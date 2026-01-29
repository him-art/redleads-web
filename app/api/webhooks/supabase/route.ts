import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import WelcomeEmail from '@/lib/email-templates/WelcomeEmail';
import TrialActivatedEmail from '@/lib/email-templates/TrialActivatedEmail';
import { createClient } from '@supabase/supabase-js';

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
        if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await req.json();
        const { table, type, record, old_record } = payload;

        console.log(`[Supabase Webhook] Received ${type} on ${table}`);

        if (table === 'profiles') {
            const { email, full_name, trial_ends_at } = record;

            // 1. Welcome Email (on INSERT)
            if (type === 'INSERT' && email) {
                console.log(`[Supabase Webhook] Sending Welcome Email to ${email}`);
                await sendEmail({
                    to: email,
                    subject: 'Welcome to RedLeads! 🚀',
                    react: WelcomeEmail({ fullName: full_name || email.split('@')[0] })
                });
            }

            // 2. Trial Activated Email (on UPDATE: null -> date transition)
            if (type === 'UPDATE' && email && trial_ends_at && !old_record.trial_ends_at) {
                console.log(`[Supabase Webhook] Sending Trial Activated Email to ${email}`);
                await sendEmail({
                    to: email,
                    subject: 'Your 7-Day Trial is Active! 🚀',
                    react: TrialActivatedEmail({ fullName: full_name || email.split('@')[0] })
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Supabase Webhook Error]:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
