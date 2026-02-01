import DodoPayments from 'dodopayments';

/**
 * Dodo Payments Client
 * Initialize the SDK with your API key from environment variables.
 * Only instantiated on the server to prevent client-side evaluation errors.
 * 
 * Set DODO_TEST_MODE=true for test mode, or leave unset for live mode.
 */
const isTestMode = process.env.DODO_TEST_MODE === 'true';

export const dodo = typeof window === 'undefined' ? new DodoPayments({
    bearerToken: process.env.DODO_API_KEY,
    environment: isTestMode ? 'test_mode' : 'live_mode',
}) : null as unknown as DodoPayments;

export { isTestMode };
