import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'standardwebhooks';

// Use service role for admin operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Dodo Payments Webhook Handler
 * Handles subscription lifecycle events and updates user subscription tier.
 */
export async function POST(req: Request) {
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
        const customerEmail = data?.customer?.email || data?.customer?.customer_email;

        if (!userId && customerEmail) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', customerEmail)
                .single();
            
            if (profile) userId = profile.id;
        }

        if (!userId) {
            await updateLog('unidentified_user');
            return NextResponse.json({ received: true });
        }

        try {
            switch (eventType) {
                // --- Activation events (initial purchase) ---
                case 'subscription.active':
                case 'subscription.activated':
                case 'subscription.created': {
                    const planType = data?.metadata?.plan || 'growth';
                    
                    let keywordLimit = 5;
                    if (planType === 'growth') keywordLimit = 15;
                    if (planType === 'lifetime') keywordLimit = 15;
                    
                    await supabase
                        .from('profiles')
                        .update({ 
                            subscription_tier: planType,
                            keyword_limit: keywordLimit,
                            subscription_started_at: new Date().toISOString(),
                            dodo_customer_id: data.customer?.customer_id || data.customer_id || null,
                            dodo_subscription_id: data.subscription_id || null,
                        })
                        .eq('id', userId);

                    await updateLog('success', `Activated ${planType}`);
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
                        .select('subscription_tier, subscription_started_at')
                        .eq('id', userId)
                        .single();

                    const isAlreadySubscribed = currentProfile?.subscription_tier === planType 
                        && currentProfile?.subscription_started_at;

                    let keywordLimit = 5;
                    if (planType === 'growth') keywordLimit = 15;
                    if (planType === 'lifetime') keywordLimit = 15;

                    const updateData: any = {
                        subscription_tier: planType,
                        keyword_limit: keywordLimit,
                        dodo_customer_id: data.customer?.customer_id || data.customer_id || null,
                        dodo_payment_id: paymentId,
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
                    break;
                }

                // --- Subscription updated (plan change, status change) ---
                case 'subscription.updated': {
                    const newPlan = data?.metadata?.plan;
                    const newStatus = data?.status;

                    // If the plan changed (e.g. Starter → Growth upgrade)
                    if (newPlan) {
                        let keywordLimit = 5;
                        if (newPlan === 'growth') keywordLimit = 15;
                        if (newPlan === 'lifetime') keywordLimit = 15;

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

                // --- Cancellation / failure events ---
                case 'subscription.cancelled':
                case 'subscription.failed':
                case 'subscription.expired':
                case 'subscription.deactivated':
                    await supabase
                        .from('profiles')
                        .update({ subscription_tier: 'free' })
                        .eq('id', userId);
                    
                    await updateLog('downgraded', `Downgraded from ${eventType}`);
                    break;

                default:
                    await updateLog('unhandled_event', `Unhandled event: ${eventType}`);
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
