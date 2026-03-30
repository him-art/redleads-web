import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkDatabase() {
    console.log('--- Checking Profiles Table ---');
    const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();
    
    if (pError) {
        console.error('Error fetching profile:', pError);
    } else {
        console.log('Profile columns found:', Object.keys(profile));
        if ('subreddits' in profile) {
            console.log('✅ subreddits column exists');
        } else {
            console.error('❌ subreddits column is MISSING');
        }
    }

    console.log('\n--- Checking Monitored Leads Table ---');
    const { data: lead, error: lError } = await supabase
        .from('monitored_leads')
        .select('*')
        .limit(1)
        .single();
    
    if (lError) {
        console.error('Error fetching leads:', lError);
    } else {
        console.log('Lead columns found:', Object.keys(lead));
    }

    console.log('\n--- Checking Worker Status ---');
    const { data: worker, error: wError } = await supabase
        .from('worker_status')
        .select('*')
        .eq('id', 'scanner')
        .single();
    
    if (wError) {
        console.error('Error fetching worker status:', wError);
    } else {
        console.log('Last worker heartbeat:', worker.last_heartbeat);
        console.log('Worker meta:', JSON.stringify(worker.meta, null, 2));
    }
}

checkDatabase();
