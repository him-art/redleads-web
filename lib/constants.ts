export const TRIAL_DAYS = 3;

export const LIFETIME_TOTAL_SLOTS = 10;
export const LIFETIME_BASE_PRICE = 59;

export const PLANS = {
    STARTER: {
        id: 'starter',
        name: 'Starter Plan',
        price: 7,
        originalPrice: 15,
        keywordLimit: 10,
        powerSearchLimit: 2,
        aiReplyLimit: 100,
    },
    GROWTH: {
        id: 'growth',
        name: 'Growth Plan',
        price: 14,
        originalPrice: 29,
        keywordLimit: 20,
        powerSearchLimit: 5,
        aiReplyLimit: 500,
    },
    LIFETIME: {
        id: 'lifetime',
        name: 'Lifetime Plan',
        keywordLimit: 20,
        powerSearchLimit: 5,
        aiReplyLimit: 500,
    }
} as const;
