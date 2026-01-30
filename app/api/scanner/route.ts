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
            let isInTrial = false;

            if (!user) {
                return NextResponse.json({ 
                    error: 'Authentication required. Please sign in to start your free trial.', 
                    code: 'AUTH_REQUIRED' 
                }, { status: 401 });
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('scan_count, last_scan_at, subscription_tier, trial_ends_at, scan_allowance, created_at')
                .eq('id', user.id)
                .single();
            
            const isPaid = profile?.subscription_tier === 'pro';
            
            // Get trial status - auto-calculate if trial_ends_at is not set
            const trialEndsAt = profile?.trial_ends_at 
                ? new Date(profile.trial_ends_at) 
                : (profile?.created_at ? new Date(new Date(profile.created_at).getTime() + 3 * 24 * 60 * 60 * 1000) : null);
            isInTrial = trialEndsAt ? trialEndsAt > new Date() : false;

            if (!(isPaid || isInTrial)) {
                return NextResponse.json({ 
                    error: 'Your trial has ended. Please upgrade to Pro to continue finding leads.', 
                    code: 'PAYWALL_REQUIRED' 
                }, { status: 403 });
            }

            const today = new Date().toDateString();
            const lastDay = profile?.last_scan_at ? new Date(profile.last_scan_at).toDateString() : '';
            
            // Usage Guardrails (SaaS 2.0)
            let currentCount = profile?.scan_count || 0;
            const dailyLimit = profile?.scan_allowance || 5; // Default to 5

            if (isPaid) {
                // If Paid, reset if it's a new day
                currentCount = (today === lastDay) ? (profile?.scan_count || 0) : 0;
            }
            
            if (currentCount >= dailyLimit) {
                const msg = isPaid 
                    ? `Daily scan limit (${dailyLimit}) reached. Check back tomorrow!` 
                    : `You have used all ${dailyLimit} trial scans. Upgrade to Pro for fresh scans every day!`;
                return NextResponse.json({ error: msg, code: 'DAILY_LIMIT_REACHED' }, { status: 403 });
            }

            await supabase.from('profiles').update({ 
                scan_count: currentCount + 1,
                last_scan_at: new Date().toISOString()
            }).eq('id', user.id);

            const scanResult = await performScan(url, {
                tavilyApiKey: process.env.TAVILY_API_KEY
            });

            if (scanResult.error) {
                console.error('[Scanner API] performScan Error:', scanResult.error);
                return NextResponse.json({ error: scanResult.error }, { status: 500 });
            }

            console.log(`[Scanner API] Scan completed. Found ${scanResult.leads?.length || 0} leads.`);

            // PERSISTENCE LOGIC: If the user is Pro or in Trial, save these leads to their dashboard!
            if (user && (isPro || isInTrial)) {
                try {
                    const leadsToSave = scanResult.leads.map((lead: any) => ({
                        user_id: user.id,
                        title: lead.title,
                        subreddit: lead.subreddit,
                        url: lead.url,
                        status: 'scanner',
                        match_score: 95, // Scanner leads are high-intent
                        is_saved: false
                    }));

                    if (leadsToSave.length > 0) {
                        const { error: insertError } = await supabase
                            .from('monitored_leads')
                            .insert(leadsToSave);
                        
                        if (insertError) {
                            console.error('[Scanner API] Persistence failed:', insertError.message);
                        } else {
                            console.log(`[Scanner API] Persisted ${leadsToSave.length} leads to monitored_leads.`);
                        }
                    }
                } catch (persistErr: any) {
                    console.error('[Scanner API] Lead persistence catch:', persistErr.message);
                }
            }

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
