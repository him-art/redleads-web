import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

import * as React from 'react';

// This is the bouncer for the webhook.
// The user should set SUPABASE_WEBHOOK_SECRET in their .env.local
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

/**
 * Supabase Database Webhook Handler
 * Currently listens for:
 * - INSERT on 'profiles' -> Send Welcome Email
 */
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        
        // Security check
        if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await req.json();
        const { table, type, record, old_record } = payload;

        console.log(`[Supabase Webhook] Received ${type} on ${table}`);

        if (table === 'profiles') {
            const { email, full_name, website_url } = record;
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Supabase Webhook Error]:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
