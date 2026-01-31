import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCounts() {
    const { data: leads, error } = await supabase
        .from('monitored_leads')
        .select('user_id');

    if (error) {
        console.error(error);
        return;
    }

    const counts: Record<string, number> = {};
    leads.forEach(l => {
        counts[l.user_id] = (counts[l.user_id] || 0) + 1;
    });

    console.table(counts);
}

checkCounts();
