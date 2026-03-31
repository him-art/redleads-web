import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import TrialLifecycleEmail from '@/lib/email-templates/TrialLifecycleEmails';
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

            // 1. Welcome & Activation Email (on INSERT or UPDATE)
            // We consolidate this to using Day 1 of the Lifecycle
            if ((type === 'INSERT' || (type === 'UPDATE' && record.trial_ends_at && !old_record.trial_ends_at)) && email) {
                console.log(`[Supabase Webhook] Sending Welcome/Activation Email to ${email}`);
                await sendEmail({
                    to: email,
                    subject: 'Your first Reddit leads are ready 👀',
                    react: React.createElement(TrialLifecycleEmail, { 
                        fullName: full_name || email.split('@')[0],
                        stage: 'day1',
                        productName: website_url?.replace(/^https?:\/\//, '') || 'your website',
                        leadCount: 12 // Default starting placeholder
                    })
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Supabase Webhook Error]:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
