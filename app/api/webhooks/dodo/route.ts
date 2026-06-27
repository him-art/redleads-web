import { NextResponse } from 'next/server';
import { Webhook } from 'standardwebhooks';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';
import * as React from 'react';
import WelcomeEmail from '@/lib/email-templates/WelcomeEmail';

/**
 * Dodo Payments Webhook Handler
 * Handles subscription lifecycle events and updates user subscription tier.
 *
 * Key behaviours:
 * - onboarding_completed: true is set HERE (after payment) — never during onboarding wizard
 * - Welcome email fires once on first activation only
 * - Cancellation events are idempotent: sibling events (subscription.cancelled +
 *   subscription.updated) won't double-write the profile
 */
export async function POST(req: Request) {
    // Instantiate inside handler so env vars are available at request time (not build time)
    const supabase = createAdminClient();
    try {
        const body = await req.text();
        const webhookId = req.headers.get('webhook-id') || '';
        const webhookTimestamp = req.headers.get('webhook-timestamp') || '';
        const webhookSignature = req.headers.get('webhook-signature') || '';

        // Verify webhook signature
        const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('[Dodo Webhook] Missing DODO_WEBHOOK_SECRET');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        const wh = new Webhook(webhookSecret);
        let payload: any;

        try {
            payload = wh.verify(body, {
                'webhook-id': webhookId,
                'webhook-timestamp': webhookTimestamp,
                'webhook-signature': webhookSignature,
            });
        } catch (err) {
            console.error('[Dodo Webhook] Signature verification failed:', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const eventType = payload.type;
        const data = payload.data;

        console.log(`[Dodo Webhook] Received event: ${eventType}`);

        // 1. Log the webhook — capture the ID for future updates
        const { data: logRow } = await supabase.from('webhook_logs').insert({
            event_type: eventType,
            payload: payload,
            status: 'received'
        }).select('id').single();

        const logId = logRow?.id;

        // Helper to update this specific log row
        const updateLog = async (status: string, statusDetail?: string) => {
            if (!logId) return;
            const update: any = { status };
            if (statusDetail) update.status_detail = statusDetail;
            await supabase.from('webhook_logs').update(update).eq('id', logId);
        };

        // 2. Determine user to update
        let userId = data?.metadata?.user_id;
        const customerEmail = data?.customer?.email || data?.customer?.customer_email || data?.email;

        if (!userId && customerEmail) {
            console.log(`[Dodo Webhook] No userId in metadata, looking up by email: ${customerEmail}`);
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', customerEmail)
                .single();

            if (profile) {
                userId = profile.id;
                console.log(`[Dodo Webhook] Found user via email: ${userId}`);
            }
        }

        if (!userId) {
            console.error('[Dodo Webhook] UNIDENTIFIED USER. Payload data:', JSON.stringify(data, null, 2));
            await updateLog('unidentified_user', `Email found: ${customerEmail || 'none'}`);
            return NextResponse.json({ received: true });
        }

        // 3. Idempotency helper — prevents double profile writes when sibling events
        //    (e.g. subscription.cancelled + subscription.updated) fire within 60 seconds.
        const isRecentlyCancelled = async (subscriptionId: string | null): Promise<boolean> => {
            if (!subscriptionId) return false;
            const { data: recentLog } = await supabase
                .from('webhook_logs')
                .select('id')
                .eq('status', 'downgraded')
                .filter('payload->data->>subscription_id', 'eq', subscriptionId)
                .gte('created_at', new Date(Date.now() - 60_000).toISOString())
                .maybeSingle();
            return !!recentLog;
        };

        try {
            switch (eventType) {
                // --- Activation events (initial purchase) ---
                case 'subscription.active':
                case 'subscription.activated':
                case 'subscription.created': {
                    const planType = data?.metadata?.plan || 'growth';

                    let keywordLimit = 10;
                    if (planType === 'growth') keywordLimit = 20;
                    if (planType === 'lifetime') keywordLimit = 20;
                    if (planType === 'one_time') keywordLimit = 10;

                    // Calculate trial_ends_at for trial-eligible plans
                    let trialEndsAt = null;
                    if (planType === 'starter' || planType === 'growth') {
                        if (data.next_billing_date) {
                            trialEndsAt = new Date(data.next_billing_date).toISOString();
                        } else {
                            trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                        }
                    }

                    // Fetch current profile state — needed for welcome email guard
                    const { data: userProfile } = await supabase
                        .from('profiles')
                        .select('email, onboarding_completed')
                        .eq('id', userId)
                        .single();

                    const wasAlreadyOnboarded = userProfile?.onboarding_completed === true;

                    await supabase
                        .from('profiles')
                        .update({
                            subscription_tier: planType,
                            keyword_limit: keywordLimit,
                            subscription_started_at: new Date().toISOString(),
                            trial_ends_at: trialEndsAt,
                            dodo_customer_id: data.customer?.customer_id || data.customer_id || null,
                            dodo_subscription_id: data.subscription_id || null,
                            // ← onboarding_completed is ONLY set here, after real payment.
                            //   Never set during the onboarding wizard profile save.
                            onboarding_completed: true,
                        })
                        .eq('id', userId);

                    await updateLog('success', `Activated ${planType}`);

                    // Send welcome email on first-ever activation only (not on plan upgrades/renewals)
                    if (!wasAlreadyOnboarded && userProfile?.email) {
                        try {
                            const planName = planType.charAt(0).toUpperCase() + planType.slice(1);
                            await sendEmail({
                                to: userProfile.email,
                                subject: `You're in — your Reddit lead scanner is live`,
                                react: React.createElement(WelcomeEmail, {
                                    email: userProfile.email,
                                    plan: planName,
                                }),
                                from: 'RedLeads <onboarding@redleads.app>',
                                includeUnsubscribe: false,
                            }, supabase);
                            console.log(`[Dodo Webhook] Welcome email sent to ${userProfile.email} (plan: ${planName})`);
                        } catch (emailErr) {
                            // Non-blocking — webhook must not fail if email fails
                            console.error('[Dodo Webhook] Welcome email send failed:', emailErr);
                        }
                    }

                    break;
                }

                // --- Payment events ---
                case 'payment.succeeded':
                case 'payment.captured': {
                    const planType = data?.metadata?.plan || 'growth';
                    const paymentId = data?.payment_id || null;

                    // Fetch current profile to check if this is initial or renewal
                    const { data: currentProfile } = await supabase
                        .from('profiles')
                        .select('subscription_tier, subscription_started_at, email, onboarding_completed')
                        .eq('id', userId)
                        .single();

                    const isAlreadySubscribed = currentProfile?.subscription_tier === planType
                        && currentProfile?.subscription_started_at;
                    const wasAlreadyOnboarded = currentProfile?.onboarding_completed === true;

                    let keywordLimit = 10;
                    if (planType === 'growth') keywordLimit = 20;
                    if (planType === 'lifetime') keywordLimit = 20;
                    if (planType === 'one_time') keywordLimit = 10;

                    const updateData: any = {
                        subscription_tier: planType,
                        keyword_limit: keywordLimit,
                        dodo_customer_id: data.customer?.customer_id || data.customer_id || null,
                        dodo_payment_id: paymentId,
                        onboarding_completed: true,
                    };

                    // Only set subscription_started_at on INITIAL purchase, not renewals
                    if (!isAlreadySubscribed) {
                        updateData.subscription_started_at = new Date().toISOString();
                    }

                    await supabase
                        .from('profiles')
                        .update(updateData)
                        .eq('id', userId);

                    await updateLog('success', isAlreadySubscribed
                        ? `Renewal payment for ${planType}`
                        : `Initial payment for ${planType}`);

                    // Send welcome email on first-ever payment only (critical for one-time payments that lack sub.active events)
                    if (!wasAlreadyOnboarded && currentProfile?.email) {
                        try {
                            const planName = planType.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
                            await sendEmail({
                                to: currentProfile.email,
                                subject: `You're in — your Reddit lead scanner is live`,
                                react: React.createElement(WelcomeEmail, {
                                    email: currentProfile.email,
                                    plan: planName,
                                }),
                                from: 'RedLeads <onboarding@redleads.app>',
                                includeUnsubscribe: false,
                            }, supabase);
                            console.log(`[Dodo Webhook] Welcome email sent to ${currentProfile.email} (plan: ${planName}) from payment event`);
                        } catch (emailErr) {
                            console.error('[Dodo Webhook] Welcome email send failed from payment event:', emailErr);
                        }
                    }
                    break;
                }

                // --- Subscription updated (plan change, status change) ---
                case 'subscription.updated': {
                    const newPlan = data?.metadata?.plan;
                    const newStatus = data?.status;
                    const subscriptionId = data?.subscription_id || null;

                    // 1. If the status is any "inactive" state, mark user as canceled
                    if (['cancelled', 'failed', 'expired', 'deactivated'].includes(newStatus)) {
                        // Idempotency guard: skip if a sibling event already wrote the downgrade
                        if (await isRecentlyCancelled(subscriptionId)) {
                            await updateLog('duplicate_skipped', `Downgrade already applied by sibling event (sub: ${subscriptionId})`);
                            break;
                        }

                        await supabase
                            .from('profiles')
                            .update({
                                subscription_tier: 'canceled',
                                dodo_subscription_id: null,
                                trial_ends_at: null,
                            })
                            .eq('id', userId);

                        await updateLog('downgraded', `Marked canceled via updated event (status: ${newStatus})`);
                    }
                    // 2. Otherwise, if the plan changed (e.g. Starter → Growth upgrade)
                    else if (newPlan) {
                        let keywordLimit = 10;
                        if (newPlan === 'growth') keywordLimit = 20;
                        if (newPlan === 'lifetime') keywordLimit = 20;
                        if (newPlan === 'one_time') keywordLimit = 10;

                        await supabase
                            .from('profiles')
                            .update({
                                subscription_tier: newPlan,
                                keyword_limit: keywordLimit,
                                dodo_subscription_id: data.subscription_id || null,
                            })
                            .eq('id', userId);

                        await updateLog('success', `Plan updated to ${newPlan}`);
                    } else {
                        // Generic update — log it but no profile change needed
                        await updateLog('acknowledged', `Subscription updated (status: ${newStatus || 'unknown'})`);
                    }
                    break;
                }

                // --- Subscription renewed ---
                case 'subscription.renewed': {
                    // Renewal is a billing event — subscription stays active
                    // We do NOT reset subscription_started_at here
                    await updateLog('acknowledged', 'Subscription renewed — no profile change needed');
                    break;
                }

                // --- Payment failure (card declined, 3DS failed, etc.) ---
                case 'payment.failed': {
                    const errorCode = data?.error_code || 'UNKNOWN';
                    const errorMessage = data?.error_message || 'No details provided';
                    const paymentId = data?.payment_id || 'unknown';
                    const cardLast4 = data?.card_last_four || '****';

                    console.warn(
                        `[Dodo Webhook] Payment failed for user ${userId}: ` +
                        `${errorCode} — ${errorMessage} ` +
                        `(payment: ${paymentId}, card: ****${cardLast4})`
                    );

                    await updateLog('payment_failed', `${errorCode}: ${errorMessage} (card ****${cardLast4})`);
                    // Note: no profile downgrade here — subscription.failed / subscription.updated
                    // events handle tier changes. This case is purely for diagnostics.
                    break;
                }

                // --- Cancellation / failure events ---
                case 'subscription.cancelled':
                case 'subscription.failed':
                case 'subscription.expired':
                case 'subscription.deactivated': {
                    const subscriptionId = data?.subscription_id || null;

                    // Idempotency guard: skip if a sibling event already wrote the downgrade
                    if (await isRecentlyCancelled(subscriptionId)) {
                        await updateLog('duplicate_skipped', `Downgrade already applied by sibling event (sub: ${subscriptionId})`);
                        break;
                    }

                    await supabase
                        .from('profiles')
                        .update({
                            subscription_tier: 'canceled',
                            dodo_subscription_id: null,
                            trial_ends_at: null,
                        })
                        .eq('id', userId);

                    await updateLog('downgraded', `Marked canceled from ${eventType}`);
                    break;
                }

                default:
                    console.log(`[Dodo Webhook] Unhandled event type: ${eventType}`);
                    await updateLog('unhandled_event', `Event: ${eventType}`);
            }
        } catch (dbError) {
            console.error('[Dodo Webhook DB Error]', dbError);
            await updateLog('error', String(dbError));
            throw dbError;
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('[Dodo Webhook Error]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
