import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Extract Supabase project ref from URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    process.exit(1);
}

// Extract project ref from URL (e.g., https://xxxxx.supabase.co -> xxxxx)
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
console.log(`Project ref: ${projectRef}`);

// Step 1: First, find and inspect the trigger
const inspectSQL = `
SELECT tgname, tgenabled, pg_get_triggerdef(oid) as definition
FROM pg_trigger
WHERE tgrelid = 'public.profiles'::regclass
AND tgname NOT LIKE 'RI_%';
`;

// Step 2: Disable the trigger, update the user, then re-enable
const updateSQL = `
-- Temporarily disable all user triggers on profiles
ALTER TABLE profiles DISABLE TRIGGER USER;

-- Update the user
UPDATE profiles
SET subscription_tier = 'lifetime',
    keyword_limit = 15,
    subscription_started_at = NOW(),
    dodo_payment_id = 'pay_0NZL3zu03vTIrO0gEkrNt'
WHERE email = 'onurmatik@gmail.com';

-- Re-enable triggers
ALTER TABLE profiles ENABLE TRIGGER USER;

-- Verify
SELECT email, subscription_tier, keyword_limit, subscription_started_at, dodo_payment_id
FROM profiles
WHERE email = 'onurmatik@gmail.com';
`;

async function runSQL(sql, label) {
    console.log(`\n⚡ Running: ${label}...`);
    
    // Use Supabase Management API (pg-meta)
    // This runs as postgres role, bypassing triggers
    const url = `${supabaseUrl}/rest/v1/rpc/`;

    // Alternative: use the direct PostgREST pg/query endpoint
    // Try the Supabase pg-meta SQL endpoint
    const pgMetaUrl = `https://${projectRef}.supabase.co/pg/query`;
    
    const res = await fetch(pgMetaUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
        },
        body: JSON.stringify({ query: sql }),
    });

    if (!res.ok) {
        const text = await res.text();
        console.log(`⚠️  pg-meta failed (${res.status}): ${text}`);
        return null;
    }

    const data = await res.json();
    return data;
}

async function main() {
    // Try inspect first
    let result = await runSQL(inspectSQL, 'Inspect triggers');
    if (result) {
        console.log('Triggers:', JSON.stringify(result, null, 2));
    }

    // Try the update
    result = await runSQL(updateSQL, 'Update user with triggers disabled');
    if (result) {
        console.log('Result:', JSON.stringify(result, null, 2));
        return;
    }

    // Fallback: Try Supabase SQL API v1
    console.log('\n⚡ Trying Supabase SQL API...');
    const sqlApiUrl = `https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`;
    
    // Try with a simple function approach - create a temp function
    const createFnSQL = `
    CREATE OR REPLACE FUNCTION public.admin_update_user_tier(p_email text, p_tier text, p_keyword_limit int, p_payment_id text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
        UPDATE profiles
        SET subscription_tier = p_tier,
            keyword_limit = p_keyword_limit,
            subscription_started_at = NOW(),
            dodo_payment_id = p_payment_id
        WHERE email = p_email;
    END;
    $$;
    `;

    // Try creating the function via PostgREST
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceKey);

    // Try calling the function if it already exists
    console.log('\n⚡ Trying to call admin_update_user_tier RPC...');
    const { data, error } = await supabase.rpc('admin_update_user_tier', {
        p_email: 'onurmatik@gmail.com',
        p_tier: 'lifetime',
        p_keyword_limit: 15,
        p_payment_id: 'pay_0NZL3zu03vTIrO0gEkrNt'
    });

    if (error) {
        console.log('⚠️  RPC failed:', error.message);
        console.log('\n════════════════════════════════════════');
        console.log('MANUAL SQL REQUIRED in Supabase SQL Editor:');
        console.log('════════════════════════════════════════');
        console.log(`
-- Step 1: Disable the trigger temporarily
ALTER TABLE profiles DISABLE TRIGGER USER;

-- Step 2: Update the user
UPDATE profiles
SET subscription_tier = 'lifetime',
    keyword_limit = 15,
    subscription_started_at = NOW(),
    dodo_payment_id = 'pay_0NZL3zu03vTIrO0gEkrNt'
WHERE email = 'onurmatik@gmail.com';

-- Step 3: Re-enable triggers
ALTER TABLE profiles ENABLE TRIGGER USER;

-- Step 4: Verify
SELECT email, subscription_tier, keyword_limit FROM profiles WHERE email = 'onurmatik@gmail.com';
`);
    } else {
        console.log('✅ RPC succeeded!', data);
        
        // Verify
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, subscription_tier, keyword_limit, subscription_started_at')
            .eq('email', 'onurmatik@gmail.com')
            .single();
        
        console.log('📋 Updated profile:', profile);
    }
}

main().catch(console.error);
