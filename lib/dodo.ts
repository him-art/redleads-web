import DodoPayments from 'dodopayments';

/**
 * Dodo Payments Client
 * Initialize the SDK with your API key from environment variables.
 */
export const dodo = new DodoPayments({
    bearerToken: process.env.DODO_API_KEY,
});

// Test mode flag - set to true for development
export const isTestMode = process.env.NODE_ENV !== 'production';

// Public Beta Mode Configuration
export const BETA_MODE = process.env.NEXT_PUBLIC_BETA_MODE === 'true';
export const BETA_SEAT_LIMIT = 20;
