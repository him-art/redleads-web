import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function cleanup() {
    console.log('🧹 Starting cleanup of duplicate leads...');

    // 1. Fetch all leads (id, user_id, title, created_at)
    // Warning: If DB is huge, pagination is needed. Assuming < 100k here for script.
    const { data: leads, error } = await supabase
        .from('monitored_leads')
        .select('id, user_id, title, created_at')
        .order('created_at', { ascending: false }); // Newest first

    if (error) {
        console.error('Error fetching leads:', error);
        return;
    }

    console.log(`Analyzing ${leads.length} leads...`);

    const seen = new Set<string>();
    const toDelete: string[] = [];

    for (const lead of leads) {
        // Unique key: User + Title (Exact Match)
        // Normalize title? User asked for "exactly duplicate titles"
        const key = `${lead.user_id}::${lead.title.trim()}`;
        
        if (seen.has(key)) {
            // Duplicate! Valid because leads are ordered Newest -> Oldest.
            // So we keep the first one we see (Newest), and delete subsequent (Older)
            toDelete.push(lead.id);
        } else {
            seen.add(key);
        }
    }

    console.log(`Found ${toDelete.length} duplicates to delete.`);

    if (toDelete.length > 0) {
        // Delete in batches of 100 to be safe
        const BATCH_SIZE = 100;
        for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
            const batch = toDelete.slice(i, i + BATCH_SIZE);
            const { error: delError } = await supabase
                .from('monitored_leads')
                .delete()
                .in('id', batch);
            
            if (delError) {
                console.error('Error deleting batch:', delError);
            } else {
                console.log(`Deleted ids ${i} to ${Math.min(i + BATCH_SIZE, toDelete.length)}`);
            }
        }
        console.log('✅ Cleanup complete.');
    } else {
        console.log('No duplicates found.');
    }
}

cleanup();
