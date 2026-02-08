
import dotenv from 'dotenv';
import { performScan } from './lib/scanner-core.js';

dotenv.config({ path: '.env.local' });

async function testScan() {
    const url = 'https://meet-lea.com';
    const keywords = ['Lea', 'CRM', 'Sales', 'Marketing'];
    const description = 'Meet Lea is a tool that helps businesses manage their online presence and customer interactions.';
    
    console.log('Testing scan for:', url);
    try {
        const result = await performScan(url, {
            keywords,
            description,
            tavilyApiKey: process.env.TAVILY_API_KEY
        });
        console.log('Scan Successful! Leads found:', result.leads?.length);
        console.log('First lead:', result.leads?.[0]?.title);
    } catch (error) {
        console.error('Scan Failed:', error);
    }
}

testScan();
