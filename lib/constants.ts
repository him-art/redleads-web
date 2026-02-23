export const TRIAL_DAYS = 3;

export const LIFETIME_TOTAL_SLOTS = 10;
export const LIFETIME_BASE_PRICE = 20;

export const PLANS = {
    STARTER: {
        id: 'starter',
        name: 'Starter Plan',
        price: 7,
        originalPrice: 15,
        keywordLimit: 5,
        powerSearchLimit: 2,
        aiReplyLimit: 100,
    },
    GROWTH: {
        id: 'growth',
        name: 'Growth Plan',
        price: 14,
        originalPrice: 29,
        keywordLimit: 15,
        powerSearchLimit: 5,
        aiReplyLimit: 500,
    },
    LIFETIME: {
        id: 'lifetime',
        name: 'Lifetime Plan',
        keywordLimit: 15,
        powerSearchLimit: 5,
        aiReplyLimit: 500,
    }
} as const;
