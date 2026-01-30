import DodoPayments from 'dodopayments';

/**
 * Dodo Payments Client
 * Initialize the SDK with your API key from environment variables.
 * Only instantiated on the server to prevent client-side evaluation errors.
 */
export const dodo = typeof window === 'undefined' ? new DodoPayments({
    bearerToken: process.env.DODO_API_KEY,
}) : null as unknown as DodoPayments;

// Test mode flag - set to true for development
export const isTestMode = process.env.NODE_ENV !== 'production';
