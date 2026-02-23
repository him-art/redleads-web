import { TRIAL_DAYS, PLANS } from './constants';

export interface TrialStatus {
    isActuallyExpired: boolean;
    isInTrial: boolean;
    daysRemaining: number;
    trialEndsAt: Date | null;
}

/**
 * Standardized trial status calculation used across the dashboard.
 */
export function calculateTrialStatus(profile: any, isSubscribed: boolean): TrialStatus {
    if (isSubscribed) {
        return { isActuallyExpired: false, isInTrial: false, daysRemaining: 0, trialEndsAt: null };
    }

    const trialEndsAtString = profile?.trial_ends_at || (profile?.created_at ? (() => {
        const d = new Date(profile.created_at);
        if (isNaN(d.getTime())) return null;
        const ends = new Date(d.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
        return ends.toISOString();
    })() : null);

    const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null;
    const now = new Date();
    
    let daysRemaining = 0;
    if (trialEndsAt) {
        const diff = trialEndsAt.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    const trialExpired = trialEndsAt ? (trialEndsAt.getTime() <= now.getTime()) : false;
    const isActuallyExpired = trialExpired || (!!trialEndsAt && daysRemaining <= 0);
    const isInTrial = !isActuallyExpired && daysRemaining > 0;

    return {
        isActuallyExpired,
        isInTrial,
        daysRemaining,
        trialEndsAt
    };
}

/**
 * Centralized plane details and limits.
 */
export function getPlanDetails(profile: any) {
    const rawTier = profile?.subscription_tier?.toLowerCase();
    // Normalize tier (handle professional alias if redirected from legacy systems)
    const tier = rawTier === 'professional' ? 'growth' : rawTier;
    const isAdmin = profile?.is_admin === true;

    const baseDetails = {
        isAdmin,
        isStarter: tier === 'starter' || tier === 'growth' || tier === 'lifetime' || isAdmin,
        isGrowth: tier === 'growth' || tier === 'lifetime' || isAdmin,
        isLifetime: tier === 'lifetime',
    };

    if (isAdmin) {
        return { ...PLANS.GROWTH, ...baseDetails, id: 'admin', name: 'Administrator', isFullAccess: true };
    }

    switch (tier) {
        case 'lifetime':
            return { ...PLANS.LIFETIME, ...baseDetails, id: 'lifetime', name: 'Lifetime Plan', isFullAccess: true };
        case 'growth':
            return { ...PLANS.GROWTH, ...baseDetails, id: 'growth', name: 'Growth Plan', isFullAccess: true };
        case 'starter':
            return { ...PLANS.STARTER, ...baseDetails, id: 'starter', name: 'Starter Plan', isFullAccess: false };
        default:
            return { ...PLANS.STARTER, ...baseDetails, id: 'free', name: 'Free Trial', isFullAccess: false };
    }
}

/**
 * Formats a currency value.
 */
export function formatCurrency(amount: number) {
    return `$${amount}`;
}
