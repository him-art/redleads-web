const dotenv = require('dotenv');
const DodoPayments = require('dodopayments'); 

dotenv.config({ path: '.env.local' });

const apiKey = process.env.DODO_API_KEY;

console.log('API Key exists:', !!apiKey);

try {
    const DodoClient = DodoPayments.default || DodoPayments;
    const dodo = new DodoClient({
        bearerToken: apiKey,
        environment: 'live_mode', // Ben is on live? He paid $15. Yes.
    });

    const paymentId = 'pay_0NY5ORFCE76Oj0c8QaOAw';
    
    console.log('Fetching payment...');
    dodo.payments.get({ payment_id: paymentId }) // Check signature. Is it object or string?
        .then(payment => {
            console.log('Payment retrieved:', JSON.stringify(payment, null, 2));
        })
        .catch(err => {
            console.error('Fetch failed:', err.message);
            if(err.response) console.error('Response:', err.response.data);
        });

} catch (e) {
    console.error('Setup failed:', e);
}
