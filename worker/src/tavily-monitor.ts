/**
 * RedLeads Global Tavily Ingestion Monitor (Clustered)
 * 
 * Replaces RSS monitor. Runs once daily.
 * 1. Loads all active paid & trial users.
 * 2. Uses LLM to cluster users into cohesive groups based on keywords/descriptions.
 * 3. Generates a mega-query for each cluster and searches Tavily.
 * 4. Grades the resulting leads and attributes them to the correct users.
 * 5. Saves leads to Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ai as AI } from '../../lib/ai';
import path from 'path';
import fs from 'fs';

// Load .env.local synchronously (safe for both local dev and CI)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !TAVILY_API_KEY) {
    const missing = [
        !SUPABASE_URL && 'NEXT_PUBLIC_SUPABASE_URL',
        !SUPABASE_SERVICE_KEY && 'SUPABASE_SERVICE_ROLE_KEY',
        !TAVILY_API_KEY && 'TAVILY_API_KEY'
    ].filter(Boolean).join(', ');
    console.error(`[TavilyMonitor] ❌ CRITICAL: Missing env vars: ${missing}`);
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface UserProfile {
    id: string;
    keywords: string[];
    description: string;
    tier: string;
}

interface Cluster {
    query: string;
    userIds: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractSubreddit(url: string) {
    try {
        const parts = url.split('/r/');
        if (parts.length > 1) {
            return parts[1].split('/')[0];
        }
        return 'Reddit';
    } catch {
        return 'Reddit';
    }
}

/**
 * Loads all active users who are eligible for leads.
 */
async function getActiveUsers(): Promise<UserProfile[]> {
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, keywords, description, subscription_tier, trial_ends_at, created_at')
        .not('keywords', 'is', null);

    if (error || !profiles) {
        console.error('[TavilyMonitor] Failed to fetch profiles:', error);
        return [];
    }

    const now = new Date();
    const activeProfiles: UserProfile[] = [];

    profiles.forEach(p => {
        const tier = (p.subscription_tier || '').toLowerCase();
        const isPaid = tier === 'starter' || tier === 'growth' || tier === 'lifetime' || tier === 'one_time';
        
        const trialEndsAt = p.trial_ends_at ? new Date(p.trial_ends_at) : null;
        const isInTrial = trialEndsAt ? trialEndsAt > now : false;

        if (isPaid || isInTrial) {
            // Must have keywords
            if (p.keywords && Array.isArray(p.keywords) && p.keywords.length > 0) {
                activeProfiles.push({
                    id: p.id,
                    keywords: p.keywords.slice(0, 5), // Keep it concise for AI
                    description: p.description || '',
                    tier
                });
            }
        }
    });

    return activeProfiles;
}

/**
 * Uses LLM to cluster users and generate high-intent search queries.
 */
async function clusterUsers(users: UserProfile[]): Promise<Cluster[]> {
    console.log(`[TavilyMonitor] 🤖 Clustering ${users.length} users...`);
    
    // To avoid token limits if there are many users, we could chunk them.
    // For now, assume ~100 users fit easily in Llama's context window.
    
    const payload = users.map(u => ({
        id: u.id,
        keywords: u.keywords,
        description: u.description.substring(0, 150) // truncate to save tokens
    }));

    const prompt = `
        You are an expert lead generation strategist.
        We have ${users.length} users looking for their target audience on Reddit.
        
        Task: Group these users into cohesive clusters based on their target audiences or niches (e.g., "SaaS Founders", "Designers", "Real Estate").
        Aim for 5 to 15 clusters max. 
        For each cluster, generate a SINGLE Natural Language search query that an AI search engine can use to find their target audience on Reddit over the last 24 hours.
        
        The query should be descriptive, e.g., "People looking for lead generation tools or alternatives to Apollo".
        Do NOT use Boolean operators (OR, AND).
        Do NOT include site:reddit.com in the query string.
        
        Users:
        ${JSON.stringify(payload)}
        
        Respond ONLY with a JSON object:
        {
            "clusters": [
                {
                    "query": "<search query here>",
                    "userIds": ["id1", "id2"]
                }
            ]
        }
    `;

    try {
        const res = await AI.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });

        const content = res.choices?.[0]?.message?.content;
        if (content) {
            const parsed = JSON.parse(content);
            if (parsed.clusters && Array.isArray(parsed.clusters)) {
                return parsed.clusters;
            }
        }
    } catch (e) {
        console.error('[TavilyMonitor] AI Clustering failed:', e);
    }
    
    // Fallback: Group users in chunks of 5 and use generic queries
    console.warn('[TavilyMonitor] ⚠️ Using fallback clustering logic.');
    const fallbackClusters: Cluster[] = [];
    for (let i = 0; i < users.length; i += 5) {
        const chunk = users.slice(i, i + 5);
        const allKeywords = chunk.flatMap(u => u.keywords);
        fallbackClusters.push({
            query: `People asking for recommendations related to ${allKeywords.slice(0, 10).join(', ')}`,
            userIds: chunk.map(u => u.id)
        });
    }
    return fallbackClusters;
}

/**
 * Searches Tavily for a given cluster query.
 */
async function searchTavily(query: string): Promise<any[]> {
    console.log(`[TavilyMonitor] 🔍 Searching Tavily: "${query}"`);
    try {
        const fetchBody = {
            api_key: TAVILY_API_KEY,
            query: query,
            search_depth: "advanced",
            include_domains: ["reddit.com"],
            max_results: 30,
            time_range: "day"
        };

        const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fetchBody)
        });

        if (res.ok) {
            const data = await res.json();
            return data.results || [];
        } else {
            console.error(`[TavilyMonitor] Tavily API error: ${res.status} ${res.statusText}`);
            return [];
        }
    } catch (error) {
        console.error('[TavilyMonitor] Tavily Fetch failed:', error);
        return [];
    }
}

/**
 * Grades leads for specific users in a cluster to ensure relevance.
 */
async function gradeAndDistributeLeads(cluster: Cluster, tavilyResults: any[], userMap: Map<string, UserProfile>): Promise<any[]> {
    if (tavilyResults.length === 0) return [];
    if (cluster.userIds.length === 0) return [];

    console.log(`[TavilyMonitor] ⚖️ Grading ${tavilyResults.length} leads for ${cluster.userIds.length} users...`);

    // Only keep Reddit posts
    const validResults = tavilyResults.filter(r => r.url.includes('reddit.com/r/'));
    
    // To save tokens, we evaluate up to 20 leads at a time
    const leadsToEvaluate = validResults.slice(0, 20).map(r => ({
        url: r.url,
        title: r.title,
        body: r.content?.substring(0, 300) || ''
    }));

    const targetUsers = cluster.userIds.map(id => {
        const u = userMap.get(id);
        return u ? { id: u.id, context: u.description || u.keywords.join(', ') } : null;
    }).filter(Boolean);

    if (leadsToEvaluate.length === 0 || targetUsers.length === 0) return [];

    const prompt = `
        You are a lead distribution AI. We have ${leadsToEvaluate.length} Reddit posts and ${targetUsers.length} users.
        
        Your task is to assign relevant leads to the users who can solve their problem.
        
        Users:
        ${JSON.stringify(targetUsers, null, 2)}
        
        Leads:
        ${JSON.stringify(leadsToEvaluate, null, 2)}
        
        For each lead, decide if it's a "High Match" or "Good Match" for any of the users. If it's not relevant to a user, do not assign it to them.
        A lead can be assigned to multiple users if relevant.
        
        Respond ONLY with a JSON object:
        {
            "assignments": [
                {
                    "url": "https://reddit.com/r/...",
                    "userId": "user_id_here",
                    "category": "High Match" // or "Good Match"
                }
            ]
        }
    `;

    try {
        const res = await AI.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.1,
        });

        const content = res.choices?.[0]?.message?.content;
        if (content) {
            const parsed = JSON.parse(content);
            const assignments = parsed.assignments || [];
            
            const finalLeads: any[] = [];
            
            for (const assignment of assignments) {
                const leadData = validResults.find(r => r.url === assignment.url);
                if (leadData && cluster.userIds.includes(assignment.userId)) {
                    finalLeads.push({
                        user_id: assignment.userId,
                        title: leadData.title,
                        subreddit: extractSubreddit(leadData.url),
                        url: leadData.url,
                        body_text: leadData.content || '',
                        status: 'new',
                        match_category: assignment.category === 'High Match' ? 'High Match' : 'Good Match',
                        match_score: assignment.category === 'High Match' ? 0.95 : 0.75,
                        reddit_score: 0,
                        comment_count: 0
                    });
                }
            }
            return finalLeads;
        }
    } catch (error) {
        console.error('[TavilyMonitor] AI Grading failed:', error);
    }
    
    // Fallback: Assign all leads to all users in the cluster as "Good Match"
    console.warn('[TavilyMonitor] ⚠️ Using fallback assignment.');
    const fallbackLeads: any[] = [];
    for (const lead of validResults) {
        for (const userId of cluster.userIds) {
            fallbackLeads.push({
                user_id: userId,
                title: lead.title,
                subreddit: extractSubreddit(lead.url),
                url: lead.url,
                body_text: lead.content || '',
                status: 'new',
                match_category: 'Good Match',
                match_score: 0.75,
                reddit_score: 0,
                comment_count: 0
            });
        }
    }
    return fallbackLeads;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function run() {
    console.log('\n[TavilyMonitor] ═══════════════════════════════════════════════════════');
    console.log('[TavilyMonitor] 🚀 Starting Global Tavily Cluster Scan...');
    const startTime = Date.now();

    // 1. Get Users
    const users = await getActiveUsers();
    console.log(`[TavilyMonitor] 👤 Found ${users.length} active users.`);
    if (users.length === 0) return;

    const userMap = new Map<string, UserProfile>();
    users.forEach(u => userMap.set(u.id, u));

    // 2. Cluster Users
    const clusters = await clusterUsers(users);
    console.log(`[TavilyMonitor] 🧩 Formed ${clusters.length} clusters.`);

    let totalLeadsInserted = 0;

    // 3. Process each cluster
    for (const cluster of clusters) {
        console.log(`\n[TavilyMonitor] ⚙️ Processing Cluster (${cluster.userIds.length} users): ${cluster.query}`);
        
        // 3a. Search
        const tavilyResults = await searchTavily(cluster.query);
        console.log(`[TavilyMonitor] 🌐 Found ${tavilyResults.length} raw results.`);

        // 3b. Grade and Distribute
        const processedLeads = await gradeAndDistributeLeads(cluster, tavilyResults, userMap);
        console.log(`[TavilyMonitor] 📬 Distributed into ${processedLeads.length} user-specific leads.`);

        if (processedLeads.length > 0) {
            // Deduplicate against existing leads in DB
            const userIds = [...new Set(processedLeads.map(l => l.user_id))];
            const titles = [...new Set(processedLeads.map(l => l.title))];

            const { data: existing } = await supabase
                .from('monitored_leads')
                .select('user_id, url')
                .in('user_id', userIds)
                .in('title', titles);

            const existingSet = new Set(existing?.map(x => `${x.user_id}_${x.url}`) || []);
            
            const leadsToInsert = processedLeads.filter(l => !existingSet.has(`${l.user_id}_${l.url}`));
            
            if (leadsToInsert.length > 0) {
                // To avoid payload too large, chunk inserts
                const chunkSize = 100;
                for (let i = 0; i < leadsToInsert.length; i += chunkSize) {
                    const chunk = leadsToInsert.slice(i, i + chunkSize);
                    const { error } = await supabase.from('monitored_leads').insert(chunk);
                    if (error) {
                        console.error('[TavilyMonitor] DB Insert Error:', error.message);
                    } else {
                        totalLeadsInserted += chunk.length;
                    }
                }
                console.log(`[TavilyMonitor] ✅ Inserted ${leadsToInsert.length} new leads.`);
            } else {
                console.log(`[TavilyMonitor] ⏭️ All leads were duplicates.`);
            }
        }

        // Delay to avoid hammering APIs
        await delay(2000);
    }

    const duration = Date.now() - startTime;
    console.log(`\n[TavilyMonitor] 🎉 Scan Complete: Inserted ${totalLeadsInserted} total leads. Duration: ${Math.round(duration/1000)}s`);

    // Update Heartbeat
    try {
        await supabase.from('worker_status').upsert({
            id: 'tavily_ingestion',
            last_heartbeat: new Date().toISOString(),
            status: 'online',
            meta: {
                last_run_duration_ms: duration,
                clusters_count: clusters.length,
                leads_inserted: totalLeadsInserted
            }
        });
    } catch (err) {
        console.error('[TavilyMonitor] Failed to update heartbeat:', err);
    }

    console.log('[TavilyMonitor] ═══════════════════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════════════════════════

async function start() {
    await run();
    process.exit(0);
}

start().catch(e => {
    console.error('[TavilyMonitor] Fatal Error:', e);
    process.exit(1);
});
