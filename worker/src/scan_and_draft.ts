
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    console.log('--- RedLeads Worker: Daily Summary Generator ---');
    console.log(`Time: ${new Date().toISOString()}`);

    // 1. Get all users
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, website_url')
        .not('email', 'is', null);

    if (error || !profiles) {
        console.error('Failed to fetch profiles:', error);
        return;
    }

    console.log(`Processing daily summaries for ${profiles.length} users...`);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    for (const user of profiles) {
        // 2. Fetch leads found in the last 24 hours
        const { data: newLeads } = await supabase
            .from('monitored_leads')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', yesterday.toISOString())
            .order('created_at', { ascending: false });

        if (!newLeads || newLeads.length === 0) {
            console.log(`No new leads for ${user.email} today.`);
            continue;
        }

        console.log(`Found ${newLeads.length} new leads for ${user.email}. Generating report...`);

        // 3. Generate Email Body
        const reportHtml = generateReportHtml(user.email, newLeads);
        const subject = `Your Daily Intel: ${newLeads.length} New Opportunities (${new Date().toLocaleDateString()})`;

        // 4. Save to email_drafts (which shows in Dashboard Reports)
        const { error: draftError } = await supabase
            .from('email_drafts')
            .insert({
                user_id: user.id,
                subject: subject,
                body_html: reportHtml,
                status: 'ready' // Marked as ready/sent for the dashboard to pick up
            });

        if (draftError) {
            console.error(`Failed to save report for ${user.email}:`, draftError);
        } else {
            console.log(`✅ Daily Report saved for ${user.email}`);
        }
    }

    console.log('--- Summary Generation Complete ---');
}

function generateReportHtml(email: string | null, leads: any[]) {
    const listItems = leads.map(l => `
        <div style="margin-bottom: 16px; padding: 16px; border: 1px solid #333; border-radius: 12px; background-color: #111; color: white;">
            <div style="margin-bottom: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #F97316;">
                r/${l.subreddit}
            </div>
            <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: white;">
                <a href="${l.url}" style="color: white; text-decoration: none;">${l.title}</a>
            </p>
            <div style="font-size: 12px; color: #888;">
                Match Score: ${(l.match_score * 100).toFixed(0)}%
            </div>
        </div>
    `).join('');

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color:black; color:white; padding: 20px;">
            <h2 style="color: white;">Daily Intelligence Report</h2>
            <p style="color: #ccc;">We found <strong>${leads.length}</strong> new discussions relevant to your business in the last 24 hours.</p>
            <hr style="border-color: #333; margin: 24px 0;" />
            ${listItems}
            <p style="font-size: 12px; color: #666; margin-top: 24px; text-align: center;">
                Login to your dashboard to view full analysis and bookmark leads.
            </p>
        </div>
    `;
}

main();
