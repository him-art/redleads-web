import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkUser() {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'chrispterdanny@gmail.com')
        .single();
    
    if (error) {
        console.error('Error fetching user:', error);
    } else {
        console.log('User Profile:', JSON.stringify(profile, null, 2));
    }
}

checkUser();
