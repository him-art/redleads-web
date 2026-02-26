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

async function testTriggerFix() {
    console.log(`\n🧪 Testing Trigger Fix for ${TARGET_EMAIL}...`);

    // 1. Find the existing test user
    const { data: user, error: findError } = await supabase
        .from('profiles')
        .select('id, subscription_tier, keyword_limit')
        .eq('email', TARGET_EMAIL)
        .single();

    if (findError || !user) {
        console.error('❌ Failed to find test user:', findError?.message || 'User not found');
        return;
    }

    const originalTier = user.subscription_tier;
    const originalLimit = user.keyword_limit;
    console.log(`✅ Test user found. Current tier: ${originalTier} (Limit: ${originalLimit})`);

    // 2. Attempt to update tier using service_role (simulating webhook)
    // We'll flip it to growth (or back to trial if it was growth) to verify the update works
    const newTier = originalTier === 'growth' ? 'trial' : 'growth';
    const newLimit = newTier === 'growth' ? 15 : 3;

    console.log(`🔄 Attempting tier update to: ${newTier} (Limit: ${newLimit})...`);
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            subscription_tier: newTier,
            keyword_limit: newLimit
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('❌ Tier update FAILED:', updateError.message);
        console.log('   (The trigger is likely still blocking the update)');
    } else {
        console.log('✅ Tier update SUCCEEDED!');
        
        // 3. Verify
        const { data: updated } = await supabase
            .from('profiles')
            .select('subscription_tier, keyword_limit')
            .eq('id', user.id)
            .single();
        
        console.log(`   Final Tier: ${updated.subscription_tier}`);
        console.log(`   Final Limit: ${updated.keyword_limit}`);
    }
}

testTriggerFix().catch(console.error);
