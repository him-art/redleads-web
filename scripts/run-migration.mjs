import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    process.exit(1);
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
console.log(`Project reference ID: ${projectRef}`);

const migrationSQL = `
-- Add unsubscribed column to public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN DEFAULT false;

-- Ensure any existing records have it set to false
UPDATE public.profiles SET unsubscribed = false WHERE unsubscribed IS NULL;
`;

async function runMigration() {
    console.log('\n⚡ Running database migration SQL...');
    
    const pgMetaUrl = `https://${projectRef}.supabase.co/pg/query`;
    
    try {
        const res = await fetch(pgMetaUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`,
                'apikey': serviceKey,
            },
            body: JSON.stringify({ query: migrationSQL }),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`❌ pg-meta endpoint returned error (${res.status}): ${text}`);
            process.exit(1);
        }

        const data = await res.json();
        console.log('✅ SQL executed successfully!');
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('❌ Failed to connect to pg-meta query endpoint:', err);
        process.exit(1);
    }
}

runMigration();
