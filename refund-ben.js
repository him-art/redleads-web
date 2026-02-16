const dotenv = require('dotenv');
const DodoPayments = require('dodopayments'); 
// Try to handle both default and named export just in case
const DodoClient = DodoPayments.default || DodoPayments;

dotenv.config({ path: '.env.local' });

const apiKey = process.env.DODO_API_KEY;
const isTestMode = process.env.DODO_TEST_MODE === 'true';

console.log('Initializing Dodo with Key:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
    console.error('Missing DODO_API_KEY');
    process.exit(1);
}

const dodo = new DodoClient({
    bearerToken: apiKey,
    environment: isTestMode ? 'test_mode' : 'live_mode',
});

async function refund() {
    try {
        const paymentId = 'pay_0NY5ORFCE76Oj0c8QaOAw';
        console.log(`Checking payment: ${paymentId}`);

        // Get payment first
        const payment = await dodo.payments.get({ payment_id: paymentId });
        console.log(`Payment found: ${payment.amount} ${payment.currency}, Status: ${payment.status}`);

        if (payment.status === 'succeeded') {
            console.log('Initiating refund...');
             const result = await dodo.refunds.create({
                payment_id: paymentId,
                amount: payment.amount, 
                reason: 'Customer requested refund via admin',
            });
            console.log('Refund successful! Refund ID:', result.refund_id);
        } else {
            console.log('Payment status is not succeeded, cannot refund.');
        }

    } catch (error) {
        console.error('Refund failed:', error);
        // Log full error object if possible
        if (error.response) {
             console.error('Response data:', error.response.data);
        }
    }
}

refund();
