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

        // 1. Save or Create Profile
        const { TRIAL_DAYS } = await import('@/lib/constants');
        const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email,
                description,
                keywords,
                onboarding_completed: true,
                website_url: url,
                trial_ends_at: trialEndsAt
            });

        if (updateError) {
            console.error('[Onboarding] Profile save error:', updateError);
            throw new Error('Failed to save profile');
        }

        console.log(`[Onboarding] Successfully saved profile for ${user.id} with URL: ${url}`);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[Onboarding Complete Error]', error);
        // Log more details if it's a supabase error
        if (error.message) console.error('Error message:', error.message);
        if (error.details) console.error('Error details:', error.details);
        if (error.hint) console.error('Error hint:', error.hint);
        
        return NextResponse.json({ error: 'Failed to complete setup' }, { status: 500 });
    }
}
