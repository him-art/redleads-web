/**
 * RedLeads Win-Back Worker
 *
 * Targets users whose trial has expired (trial_ends_at < NOW, subscription_tier = 'trial')
 * and who have NOT already received a win-back email (user_metadata.win_back_sent != true).
 *
 * Usage:
 *   Normal run:   npx ts-node --project worker/tsconfig.json worker/src/win-back.ts
 *   Dry run:      DRY_RUN=true npx ts-node --project worker/tsconfig.json worker/src/win-back.ts
 *
 * IMPORTANT: dotenv MUST be loaded before any library that reads env vars at require-time.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sendEmail } = require('../../lib/email');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WinBackEmailModule = require('../../lib/email-templates/WinBackEmail');
const WinBackEmail = WinBackEmailModule.default || WinBackEmailModule;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM_LIFECYCLE || process.env.EMAIL_FROM || 'RedLeads <onboarding@redleads.app>';

// Set DRY_RUN=true in env to preview without sending
const DRY_RUN = process.env.DRY_RUN === 'true';

if (!SUPABASE_URL) { console.error('[WinBack] ❌ Missing NEXT_PUBLIC_SUPABASE_URL'); process.exit(1); }
if (!SUPABASE_SERVICE_KEY) { console.error('[WinBack] ❌ Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
if (!process.env.RESEND_API_KEY) { console.warn('[WinBack] ⚠️ RESEND_API_KEY not defined — emails will fail.'); }

if (DRY_RUN) {
    console.log('[WinBack] 🔍 DRY RUN MODE — no emails will be sent.');
}

console.log(`[WinBack] 📧 Using sender: ${EMAIL_FROM}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function runWinBack() {
    console.log('[WinBack] 🚀 Starting win-back campaign...');
    const startTime = Date.now();

    // 1. Fetch expired trial users who haven't received a win-back yet
    const now = new Date();
    const { data: expiredProfiles, error } = await supabase
        .from('profiles')
        .select('id, email, subscription_tier, trial_ends_at, description, website_url, user_metadata')
        .eq('subscription_tier', 'trial')
        .lt('trial_ends_at', now.toISOString())
        .limit(40); // Batched to max 40 per run to stay under Resend's 90/day limit over 3-4 days

    if (error) {
        console.error('[WinBack] ❌ Failed to fetch expired profiles:', error.message);
        return;
    }

    if (!expiredProfiles || expiredProfiles.length === 0) {
        console.log('[WinBack] No expired trial profiles found.');
        return;
    }

    console.log(`[WinBack] Found ${expiredProfiles.length} expired trial users.`);

    // Filter out those who already received a win-back email
    const eligible = expiredProfiles.filter((p: any) => {
        const meta = (p.user_metadata as any) || {};
        return !meta.win_back_sent;
    });

    console.log(`[WinBack] ${eligible.length} users are eligible for win-back (${expiredProfiles.length - eligible.length} already received it).`);

    let sentCount = 0;
    let skippedCount = 0;

    for (const profile of eligible) {
        const { id, email, trial_ends_at, website_url, user_metadata } = profile;

        if (!email) {
            skippedCount++;
            continue;
        }

        // 2. Fetch their actual lead count since trial ended
        let leadCount = 5; // fallback
        let topSubreddit = 'SaaS';

        try {
            const { data: leads } = await supabase
                .from('monitored_leads')
                .select('subreddit, created_at')
                .eq('user_id', id);

            if (leads && leads.length > 0) {
                // Count leads that came in AFTER trial ended (the "you missed these" framing)
                const trialEndDate = new Date(trial_ends_at);
                const leadsAfterExpiry = leads.filter(l => new Date(l.created_at) >= trialEndDate);
                
                // Use post-expiry count if meaningful, else total
                leadCount = leadsAfterExpiry.length > 0 ? leadsAfterExpiry.length : Math.min(leads.length, 20);

                // Find top subreddit across ALL their leads
                const subCounts: Record<string, number> = {};
                leads.forEach(l => {
                    if (l.subreddit) subCounts[l.subreddit] = (subCounts[l.subreddit] || 0) + 1;
                });
                const sorted = Object.entries(subCounts).sort((a, b) => b[1] - a[1]);
                if (sorted.length > 0) topSubreddit = sorted[0][0];
            }
        } catch (leadErr: any) {
            console.warn(`[WinBack] ⚠️ Could not fetch leads for ${email}:`, leadErr.message);
        }

        // 3. Calculate days since expiry
        const trialEndDate = new Date(trial_ends_at);
        const daysSinceExpiry = Math.max(1, Math.floor((now.getTime() - trialEndDate.getTime()) / (1000 * 60 * 60 * 24)));

        const productName = website_url?.replace(/^https?:\/\//, '') || 'your product';
        const fullName = (user_metadata as any)?.full_name || email.split('@')[0];

        if (DRY_RUN) {
            console.log(`[WinBack] 🔍 [DRY RUN] Would send to: ${email} | Leads: ${leadCount} | Subreddit: r/${topSubreddit} | Days since expiry: ${daysSinceExpiry}`);
            continue;
        }

        // 4. Send the win-back email
        try {
            console.log(`[WinBack] 📧 Sending to ${email} (${leadCount} leads, r/${topSubreddit}, ${daysSinceExpiry}d ago)...`);

            const result = await sendEmail({
                to: email,
                from: EMAIL_FROM,
                subject: `We unlocked your RedLeads account for 7 more days 👀`,
                react: WinBackEmail({
                    fullName,
                    leadCount,
                    topSubreddit,
                    productName,
                    daysSinceExpiry,
                })
            }, supabase);

            if (result?.success) {
                // 5. Mark win_back_sent = true and EXTEND trial by 7 days
                const existingMeta = (user_metadata as any) || {};
                const newTrialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
                
                await supabase
                    .from('profiles')
                    .update({
                        trial_ends_at: newTrialEndsAt,
                        user_metadata: {
                            ...existingMeta,
                            win_back_sent: true,
                            win_back_sent_at: now.toISOString(),
                        }
                    })
                    .eq('id', id);

                sentCount++;
                console.log(`[WinBack] ✅ Sent to ${email}`);
            } else {
                console.error(`[WinBack] ❌ Failed for ${email}:`, result?.error);
            }
        } catch (err: any) {
            console.error(`[WinBack] Exception for ${email}:`, err.message);
        }

        // Throttle: 200ms between sends to stay within Resend rate limits
        await new Promise(r => setTimeout(r, 200));
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[WinBack] ✅ Complete. Sent: ${sentCount}, Skipped: ${skippedCount}, Duration: ${duration}s`);

    // Update heartbeat
    await supabase.from('worker_status').upsert({
        id: 'win_back',
        last_heartbeat: now.toISOString(),
        status: 'online',
        meta: {
            last_run_sent_count: sentCount,
            last_run_eligible: eligible.length,
            dry_run: DRY_RUN,
            duration_ms: Date.now() - startTime,
        }
    });
}

runWinBack().catch(e => {
    console.error('[WinBack] Script crash:', e.message);
    process.exit(1);
});
