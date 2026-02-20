import { NextResponse } from 'next/server';
import { performScan } from '@/lib/scanner-core';
import { db } from '@/lib/firebase'; // Assuming Firebase is used for basic logging
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import crypto from 'crypto';

// Rate limit: 3 scans per IP per day for free tool
const DAILY_LIMIT = 3;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. IP Rate Limiting
        const remoteIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        // Create a distinct hash for today to reset daily
        const today = new Date().toISOString().split('T')[0]; 
        const ipHash = crypto.createHash('sha256').update(`${remoteIP}-${today}`).digest('hex');

        if (db) {
            try {
                const logsRef = collection(db, 'free_tool_logs');
                const q = query(logsRef, where('ip_hash', '==', ipHash));
                const snapshot = await getDocs(q);

                if (snapshot.size >= DAILY_LIMIT) {
                     return NextResponse.json({ 
                        error: 'Daily limit reached. Sign up for unlimited scans.', 
                        code: 'LIMIT_REACHED' 
                    }, { status: 429 });
                }

                // Log this attempt
                await addDoc(logsRef, {
                    ip_hash: ipHash,
                    url,
                    created_at: Timestamp.now(),
                    tool: 'opportunity-finder'
                });
            } catch (authErr) {
                // Fail gracefuly if firebase auth/permissions issue, don't block the user
                console.warn('Rate limiting check failed:', authErr);
            }
        }

        // 2. Perform Scan
        // Note: For free tool, we might not have a description. 
        // scanner-core handles this by using the URL to infer context via AI.
        const scanResult = await performScan(url, {
            tavilyApiKey: process.env.TAVILY_API_KEY,
            // No custom description or keywords for basic check
        });

        if (scanResult.error) {
            return NextResponse.json({ error: scanResult.error }, { status: 500 });
        }

        const leads = scanResult.leads || [];

        // 3. Truncate Results (The "Teaser" Logic)
        // Return top 3 full leads, and just the COUNT of the rest.
        // Also ensure we don't return high-value fields for the rest if strictly filtered?
        // Actually, just returning top 3 is enough. The frontend can say "Found 15 more".
        
        const topLeads = leads.slice(0, 5);
        const totalFound = leads.length;

        return NextResponse.json({
            leads: topLeads,
            totalFound,
            remaining: Math.max(0, totalFound - 5),
            teaser: true
        });

    } catch (error: any) {
        console.error('[Free Tool API Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
