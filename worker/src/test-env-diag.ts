/**
 * Diagnostic script: Check if env vars are loaded correctly.
 * Does NOT print any secrets — only key names, types, and lengths.
 */
import dotenv from 'dotenv';

// Load .env.local explicitly
const result = dotenv.config({ path: '.env.local' });

console.log('--- dotenv.config result ---');
console.log('Error:', result.error || 'none');
console.log('Parsed keys:', result.parsed ? Object.keys(result.parsed).length : 0);

// List all keys that contain "SUPABASE" or "RESEND" (names only, no values)
const supabaseKeys = Object.keys(process.env).filter(k => k.includes('SUPABASE'));
const resendKeys = Object.keys(process.env).filter(k => k.includes('RESEND'));

console.log('\n--- SUPABASE keys in process.env ---');
supabaseKeys.forEach(k => {
    const val = process.env[k];
    console.log(`  ${k}: type=${typeof val}, length=${val?.length ?? 'undefined'}, truthy=${!!val}`);
});

console.log('\n--- RESEND keys in process.env ---');
resendKeys.forEach(k => {
    const val = process.env[k];
    console.log(`  ${k}: type=${typeof val}, length=${val?.length ?? 'undefined'}, truthy=${!!val}`);
});

// Also check the parsed result from dotenv
if (result.parsed) {
    const parsedSupabase = Object.keys(result.parsed).filter(k => k.includes('SUPABASE'));
    const parsedResend = Object.keys(result.parsed).filter(k => k.includes('RESEND'));
    console.log('\n--- SUPABASE keys in dotenv parsed ---');
    parsedSupabase.forEach(k => {
        const val = result.parsed![k];
        console.log(`  ${k}: type=${typeof val}, length=${val?.length ?? 'undefined'}, truthy=${!!val}`);
    });
    console.log('\n--- RESEND keys in dotenv parsed ---');
    parsedResend.forEach(k => {
        const val = result.parsed![k];
        console.log(`  ${k}: type=${typeof val}, length=${val?.length ?? 'undefined'}, truthy=${!!val}`);
    });
}
