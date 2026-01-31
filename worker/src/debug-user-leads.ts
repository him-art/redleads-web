import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkUserLeads() {
    // 1. Find User ID
    // Typo handling: checking both 'hajayswar' and 'hjayaswar' just in case, or listing all emails
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', '%jayaswar%'); // Broad match to catch the user

    if (profileError) {
        console.error('Error fetching profiles:', profileError);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log('No matching user found in profiles table.');
        return;
    }

    console.log('Found profiles:', profiles);

    for (const profile of profiles) {
        // 2. Count leads
        const { count, error: countError } = await supabase
            .from('monitored_leads')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

        if (countError) {
            console.error(`Error counting leads for ${profile.email}:`, countError);
            continue;
        }

        console.log(`User: ${profile.email} (${profile.id})`);
        console.log(`Total Leads: ${count}`);
        
        // 3. Check what range(20, 1000) would return
        const { data: rangeData, error: rangeError } = await supabase
             .from('monitored_leads')
             .select('id, title, created_at')
             .eq('user_id', profile.id)
             .order('created_at', { ascending: false })
             .range(20, 25); // Check just the first few that should show up
             
        if (rangeError) {
             console.error('Error with range query:', rangeError);
        } else {
             console.log(`Leads at index 20-25 (Should be in history): ${rangeData?.length}`);
             if (rangeData?.length > 0) {
                 console.log('Sample history lead:', rangeData[0]);
             } else {
                 console.log('Range query returned no leads.');
             }
        }
    }
}

checkUserLeads();
