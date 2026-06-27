import { NextResponse } from 'next/server';

// Secret set in Supabase Dashboard → Webhooks → HTTP Header
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

/**
 * Supabase Database Webhook Handler
 *
 * NOTE: Welcome emails are sent directly from the Dodo Payments webhook
 * (app/api/webhooks/dodo/route.ts) after a successful subscription activation.
 * This handler is kept as an authenticated stub for future DB-triggered events.
 */
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');

        if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await req.json();
        const { table, type } = payload;

        console.log(`[Supabase Webhook] Received ${type} on ${table} — no handler configured`);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Supabase Webhook Error]:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
