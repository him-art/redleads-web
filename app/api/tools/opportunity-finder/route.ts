import { NextResponse } from 'next/server';
import { performScan } from '@/lib/scanner-core';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

const ANON_DAILY_LIMIT = 2;
const AUTH_DAILY_LIMIT = 10;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        // 2. Rate Limiting Logic
        const remoteIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        const today = new Date().toISOString().split('T')[0]; 
        
        if (db) {
            try {
                const logsRef = collection(db, 'free_tool_logs');
                let q;

                if (userId) {
                    // Track by User ID for logged in users
                    q = query(
                        logsRef, 
                        where('user_id', '==', userId), 
                        where('date', '==', today),
                        where('tool', '==', 'opportunity-finder')
                    );
                } else {
                    // Track by IP for anonymous users
                    const ipHashForCheck = crypto.createHash('sha256').update(`${remoteIP}-${today}-opportunity`).digest('hex');
                    q = query(
                        logsRef, 
                        where('ip_hash', '==', ipHashForCheck),
                        where('tool', '==', 'opportunity-finder')
                    );
                }

                const snapshot = await getDocs(q);
                const currentCount = snapshot.size;

                if (userId) {
                    if (currentCount >= AUTH_DAILY_LIMIT) {
                        return NextResponse.json({ 
                            error: 'Daily limit reached. Please come back tomorrow.', 
                            code: 'LIMIT_REACHED' 
                        }, { status: 429 });
                    }
                } else {
                    if (currentCount >= ANON_DAILY_LIMIT) {
                        return NextResponse.json({ 
                            error: 'Daily limit reached. Sign up for unlimited scans.', 
                            code: 'LIMIT_REACHED' 
                        }, { status: 429 });
                    }
                }

                // Log this attempt
                const ipHashForLogging = crypto.createHash('sha256').update(`${remoteIP}-${today}-opportunity`).digest('hex');
                await addDoc(logsRef, {
                    ip_hash: ipHashForLogging,
                    user_id: userId || null,
                    url,
                    created_at: Timestamp.now(),
                    date: today,
                    tool: 'opportunity-finder'
                });
            } catch (authErr) {
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
        
        const topLeads = leads.slice(0, 10);
        const totalFound = leads.length;

        // 4. Persistent Supabase Increment (for authenticated users)
        if (userId) {
            try {
                const { createAdminClient } = await import('@/lib/supabase/server');
                const adminSupabase = createAdminClient();

                const { data: profile } = await adminSupabase
                    .from('profiles')
                    .select('free_tool_usage_count')
                    .eq('id', userId)
                    .single();

                await adminSupabase
                    .from('profiles')
                    .update({ 
                        free_tool_usage_count: (profile?.free_tool_usage_count || 0) + 1 
                    })
                    .eq('id', userId);
            } catch (authErr) {
                console.warn('Supabase usage tracking failed (Admin Mode):', authErr);
            }
        }

        return NextResponse.json({
            leads: topLeads,
            totalFound,
            teaser: true
        });

    } catch (error: any) {
        console.error('[Free Tool API Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
