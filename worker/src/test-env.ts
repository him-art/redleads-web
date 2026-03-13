
import dotenv from 'dotenv';
import fs from 'fs';

console.log('--- Env Loader Test ---');
console.log('.env.local exists:', fs.existsSync('.env.local'));
console.log('.env exists:', fs.existsSync('.env'));

dotenv.config(); // Loads .env
const envKeys = Object.keys(process.env);
console.log('Total keys after .env:', envKeys.length);
console.log('Has SUPABASE_SERVICE_ROLE_KEY:', envKeys.includes('SUPABASE_SERVICE_ROLE_KEY'));

dotenv.config({ path: '.env.local', override: true });
const envKeysLocal = Object.keys(process.env);
console.log('Total keys after .env.local:', envKeysLocal.length);
console.log('Has SUPABASE_SERVICE_ROLE_KEY:', envKeysLocal.includes('SUPABASE_SERVICE_ROLE_KEY'));
console.log('Has NEXT_PUBLIC_SUPABASE_URL:', envKeysLocal.includes('NEXT_PUBLIC_SUPABASE_URL'));
