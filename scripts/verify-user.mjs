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

const TARGET_EMAIL = 'onurmatik@gmail.com';

async function verifyUser() {
    console.log(`\n🔍 Verifying user: ${TARGET_EMAIL}...`);

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('email, subscription_tier, keyword_limit, subscription_started_at, dodo_payment_id')
        .eq('email', TARGET_EMAIL)
        .single();

    if (error || !profile) {
        console.error('❌ User profile verification failed:', error?.message || 'No profile returned');
        return;
    }

    console.log('\n✅ Profile Data:');
    console.log(`   Email:          ${profile.email}`);
    console.log(`   Tier:           ${profile.subscription_tier}`);
    console.log(`   Keyword Limit:  ${profile.keyword_limit}`);
    console.log(`   Sub Started At: ${profile.subscription_started_at}`);
    console.log(`   Payment ID:     ${profile.dodo_payment_id}`);

    if (profile.subscription_tier === 'lifetime' && profile.keyword_limit === 15) {
        console.log('\n✨ Verification SUCCESS: User has full Lifetime access.');
    } else {
        console.log('\n⚠️ Verification INCOMPLETE: Some fields are not as expected.');
    }
}

verifyUser().catch(console.error);
