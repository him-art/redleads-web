import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { reason } = await req.json();

        // 1. Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_started_at, dodo_customer_id, dodo_subscription_id, dodo_payment_id, subscription_tier, created_at')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        if (!dodo) {
            return NextResponse.json({ error: 'Payment provider not initialized' }, { status: 500 });
        }

        // 2. Resolve Subscription ID
        let subscriptionId = profile.dodo_subscription_id;

        if (!subscriptionId && profile.dodo_customer_id) {
            // Fallback: Find active subscription from Dodo
            try {
                const subs: any = await dodo.subscriptions.list({
                    customer_id: profile.dodo_customer_id,
                    status: 'active', // Only look for active ones
                    page_size: 1
                });
                
                // Handle different Dodo SDK response structures if needed (data vs items)
                const activeSub = subs.data?.[0] || subs.items?.[0] || subs[0];
                
                if (activeSub) {
                    subscriptionId = activeSub.subscription_id;
                    console.log(`[Cancel] Found missing subscription_id ${subscriptionId} for user ${user.id}`);
                }
            } catch (err) {
                console.error('[Cancel] Failed to list subscriptions:', err);
            }
        }

        // 3. Cancel Subscription in Dodo
        if (subscriptionId) {
            try {
                await dodo.subscriptions.update(subscriptionId, {
                    status: 'cancelled'
                });
                console.log(`[Cancel] Successfully updated subscription ${subscriptionId} to cancelled status`);
            } catch (err: any) {
                console.error('[Cancel] Dodo cancellation failed:', err);
                // If cancellation fails, we MUST throw to let the frontend redirect to portal.
                // Do not downgrade user locally if they are still active in Dodo.
                throw new Error('Dodo cancellation failed: ' + err.message);
            }
        } else {
            console.warn('[Cancel] No subscription ID found to cancel for user', user.id);
            //Proceed to downgrade anyway to ensure they don't see "Active" in UI
        }

        // 4. Refund Logic (7-day guarantee)
        let refundId = null;
        const subStartedAt = profile.subscription_started_at ? new Date(profile.subscription_started_at) : new Date(profile.created_at);
        const now = new Date();
        const isWithinGuarantee = (now.getTime() - subStartedAt.getTime()) < (7 * 24 * 60 * 60 * 1000);

        if (isWithinGuarantee && profile.dodo_customer_id) {
            try {
                // Use stored payment_id if available, otherwise fetch from Dodo
                let paymentIdToRefund = profile.dodo_payment_id;
                let refundAmount: number | null = null;

                if (!paymentIdToRefund) {
                    const payments: any = await dodo.payments.list({
                        customer_id: profile.dodo_customer_id,
                        page_size: 1
                    });
                    
                    const latestPayment = payments.data?.[0] || payments.items?.[0] || payments[0];

                    if (latestPayment && latestPayment.status === 'succeeded') {
                        paymentIdToRefund = latestPayment.payment_id;
                        refundAmount = latestPayment.amount;
                    }
                }

                if (paymentIdToRefund) {
                    const refundPayload: any = {
                        payment_id: paymentIdToRefund,
                        reason: reason || '7-day guarantee cancellation',
                    };
                    if (refundAmount) refundPayload.amount = refundAmount;

                    const refund = await (dodo.refunds as any).create(refundPayload);
                    refundId = refund.refund_id;
                    console.log(`[Cancel] Refunded for user ${user.id}`);
                }
            } catch (err) {
                console.error('[Cancel] Refund failed:', err);
                // Non-blocking
            }
        }

        // 5. Update Profile
        await supabase
            .from('profiles')
            .update({ 
                subscription_tier: 'free',
                dodo_subscription_id: null 
            })
            .eq('id', user.id);

        return NextResponse.json({ 
            success: true, 
            refunded: !!refundId,
            message: 'Subscription cancelled successfully' 
        });

    } catch (error: any) {
        console.error('[Cancel Subscription Error]:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription. Please contact support if this persists.' }, 
            { status: 500 }
        );
    }
}
