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

    // 1. Fetch NEW leads from last 24h
    // We filter by status='new' to avoid re-sending if worker re-runs
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: leads, error } = await supabase
        .from('monitored_leads')
        .select(`
            id, 
            title, 
            subreddit, 
            match_score, 
            body_text,
            user_id
        `)
        .eq('status', 'new')
        .gte('created_at', yesterday)
        .order('match_score', { ascending: false });

    if (error) {
        console.error('[Digest] Failed to fetch leads:', error);
        return;
    }

    if (!leads || leads.length === 0) {
        console.log('[Digest] No new leads to report today.');
        return;
    }

    console.log(`[Digest] Found ${leads.length} new leads. Fetching user emails...`);

    // 2. Fetch Emails & Descriptions
    const userIds = Array.from(new Set(leads.map(l => l.user_id)));
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, description')
        .in('id', userIds);
    
    if (profileError) {
        console.error('[Digest] Failed to fetch profiles:', profileError);
        return;
    }

    const userEmails: Record<string, string> = {};
    profiles?.forEach(p => {
        if (p.email) userEmails[p.id] = p.email;
    });

    // 3. Group by User
    const leadsByUser: Record<string, typeof leads> = {};
    const userDescriptions: Record<string, string> = {}; // Store descriptions
    
    // Process profiles to map emails and descriptions
    profiles?.forEach((p: any) => {
        if (p.email) userEmails[p.id] = p.email;
        if (p.description) userDescriptions[p.id] = p.description;
    });
    
    for (const lead of leads) {
        if (!leadsByUser[lead.user_id]) {
            leadsByUser[lead.user_id] = [];
        }
        leadsByUser[lead.user_id].push(lead);
    }

    // 4. Send Emails & Update Status
    const { sendEmail } = require(emailLibPath);
    const { ai } = require(path.join(__dirname, '../../lib/ai')); // Import AI
    const DailyDigestEmail = require(emailTemplatePath).default;

    let sentCount = 0;

    for (const [userId, userLeads] of Object.entries(leadsByUser)) {
        const email = userEmails[userId];
        const description = userDescriptions[userId];
        
        if (!email) {
            console.warn(`[Digest] No email found for user ${userId}, skipping.`);
            continue;
        }

        let finalLeads = userLeads;

        // --- AI Filtering Logic ---
        if (userLeads.length > 10 && description && ai) {
            console.log(`[Digest] 🤖 AI Filtering for ${email}: ${userLeads.length} leads -> Top 10`);
            
            // Take top 30 by keyword match score as candidates
            const candidates = userLeads.slice(0, 30);
            
            try {
                const prompt = `
                    You are an expert Lead Qualifier.
                    
                    Business Description: "${description}"
                    
                    Task: Analyze the following ${candidates.length} potential leads from Reddit.
                    Identify the top 10 MOST RELEVANT leads for this business.
                    
                    Criteria:
                    - High Intent: Validates a problem the business solves.
                    - Relevance: Matches the specific niche/industry.
                    - Recency/Context: Looks like a genuine opportunity, not spam.
                    
                    Leads:
                    ${JSON.stringify(candidates.map((l: any) => ({
                        id: l.id,
                        title: l.title,
                        snippet: l.subreddit + ": " + (l.body_text || '').slice(0, 200) // Truncate for tokens
                    })))}
                    
                    Return a JSON object with a single array "top_ids" containing the IDs of the top 10 matches, ordered by relevance.
                    Example: { "top_ids": ["id1", "id2", ...] }
                    ONLY return JSON.
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
                        // Filter and sort final leads based on AI return
                        const aiSelected = candidates.filter(l => result.top_ids.includes(l.id));
                        
                        // Sort by AI order
                        aiSelected.sort((a, b) => {
                            return result.top_ids.indexOf(a.id) - result.top_ids.indexOf(b.id);
                        });
                        
                        // Fallback: If AI returned < 10, fill with keyword matches
                        if (aiSelected.length < 10) {
                            const remaining = candidates.filter(l => !result.top_ids.includes(l.id));
                            finalLeads = [...aiSelected, ...remaining].slice(0, 10);
                        } else {
                            finalLeads = aiSelected.slice(0, 10);
                        }
                        console.log(`[Digest] ✨ AI successfully selected ${finalLeads.length} leads.`);
                    }
                }
            } catch (aiError) {
                console.error(`[Digest] ⚠️ AI Filtering failed for ${email}`, aiError);
                // Fallback to top 10 by keyword score
                finalLeads = userLeads.slice(0, 10);
            }
        } else {
            // No AI or few leads: Just take top 10
            finalLeads = userLeads.slice(0, 10);
        }
        // ---------------------------

        try {
            console.log(`[Digest] 📧 Sending digest to ${email} (${finalLeads.length} leads)...`);
            
            const emailResult = await sendEmail({
                to: email,
                subject: `Daily Intelligence: ${finalLeads.length} Top Opportunities 🎯`,
                react: DailyDigestEmail({
                    fullName: email.split('@')[0], 
                    leads: finalLeads
                })
            });

            if (!emailResult || !emailResult.success) {
                console.error(`[Digest] ❌ Failed to send email to ${email}:`, emailResult?.error);
                continue; // Do not mark as emailed
            }

            // 4. Mark ALL fetched leads as emailed/processed so they don't show up again
            // We processed the backlog for today.
            const leadIds = userLeads.map(l => l.id);
            const { error: updateError } = await supabase
                .from('monitored_leads')
                .update({ status: 'emailed' })
                .in('id', leadIds);

            if (updateError) {
                console.error(`[Digest] Failed to update status for user ${userId}:`, updateError);
            } else {
                sentCount++;
            }

        } catch (err: any) {
            console.error(`[Digest] Failed to send email to ${email}:`, err.message);
        }
    }

    console.log(`[Digest] ✅ Complete. Sent ${sentCount} digests.`);
}

runDailyDigest().catch(e => {
    console.error('[Digest] Fatal Error:', e);
    process.exit(1);
});
