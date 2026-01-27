/**
 * RedLeads Daily Report Generator
 * 
 * An independent scheduled job that generates daily intelligence reports.
 * Runs once per day at 8 AM UTC via node-cron.
 * 
 * Key Features:
 * - Queries leads from the last 24 hours
 * - Uses Groq AI to generate concise, actionable reports
 * - Stores reports in the daily_reports Supabase table
 * - Graceful shutdown handling
 * 
 * NOTE: Currently generates global reports (all users see same aggregated intel).
 * TODO: For per-user reports, loop over users and filter leads by user_id.
 */

import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Graceful Shutdown
let isRunning = true;

// ═══════════════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

process.on('SIGTERM', () => {
    console.log('[REPORT] 🛑 Daily report generator shutting down gracefully...');
    isRunning = false;
    setTimeout(() => process.exit(0), 3000);
});

process.on('SIGINT', () => {
    console.log('[REPORT] 🛑 Daily report generator interrupted');
    isRunning = false;
    setTimeout(() => process.exit(0), 1000);
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Lead {
    id: string;
    title: string;
    body_text: string | null;
    subreddit: string;
    url: string;
    created_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORT GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The exact system prompt for generating high-quality daily intelligence reports.
 */
function getReportSystemPrompt(todayDate: string): string {
    // secure: prompt is loaded from environment variable DAILY_REPORT_PROMPT
    return `Generate a daily summary report for ${todayDate}.`;
}

/**
 * Fetch leads from the last 24 hours.
 */
async function getLeadsFromLast24Hours(): Promise<Lead[]> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
        .from('monitored_leads')
        .select('id, title, body_text, subreddit, url, created_at')
        .gte('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[REPORT] Failed to fetch leads:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Generate a daily report using Groq AI.
 */
async function generateReportWithAI(leads: Lead[]): Promise<string> {
    if (leads.length === 0) {
        return `<h2>Daily Intel Report — ${formatDate(new Date())}</h2>
<p>No new leads detected in the last 24 hours. Your monitoring is active and watching your configured subreddits.</p>`;
    }

    try {
        // Import the AI manager dynamically
        const { AIManager } = await import('../../lib/ai');
        const ai = new AIManager();

        const todayDate = formatDate(new Date());
        const systemPrompt = process.env.DAILY_REPORT_PROMPT || getReportSystemPrompt(todayDate);

        // Format leads for the prompt
        const leadsText = leads.map(lead => 
            `[r/${lead.subreddit}] Title: ${lead.title}\nBody: ${lead.body_text || 'No body text'}\nLink: ${lead.url}\nPosted: ${lead.created_at}`
        ).join('\n\n---\n\n');

        const response = await ai.call({
            model: 'llama-3.3-70b-versatile', // High-quality model for daily reports
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Here are ${leads.length} Reddit posts from the last 24 hours:\n\n${leadsText}` }
            ],
            temperature: 0.4,
            max_tokens: 2000,
        });

        const reportHtml = response.choices?.[0]?.message?.content?.trim();
        
        if (!reportHtml) {
            throw new Error('Empty response from AI');
        }

        return reportHtml;

    } catch (error) {
        console.error('[REPORT] AI generation failed:', error);
        return `<h2>Daily Intel Report — ${formatDate(new Date())}</h2>
<p>Report generation encountered an error. ${leads.length} leads were detected but analysis failed. Please check the logs.</p>`;
    }
}

/**
 * Format a date as a readable string (e.g., "January 27, 2026").
 */
function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Store the generated report in Supabase.
 */
async function storeReport(reportHtml: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { error } = await supabase
        .from('daily_reports')
        .upsert({
            date: today,
            report_html: reportHtml,
            generated_at: new Date().toISOString(),
        }, {
            onConflict: 'date' // Replace if report for today already exists
        });

    if (error) {
        console.error('[REPORT] Failed to store report:', error.message);
        return false;
    }

    return true;
}

/**
 * Main report generation function.
 */
async function generateDailyReport(): Promise<void> {
    if (!isRunning) return;

    const startTime = Date.now();
    console.log('\n[REPORT] ═══════════════════════════════════════════════════════');
    console.log('[REPORT] 📊 Starting daily report generation...');
    console.log('[REPORT] ═══════════════════════════════════════════════════════\n');

    // 1. Fetch leads from last 24 hours
    const leads = await getLeadsFromLast24Hours();
    console.log(`[REPORT] Found ${leads.length} leads from the last 24 hours`);

    // 2. Generate report with AI
    const reportHtml = await generateReportWithAI(leads);
    console.log(`[REPORT] Report generated (${reportHtml.length} characters)`);

    // 3. Store in database
    const stored = await storeReport(reportHtml);
    
    if (stored) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[REPORT] ✅ Daily report stored successfully in ${duration}s`);
    } else {
        console.error('[REPORT] ❌ Failed to store daily report');
    }

    console.log('\n[REPORT] ═══════════════════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHEDULER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Start the daily report generator.
 * Schedules to run at 8 AM UTC every day.
 * Supports --once flag for single execution (GitHub Actions).
 */
async function startReportGenerator(): Promise<void> {
    const isOnce = process.argv.includes('--once');

    console.log('[REPORT] 🎬 RedLeads Daily Report Generator starting...');
    console.log(`[REPORT] Mode: ${isOnce ? 'ONCE (public run)' : 'CONTINUOUS (Cron)'}`);
    console.log('[REPORT] Schedule: 8 AM UTC daily (cron: 0 8 * * *)');

    // Run immediately on start if --once is set, otherwise just schedule
    if (isOnce) {
        await generateDailyReport();
        console.log('[REPORT] 🏁 Single run complete. Exiting.');
        process.exit(0);
    } else {
        // Run immediately on start for testing/first deployment in continuous mode
        await generateDailyReport();
    }

    // Schedule daily runs at 8 AM UTC
    cron.schedule('0 8 * * *', async () => {
        if (isRunning) {
            await generateDailyReport();
        }
    }, {
        timezone: 'UTC'
    });

    console.log('[REPORT] ✅ Cron scheduled: 0 8 * * * (8 AM UTC)');
    
    // Keep the process alive
    console.log('[REPORT] 💤 Waiting for next scheduled run...');
}

// Start the report generator
startReportGenerator().catch(console.error);
