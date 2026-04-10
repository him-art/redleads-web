/**
 * RedLeads Global Keyword Monitor (Production)
 * 
 * Architected for scale:
 * 1. Polls 100+ curated subreddits via RSS (no API limits)
 * 2. Matches posts against ALL user keywords in-memory (O(1) lookup per keyword)
 * 3. Uses Levenshtein/Fuzzy matching only for specific edge cases
 * 4. Zero per-user Reddit API calls
 * 
 * Strategy:
 * - Load all active users & keywords
 * - Build inverted index: Keyword -> [UserIDs]
 * - Poll subreddits sequentially (with pacing)
 * - Match & Score
 * - Store Leads
 */

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import pLimit from 'p-limit';
import cron from 'node-cron';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ai as AI } from '../../lib/ai';

dotenv.config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('[RSS] ❌ CRITICAL: Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Network & Pacing
// "Google-level" robustness: mimic a real browser to avoid 429s/blocking
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
let DELAY_BETWEEN_REQ_MS = 4000; // 4s base delay (dynamically adjusted)
const DELAY_MIN_MS = 1500; // Minimum delay
const DELAY_MAX_MS = 8000; // Maximum delay when under pressure
const JITTER_MAX_MS = 1500; // Add noise to avoid pattern detection
const TIMEOUT_MS = 15000;

// Rate Limiting State
let consecutive429s = 0; // Track consecutive 429 errors
let globalCooldownUntil = 0; // Timestamp for global cooldown
const COOLDOWN_THRESHOLD = 3; // Trigger global cooldown after N consecutive 429s
const COOLDOWN_DURATION_MS = 60000; // 1 minute global cooldown

const RSS_LIMIT = 25; // Fetch top 25 new posts per sub
const MAX_KEYWORDS_PER_USER = 10; // Enforced limit

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface UserRules {
    userId: string;
    keywords: string[]; // Normalized lowercase
    negativeKeywords: string[]; // Optional: ["free", "hiring"]
}

interface RSSPost {
    id: string;
    title: string;
    link: string;
    snippet: string;
    pubDate: Date;
    subreddit: string;
    author: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════

let isRunning = true;
const processedPosts = new Set<string>(); // Dedup within run
setInterval(() => processedPosts.clear(), 3600 * 1000); // Clear hourly

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

async function delay(ms: number) {
    const jitter = Math.random() * JITTER_MAX_MS;
    return new Promise(resolve => setTimeout(resolve, ms + jitter));
}

// Load master list from JSON
function loadMasterSubreddits(): string[] {
    try {
        const filePath = path.join(process.cwd(), 'data', 'master-subreddits.json');
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        console.error('[RSS] Failed to load master-subreddits.json:', e);
        return [];
    }
}

/**
 * Loads all active users and their keywords.
 * Returns a Global Keyword Index (Keyword -> UserIDs)
 */
async function buildKeywordIndex(): Promise<{ 
    index: Map<string, string[]>, 
    userSubredditsMap: Map<string, Set<string>>,
    userCount: number,
    keywordCount: number,
    profiles: any[]
}> {
    const TRIAL_DAYS = 3;

    // 1. Fetch profiles with keywords + subreddits + subscription/trial info
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, keywords, user_metadata, description, subscription_tier, trial_ends_at, created_at')
        .not('keywords', 'is', null);

    if (error) {
        console.error('[RSS] Failed to fetch profiles:', error);
        return { index: new Map(), userSubredditsMap: new Map(), userCount: 0, keywordCount: 0, profiles: [] };
    }

    const now = new Date();
    const index = new Map<string, string[]>();
    const userSubredditsMap = new Map<string, Set<string>>();
    let keywordCount = 0;
    let skippedExpired = 0;

    // 2. Filter: only index keywords for paid users or active trial users
    const activeProfiles = profiles.filter(p => {
        const tier = p.subscription_tier?.toLowerCase();
        const isPaid = tier === 'starter' || tier === 'growth' || tier === 'lifetime';
        if (isPaid) return true;

        // Calculate trial end date
        const trialEndsAt = p.trial_ends_at ? new Date(p.trial_ends_at) : null;

        const isInTrial = trialEndsAt ? trialEndsAt > now : false;
        if (!isInTrial) {
            skippedExpired++;
            return false;
        }
        return true;
    });

    if (skippedExpired > 0) {
        console.log(`[RSS] 🚫 Skipped ${skippedExpired} expired trial users from keyword index.`);
    }

    activeProfiles.forEach(p => {
        if (!p.keywords || !Array.isArray(p.keywords)) return;
        
        // Take top 10 keywords only
        const userKeywords = p.keywords.slice(0, MAX_KEYWORDS_PER_USER);
        
        userKeywords.forEach((k: string) => {
             const key = k.toLowerCase().trim();
             if (!key) return;
             
             const users = index.get(key) || [];
             users.push(p.id);
             index.set(key, users);
             keywordCount++;
        });

        // Index human-specified subreddits from user_metadata
        const metadata = p.user_metadata || {};
        const userSubs = metadata.subreddits || [];
        if (Array.isArray(userSubs)) {
            userSubs.forEach((s: string) => {
                const sub = s.toLowerCase().trim();
                if (!sub) return;
                const users = userSubredditsMap.get(sub) || new Set<string>();
                users.add(p.id);
                userSubredditsMap.set(sub, users);
            });
        }
    });

    return { index, userSubredditsMap, userCount: activeProfiles.length, keywordCount, profiles: activeProfiles };
}

/**
 * Fetch RSS Feed with robust error handling and exponential backoff
 */
async function fetchFeed(subreddit: string, retryCount = 0): Promise<RSSPost[]> {
    const url = `https://www.reddit.com/r/${subreddit}/new/.rss?limit=${RSS_LIMIT}`;
    
    // Check for global cooldown
    if (Date.now() < globalCooldownUntil) {
        const waitTime = globalCooldownUntil - Date.now();
        console.log(`[RSS] ⏳ Global cooldown active, waiting ${Math.ceil(waitTime / 1000)}s...`);
        await delay(waitTime);
    }
    
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': USER_AGENT },
            timeout: TIMEOUT_MS
        });

        // Success - reset consecutive 429 counter and ease up on throttling
        consecutive429s = 0;
        if (DELAY_BETWEEN_REQ_MS > DELAY_MIN_MS) {
            DELAY_BETWEEN_REQ_MS = Math.max(DELAY_MIN_MS, DELAY_BETWEEN_REQ_MS - 100);
        }

        const parsed = await parseStringPromise(res.data, { explicitArray: false });
        const entries = parsed?.feed?.entry;
        
        if (!entries) return [];
        const items = Array.isArray(entries) ? entries : [entries];

        return items.map((item: any) => ({
            id: item.id || item.link?.$.href,
            title: item.title || '',
            link: item.link?.$.href || '',
            snippet: (item.content?._ || item.summary || '').replace(/<[^>]*>/g, '').slice(0, 1000),
            pubDate: new Date(item.updated || item.published || Date.now()),
            subreddit: subreddit,
            author: item.author?.name?.replace('/u/', '') || 'unknown'
        }));

    } catch (err: any) {
        if (err.response?.status === 429) {
            consecutive429s++;
            
            // Exponential backoff: 5s, 10s, 20s, 40s...
            const backoffMs = Math.min(5000 * Math.pow(2, retryCount), 60000);
            console.warn(`[RSS] ⚠️ 429 on r/${subreddit} (attempt ${retryCount + 1}). Backoff: ${backoffMs / 1000}s`);
            
            // Increase base delay for all subsequent requests
            DELAY_BETWEEN_REQ_MS = Math.min(DELAY_MAX_MS, DELAY_BETWEEN_REQ_MS + 500);
            console.log(`[RSS] 📈 Increased base delay to ${DELAY_BETWEEN_REQ_MS}ms`);
            
            // Trigger global cooldown if too many consecutive 429s
            if (consecutive429s >= COOLDOWN_THRESHOLD) {
                globalCooldownUntil = Date.now() + COOLDOWN_DURATION_MS;
                console.warn(`[RSS] 🛑 Global cooldown triggered for ${COOLDOWN_DURATION_MS / 1000}s`);
            }
            
            // Retry up to 2 times with exponential backoff
            if (retryCount < 2) {
                await delay(backoffMs);
                return fetchFeed(subreddit, retryCount + 1);
            }
            
            console.warn(`[RSS] ❌ Skipping r/${subreddit} after ${retryCount + 1} failed attempts.`);
        } else if (err.response?.status === 404) {
            console.warn(`[RSS] ❌ r/${subreddit} not found/banned.`);
        } else if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
            console.warn(`[RSS] ⏱️ Timeout on r/${subreddit}`);
        }
        return [];
    }
}

/**
 * Matches a post against the global keyword index.
 * Returns unique UserIDs that matched.
 */
function findMatchingUsers(post: RSSPost, keywordIndex: Map<string, string[]>): string[] {
    const text = `${post.title} ${post.snippet}`.toLowerCase();
    const matchedUsers = new Set<string>();

    for (const [keyword, userIds] of keywordIndex.entries()) {
        // Use Regex with word boundaries to prevent partial matches (e.g., "app" matching "apple")
        // Escape special characters in keyword just in case
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
        
        if (regex.test(text)) {
            userIds.forEach(uid => matchedUsers.add(uid));
        }
    }

    return Array.from(matchedUsers);
}

async function getLeadCategory(post: RSSPost, businessDescription: string): Promise<string> {
    if (!businessDescription) return 'Medium';
    
    const prompt = `
        You are an expert Lead Qualification Assistant. Your goal is to categorize a Reddit post based on its relevance and intent for a specific business.
        
        BUSINESS CONTEXT:
        The business is described as: "${businessDescription}"
        
        REDDIT POST TO ANALYZE:
        Title: "${post.title}"
        Snippet: "${post.snippet.slice(0, 1000)}"
        Subreddit: r/${post.subreddit}
        
        CATEGORIZATION CRITERIA:
        - "High": The user is explicitly asking for a solution, expressing a strong pain point that the business solves, or looking for recommendations in the business's niche. This indicates clear "buying intent" or a direct need that the business can fulfill.
        - "Medium": The post is highly relevant to the niche or industry of the business, but the intent is more informational, conversational, or exploratory (e.g., sharing a story, asking a general question, discussing trends). It's a good lead, but not immediately actionable.
        - "Low": The post mentions a keyword relevant to the business but is unrelated to its core offering (e.g., a casual mention, a different context, or a tangential discussion). This also includes spam, noise, or posts where the business cannot provide value.
        
        Return ONLY one word: "High", "Medium", or "Low".
    `;

    const res = await AI.call({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 10
    });

    const content = res.choices?.[0]?.message?.content?.trim();
    if (content?.toLowerCase().includes('high')) return 'High';
    if (content?.toLowerCase().includes('low')) return 'Low';
    return 'Medium';
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CYCLE
// ═══════════════════════════════════════════════════════════════════════════

async function runPollCycle() {
    if (!isRunning) return;
    
    const startTime = Date.now();
    console.log('\n[RSS] ═══════════════════════════════════════════════════════');
    console.log('[RSS] 🚀 Starting Global Keyword Scan...');
    
    // 1. Build Index
    const { index, userSubredditsMap, userCount, keywordCount, profiles } = await buildKeywordIndex();
    console.log(`[RSS] 🧠 Loaded ${keywordCount} keywords for ${userCount} users.`);
    
    // 2. Load and Merge Subreddits
    const masterSubreddits = loadMasterSubreddits();
    const allUniqueSubreddits = Array.from(new Set([
        ...masterSubreddits.map(s => s.toLowerCase()), 
        ...Array.from(userSubredditsMap.keys())
    ]));
    
    console.log(`[RSS] 📋 Monitoring ${allUniqueSubreddits.length} subreddits (${masterSubreddits.length} master + unique custom).`);
    
    let totalPosts = 0;
    let totalMatches = 0;
    let successCount = 0;

    // 3. Sequential Polling
    for (const subreddit of allUniqueSubreddits) {
        if (!isRunning) break;
        
        try {
            // Fetch
            const posts = await fetchFeed(subreddit);
            
            // Filter new/unseen
            const newPosts = posts.filter(p => !processedPosts.has(p.id));
            if (newPosts.length === 0) {
                await delay(DELAY_BETWEEN_REQ_MS);
                continue;
            }

            successCount++;
            totalPosts += newPosts.length;
            
            // Worker Hard Timeout Guard: 110 minutes
            const MAX_EXECUTION_TIME_MS = 110 * 60 * 1000;
            if (Date.now() - startTime > MAX_EXECUTION_TIME_MS) {
                console.warn(`[RSS] ⏱️ Hard timeout reached (110 mins). Exiting loop early to prevent overlapping crons.`);
                break;
            }

            // Match & Store
            for (const post of newPosts) {
                processedPosts.add(post.id);
                let matchedUserIds = findMatchingUsers(post, index);
                
                // RESTRICTED DELIVERY:
                // If the subreddit is NOT in the master list, only deliver to users who specifically requested it.
                const isMasterSub = masterSubreddits.some(s => s.toLowerCase() === subreddit.toLowerCase());
                if (!isMasterSub) {
                    const specificUsers = userSubredditsMap.get(subreddit.toLowerCase()) || new Set<string>();
                    matchedUserIds = matchedUserIds.filter(uid => specificUsers.has(uid));
                }

                if (matchedUserIds.length > 0) {
                    totalMatches += matchedUserIds.length;
                    console.log(`[RSS] 🎯 Match in r/${subreddit} (${isMasterSub ? 'Global' : 'Custom'}) -> ${matchedUserIds.length} user(s) matched.`);
                    
                    // DEDUPLICATION: Check which users already have this title
                    const { data: existing } = await supabase
                        .from('monitored_leads')
                        .select('user_id')
                        .eq('title', post.title)
                        .in('user_id', matchedUserIds);
                    
                    const existingUserIds = new Set(existing?.map(x => x.user_id) || []);
                    const newUserIds = matchedUserIds.filter(uid => !existingUserIds.has(uid));

                    if (newUserIds.length === 0) {
                        console.log(`[RSS] ⏭️  Skipping duplicates for all matched users.`);
                        continue;
                    }

                    // Bulk insert leads
                    // SEVERE RATE LIMIT HANDLING: Serialize AI calls (pLimit(1)) and add delays
                    // Groq has strict RPM / TPM limits. 
                    const limit = pLimit(1);
                    const leadsToInsert = await Promise.all(newUserIds.map((uid) => limit(async () => {
                        const prof = profiles?.find(p => p.id === uid);
                        
                        // Internal retry logic for rate-limits
                        let category = 'Medium';
                        let retries = 3;
                        while (retries > 0) {
                            try {
                                category = await getLeadCategory(post, prof?.description || '');
                                break; // Success
                            } catch (e: any) {
                                if (e?.message?.includes('rate-limited') || e?.message?.includes('all available keys') || e?.message?.includes('429')) {
                                    const maskedUid = uid.slice(0, 4);
                                    console.warn(`[AI] ⚠️ Rate limited for user ${maskedUid}... Waiting 65s... (${retries} retries left)`);
                                    await delay(65000);
                                    retries--;
                                } else {
                                    console.error(`[AI] Error categorizing lead (Fallback to Medium):`, e);
                                    break;
                                }
                            }
                        }
                        
                        // Enforce pacing between sequential AI calls to prevent RPM exhaustion
                        await delay(4000); 
                        
                        return {
                            user_id: uid,
                            title: post.title,
                            body_text: post.snippet.slice(0, 1000), 
                            subreddit: post.subreddit,
                            url: post.link,
                            author: post.author,
                            status: 'new',
                            match_score: category === 'High' ? 0.95 : category === 'Medium' ? 0.75 : 0.45,
                            match_category: category,
                            reddit_score: 0,
                            comment_count: 0
                        };
                    })));
                    
                    const { error } = await supabase.from('monitored_leads').insert(leadsToInsert);
                    if (error) console.error('[RSS] DB Insert Error:', error.message);
                }
            }
        } catch (err) {
            console.error(`[RSS] Error processing r/${subreddit}:`, err);
        }
        
        await delay(DELAY_BETWEEN_REQ_MS);
    }
    
    const duration = Date.now() - startTime;
    console.log(`[RSS] ✅ Cycle Complete: Scanned ${totalPosts} posts, Found ${totalMatches} leads. Duration: ${Math.round(duration/1000)}s`);
    
    // Update Heartbeat
    try {
        await supabase.from('worker_status').upsert({
            id: 'scanner',
            last_heartbeat: new Date().toISOString(),
            status: 'online',
            meta: {
                last_run_duration_ms: duration,
                last_scan_counts: {
                    posts: totalPosts,
                    leads: totalMatches,
                    success_rate: allUniqueSubreddits.length > 0 ? (successCount / allUniqueSubreddits.length) : 0
                },
                delay_ms: DELAY_BETWEEN_REQ_MS
            }
        });
    } catch (err) {
        console.error('[RSS] Failed to update heartbeat:', err);
    }

    console.log('[RSS] ═══════════════════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════════════════════════

async function start() {
    console.log('[RSS] 🎬 RedLeads Worker Starting...');
    
    // Check for --once flag
    const isOnce = process.argv.includes('--once') || process.env.npm_config_once === 'true';

    await runPollCycle();

    if (isOnce) {
        console.log('[RSS] 🏁 Single run complete.');
        process.exit(0);
    }

    // Schedule: Every 2 hours
    // Gives plenty of buffer for long ingestion cycles with rate limiting
    cron.schedule('0 */2 * * *', runPollCycle);
    console.log('[RSS] ⏰ Scheduled cron: 0 */2 * * *');
}

// Graceful Shutdown
process.on('SIGTERM', () => { isRunning = false; process.exit(0); });
process.on('SIGINT', () => { isRunning = false; process.exit(0); });

start().catch(e => {
    console.error('[RSS] Fatal Error:', e);
    process.exit(1);
});
