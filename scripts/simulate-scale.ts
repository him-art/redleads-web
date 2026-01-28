import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const KEYWORD_POOL = [
    'CRM software', 'sales automation', 'lead generation', 'B2B SaaS',
    'customer success', 'marketing attribution', 'growth hacking',
    'cold email', 'outreach tools', 'pipeline management',
    'conversion rate', 'funnel optimization', 'retention strategy',
    'churn reduction', 'sales ops', 'revops', 'account based marketing',
    'content strategy', 'SEO tools', 'social listening'
];

const SUBREDDIT_POOL = [
    'sales', 'entrepreneur', 'startups', 'saas', 'marketing',
    'growthhacking', 'smallbusiness', 'ecommerce', 'digitalmarketing',
    'business', 'founders', 'webdev', 'technology', 'productmanagement'
];

async function simulateScale() {
    console.log('🚀 Starting Scalability Simulation (50 Users)...');

    const users = [];
    for (let i = 1; i <= 50; i++) {
        // Randomize count and selections
        const userKeywords = [...KEYWORD_POOL]
            .sort(() => 0.5 - Math.random())
            .slice(0, 8 + Math.floor(Math.random() * 8)); // 8-15 keywords

        const userSubreddits = [...SUBREDDIT_POOL]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5 + Math.floor(Math.random() * 6)); // 5-10 subreddits

        users.push({
            id: crypto.randomUUID(),
            email: `test_user_${i}@example.com`,
            keywords: userKeywords,
            subreddits: userSubreddits,
            description: `Mock Business ${i}: A specialized provider of ${userKeywords[0]} and ${userKeywords[1]} solutions for ${userSubreddits[0]} focused companies.`,
            subscription_tier: 'pro',
            created_at: new Date().toISOString()
        });
    }

    console.log(`[SCALE] Created 50 mock profiles. Syncing with Supabase...`);

    // Clean up old test users first (optional but keeps DB clean)
    // We only delete users with @example.com to avoid touching real ones
    const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .like('email', '%@example.com');

    if (deleteError) {
        console.error('[SCALE] Error cleaning up test users:', deleteError.message);
    }

    // Insert new mock users
    const { error: insertError } = await supabase
        .from('profiles')
        .insert(users);

    if (insertError) {
        console.error('[SCALE] Error inserting mock users:', insertError.message);
        return;
    }

    console.log('✅ Successfully populated 50 mock user profiles.');
    console.log('--- Summary ---');
    console.log('Total Profiles:', users.length);
    console.log('Sample User:', users[0].email);
    console.log('Subreddits per User (avg): ~7');
    console.log('Keywords per User (avg): ~12');
}

simulateScale().catch(console.error);
