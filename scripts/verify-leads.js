const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Fix for import paths when running with node from scripts/
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkLeads() {
    const email = 'ben@crawlwalkrun.co';
    console.log(`Checking leads for: ${email}`);

    // 1. Get User ID
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
    
    if (profileError || !profiles) {
        console.error('Failed to find user:', profileError);
        return;
    }

    const userId = profiles.id;
    console.log(`User ID: ${userId}`);

    // 2. Count leads in last 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // Check ALL leads (status doesn't matter for "found")
    const { data: leads, error: leadsError } = await supabase
        .from('monitored_leads')
        .select('id, title, subreddit, created_at, match_score')
        .eq('user_id', userId)
        .gte('created_at', yesterday)
        .order('created_at', { ascending: false });

    if (leadsError) {
        console.error('Failed to fetch leads:', leadsError);
        return;
    }

    console.log(`Found ${leads.length} leads in the last 24 hours.`);
    if (leads.length > 0) {
        console.log('Recent leads:');
        leads.slice(0, 5).forEach(l => {
            console.log(`- [${new Date(l.created_at).toISOString()}] ${l.title} (Score: ${l.match_score})`);
        });
        if (leads.length > 5) console.log(`... and ${leads.length - 5} more.`);
    }
}

checkLeads();
