/**
 * RedLeads Daily Digest Worker
 * 
 * Runs once daily (e.g., 8:00 AM UTC).
 * 1. Fetches all leads with status 'new' created in the last 24 hours.
 * 2. Groups them by user.
 * 3. Sends a single digest email per user.
 * 4. Updates lead status to 'emailed'.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Fix for import paths when running with ts-node
const emailLibPath = path.join(__dirname, '../../lib/email');
const emailTemplatePath = path.join(__dirname, '../../lib/email-templates/DailyDigestEmail');

dotenv.config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('[Digest] ❌ CRITICAL: Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function runDailyDigest() {
    console.log('[Digest] 🌅 Starting Daily Digest...');

    // 1. Fetch ALL profiles (92 total, safe to fetch all)
    const TRIAL_DAYS = 3;
    const { data: allProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, description, subscription_tier, trial_ends_at, created_at');

    if (profileError) {
        console.error('[Digest] Failed to fetch profiles:', profileError);
        return;
    }

    const now = new Date();
    const eligibleProfiles = allProfiles?.filter((p: any) => {
        const tier = (p.subscription_tier || '').toLowerCase();
        
        // Paid users always get the digest
        const isPaid = tier === 'starter' || tier === 'growth' || tier === 'lifetime' || tier === 'scout';
        if (isPaid) return true;

        // For non-paid users (free/trial), check if they are currently in an active 3-day trial.
        // If they ARE in an active trial, we EXCLUDE them so they only get the high-converting FOMO lifecycle sequence.
        // Once the trial expires, they will start receiving the normal daily digest (if we choose to keep sending to free users).
        const trialEndsAt = p.trial_ends_at
            ? new Date(p.trial_ends_at)
            : (p.created_at ? new Date(new Date(p.created_at).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000) : null);
        
        const isTrialActive = trialEndsAt && trialEndsAt > now;
        
        return !isTrialActive; // Return true only if trial is NOT active
    }) || [];

    console.log(`[Digest] Found ${eligibleProfiles.length} eligible candidates (Paid or Trial).`);

    // 2. Setup dependencies
    const { sendEmail } = require(emailLibPath);
    const { ai } = require(path.join(__dirname, '../../lib/ai'));
    const DailyDigestEmail = require(emailTemplatePath).default;

    let sentCount = 0;

    // 3. Process each eligible user sequentially
    for (const profile of eligibleProfiles) {
        const userId = profile.id;
        const email = profile.email;
        const description = profile.description;

        if (!email) continue;

        // Fetch top leads for THIS user only
        const { data: userLeads, error: userLeadsError } = await supabase
            .from('monitored_leads')
            .select('id, title, subreddit, match_score, body_text')
            .eq('user_id', userId)
            .eq('status', 'new')
            .order('match_score', { ascending: false })
            .limit(30);

        if (userLeadsError) {
            console.error(`[Digest] Error fetching leads for ${email}:`, userLeadsError);
            continue;
        }

        if (!userLeads || userLeads.length === 0) {
            continue;
        }

        console.log(`[Digest] 🎯 Processing ${userLeads.length} leads for ${email}...`);

        let finalLeads = userLeads;

        // AI Filtering Logic for this user
        if (userLeads.length > 10 && description && ai) {
            console.log(`[Digest] 🤖 AI Filtering for ${email}: ${userLeads.length} leads -> Top 10`);
            try {
                const prompt = `
                    You are an expert Lead Qualifier.
                    
                    Product Description: "${description}"
                    
                    Task: Analyze the following ${userLeads.length} leads from Reddit.
                    Identify the top 10 MOST RELEVANT leads for this product.
                    
                    Return a JSON object:
                    {
                      "top_ids": ["id1", "id2", ...],
                      "categories": { "id1": "High", "id2": "Medium", ... }
                    }
                    ONLY return JSON.
                    
                    Leads:
                    ${JSON.stringify(userLeads.map((l: any) => ({
                        id: l.id,
                        title: l.title,
                        snippet: l.subreddit + ": " + (l.body_text || '').slice(0, 200)
                    })))}
                `;

                const aiResponse = await ai.call({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.1
                });
                
                const content = aiResponse.choices?.[0]?.message?.content;
                if (content) {
                    const result = JSON.parse(content);
                    if (result.top_ids && Array.isArray(result.top_ids)) {
                        const aiSelected = userLeads.filter(l => result.top_ids.includes(l.id));
                        finalLeads = aiSelected.map(l => ({
                            ...l,
                            match_score: result.categories?.[l.id] === 'High' ? 0.95 : result.categories?.[l.id] === 'Medium' ? 0.75 : 0.45
                        })).slice(0, 10);
                    }
                }
            } catch (aiError) {
                console.error(`[Digest] ⚠️ AI Filtering failed for ${email}:`, aiError);
                finalLeads = userLeads.slice(0, 10);
            }
        } else {
            finalLeads = userLeads.slice(0, 10);
        }

        // Send Email
        try {
            console.log(`[Digest] 📧 Sending digest to ${email} (${finalLeads.length} leads)...`);
            
            // Generate dynamic subject line
            let topSubreddit = 'Reddit';
            if (finalLeads.length > 0) {
                const subredditCounts = finalLeads.reduce((acc: Record<string, number>, lead: any) => {
                    const sub = lead.subreddit || 'Reddit';
                    acc[sub] = (acc[sub] || 0) + 1;
                    return acc;
                }, {});
                topSubreddit = Object.keys(subredditCounts).reduce((a, b) => subredditCounts[a] > subredditCounts[b] ? a : b);
            }
            
            const emailResult = await sendEmail({
                to: email,
                subject: `[r/${topSubreddit}] ${finalLeads.length} New Opportunities 🎯`,
                react: DailyDigestEmail({
                    fullName: email.split('@')[0], 
                    leads: finalLeads
                })
            });

            if (emailResult?.success) {
                // Mark ALL user's NEW leads as emailed to clear backlog
                const { error: updateError } = await supabase
                    .from('monitored_leads')
                    .update({ status: 'emailed' })
                    .eq('user_id', userId)
                    .eq('status', 'new');

                if (updateError) {
                    console.error(`[Digest] Failed to update lead status for ${email}:`, updateError);
                } else {
                    sentCount++;
                }
            } else {
                console.error(`[Digest] ❌ Failed to send email to ${email}:`, emailResult?.error);
            }
        } catch (err: any) {
            console.error(`[Digest] Fatal error sending to ${email}:`, err.message);
        }
    }

    console.log(`[Digest] ✅ Complete. Sent ${sentCount} digests.`);

    // Update Heartbeat
    try {
        await supabase.from('worker_status').upsert({
            id: 'digest',
            last_heartbeat: new Date().toISOString(),
            status: 'online',
            meta: {
                last_run_sent_count: sentCount,
                eligible_users: eligibleProfiles.length
            }
        });
    } catch (err) {
        console.error('[Digest] Failed to update heartbeat:', err);
    }
}

runDailyDigest().catch(e => {
    console.error('[Digest] Fatal Error:', e);
    process.exit(1);
});
