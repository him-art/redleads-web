import { TRIAL_DAYS, PLANS } from './constants';

export interface TrialStatus {
    isActuallyExpired: boolean;
    isInTrial: boolean;
    daysRemaining: number;
    trialEndsAt: Date | null;
    needsCheckout: boolean;
}

/**
 * Standardized trial status calculation used across the dashboard.
 */
export function isSubscribedPlan(profile: any): boolean {
    const tier = profile?.subscription_tier?.toLowerCase();
    return tier === 'starter' || tier === 'growth' || tier === 'lifetime' || profile?.is_admin === true;
}

export function calculateTrialStatus(profile: any): TrialStatus {
    const subscribed = isSubscribedPlan(profile);
    const trialEndsAtString = profile?.trial_ends_at || null;
    const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null;
    const now = new Date();
    
    let daysRemaining = 0;
    if (trialEndsAt) {
        const diff = trialEndsAt.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    const trialExpired = trialEndsAt ? (trialEndsAt.getTime() <= now.getTime()) : false;

    // A user is in a trial if they have an active trial end date in the future
    const isInTrial = !trialExpired && daysRemaining > 0;

    // Cutoff logic: users created after this date MUST have completed checkout (have a trial date or subscription)
    // If they don't, they are in a "limbo" state and need to check out to start their trial.
    const profileCreatedAt = profile?.created_at ? new Date(profile.created_at) : new Date(0);
    const ENFORCEMENT_DATE = new Date('2026-05-20T00:00:00Z');
    
    // A user needs checkout if they were created after enforcement date, have no subscription, and have no trialEndsAt
    const needsCheckout = !subscribed && profileCreatedAt > ENFORCEMENT_DATE && !trialEndsAt;
    
    // They are "expired" (locked out) if they are not subscribed AND (their trial is over OR they need to check out).
    const isActuallyExpired = subscribed ? false : (trialExpired || (!!trialEndsAt && daysRemaining <= 0) || needsCheckout);

    return {
        isActuallyExpired,
        isInTrial,
        daysRemaining,
        trialEndsAt,
        needsCheckout
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
    const isSubscribed = isSubscribedPlan(profile);

    // Differentiate active paid sub from subscription trial
    const trialStatus = calculateTrialStatus(profile);
    const isInTrial = trialStatus.isInTrial;

    const baseDetails = {
        isAdmin,
        isStarter: isSubscribed,
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
            return { ...PLANS.STARTER, ...baseDetails, id: 'trial', name: 'Preview Account', isFullAccess: false };
    }
}

/**
 * Formats a currency value.
 */
export function formatCurrency(amount: number) {
    return `$${amount}`;
}

/**
 * Cleans Reddit titles by removing redundant suffixes and subreddit mentions.
 */
export function cleanRedditTitle(title: string): string {
    if (!title) return '';
    
    return title
        .replace(/\s*-\s*Reddit\s*$/gi, '') // Remove "- Reddit" at the end
        .replace(/\s*[:|]\s*r\/[a-zA-Z0-9_]+\s*$/gi, '') // Remove ": r/subreddit" or "| r/subreddit" at the end
        .replace(/\s*\.\.\.\s*$/g, '') // Remove trailing ellipsis if it's just from a simple cut
        .trim();
}
