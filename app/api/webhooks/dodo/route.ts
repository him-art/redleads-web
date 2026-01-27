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

        // Extract user_id from metadata
        const userId = data?.metadata?.user_id;
        if (!userId) {
            console.warn('[Dodo Webhook] No user_id in metadata, skipping.');
            return NextResponse.json({ received: true });
        }

        switch (eventType) {
            case 'subscription.active':
            case 'payment.succeeded':
                // Upgrade user to Pro
                await supabase
                    .from('profiles')
                    .update({ 
                        subscription_tier: 'pro',
                        dodo_customer_id: data.customer?.customer_id || null,
                    })
                    .eq('id', userId);
                console.log(`[Dodo Webhook] Upgraded user ${userId} to Pro`);
                break;

            case 'subscription.cancelled':
            case 'subscription.failed':
            case 'subscription.expired':
                // Downgrade user to Free
                await supabase
                    .from('profiles')
                    .update({ subscription_tier: 'free' })
                    .eq('id', userId);
                console.log(`[Dodo Webhook] Downgraded user ${userId} to Free`);
                break;

            default:
                console.log(`[Dodo Webhook] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('[Dodo Webhook Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
