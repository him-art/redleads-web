import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function auditEmails() {
    console.log('🔍 Auditing profiles to see who received unexpected day1 emails...');
    
    // We only want users whose trial started > 96 hours ago but who got the email recently
    // Easiest is to check user_metadata->lifecycle_sent->day1
    
    const { data: allProfiles, error } = await supabase
        .from('profiles')
        .select('id, email, user_metadata, trial_ends_at')
        .not('user_metadata', 'is', null);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    let affectedCount = 0;
    for (const p of allProfiles) {
        if (p.user_metadata?.lifecycle_sent?.day1) {
            affectedCount++;
        }
    }
    console.log(`\n🔴 Total users with day1 lifecycle email sent flag: ${affectedCount}`);
    
    // Check how many of these were > 96hrs since trial start
    const now = new Date();
    let oldUsersAffected = 0;
    
    for (const p of allProfiles) {
        if (p.user_metadata?.lifecycle_sent?.day1 && p.trial_ends_at) {
            const trialEndsAtDate = new Date(p.trial_ends_at);
            const trialStartedAtDate = new Date(trialEndsAtDate.getTime() - 3 * 24 * 60 * 60 * 1000);
            const hoursSinceTrialStart = (now.getTime() - trialStartedAtDate.getTime()) / (1000 * 60 * 60);

            if (hoursSinceTrialStart > 96) {
                oldUsersAffected++;
            }
        }
    }
    console.log(`🔴 Users with trial started > 96hrs ago who got the day1 email recently: ${oldUsersAffected}`);
}

auditEmails().catch(console.error);
