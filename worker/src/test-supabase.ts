
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', SUPABASE_URL);
console.log('Key defined:', !!SUPABASE_SERVICE_KEY);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing config');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function test() {
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success! Profile count:', data);
    }
}

test();
