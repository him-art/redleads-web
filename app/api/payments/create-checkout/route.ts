import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';
import { BETA_MODE, BETA_SEAT_LIMIT } from '@/lib/constants';
import { z } from 'zod';

const checkoutSchema = z.object({
    plan: z.enum(['scout', 'growth']).optional(),
    surveyResponses: z.record(z.string(), z.any()).optional(),
});

/**
 * Creates a Dodo Payments checkout session for subscription upgrade.
 * Supports both Scout ($9/mo) and Growth ($19/mo) plans.
 */
export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request body ONCE
        const body = await req.json().catch(() => ({}));
        const result = checkoutSchema.safeParse(body);
        
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }
        
        const { plan = 'growth', surveyResponses } = result.data;

        // 3. Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, subscription_tier')
            .eq('id', user.id)
            .single();

        if (profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'growth') {
            return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
        }

        // 4. Public Beta Mode Logic
        if (BETA_MODE) {
            // Check current beta user count
            const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('is_beta_user', true);
            
            if (count !== null && count >= BETA_SEAT_LIMIT) {
                return NextResponse.json({ error: 'Beta is full! Sign up for the waitlist.' }, { status: 403 });
            }

            if (!surveyResponses || Object.keys(surveyResponses).length === 0) {
                return NextResponse.json({ error: 'Please complete the survey to unlock Beta access.' }, { status: 400 });
            }

            // Upgrade user using ADMIN client to bypass RLS
            const adminSupabase = createAdminClient();
            const { error: updateError } = await adminSupabase
                .from('profiles')
                .update({ 
                    subscription_tier: 'pro',
                    is_beta_user: true,
                    beta_survey_responses: surveyResponses
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('[Beta Upgrade Error]', updateError);
                return NextResponse.json({ error: 'Failed to activate Beta access' }, { status: 500 });
            }

            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            return NextResponse.json({ 
                beta_success: true,
                message: 'Welcome to the inner circle! You are officially in the Beta.',
                redirect_url: `${siteUrl}/dashboard?payment=success&beta=true`
            });
        }

        // 5. Standard Flow (Dodo Payments)
        const productId = plan === 'scout' 
            ? process.env.DODO_PRODUCT_ID_SCOUT 
            : process.env.DODO_PRODUCT_ID;

        const finalProductId = productId || process.env.DODO_PRODUCT_ID;
        
        if (!finalProductId) {
            console.error('[Dodo] Missing DODO_PRODUCT_ID');
            return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        const session = await dodo.subscriptions.create({
            billing: {
                city: 'Unknown',
                country: 'US',
                state: 'Unknown',
                street: 'Unknown',
                zipcode: '00000',
            },
            customer: {
                email: profile?.email || user.email || '',
                name: profile?.email?.split('@')[0] || 'Customer',
            },
            product_id: finalProductId,
            quantity: 1,
            return_url: `${siteUrl}/dashboard?payment=success&plan=${plan}`,
            metadata: {
                user_id: user.id,
                plan: plan || 'growth',
            },
        });

        return NextResponse.json({ 
            checkout_url: session.payment_link,
            subscription_id: session.subscription_id,
        });

    } catch (error: any) {
        console.error('[Checkout Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
