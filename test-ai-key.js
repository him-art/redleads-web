require('dotenv').config({ path: '.env.local' });

async function testAIKey() {
    const apiKey = process.env.AI_API_KEY;
    
    if (!apiKey) {
        console.error('❌ AI_API_KEY not found in .env.local');
        process.exit(1);
    }
    
    console.log('🔑 Testing AI API Key...');
    console.log('Key starts with:', apiKey.substring(0, 10) + '...');
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'user', content: 'Say "API key works!" if you can read this.' }
                ],
                max_tokens: 20
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('❌ API Error:', response.status, error);
            process.exit(1);
        }
        
        const data = await response.json();
        console.log('✅ API Key is VALID!');
        console.log('Response:', data.choices[0].message.content);
        
    } catch (error) {
        console.error('❌ Connection Error:', error.message);
        process.exit(1);
    }
}

testAIKey();
