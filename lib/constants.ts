export const TRIAL_DAYS = 7;

export const LIFETIME_TOTAL_SLOTS = 260;
export const LIFETIME_BASE_PRICE = 199;

export const PLANS = {
    STARTER: {
        id: 'starter',
        name: 'Starter Plan',
        price: 29,
        annualPrice: 240, // $20/mo × 12
        keywordLimit: 10,
        subredditLimit: 5,
        powerSearchLimit: 5,
        aiReplyLimit: 100,
    },
    GROWTH: {
        id: 'growth',
        name: 'Growth Plan',
        price: 39,
        annualPrice: 348, // $29/mo × 12
        keywordLimit: 20,
        subredditLimit: 15, // New field
        powerSearchLimit: 10,
        aiReplyLimit: 500,
    },
    LIFETIME: {
        id: 'lifetime',
        name: 'Lifetime Plan (Legacy)',
        keywordLimit: 20,
        subredditLimit: 15, // New field
        powerSearchLimit: 10,
        aiReplyLimit: 500,
    },
    ONE_TIME: {
        id: 'one_time',
        name: 'One-Time Payment',
        keywordLimit: 20,
        subredditLimit: 5,
        powerSearchLimit: 10,
        aiReplyLimit: 200,
    }
} as const;
