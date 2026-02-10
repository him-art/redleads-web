import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import PremiumOnboardingEmail from '@/lib/email-templates/PremiumOnboardingEmail';
import * as React from 'react';
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
        if (!WEBHOOK_SECRET || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
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
                    react: React.createElement(PremiumOnboardingEmail, { 
                        fullName: full_name || email.split('@')[0],
                        step: 'welcome',
                        daysLeft: 3
                    })
                });
            }

            // 2. Trial Activated Email (on UPDATE: null -> date transition)
            if (type === 'UPDATE' && email && trial_ends_at && !old_record.trial_ends_at) {
                console.log(`[Supabase Webhook] Sending Trial Activated Email to ${email}`);
                await sendEmail({
                    to: email,
                    subject: 'Your 3-Day Trial is Active! 🚀',
                    react: React.createElement(PremiumOnboardingEmail, { 
                        fullName: full_name || email.split('@')[0],
                        step: 'welcome', // We'll show the welcome/trial info together
                        trialExpiryDate: trial_ends_at ? new Date(trial_ends_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : undefined
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
