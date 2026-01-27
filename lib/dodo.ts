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
