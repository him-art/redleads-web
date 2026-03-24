import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verify() {
    console.log('Querying Supabase for recent win-back extensions...');
    
    // We want to find users who have win_back_sent = true in their metadata
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email, trial_ends_at, user_metadata, subscription_tier')
        .eq('subscription_tier', 'trial');
        
    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    // Filter to only those with win_back_sent: true
    const winBackUsers = profiles.filter(p => p.user_metadata?.win_back_sent === true);
    
    console.log(`\nFound ${winBackUsers.length} users with win_back_sent = true.`);
    
    let correctlyExtended = 0;
    const now = new Date();
    
    console.log('\n--- Sample of 5 updated records ---');
    for (let i = 0; i < Math.min(5, winBackUsers.length); i++) {
        const u = winBackUsers[i];
        const endsAt = new Date(u.trial_ends_at);
        const daysLeft = ((endsAt.getTime() - now.getTime()) / (1000 * 3600 * 24)).toFixed(1);
        
        console.log(`Email: ${u.email}`);
        console.log(`  -> Trial Ends: ${endsAt.toISOString()} (${daysLeft} days from now)`);
        console.log(`  -> Metadata: win_back_sent_at = ${u.user_metadata.win_back_sent_at}`);
        console.log('---');
    }

    winBackUsers.forEach(u => {
        if (new Date(u.trial_ends_at) > now) {
            correctlyExtended++;
        }
    });

    console.log(`\n✅ ${correctlyExtended} out of ${winBackUsers.length} win-back users currently have an active, future-dated trial_ends_at!`);
}

verify().catch(console.error);
