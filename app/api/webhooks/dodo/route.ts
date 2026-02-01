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

        // 1. Log the receipt of the webhook for debugging
        await supabase.from('webhook_logs').insert({
            event_type: eventType,
            payload: payload,
            status: 'received'
        });

        // Determine user to update
        let userId = data?.metadata?.user_id;
        const customerEmail = data?.customer?.email || data?.customer?.customer_email;

        // ... (rest of the identification logic) ...
        if (!userId && customerEmail) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', customerEmail)
                .single();
            
            if (profile) userId = profile.id;
        }

        if (!userId) {
            await supabase.from('webhook_logs').update({ status: 'unidentified_user' }).eq('event_type', eventType).order('created_at', { ascending: false }).limit(1);
            return NextResponse.json({ received: true });
        }

        try {
            switch (eventType) {
                case 'subscription.active':
                case 'subscription.activated':
                case 'subscription.created':
                case 'payment.succeeded':
                case 'payment.captured':
                    await supabase
                        .from('profiles')
                        .update({ 
                            subscription_tier: 'pro',
                            subscription_started_at: new Date().toISOString(),
                            dodo_customer_id: data.customer?.customer_id || data.customer_id || null,
                        })
                        .eq('id', userId);
                    
                    await supabase.from('webhook_logs').update({ status: 'success' }).eq('event_type', eventType).order('created_at', { ascending: false }).limit(1);
                    break;

                case 'subscription.cancelled':
                case 'subscription.failed':
                case 'subscription.expired':
                case 'subscription.deactivated':
                    await supabase
                        .from('profiles')
                        .update({ subscription_tier: 'free' })
                        .eq('id', userId);
                    
                    await supabase.from('webhook_logs').update({ status: 'downgraded' }).eq('event_type', eventType).order('created_at', { ascending: false }).limit(1);
                    break;

                default:
                    await supabase.from('webhook_logs').update({ status: 'unhandled_event' }).eq('event_type', eventType).order('created_at', { ascending: false }).limit(1);
            }
        } catch (dbError) {
            console.error('[Dodo Webhook DB Error]', dbError);
            await supabase.from('webhook_logs').update({ status: 'error' }).eq('event_type', eventType).order('created_at', { ascending: false }).limit(1);
            throw dbError;
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('[Dodo Webhook Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
