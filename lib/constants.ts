export const TRIAL_DAYS = 7;

export const LIFETIME_TOTAL_SLOTS = 260;
export const LIFETIME_BASE_PRICE = 59;

export const PLANS = {
    STARTER: {
        id: 'starter',
        name: 'Starter Plan',
        price: 19,
        annualPrice: 149, // Aggressive 35% discount for immediate annual cashflow
        keywordLimit: 10,
        subredditLimit: 5,
        powerSearchLimit: 2,
        aiReplyLimit: 100,
    },
    GROWTH: {
        id: 'growth',
        name: 'Growth Plan',
        price: 29,
        annualPrice: 249, // Aggressive 28% discount for immediate annual cashflow
        keywordLimit: 20,
        subredditLimit: 15, // New field
        powerSearchLimit: 5,
        aiReplyLimit: 500,
    },
    LIFETIME: {
        id: 'lifetime',
        name: 'Lifetime Plan',
        keywordLimit: 20,
        subredditLimit: 15, // New field
        powerSearchLimit: 5,
        aiReplyLimit: 500,
    }
} as const;
