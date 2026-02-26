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

async function inspectTriggers() {
    console.log('🔍 Looking for triggers on the profiles table...\n');

    // Query pg_trigger to find triggers on profiles
    const { data, error } = await supabase.rpc('exec_sql', {
        query: `SELECT tgname, tgenabled, pg_get_triggerdef(oid) as definition FROM pg_trigger WHERE tgrelid = 'public.profiles'::regclass`
    });

    if (error) {
        console.log('⚠️  Cannot use exec_sql RPC. Trying alternative...\n');
        
        // Try querying information_schema
        const { data: triggers, error: trigError } = await supabase
            .from('pg_trigger')
            .select('*');
        
        if (trigError) {
            console.log('⚠️  Cannot query pg_trigger directly:', trigError.message);
            console.log('\n📋 Manual steps needed:');
            console.log('   1. Go to Supabase Dashboard → SQL Editor');
            console.log('   2. Run this query:\n');
            console.log("   SELECT tgname, tgenabled, pg_get_triggerdef(oid) as definition");
            console.log("   FROM pg_trigger");
            console.log("   WHERE tgrelid = 'public.profiles'::regclass;");
            console.log('\n   3. Also check for RLS policies:\n');
            console.log("   SELECT * FROM pg_policies WHERE tablename = 'profiles';");
            console.log('\n   4. To immediately update the user, run:\n');
            console.log("   UPDATE profiles");
            console.log("   SET subscription_tier = 'lifetime',");
            console.log("       keyword_limit = 15,");
            console.log("       subscription_started_at = NOW(),");
            console.log("       dodo_payment_id = 'pay_0NZL3zu03vTIrO0gEkrNt'");
            console.log("   WHERE email = 'onurmatik@gmail.com';");
            console.log('\n   5. Then to fix the trigger, find and modify it to allow service_role updates.');
        }
    } else {
        console.log('Triggers found:', JSON.stringify(data, null, 2));
    }
}

inspectTriggers().catch(console.error);
