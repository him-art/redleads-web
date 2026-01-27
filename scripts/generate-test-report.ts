
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GroqManager } from '../lib/groq';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const groq = new GroqManager();

const USER_ID = '8e891ceb-26cd-42f8-aa63-9a2fa73dfd4f';

async function generateAISummary(leads: any[], userContext: string): Promise<string> {
    if (leads.length === 0) return "";

    try {
        const prompt = `
            YOU ARE RedLeads Intel Analyst — a sharp, no-nonsense market intelligence expert for SaaS founders. Your job is to turn raw Reddit posts into concise, high-value daily briefings that save founders hours and spotlight real opportunities.

            USER BUSINESS CONTEXT: ${userContext}
            
            UNPROCESSED LEADS FROM LAST 24H:
            ${leads.map(l => `[ID: ${l.id}] [r/${l.subreddit}] Title: ${l.title} | Body: ${l.body_text || 'No body text'}`).join('\n')}
            
            YOUR TASK: Generate a DETAILED and STRUCTURED daily intelligence report for this user in exactly 3 sections.
            Output ONLY the HTML — nothing else.

            Generate EXACTLY these three sections:

            <h2>Daily Intel Report — ${new Date().toLocaleDateString()}</h2>

            <h3>1. Core Pain Points</h3>
            <ul>
              <li>Bullet 1: Clear pain description (1 short sentence) — Quote: "exact user quote if strong". (Why it matters: brief 1-line impact for SaaS founders)</li>
              <!-- 4–8 bullets max, most recurring/urgent first -->
          </ul>

            <h3>2. Competitor Activity</h3>
            <ul>
              <li>Competitor Name: Specific unhappiness or switch reason — Quote: "exact quote". (Opportunity: how your tool solves this)</li>
              <!-- 3–6 bullets max, group by competitor if multiple mentions -->
            </ul>

            <h3>3. Customer Hangouts</h3>
            <ul>
              <li>r/subredditname — Heat level: High/Medium/Low — Why hot: 1-line reason + post count today</li>
              <!-- List all active subreddits, hottest first -->
            </ul>

            RULES TO FOLLOW STRICTLY:
            - Be concise: Every bullet under 2 lines. No fluff, no repetition.
            - Actionable only: Focus on what founders can act on today.
            - Evidence-based: Every point must trace to real posts. If no strong examples in a section, write "No significant activity today".
            - Neutral & professional tone: No hype, no emojis.
            - HTML only: Clean, simple tags. Use <strong> for emphasis if needed.
        `;

        const data = await groq.call({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        return data.choices?.[0]?.message?.content?.trim() || "Summary could not be generated today.";
    } catch (e) {
        console.error('AI Error:', e);
        return "Summary could not be generated today.";
    }
}

async function runTest() {
    console.log('🚀 Starting test report generation...');

    // 1. Get User
    const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', USER_ID)
        .single();

    if (!user) {
        console.error('❌ User not found');
        return;
    }

    // 2. Get Recent Leads
    const { data: leads } = await supabase
        .from('monitored_leads')
        .select('*')
        .eq('user_id', USER_ID)
        .order('created_at', { ascending: false })
        .limit(15);

    if (!leads || leads.length === 0) {
        console.error('❌ No leads found to summarize');
        return;
    }

    console.log(`📊 Found ${leads.length} leads. Generating AI analysis...`);

    // 3. Generate Summary
    const aiSummary = await generateAISummary(leads, user.description || "");

    // 4. Create HTML
    const reportHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; background: #000; color: #fff; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #222; border-radius: 12px;">
            <div style="color: #eee; font-size: 15px;">
                ${aiSummary}
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #222; font-size: 12px; color: #555; text-align: center;">
                <p>This TEST report was generated based on <strong>${leads.length} leads</strong>.</p>
                <p>View the full lead pipeline on your <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://redleads.app'}/dashboard" style="color: #F97316; text-decoration: none; font-weight: bold;">RedLeads Dashboard</a>.</p>
            </div>
        </div>
    `;

    // 5. Save to database
    const { error } = await supabase.from('email_drafts').insert({
        user_id: USER_ID,
        subject: `Daily Intel: ${leads.length} New Opportunities (TEST)`,
        body_html: reportHtml,
        status: 'draft'
    });

    if (error) {
        console.error('❌ Error saving report:', error);
    } else {
        console.log('✅ Success! Test report generated and saved to database.');
        console.log('Check your dashboard under Daily Reports.');
    }
}

runTest();
