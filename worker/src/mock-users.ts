
export const MOCK_USERS = Array.from({ length: 50 }, (_, i) => {
    const KEYWORD_POOL = [
        'CRM software', 'sales automation', 'lead generation', 'B2B SaaS',
        'customer success', 'marketing attribution', 'growth hacking',
        'cold email', 'outreach tools', 'pipeline management'
    ];
    const SUBREDDIT_POOL = [
        'sales', 'entrepreneur', 'startups', 'saas', 'marketing',
        'growthhacking', 'smallbusiness', 'ecommerce', 'digitalmarketing',
        'business'
    ];

    return {
        id: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
        keywords: KEYWORD_POOL.slice(0, 5 + Math.floor(Math.random() * 5)),
        description: `Scale Test User ${i}: Focused on B2B SaaS and high-intent lead generation.`
    };
});
