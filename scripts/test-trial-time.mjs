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

const TARGET_EMAIL = 'him.official.jay@gmail.com';

async function setTrialTime(hoursElapsed, clearSentFlags) {
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + (72 - hoursElapsed) * 60 * 60 * 1000);

    console.log(`\n⏳ Setting trial time for ${TARGET_EMAIL}: ${hoursElapsed} hours elapsed.`);
    
    // Get existing metadata
    const { data: profile } = await supabase.from('profiles').select('user_metadata').eq('email', TARGET_EMAIL).single();
    const metadata = profile?.user_metadata || {};
    
    if (clearSentFlags) {
        console.log('🧹 Clearing lifecycle_sent flags...');
        delete metadata.lifecycle_sent;
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            subscription_tier: 'trial',
            trial_ends_at: trialEndsAt.toISOString(),
            user_metadata: metadata
        })
        .eq('email', TARGET_EMAIL);

    if (error) {
        console.error('❌ Update failed:', error.message);
    } else {
        console.log('✅ Update successful. Trial ends at:', trialEndsAt.toISOString());
    }
}

const hoursElapsed = process.argv[2] ? parseInt(process.argv[2], 10) : 2;
const clearSentFlags = process.argv[3] === 'true';

setTrialTime(hoursElapsed, clearSentFlags).catch(console.error);
