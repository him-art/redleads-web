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
        const { createClient, createAdminClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const adminSupabase = createAdminClient();

        const { data: { user } } = await supabase.auth.getUser();

        // Execution Logic: SCAN
        if (action === 'SCAN') {
            if (!url) return NextResponse.json({ error: 'No URL' }, { status: 400 });

            const remoteIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'localhost';
            
            let isInTrial = false;

            if (!user) {
                return NextResponse.json({ 
                    error: 'Authentication required. Please sign in to start your free trial.', 
                    code: 'AUTH_REQUIRED' 
                }, { status: 401 });
            }

            // Using Admin Supabase to bypass RLS/Triggers for reading usage
            const { data: profile } = await adminSupabase
                .from('profiles')
                .select('scan_count, last_scan_at, subscription_tier, trial_ends_at, scan_allowance, created_at, keywords, description')
                .eq('id', user.id)
                .single();
            
            const isPaid = profile?.subscription_tier === 'growth' || profile?.subscription_tier === 'starter' || profile?.subscription_tier === 'lifetime';
            
            // Get trial status - auto-calculate if trial_ends_at is not set
            const trialEndsAt = profile?.trial_ends_at 
                ? new Date(profile.trial_ends_at) 
                : (profile?.created_at ? new Date(new Date(profile.created_at).getTime() + 3 * 24 * 60 * 60 * 1000) : null);
            isInTrial = trialEndsAt ? trialEndsAt > new Date() : false;

            if (!(isPaid || isInTrial)) {
                return NextResponse.json({ 
                    error: 'Your trial has ended. Please upgrade to a paid plan to continue automated scanning.', 
                    code: 'PAYWALL_REQUIRED' 
                }, { status: 403 });
            }

            const today = new Date().toDateString();
            const lastDay = profile?.last_scan_at ? new Date(profile.last_scan_at).toDateString() : '';
            
            // Usage Guardrails (SaaS 2.0)
            const dailyLimit = profile?.scan_allowance || (
                profile?.subscription_tier === 'lifetime' ? 5 : 
                profile?.subscription_tier === 'growth' ? 5 : 
                profile?.subscription_tier === 'starter' ? 2 : 
                5 // Trial default
            );

            // Effective count resets if it's a new day
            let effectiveCount = (today === lastDay) ? (profile?.scan_count || 0) : 0;

            if (effectiveCount >= dailyLimit) {
                const msg = isPaid 
                    ? `Daily scan limit (${dailyLimit}) reached. Upgrade to increase your limit or check back tomorrow!` 
                    : `You have used your ${dailyLimit} daily trial scans. Upgrade for fresh scans every day!`;
                return NextResponse.json({ error: msg, code: 'DAILY_LIMIT_REACHED' }, { status: 403 });
            }

            // Using Admin Supabase to bypass RLS/Triggers for updating usage
            const { error: updateError } = await adminSupabase
                .from('profiles')
                .update({ 
                    scan_count: (today === lastDay) ? (profile?.scan_count || 0) + 1 : 1,
                    last_scan_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('[Scanner] Failed to update scan count (Admin Mode):', updateError);
            }

            const scanResult = await performScan(url, {
                tavilyApiKey: process.env.TAVILY_API_KEY,
                keywords: profile?.keywords,
                description: profile?.description
            });

            if (scanResult.error) {
                console.error('[Scanner API] performScan Error:', scanResult.error);
                return NextResponse.json({ error: scanResult.error }, { status: 500 });
            }

            console.log(`[Scanner API] Scan completed. Found ${scanResult.leads?.length || 0} leads.`);

            // PERSISTENCE LOGIC: If the user is Paid (Starter/Growth) or in Trial, save these leads!
            if (user && (isPaid || isInTrial)) {
                try {
                    const leadsToSave = scanResult.leads.map((lead: any) => ({
                        user_id: user.id,
                        title: lead.title,
                        subreddit: lead.subreddit,
                        url: lead.url,
                        body_text: lead.body_text || '',
                        status: 'scanner',
                        match_score: lead.match_category === 'High' ? 0.95 : lead.match_category === 'Medium' ? 0.75 : 0.45,
                        match_category: lead.match_category || 'Medium',
                        is_saved: false
                    }));

                    console.log(`[Scanner API] Saving ${leadsToSave.length} leads for user ${user.id} (Paid: ${isPaid}, Trial: ${isInTrial})`);

                    if (leadsToSave.length > 0) {
                        // Using Admin Supabase to bypass RLS for lead persistence
                        const { error: insertError } = await adminSupabase
                            .from('monitored_leads')
                            .insert(leadsToSave);
                        
                        if (insertError) {
                            console.error('[Scanner API] Persistence failed (Admin Mode):', insertError.message);
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
    } catch (error: any) {
        console.error('[Scanner API Error]:', error);
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred while scanning. Please try again later.' }, 
            { status: 500 }
        );
    }
}
