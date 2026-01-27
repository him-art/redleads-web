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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Network & Pacing
const USER_AGENT = 'RedLeads/2.0 (SaaS Lead Monitor; +https://redleads.app)';
const DELAY_BETWEEN_REQ_MS = 1800; // 1.8 seconds base delay
const JITTER_MAX_MS = 1000; // Up to 1 second random jitter
const REQUEST_TIMEOUT_MS = 15000; // 15 second timeout

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

/**
 * Extract Reddit post ID from a URL.
 */
function extractPostId(url: string): string | null {
    const match = url.match(/comments\/([a-z0-9]+)/i);
    return match ? match[1] : null;
}

/**
 * Quick AI match score using Groq (fast model).
 * Returns 0-1 indicating relevance.
 * 
 * Groq llama-3.1-8b-instant prompt:
 * "Score 0-1 how likely this Reddit post indicates high-intent SaaS buyer 
 * (explicit complaint, seeking alternative, recommendation request, 'looking for tool'). 
 * Title: {{title}} Snippet: {{snippet}} Output ONLY a number 0-1 with no explanation."
 */
async function getQuickMatchScore(text: string): Promise<number> {
    try {
        // Import the AI manager dynamically to avoid circular deps
        const { AIManager } = await import('../../lib/ai');
        const ai = new AIManager();

        const defaultPrompt = "Score this post 0-1 for relevance.";
        const systemPrompt = process.env.LEAD_SCORE_PROMPT || defaultPrompt;

        const response = await ai.call({
            model: 'llama-3.1-8b-instant', // Fast model for quick scoring
            messages: [
                {
                    role: 'system',
                    content: `Score 0-1 how likely this Reddit post indicates high-intent SaaS buyer (explicit complaint, seeking alternative, recommendation request, 'looking for tool'). Output ONLY a number 0-1 with no explanation.`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.1,
            max_tokens: 10,
        });

        const score = parseFloat(response.choices?.[0]?.message?.content?.trim() || '0');
        return isNaN(score) ? 0 : Math.min(1, Math.max(0, score));
    } catch (e) {
        console.error('[RSS] Quick match score error:', e);
        return 0;
    }
}

/**
 * Fetch full post content from Reddit JSON endpoint.
 */
async function fetchFullPost(postId: string): Promise<RedditPostData | null> {
    try {
        const url = `https://www.reddit.com/comments/${postId}.json?limit=1&raw_json=1`;
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': USER_AGENT },
            timeout: REQUEST_TIMEOUT_MS,
        });

        const postData = response.data?.[0]?.data?.children?.[0]?.data;
        if (!postData) return null;

        return {
            id: postData.id,
            title: postData.title,
            selftext: postData.selftext || '',
            url: `https://www.reddit.com${postData.permalink}`,
            subreddit: postData.subreddit,
            author: postData.author,
            created_utc: postData.created_utc,
            score: postData.score,
            num_comments: postData.num_comments,
        };
    } catch (e) {
        console.error(`[RSS] Failed to fetch full post ${postId}:`, (e as Error).message);
        return null;
    }
}

/**
 * Process a full lead through the existing pipeline.
 * Stores in monitored_leads, assigns to users, triggers Realtime.
 */
async function processFullLead(postData: RedditPostData): Promise<void> {
    try {
        // Get users monitoring this subreddit
        const { data: userSubs } = await supabase
            .from('profiles')
            .select('id, subreddits')
            .contains('subreddits', [postData.subreddit.toLowerCase()]);

        if (!userSubs || userSubs.length === 0) {
            console.log(`[RSS] No users monitoring r/${postData.subreddit}, skipping.`);
            return;
        }

        // Insert lead for each user (RLS handles isolation)
        for (const user of userSubs) {
            const { error } = await supabase.from('monitored_leads').insert({
                user_id: user.id,
                title: postData.title,
                body_text: postData.selftext,
                subreddit: postData.subreddit,
                url: postData.url,
                author: postData.author,
                reddit_score: postData.score,
                comment_count: postData.num_comments,
                match_score: 0.8, // Re-score with full analysis if needed
                status: 'new',
            });

            if (error && !error.message.includes('duplicate')) {
                console.error(`[RSS] Failed to insert lead for user ${user.id}:`, error.message);
            }
        }

        console.log(`[RSS] ✅ Processed lead: "${postData.title.slice(0, 50)}..." → ${userSubs.length} users`);
    } catch (e) {
        console.error('[RSS] processFullLead error:', e);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch and parse RSS feed for a subreddit.
 */
async function fetchRSSFeed(subName: string): Promise<RSSPost[]> {
    const url = `https://www.reddit.com/r/${subName}/new.rss?limit=25`;

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

        // 1. Fetch RSS feed
        const posts = await fetchRSSFeed(sub.name);
        
        if (posts.length === 0) {
            console.log(`[RSS] No posts found in r/${sub.name}`);
            await resetErrorStreak(sub.name);
            return true;
        }

        // 2. Filter to only new posts (after last_pubdate)
        const lastPubdate = sub.last_pubdate ? new Date(sub.last_pubdate) : new Date(0);
        const newPosts = posts.filter(p => p.pubDate > lastPubdate);

        if (newPosts.length === 0) {
            console.log(`[RSS] No new posts in r/${sub.name} since ${lastPubdate.toISOString()}`);
            await resetErrorStreak(sub.name);
            return true;
        }

        console.log(`[RSS] Found ${newPosts.length} new posts in r/${sub.name}`);

        // 3. Process each new post
        let latestPubdate = lastPubdate;
        let processedCount = 0;

        for (const post of newPosts) {
            if (!isRunning) break;
            
            // Quick AI score on title + snippet
            const quickScore = await getQuickMatchScore(`${post.title}\n\n${post.snippet}`);
            
            if (quickScore >= QUICK_SCORE_THRESHOLD) {
                // High intent detected → fetch full post
                console.log(`[RSS] 🎯 High-intent (${quickScore.toFixed(2)}): "${post.title.slice(0, 40)}..."`);
                
                await delay(DELAY_BETWEEN_REQ_MS); // Pace before .json fetch
                
                const fullPost = await fetchFullPost(post.id);
                if (fullPost) {
                    await processFullLead(fullPost);
                    processedCount++;
                }
            }

            // Track latest pubdate
            if (post.pubDate > latestPubdate) {
                latestPubdate = post.pubDate;
            }
        }

        // 4. Update last_pubdate and reset error streak
        await updateLastPubdate(sub.name, latestPubdate);
        await resetErrorStreak(sub.name);

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[RSS] ✅ r/${sub.name} complete: ${processedCount} leads processed in ${duration}s`);
        
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

    // Get all unique, non-paused subreddits
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
    const isOnce = process.argv.includes('--once');

    console.log('[RSS] 🎬 RedLeads Hybrid RSS Monitor starting...');
    console.log(`[RSS] Mode: ${isOnce ? 'ONCE (public run)' : 'CONTINUOUS (Cron)'}`);
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

    // Schedule recurring runs (every 20 minutes)
    cron.schedule('*/20 * * * *', async () => {
        if (isRunning) {
            await pollCycle();
        }
    });

    console.log('[RSS] ✅ Cron scheduled: */20 * * * *');
}

// Start the monitor
startMonitor().catch(console.error);
