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

async function checkDatabaseState() {
    console.log('\n🔍 Checking Database State...');

    // 1. Check current role as seen by the database
    console.log('Checking current role via rpc...');
    const { data: role, error: roleError } = await supabase.rpc('exec_sql', {
        query: "SELECT current_setting('role')"
    });
    
    if (roleError) {
        console.log('⚠️  RPC exec_sql not available for role check.');
    } else {
        console.log(`✅ Current role: ${JSON.stringify(role)}`);
    }

    // 2. List all triggers on profiles to find out their exact names and definitions
    console.log('\nListing triggers on profiles table...');
    const { data: triggers, error: trigError } = await supabase.rpc('exec_sql', {
        query: "SELECT tgname, pg_get_triggerdef(oid) as definition FROM pg_trigger WHERE tgrelid = 'public.profiles'::regclass"
    });

    if (trigError) {
        console.log('⚠️  RPC exec_sql not available for trigger inspection.');
        console.log('Please run this in Supabase SQL Editor:');
        console.log("SELECT tgname, pg_get_triggerdef(oid) FROM pg_trigger WHERE tgrelid = 'profiles'::regclass;");
    } else {
        console.log('✅ Triggers found:');
        console.log(JSON.stringify(triggers, null, 2));
    }
}

checkDatabaseState().catch(console.error);
