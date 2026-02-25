import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';

/**
 * Handles automatic refunds for subscriptions cancelled within the 7-day window.
 */
export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { reason } = await req.json();

        // 1. Fetch user profile to verify 7-day window
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_started_at, dodo_customer_id, dodo_payment_id, subscription_tier')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        if (!['growth', 'starter', 'lifetime'].includes(profile.subscription_tier)) {
            return NextResponse.json({ error: 'No active paid subscription' }, { status: 400 });
        }

        // 2. Check 7-day window
        const subStartedAt = profile.subscription_started_at ? new Date(profile.subscription_started_at) : null;
        const now = new Date();
        const isWithinGuarantee = subStartedAt ? (now.getTime() - subStartedAt.getTime()) < (7 * 24 * 60 * 60 * 1000) : false;

        if (!isWithinGuarantee) {
            return NextResponse.json({ 
                error: 'Refund window expired. Please contact support for manual review.' 
            }, { status: 400 });
        }

        if (!profile.dodo_customer_id) {
            return NextResponse.json({ error: 'Customer ID not found' }, { status: 400 });
        }

        // 3. Trigger Refund via Dodo API
        if (!dodo) {
            throw new Error('Dodo client not initialized');
        }

        // Use stored payment_id if available, otherwise fetch from Dodo
        let paymentIdToRefund = profile.dodo_payment_id;
        let refundAmount: number | null = null;

        if (!paymentIdToRefund) {
            const payments: any = await dodo.payments.list({
                customer_id: profile.dodo_customer_id,
                page_size: 1
            });

            const latestPayment = payments.data?.[0] || payments.items?.[0] || payments[0];

            if (!latestPayment || latestPayment.status !== 'succeeded') {
                return NextResponse.json({ error: 'No successful payment found to refund' }, { status: 404 });
            }

            paymentIdToRefund = latestPayment.payment_id;
            refundAmount = latestPayment.amount;
        }

        if (!paymentIdToRefund) {
            return NextResponse.json({ error: 'No payment ID found to refund' }, { status: 404 });
        }

        const refundPayload: any = {
            payment_id: paymentIdToRefund,
            reason: reason || '7-day guarantee cancellation',
        };
        if (refundAmount) refundPayload.amount = refundAmount;

        const refund = await (dodo.refunds as any).create(refundPayload);

        console.log(`[Refund] Successfully triggered for user ${user.id}:`, refund.refund_id);

        return NextResponse.json({ 
            success: true, 
            refund_id: refund.refund_id,
            message: 'Refund initiated successfully'
        });

    } catch (error: any) {
        console.error('[Refund Subscription Error]:', error);
        return NextResponse.json(
            { error: 'Failed to process refund. Please contact support.' }, 
            { status: 500 }
        );
    }
}
