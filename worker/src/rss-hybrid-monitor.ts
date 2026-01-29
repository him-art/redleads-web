/**
 * RedLeads Hybrid RSS Monitor (Production)
 * 
 * A scalable, ban-proof background worker for monitoring Reddit subreddits.
 * Uses a hybrid strategy: RSS for discovery, selective .json for full content.
 * Designed for 200+ users / 500+ unique subreddits.
 * 
 * Key Features:
 * - Sequential p-limit pacing to avoid Reddit rate limits
 * - RSS primary with selective .json enrichment
 * - Global dedup via unique_subreddits table
 * - Error streak tracking with automatic pausing
 * - Graceful shutdown handling
 * - Health monitoring with failure rate alerts
 */

import { createClient } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';
import { parseStringPromise } from 'xml2js';
import pLimit from 'p-limit';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('[RSS] ❌ CRITICAL: Missing Supabase configuration.');
    console.error('     Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Network & Pacing
const USER_AGENT = 'RedLeads/2.0 (SaaS Lead Monitor; +https://redleads.app)';
const DELAY_BETWEEN_REQ_MS = 1800; // 1.8 seconds base delay
const JITTER_MAX_MS = 1000; // Up to 1 second random jitter
const REQUEST_TIMEOUT_MS = 15000; // 15 second timeout

// Ingestion Limits
const RSS_LIMIT = 20; // Top 20 newest posts
const MAX_AI_EVAL_PER_SUB_CYCLE = 10; // Max posts to score per cycle per sub

// ═══════════════════════════════════════════════════════════════════════════
// PURE RSS MODE: No .json fetching for Reddit data.
// ═══════════════════════════════════════════════════════════════════════════

// AI Matching
const QUICK_SCORE_THRESHOLD = 0.7; // Only fetch full post if score > 0.7

// Error Management
const MAX_ERROR_STREAK = 3;
const PAUSE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours pause on repeated failures

// Health Monitoring
const FAILURE_RATE_THRESHOLD = 0.3; // 30% failure rate triggers alert

// Concurrency
const limit = pLimit(1); // Sequential processing

// Graceful Shutdown
let isRunning = true;

// Local Deduplication (prevents processing same post twice in same hour)
const processedPosts = new Set<string>();
setInterval(() => processedPosts.clear(), 60 * 60 * 1000); // Clear every hour

// ═══════════════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

process.on('SIGTERM', () => {
    console.log('[RSS] 🛑 Ingestion worker shutting down gracefully...');
    isRunning = false;
    // Allow current operations to complete
    setTimeout(() => process.exit(0), 5000);
});

process.on('SIGINT', () => {
    console.log('[RSS] 🛑 Ingestion worker interrupted');
    isRunning = false;
    setTimeout(() => process.exit(0), 2000);
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface UniqueSubreddit {
    id: string;
    name: string;
    last_pubdate: string | null;
    error_streak: number;
    paused_until: string | null;
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

interface RedditPostData {
    id: string;
    title: string;
    selftext: string;
    url: string;
    subreddit: string;
    author: string;
    created_utc: number;
    score: number;
    num_comments: number;
}

interface UserProfile {
    id: string;
    keywords: string[];
    description: string;
    email?: string;
    full_name?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Delay execution with optional jitter for natural pacing.
 */
async function delay(ms: number, addJitter = true): Promise<void> {
    const jitter = addJitter ? Math.random() * JITTER_MAX_MS : 0;
    return new Promise(resolve => setTimeout(resolve, ms + jitter));
}

/**
 * Get all unique subreddits that are not currently paused.
 */
async function getUniqueSubreddits(): Promise<UniqueSubreddit[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
        .from('unique_subreddits')
        .select('*')
        .or(`paused_until.is.null,paused_until.lt.${now}`)
        .order('last_pubdate', { ascending: true, nullsFirst: true });

    if (error) {
        console.error('[RSS] Failed to fetch unique subreddits:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Increment error streak and optionally pause the subreddit.
 * Returns true if the subreddit was paused.
 */
async function handleSubError(subName: string, currentStreak: number): Promise<boolean> {
    const newStreak = currentStreak + 1;
    const pauseUntil = newStreak > MAX_ERROR_STREAK 
        ? new Date(Date.now() + PAUSE_DURATION_MS).toISOString()
        : null;

    await supabase
        .from('unique_subreddits')
        .update({ 
            error_streak: newStreak, 
            paused_until: pauseUntil 
        })
        .eq('name', subName);

    if (pauseUntil) {
        console.warn(`[RSS] ⚠️ Pausing r/${subName} until ${pauseUntil} (streak: ${newStreak})`);
    }

    return true; // Indicates failure occurred
}

/**
 * Reset error streak on successful fetch.
 */
async function resetErrorStreak(subName: string): Promise<void> {
    await supabase
        .from('unique_subreddits')
        .update({ error_streak: 0, paused_until: null })
        .eq('name', subName);
}

/**
 * Update the last processed pubdate for a subreddit.
 */
async function updateLastPubdate(subName: string, date: Date): Promise<void> {
    await supabase
        .from('unique_subreddits')
        .update({ last_pubdate: date.toISOString() })
        .eq('name', subName);
}

async function getUsersForSubreddit(subName: string): Promise<UserProfile[]> {
    // Note: We use lowercase comparison because subreddits in profiles are likely saved as lowercase strings
    // but the input subName might vary. Supabase contains filter with array of strings is case-sensitive.
    // However, our sync logic typically ensures lowercase. We will normalize here to be safe.
    
    const { data, error } = await supabase
        .from('profiles')
        .select('id, keywords, description, email, full_name')
        .contains('subreddits', [subName.toLowerCase()]);

    if (error) {
        console.error(`[RSS] Failed to fetch users for r/${subName}:`, error.message);
        return [];
    }

    return data || [];
}

/**
 * Extract Reddit post ID from a URL.
 */
function extractPostId(url: string): string | null {
    const match = url.match(/comments\/([a-z0-9]+)/i);
    return match ? match[1] : null;
}

/**
 * Personalized AI match score for a batch of posts against a single user's business description.
 * Returns an array of scores (0-1).
 */
async function getBatchMatchScores(posts: { title: string, snippet: string }[], userDesc: string): Promise<number[]> {
    if (posts.length === 0) return [];
    
    try {
        const { AIManager } = await import('../../lib/ai');
        const ai = new AIManager();

        const postsBlock = posts.map((p, i) => `[POST ${i+1}]\nTitle: ${p.title}\nSnippet: ${p.snippet}`).join('\n\n');

        const response = await ai.call({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: `You are a high-intent lead bouncer. Given a business description, score each Reddit post 0 to 1 based on how likely it indicates a target audience member, a competitor mention, or an ICP match.
                    
                    Business Description: ${userDesc}
                    
                    Respond with a JSON array of numbers only. Example: [0.8, 0.1, 0.9]`
                },
                {
                    role: 'user',
                    content: postsBlock
                }
            ],
            temperature: 0.1,
            max_tokens: 100,
        });

        const content = response.choices?.[0]?.message?.content?.trim() || '[]';
        
        // Robust parsing: extract the first [...] found in the text
        let jsonStr = content;
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
            jsonStr = match[0];
        }

        try {
            const scores = JSON.parse(jsonStr);
            return Array.isArray(scores) ? scores.map(s => isNaN(parseFloat(s)) ? 0 : Math.min(1, Math.max(0, parseFloat(s)))) : posts.map(() => 0);
        } catch (parseErr) {
            console.warn('[RSS] Failed to parse AI JSON, content was:', content);
            return posts.map(() => 0);
        }
    } catch (e) {
        console.error('[RSS] Batch match score error:', e);
        return posts.map(() => 0);
    }
}

/**
 * Store a lead for a specific user with a personalized match score.
 */
async function storePersonalizedLead(postData: RSSPost, userId: string, score: number): Promise<void> {
    try {
        const { error } = await supabase.from('monitored_leads').insert({
            user_id: userId,
            title: postData.title,
            body_text: postData.snippet,
            subreddit: postData.subreddit,
            url: postData.link,
            author: postData.author,
            reddit_score: 0,
            comment_count: 0,
            match_score: score,
            status: 'new',
        });

        if (error && !error.message.includes('duplicate')) {
            console.error(`[RSS] Failed to insert lead for user ${userId}:`, error.message);
        }
    } catch (e) {
        console.error('[RSS] storePersonalizedLead error:', e);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch and parse RSS feed for a subreddit.
 */
async function fetchRSSFeed(subName: string): Promise<RSSPost[]> {
    const url = `https://www.reddit.com/r/${subName}/new.rss?limit=${RSS_LIMIT}`;

    const response = await axios.get(url, {
        headers: { 'User-Agent': USER_AGENT },
        timeout: REQUEST_TIMEOUT_MS,
    });

    const parsed = await parseStringPromise(response.data, { explicitArray: false });
    const entries = parsed?.feed?.entry;

    if (!entries) return [];

    const items = Array.isArray(entries) ? entries : [entries];

    return items.map((item: any) => ({
        id: extractPostId(item.link?.$.href || item.id) || item.id,
        title: item.title || '',
        link: item.link?.$.href || '',
        snippet: (item.content?._ || item.summary || '').replace(/<[^>]*>/g, '').slice(0, 500),
        pubDate: new Date(item.updated || item.published || Date.now()),
        subreddit: subName,
        author: item.author?.name?.replace('/u/', '') || 'anonymous',
    }));
}

/**
 * Process a single subreddit: fetch RSS, filter new posts, score, and process.
 * Returns true on success, false on failure.
 */
async function processSubreddit(sub: UniqueSubreddit): Promise<boolean> {
    if (!isRunning) return false;
    
    const startTime = Date.now();
    
    try {
        console.log(`[RSS] 🔍 Scanning r/${sub.name}...`);

        // 1. Fetch RSS feed (Limited to newest)
        const posts = await fetchRSSFeed(sub.name);
        
        if (posts.length === 0) {
            console.log(`[RSS] No posts found in r/${sub.name}`);
            await resetErrorStreak(sub.name);
            return true;
        }

        // 2. Identify users monitoring this subreddit early
        const relevantUsers = await getUsersForSubreddit(sub.name);
        if (relevantUsers.length === 0) {
            console.log(`[RSS] No users monitoring r/${sub.name}, skipping AI entirely.`);
            await resetErrorStreak(sub.name);
            return true;
        }

        // 3. Filter to only new posts (Early Age Filter)
        const lastPubdate = sub.last_pubdate ? new Date(sub.last_pubdate) : new Date(0);
        const newPosts = posts
            .filter(p => p.pubDate > lastPubdate)
            .slice(0, MAX_AI_EVAL_PER_SUB_CYCLE);

        if (newPosts.length === 0) {
            console.log(`[RSS] No new posts in r/${sub.name} (checked top ${posts.length})`);
            await resetErrorStreak(sub.name);
            return true;
        }

        console.log(`[RSS] Processing ${newPosts.length} new posts for ${relevantUsers.length} users in r/${sub.name}`);

        // 4. Group posts by user keywords
        let totalLeadsFound = 0;
        const userMatches: Map<string, RSSPost[]> = new Map();

        for (const post of newPosts) {
            const normalizedText = `${post.title} ${post.snippet}`.toLowerCase();
            for (const user of relevantUsers) {
                const hasKeyword = user.keywords.some(kw => normalizedText.includes(kw.toLowerCase()));
                if (hasKeyword) {
                    const matches = userMatches.get(user.id) || [];
                    matches.push(post);
                    userMatches.set(user.id, matches);
                }
            }
        }

        // 5. Batch score for each user
        for (const [userId, matchingPosts] of userMatches.entries()) {
            if (!isRunning) break;
            
            const user = relevantUsers.find(u => u.id === userId)!;
            console.log(`[RSS] 🎯 Scoring ${matchingPosts.length} matches for user ${userId.slice(0, 8)}`);

            // Split into batches of 5 for efficiency
            for (let i = 0; i < matchingPosts.length; i += 5) {
                const batch = matchingPosts.slice(i, i + 5);
                const scores = await getBatchMatchScores(batch, user.description);

                for (let j = 0; j < batch.length; j++) {
                    const score = scores[j] || 0;
                    if (score >= QUICK_SCORE_THRESHOLD) {
                        // 7. Store Lead
                        await storePersonalizedLead(batch[j], userId, score);
                        totalLeadsFound++;

                        // 8. Trigger Email Alert for high-intent matches (>0.9)
                        if (score >= 0.9 && user.email) {
                            try {
                                const { sendEmail } = await import('../../lib/email');
                                const LeadAlertEmail = (await import('../../lib/email-templates/LeadAlertEmail')).default;
                                
                                console.log(`[RSS] 📧 Sending lead alert email to ${user.email} for score ${score}`);
                                await sendEmail({
                                    to: user.email,
                                    subject: `New Lead: ${batch[j].title.slice(0, 40)}...`,
                                    react: LeadAlertEmail({
                                        fullName: user.full_name || user.email.split('@')[0],
                                        leadTitle: batch[j].title,
                                        subreddit: batch[j].subreddit,
                                        matchScore: Math.round(score * 100)
                                    })
                                });
                            } catch (emailErr: any) {
                                console.error(`[RSS] Failed to send lead alert email:`, emailErr.message);
                            }
                        }
                    }
                }
            }
        }

        // 6. Update latest pubdate
        const latestPubdate = newPosts.reduce((max, p) => p.pubDate > max ? p.pubDate : max, lastPubdate);

        // 7. Update last_pubdate and reset error streak
        await updateLastPubdate(sub.name, latestPubdate);
        await resetErrorStreak(sub.name);

        const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[RSS] ✅ r/${sub.name} complete: ${totalLeadsFound} leads found in ${durationSec}s`);
        
        return true;

    } catch (error) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        const message = axiosError.message;

        console.error(`[RSS] ❌ r/${sub.name} failed: ${status || message}`);

        // Handle specific error types
        if (status === 403 || status === 429 || message.includes('blocked')) {
            await handleSubError(sub.name, sub.error_streak);
        } else {
            // Transient error - increment but don't pause immediately
            await handleSubError(sub.name, Math.max(0, sub.error_streak - 1));
        }

        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// POLL CYCLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Main poll cycle - fetches all unique subreddits and processes them sequentially.
 * Includes health monitoring with failure rate alerts.
 */
async function pollCycle(): Promise<void> {
    if (!isRunning) return;
    
    const cycleStart = Date.now();
    console.log('\n[RSS] ═══════════════════════════════════════════════════════');
    console.log('[RSS] 🚀 Starting new poll cycle...');
    console.log('[RSS] ═══════════════════════════════════════════════════════\n');

    // 1. Sync unique_subreddits from profiles to ensure new user preferences are picked up
    const { error: syncError } = await supabase.rpc('sync_unique_subreddits');
    if (syncError) {
        console.warn('[RSS] ⚠️ Subreddit sync failed (non-critical):', syncError.message);
    }

    // 2. Get all unique, non-paused subreddits
    const subreddits = await getUniqueSubreddits();
    
    if (subreddits.length === 0) {
        console.log('[RSS] No subreddits to monitor.');
        return;
    }

    console.log(`[RSS] Monitoring ${subreddits.length} unique subreddits`);

    // Process sequentially with rate limiting and health tracking
    let successCount = 0;
    let failedCount = 0;

    for (const sub of subreddits) {
        if (!isRunning) {
            console.log('[RSS] Shutdown requested, stopping poll cycle.');
            break;
        }
        
        const success = await limit(() => processSubreddit(sub));
        
        if (success) {
            successCount++;
        } else {
            failedCount++;
        }

        // Delay between subreddit fetches
        await delay(DELAY_BETWEEN_REQ_MS);
    }

    // Health monitoring - alert on high failure rate
    if (subreddits.length > 0 && failedCount / subreddits.length > FAILURE_RATE_THRESHOLD) {
        console.warn(`[RSS] 🚨 HIGH FAILURE RATE: ${failedCount}/${subreddits.length} subreddits failed this cycle — potential Reddit blocking. Consider increasing delay or checking logs.`);
        // TODO: Integrate Slack/email alert here for production monitoring
    }

    const cycleDuration = ((Date.now() - cycleStart) / 1000 / 60).toFixed(1);
    console.log('\n[RSS] ═══════════════════════════════════════════════════════');
    console.log(`[RSS] ✅ Cycle complete: ${successCount} success, ${failedCount} failed`);
    console.log(`[RSS] ⏱️  Duration: ${cycleDuration} minutes`);
    console.log('[RSS] ═══════════════════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHEDULER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Start the RSS ingestion monitor.
 * Runs immediately on start, then every 20 minutes via cron.
 * Supports --once flag for single execution (GitHub Actions).
 */
async function startMonitor(): Promise<void> {
    // Robust flag detection for different shells/npm versions
    const isOnce = process.argv.some(arg => arg.toLowerCase().includes('once')) || 
                   process.env.npm_config_once === 'true' ||
                   process.argv.includes('--once');

    console.log('[RSS] 🎬 RedLeads Hybrid RSS Monitor starting...');
    
    // Pre-flight check
    const aiKey = process.env.AI_API_KEY;
    const aiKey2 = process.env.AI_API_KEY_2;
    console.log('[RSS] Pre-flight check:');
    console.log(`     - Supabase URL: ${SUPABASE_URL ? '✅ Configured' : '❌ Missing'}`);
    console.log(`     - AI Key 1: ${aiKey ? '✅ Configured' : '❌ Missing'}`);
    console.log(`     - AI Key 2: ${aiKey2 ? '✅ Configured' : '❕ Optional'}`);

    if (isOnce) {
        console.log('[RSS] Mode: ONCE (Manual/CI run)');
    } else {
        console.log('[RSS] Mode: CONTINUOUS (Cron)');
    }
    console.log('[RSS] Configuration:');
    console.log(`     - Delay: ${DELAY_BETWEEN_REQ_MS}ms + ${JITTER_MAX_MS}ms jitter`);
    console.log(`     - Quick score threshold: ${QUICK_SCORE_THRESHOLD}`);
    console.log(`     - Max error streak: ${MAX_ERROR_STREAK} (then pause ${PAUSE_DURATION_MS / 1000 / 60} min)`);
    console.log(`     - Failure rate alert threshold: ${FAILURE_RATE_THRESHOLD * 100}%`);

    // Always run one cycle immediately
    await pollCycle();

    if (isOnce) {
        console.log('[RSS] 🏁 Single run complete. Exiting.');
        process.exit(0);
    }

    // Schedule recurring runs (every 30 minutes)
    cron.schedule('*/30 * * * *', async () => {
        if (isRunning) {
            await pollCycle();
        }
    });

    console.log('[RSS] ✅ Cron scheduled: */30 * * * *');
}

// Start the monitor
startMonitor().catch(console.error);
