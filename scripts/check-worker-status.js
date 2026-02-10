const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkConfig() {
    let output = '';
    const log = (msg) => {
        console.log(msg);
        output += msg + '\n';
    };

    const email = 'ben@crawlwalkrun.co';
    log(`--- Checking Configuration for: ${email} ---`);

    // 1. Get Profile Config
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, keywords, description')
        .eq('email', email)
        .single();
    
    if (profileError || !profile) {
        log(`Failed to find user profile: ${JSON.stringify(profileError)}`);
    } else {
        log(`User ID: ${profile.id}`);
        log(`Keywords: ${JSON.stringify(profile.keywords)}`);
        log(`Description: ${profile.description}`);
    }

    // 2. Check Worker Status
    log('\n--- Checking Worker Status ---');
    const { data: workerStatus, error: workerError } = await supabase
        .from('worker_status')
        .select('*');

    if (workerError) {
        log(`Failed to fetch worker status: ${JSON.stringify(workerError)}`);
    } else {
        workerStatus.forEach(status => {
            log(`Worker: ${status.id}`);
            log(`- Status: ${status.status}`);
            log(`- Last Heartbeat: ${status.last_heartbeat}`);
            log(`- Meta: ${JSON.stringify(status.meta, null, 2)}`);
        });
    }

    // 3. Check for any recent matches in the system globally
    log('\n--- Checking Global System Activity (Last 1h) ---');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
        .from('monitored_leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', oneHourAgo);

    if (countError) {
        log(`Failed to fetch global lead count: ${JSON.stringify(countError)}`);
    } else {
        log(`Total leads found globally in last hour: ${count}`);
    }

    fs.writeFileSync('debug_output.txt', output);
}

checkConfig();
