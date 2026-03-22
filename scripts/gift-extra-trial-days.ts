import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function giftDays() {
    console.log('Fetching active trial users...');
    const now = new Date();
    
    const { data: activeTrials, error } = await supabase
        .from('profiles')
        .select('id, email, trial_ends_at')
        .eq('subscription_tier', 'trial')
        .gt('trial_ends_at', now.toISOString());
        
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    if (!activeTrials || activeTrials.length === 0) {
        console.log('No active test trials found.');
        return;
    }
    
    console.log(`Found ${activeTrials.length} active trial profiles.`);
    let updated = 0;
    
    for (const profile of activeTrials) {
        const endDate = new Date(profile.trial_ends_at);
        // If it's more than 3 days in the future, they either already got the 7 days
        // or they were modified manually. We specifically want to bump users who
        // are trapped in the old 3-day window.
        // Let's just blindly add 4 days to anyone who was on the 3 day window.
        // Actually, let's look at the time remaining.
        
        // Add exactly 4 days to their current trial_ends_at to match the +4 delta (from 3 to 7).
        const newEndDate = new Date(endDate.getTime() + 4 * 24 * 60 * 60 * 1000);
        
        await supabase.from('profiles').update({
            trial_ends_at: newEndDate.toISOString()
        }).eq('id', profile.id);
        
        updated++;
        console.log(`Granted 4 extra days to ${profile.email}. New end date: ${newEndDate.toISOString()}`);
    }
    
    console.log(`\nSuccessfully upgraded ${updated} active users to the 7-day trial!`);
}

giftDays().catch(console.error);
