import dotenv from 'dotenv';
import DodoPayments from 'dodopayments';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.DODO_API_KEY;
const isTestMode = process.env.DODO_TEST_MODE === 'true';

console.log('Initializing Dodo with Key present:', !!apiKey);
console.log('Mode:', isTestMode ? 'TEST' : 'LIVE');

if (!apiKey) {
    console.error('Missing DODO_API_KEY');
    process.exit(1);
}

const dodo = new DodoPayments({
    bearerToken: apiKey,
    environment: isTestMode ? 'test_mode' : 'live_mode',
});

async function refund() {
    try {
        const paymentId = 'pay_0NY5ORFCE76Oj0c8QaOAw';
        console.log(`Attempting to refund payment: ${paymentId}`);

        // Get payment first to confirm amount/currency (optional safety check)
        const payment = await dodo.payments.get(paymentId);
        console.log(`Payment found: ${payment.amount} ${payment.currency}, Status: ${payment.status}`);

        if (payment.status === 'succeeded') {
             const result = await dodo.refunds.create({
                payment_id: paymentId,
                amount: payment.amount, // Full refund
                reason: 'Customer requested refund via admin',
            });
            console.log('Refund successful! Refund ID:', result.refund_id);
        } else {
            console.log('Payment status is not succeeded, cannot refund.');
        }

    } catch (error) {
        console.error('Refund failed:', error);
    }
}

refund();
