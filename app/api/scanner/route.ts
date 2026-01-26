import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { scannerSchema } from '@/lib/validation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { performScan } from '@/lib/scanner-core';
import crypto from 'crypto';

/**
 * REDLEADS SCANNER API
 * Handles real-time demo scans with RLS protection.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // 1. Validate Input
        const validation = scannerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }
        
        const { url, email, action } = validation.data;

        // 2. Auth Context
        const urlSB = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const keySB = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!urlSB || !keySB) {
            return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
        }

        const jars = await cookies();
        const supabase = createServerClient(
            urlSB,
            keySB,
            {
                cookies: {
                    get(name: string) { return jars.get(name)?.value; },
                    set(name: string, value: string, options: CookieOptions) { jars.set({ name, value, ...options }); },
                    remove(name: string, options: CookieOptions) { jars.set({ name, value: '', ...options }); },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        // Execution Logic: SCAN
        if (action === 'SCAN') {
            if (!url) return NextResponse.json({ error: 'No URL' }, { status: 400 });

            const remoteIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'localhost';
            const hashIP = crypto.createHash('sha256').update(remoteIP).digest('hex');
            
            let isPro = false;

            if (user) {
                const { data: profile } = await supabase
                    .from('user_access_status')
                    .select('daily_scan_count, last_scan_at, effective_tier')
                    .eq('id', user.id)
                    .single();
                
                isPro = profile?.effective_tier === 'pro';
                
                if (!isPro) {
                    const today = new Date().toDateString();
                    const lastDay = profile?.last_scan_at ? new Date(profile.last_scan_at).toDateString() : '';
                    const countUsed = today === lastDay ? (profile?.daily_scan_count || 0) : 0;

                    if (countUsed >= 5) return NextResponse.json({ 
                        error: 'Daily limit reached for free account.', 
                        code: 'DAILY_LIMIT_REACHED' 
                    }, { status: 403 });

                    await supabase.from('profiles').update({ 
                        daily_scan_count: countUsed + 1,
                        last_scan_at: new Date().toISOString()
                    }).eq('id', user.id);
                }
            } else {
                const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || keySB;
                const admin = createServerClient(urlSB, adminKey!, { cookies: { get: () => undefined, set: () => {}, remove: () => {} } });
                const { data: anon } = await admin.from('anon_usage').select('daily_scan_count, last_scan_at').eq('ip_hash', hashIP).single();
                
                const today = new Date().toDateString();
                const lastDay = anon?.last_scan_at ? new Date(anon.last_scan_at).toDateString() : '';
                const countUsed = today === lastDay ? (anon?.daily_scan_count || 0) : 0;

                if (countUsed >= 1) return NextResponse.json({ 
                    error: 'Free demo scan used. Sign in to continue!', 
                    code: 'DAILY_LIMIT_REACHED' 
                }, { status: 403 });

                if (anon) {
                    await admin.from('anon_usage').update({ daily_scan_count: countUsed + 1, last_scan_at: new Date().toISOString() }).eq('ip_hash', hashIP);
                } else {
                    await admin.from('anon_usage').insert({ ip_hash: hashIP, daily_scan_count: 1, last_scan_at: new Date().toISOString() });
                }
            }

            const scanResult = await performScan(url, {
                tavilyApiKey: process.env.TAVILY_API_KEY
            });

            if (scanResult.error) {
                console.error('[Scanner API] performScan Error:', scanResult.error);
                return NextResponse.json({ error: scanResult.error }, { status: 500 });
            }

            // TEASER LOGIC: Only return top 3 leads if not PRO
            const originalCount = scanResult.leads?.length || 0;
            if (!isPro && originalCount > 3) {
                scanResult.leads = scanResult.leads.slice(0, 3);
                (scanResult as any).isTeaser = true;
                (scanResult as any).totalFound = originalCount;
            }

            console.log(`[Scanner API] Scan completed. Found ${scanResult.leads?.length || 0} leads.`);
            return NextResponse.json(scanResult);
        }

        // --- Action: UNLOCK ---
        if (action === 'UNLOCK') {
            if (!email || !url) return NextResponse.json({ error: 'Missing Info' }, { status: 400 });
            if (db) {
                await addDoc(collection(db, 'free_scanner_leads'), {
                    email,
                    source_url: url,
                    captured_at: serverTimestamp(),
                    user_id: user?.id || null
                });
            }
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (apiErr: any) {
        console.error('[Scanner API Error]', apiErr);
        return NextResponse.json({ error: apiErr.message }, { status: 500 });
    }
}
