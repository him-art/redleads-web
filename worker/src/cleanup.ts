import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('[Cleanup] ❌ CRITICAL: Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runCleanup() {
    console.log('[Cleanup] 🧹 Starting database cleanup...');

    // Calculate cutoff date: 14 days ago
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const cutoff = fourteenDaysAgo.toISOString();

    console.log(`[Cleanup] Deleting leads created before ${cutoff} (excluding saved)...`);

    // Delete leads that are:
    // 1. Older than 14 days
    // 2. NOT saved (is_saved = false or null)
    const { error, count } = await supabase
        .from('monitored_leads')
        .delete({ count: 'exact' })
        .lt('created_at', cutoff)
        .or('is_saved.is.null,is_saved.eq.false');

    if (error) {
        console.error('[Cleanup] ❌ Error deleting old leads:', error);
    } else {
        console.log(`[Cleanup] ✅ Deleted ${count} old leads.`);
    }
}

runCleanup().catch(e => {
    console.error('[Cleanup] Fatal Error:', e);
    process.exit(1);
});
