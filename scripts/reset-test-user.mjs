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

async function resetUser() {
    console.log(`\n🔄 Resetting test user ${TARGET_EMAIL} to trial...`);

    const { error } = await supabase
        .from('profiles')
        .update({
            subscription_tier: 'trial',
            keyword_limit: 3
        })
        .eq('email', TARGET_EMAIL);

    if (error) {
        console.error('❌ Reset failed:', error.message);
    } else {
        console.log('✅ Reset successful.');
    }
}

resetUser().catch(console.error);
