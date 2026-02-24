import { NextResponse } from 'next/server';
import { exploreNiche } from '@/lib/niche-explorer';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, limit } from 'firebase/firestore';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

const ANON_DAILY_LIMIT = 2;
const AUTH_DAILY_LIMIT = 10;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query: searchQuery } = body;

        if (!searchQuery) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
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
                        where('tool', '==', 'niche-explorer')
                    );
                } else {
                    // Track by IP for anonymous users
                    const ipHash = crypto.createHash('sha256').update(`${remoteIP}-${today}-niche`).digest('hex');
                    q = query(
                        logsRef, 
                        where('ip_hash', '==', ipHash),
                        where('tool', '==', 'niche-explorer')
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
                            error: 'Daily limit reached. Sign up for unlimited research.', 
                            code: 'LIMIT_REACHED' 
                        }, { status: 429 });
                    }
                }

                // Log this attempt
                const ipHashForLogging = crypto.createHash('sha256').update(`${remoteIP}-${today}-niche`).digest('hex');
                await addDoc(logsRef, {
                    ip_hash: ipHashForLogging,
                    user_id: userId || null,
                    query: searchQuery,
                    created_at: Timestamp.now(),
                    date: today,
                    tool: 'niche-explorer'
                });
            } catch (authErr) {
                console.warn('Rate limiting check failed:', authErr);
            }
        }

        // 2. Perform Niche Research
        const result = await exploreNiche(searchQuery);

        // 3. Persistent Supabase Increment (for authenticated users)
        if (userId) {
            try {
                // Atomic increment using RPC
                const { error: updateError } = await supabase.rpc('increment_usage_count', { 
                    user_id_hex: userId 
                });

                if (updateError) {
                    console.error('[Niche Explorer] Failed to increment usage count:', updateError);
                }
            } catch (authErr) {
                console.warn('Supabase usage tracking failed:', authErr);
            }
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Niche Explorer Error]:', error);
        return NextResponse.json(
            { error: 'Failed to explore niche. Please try again.' }, 
            { status: 500 }
        );
    }
}
