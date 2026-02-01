import DodoPayments from 'dodopayments';

/**
 * Dodo Payments Client
 * Initialize the SDK with your API key from environment variables.
 * Only instantiated on the server to prevent client-side evaluation errors.
 */
const apiKey = process.env.DODO_API_KEY;
const isTestMode = process.env.DODO_TEST_MODE === 'true';

export const dodo = (typeof window === 'undefined' && apiKey) ? new DodoPayments({
    bearerToken: apiKey,
    environment: isTestMode ? 'test_mode' : 'live_mode',
}) : null;

export { isTestMode };
