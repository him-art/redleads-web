/**
 * RedLeads Trial Lifecycle Worker
 * 
 * Runs periodically (e.g., hourly).
 * 1. Fetches profiles in 'free' or 'trial' status with an active trial.
 * 2. Determines if they hit the 24h, 48h, or 72h milestone.
 * 3. Sends the appropriate lifecycle email.
 * 4. Logs the event to prevent duplicate sends.
 * 
 * IMPORTANT: dotenv MUST be loaded before any library imports (like lib/email)
 * because in CommonJS, `import` statements are hoisted to require() calls at
 * the top of the file, executing before inline code. This means env vars would
 * not be available when the Resend SDK initializes inside lib/email.ts.
 * 
 * Solution: Use require() for library dependencies AFTER dotenv.config().
 */

// Step 1: Load environment FIRST — these have no env-var dependencies at require-time
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Step 2: NOW require our library modules that depend on env vars
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sendEmail } = require('../../lib/email');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TrialLifecycleEmailModule = require('../../lib/email-templates/TrialLifecycleEmails');
const TrialLifecycleEmail = TrialLifecycleEmailModule.default || TrialLifecycleEmailModule;

// 7-day trial sequence timing (hours since trial start)
const STAGE_WINDOWS: Record<string, { from: number; to: number; subject: string }> = {
    day1: { from: 1,   to: 24,  subject: 'Your first Reddit leads are ready 👀' },
    day2: { from: 24,  to: 48,  subject: "You're missing leads right now" },
    day3: { from: 48,  to: 72,  subject: 'Your RedLeads trial ends today ⏰' },
    day4: { from: 72,  to: 96,  subject: 'From signup to customer in 3 days 🚀' },
    day5: { from: 96,  to: 120, subject: 'What other founders are saying about RedLeads' },
    day6: { from: 120, to: 144, subject: '🔥 High-intent leads just landed — act now' },
    day7: { from: 144, to: 200, subject: 'Last chance: your access locks tomorrow' },
};

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
    console.error('[Lifecycle] ❌ Missing NEXT_PUBLIC_SUPABASE_URL');
    process.exit(1);
}
if (!SUPABASE_SERVICE_KEY) {
    console.error('[Lifecycle] ❌ Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}
if (!process.env.RESEND_API_KEY) {
    console.warn('[Lifecycle] ⚠️ RESEND_API_KEY not defined — emails will fail.');
}

// User indicated 'onboarding@redleads.app' might have deliverability issues.
// We'll prioritize process.env.EMAIL_FROM_LIFECYCLE or fall back to the project default.
const EMAIL_FROM = process.env.EMAIL_FROM_LIFECYCLE || process.env.EMAIL_FROM || 'RedLeads <onboarding@redleads.app>';
console.log(`[Lifecycle] 📧 Using sender: ${EMAIL_FROM}`);

const DISABLE_EMAILS = false; // Safety toggle requested by the user
if (DISABLE_EMAILS) {
    console.warn('[Lifecycle] ⚠️ EMAILS ARE CURRENTLY DISABLED VIA SCRIPT VARIABLE.');
}

console.log('[Lifecycle] ✅ Environment loaded successfully.');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function runTrialLifecycle() {
    console.log('[Lifecycle] ⏱️ Starting Trial Lifecycle Check...');
    const startTime = Date.now();

    try {
        const { data: allProfiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, subscription_tier, created_at, trial_ends_at, user_metadata, description, website_url')
            .in('subscription_tier', ['free', 'trial']);

        if (profileError) {
            console.error('[Lifecycle] Failed to fetch profiles:', profileError.message);
            return;
        }

        if (!allProfiles || allProfiles.length === 0) {
            console.log('[Lifecycle] No free/trial profiles found.');
            return;
        }

        console.log(`[Lifecycle] Found ${allProfiles.length} profiles to check.`);

        let sentCount = 0;
        const now = new Date();

        for (const profile of allProfiles) {
            const { id, email, created_at, trial_ends_at, user_metadata, description } = profile;
            
            // If they haven't finished onboarding, their trial hasn't started, so we skip them.
            if (!email || !created_at || !trial_ends_at) continue;

            // Parse existing sent metadata or initialize empty map
            const metadata = (user_metadata as any) || {};
            const sentFlags: Record<string, boolean> = metadata.lifecycle_sent || {};

            // Calculate hours since trial started (back-calculates from trial_ends_at using TRIAL_DAYS)
            const TRIAL_DAYS_VALUE = 7; // matches constants.ts TRIAL_DAYS
            const trialEndsAtDate = new Date(trial_ends_at);
            const trialStartedAtDate = new Date(trialEndsAtDate.getTime() - TRIAL_DAYS_VALUE * 24 * 60 * 60 * 1000);
            const hoursSinceTrialStart = (now.getTime() - trialStartedAtDate.getTime()) / (1000 * 60 * 60);
            
            let targetStage: 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' | 'day7' | null = null;
            let subject = '';

            // Sequential stage selection: find the earliest unsent stage whose window we're in
            for (const [stageName, window] of Object.entries(STAGE_WINDOWS)) {
                if (!sentFlags[stageName] && hoursSinceTrialStart >= window.from && hoursSinceTrialStart < window.to) {
                    targetStage = stageName as unknown as typeof targetStage;
                    subject = window.subject;
                    break;
                }
            }

            // If past all windows, mark all as sent to prevent re-processing
            if (!targetStage && hoursSinceTrialStart >= 200) {
                let updated = false;
                for (const stageName of Object.keys(STAGE_WINDOWS)) {
                    if (!sentFlags[stageName]) { sentFlags[stageName] = true; updated = true; }
                }
                if (updated) {
                    await supabase.from('profiles').update({ 
                        user_metadata: { ...metadata, lifecycle_sent: sentFlags } 
                    }).eq('id', id);
                    console.log(`[Lifecycle] ⏩ Skipped and marked old trial for ${email} (${Math.round(hoursSinceTrialStart)}h)`);
                }
                continue;
            }

            if (targetStage) {
                console.log(`[Lifecycle] 📧 Sending ${targetStage} email to ${email} (${Math.round(hoursSinceTrialStart)}h since trial start)...`);
                
                let leadCount = 12;
                let topSubreddit = 'SaaS';
                
                try {
                    const { data: leads } = await supabase
                        .from('monitored_leads')
                        .select('subreddit')
                        .eq('user_id', id);
                        
                    if (leads && leads.length > 0) {
                        leadCount = leads.length;
                        const subCounts: Record<string, number> = {};
                        leads.forEach(l => {
                            if (l.subreddit) subCounts[l.subreddit] = (subCounts[l.subreddit] || 0) + 1;
                        });
                        const sortedSubs = Object.entries(subCounts).sort((a, b) => b[1] - a[1]);
                        if (sortedSubs.length > 0) topSubreddit = sortedSubs[0][0];
                    }

                    if (DISABLE_EMAILS) {
                        console.log(`[Lifecycle] 🛑 [DRY RUN] Would have sent ${targetStage} to ${email}`);
                        continue;
                    }

                    const emailResult = await sendEmail({
                        to: email,
                        from: EMAIL_FROM,
                        subject: subject,
                        react: TrialLifecycleEmail({
                            fullName: (profile.user_metadata as any)?.full_name || email.split('@')[0],
                            stage: targetStage,
                            productName: profile.website_url?.replace(/^https?:\/\//, '') || 'your website',
                            leadCount: leadCount,
                            topSubreddit: topSubreddit
                        })
                    }, supabase);

                    if (emailResult?.success) {
                        sentFlags[targetStage] = true;
                        
                        const { error: profileUpdateError } = await supabase
                            .from('profiles')
                            .update({ 
                                user_metadata: { 
                                    ...metadata, 
                                    lifecycle_sent: sentFlags 
                                } 
                            })
                            .eq('id', id);

                        if (profileUpdateError) {
                            console.error(`[Lifecycle] Failed to mark ${targetStage} sent for ${email}:`, profileUpdateError.message);
                        } else {
                            sentCount++;
                            console.log(`[Lifecycle] ✅ ${targetStage} sent to ${email}`);
                        }
                    } else {
                        console.error(`[Lifecycle] ❌ Failed to send ${targetStage} to ${email}:`, emailResult?.error);
                    }
                } catch (err: any) {
                    console.error(`[Lifecycle] Exception sending to ${email}:`, err.message);
                }
            }
        }

        console.log(`[Lifecycle] ✅ Complete. Sent ${sentCount} lifecycle emails.`);

        // Update Heartbeat
        await supabase.from('worker_status').upsert({
            id: 'trial_lifecycle',
            last_heartbeat: new Date().toISOString(),
            status: 'online',
            meta: {
                last_run_sent_count: sentCount,
                duration_ms: Date.now() - startTime
            }
        });

    } catch (globalErr: any) {
        console.error('[Lifecycle] Fatal execution error:', globalErr.message);
    }
}

runTrialLifecycle().catch(e => {
    console.error('[Lifecycle] Script crash:', e.message);
    process.exit(1);
});
