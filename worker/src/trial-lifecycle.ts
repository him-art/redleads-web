/**
 * RedLeads Trial Lifecycle Worker
 * 
 * Runs periodically (e.g., hourly).
 * 1. Fetches profiles in 'free' or 'trial' status with an active trial.
 * 2. Determines if they hit the 24h, 48h, or 72h milestone.
 * 3. Sends the appropriate lifecycle email.
 * 4. Logs the event to prevent duplicate sends.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

const emailLibPath = path.join(__dirname, '../../lib/email');
const emailTemplatePath = path.join(__dirname, '../../lib/email-templates/TrialLifecycleEmails');

dotenv.config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('[Lifecycle] ❌ CRITICAL: Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function runTrialLifecycle() {
    console.log('[Lifecycle] ⏱️ Starting Trial Lifecycle Check...');

    const { data: allProfiles, error: profileError } = await supabase
        .from('profiles')
        .select(`
            id, 
            email, 
            subscription_tier, 
            created_at, 
            trial_ends_at,
            lifecycle_metadata:user_metadata->lifecycle_sent
        `)
        .in('subscription_tier', ['free', 'trial', null]);

    if (profileError) {
        console.error('[Lifecycle] Failed to fetch profiles:', profileError);
        return;
    }

    if (!allProfiles || allProfiles.length === 0) {
        console.log('[Lifecycle] No free/trial profiles found.');
        return;
    }

    const { sendEmail } = require(emailLibPath);
    const TrialLifecycleEmail = require(emailTemplatePath).default;

    let sentCount = 0;
    const now = new Date();

    for (const profile of allProfiles) {
        const { id, email, created_at, trial_ends_at } = profile;
        if (!email || !created_at) continue;

        // Parse existing sent metadata or initialize empty map
        const sentFlags: Record<string, boolean> = (profile.lifecycle_metadata as Record<string, boolean>) || {};

        const createdAtDate = new Date(created_at);
        const hoursSinceSignup = (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60);
        
        // If an explicit trial_ends_at exists, we could use it, but since trials are 3 days (72h), 
        // measuring hours since creation is a stable way to trigger the sequence.
        
        let targetStage: 'day1' | 'day2' | 'day3' | null = null;
        let subject = '';

        // Determine if they qualify for a stage they haven't received yet
        if (hoursSinceSignup >= 72 && !sentFlags['day3']) {
            targetStage = 'day3';
            subject = 'Your RedLeads trial has expired ⏸️';
        } else if (hoursSinceSignup >= 48 && hoursSinceSignup < 72 && !sentFlags['day2']) {
            targetStage = 'day2';
            subject = 'See why founders love RedLeads 🚀';
        } else if (hoursSinceSignup >= 24 && hoursSinceSignup < 48 && !sentFlags['day1']) {
            targetStage = 'day1';
            subject = 'How to save 3 hours a day on Reddit ⏱️';
        }

        if (targetStage) {
            console.log(`[Lifecycle] 📧 Sending ${targetStage} email to ${email} (Hours active: ${Math.round(hoursSinceSignup)})...`);
            
            try {
                const emailResult = await sendEmail({
                    to: email,
                    subject: subject,
                    react: TrialLifecycleEmail({
                        fullName: email.split('@')[0],
                        stage: targetStage
                    })
                });

                if (emailResult?.success) {
                    // Update user_metadata to flag that this email was sent
                    sentFlags[targetStage] = true;
                    
                    const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
                        user_metadata: { lifecycle_sent: sentFlags }
                    });

                    // (Fallback: If you handle metadata directly in profiles table, you'd update there instead, but auth.users.user_metadata is standard for Supabase)
                     const { error: profileUpdateError } = await supabase
                        .from('profiles')
                        .update({ user_metadata: { lifecycle_sent: sentFlags } })
                        .eq('id', id);

                    if (updateError && profileUpdateError) {
                        console.error(`[Lifecycle] Failed to mark ${targetStage} sent for ${email}`, updateError);
                    } else {
                        sentCount++;
                    }
                } else {
                    console.error(`[Lifecycle] ❌ Failed to send ${targetStage} to ${email}:`, emailResult?.error);
                }
            } catch (err: any) {
                console.error(`[Lifecycle] Fatal error sending to ${email}:`, err.message);
            }
        }
    }

    console.log(`[Lifecycle] ✅ Complete. Sent ${sentCount} lifecycle emails.`);

    // Update Heartbeat
    try {
        await supabase.from('worker_status').upsert({
            id: 'trial_lifecycle',
            last_heartbeat: new Date().toISOString(),
            status: 'online',
            meta: {
                last_run_sent_count: sentCount,
            }
        });
    } catch (err) {
        console.error('[Lifecycle] Failed to update heartbeat:', err);
    }
}

runTrialLifecycle().catch(e => {
    console.error('[Lifecycle] Fatal Error:', e);
    process.exit(1);
});
