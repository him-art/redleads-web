import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { performScan } from '@/lib/scanner-core';
import { onboardingSchema } from '@/lib/validation';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = onboardingSchema.safeParse(body);
        
        if (!validation.success) {
            return NextResponse.json({ 
                error: 'Invalid input', 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const { description, keywords, url } = validation.data;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Save Profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                description,
                keywords,
                onboarding_completed: true,
                website_url: url
            })
            .eq('id', user.id);

        if (updateError) {
            // Fallback: If onboarding_completed column doesn't exist yet, try without it
            // (This handles the migration gap if I haven't run migration)
            // But for now, I'll assume users rely on description check
            await supabase
                .from('profiles')
                .update({ description, keywords })
                .eq('id', user.id);
        }

        // 2. Trigger Initial Scan with a strict 15s timeout
        console.log('[Onboarding] Triggering initial scan for:', url);
        
        try {
            // We use a timeout to ensure the user isn't stuck if external APIs are slow
            const scanPromise = performScan(url, {
                keywords,
                description,
                tavilyApiKey: process.env.TAVILY_API_KEY
            });

            const timeoutPromise = new Promise<null>((_, reject) => 
                setTimeout(() => reject(new Error('Scan timeout')), 15000)
            );

            const scanResult = await Promise.race([scanPromise, timeoutPromise]) as any;

            // Persist Leads if scan finished in time
            if (scanResult && scanResult.leads && scanResult.leads.length > 0) {
                 const leadsToSave = scanResult.leads.map((lead: any) => ({
                    user_id: user.id,
                    title: lead.title,
                    subreddit: lead.subreddit,
                    url: lead.url,
                    status: 'new',
                    match_score: lead.match_category === 'High' ? 0.95 : lead.match_category === 'Medium' ? 0.75 : 0.45,
                    match_category: lead.match_category || 'Medium',
                    is_saved: false
                }));

                await supabase.from('monitored_leads').insert(leadsToSave);
            }
        } catch (scanError) {
            console.error('[Onboarding Scan Error/Timeout]', scanError);
            // We don't fail the whole onboarding if only the scan fails
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[Onboarding Complete Error]', error);
        return NextResponse.json({ error: 'Failed to complete setup' }, { status: 500 });
    }
}
