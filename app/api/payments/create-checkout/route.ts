import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';
import { z } from 'zod';

const checkoutSchema = z.object({
    plan: z.enum(['scout', 'pro']).optional(),
});

/**
 * Creates a Dodo Payments checkout session for subscription upgrade.
 * Supports both Scout ($15/mo) and Pro ($29/mo) plans.
 */
export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request body
        const body = await req.json().catch(() => ({}));
        const result = checkoutSchema.safeParse(body);
        
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }
        
        const { plan = 'pro' } = result.data;

        // 3. Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, subscription_tier')
            .eq('id', user.id)
            .single();

        if (profile?.subscription_tier === plan) {
            return NextResponse.json({ error: 'Already on this plan' }, { status: 400 });
        }

        // 4. Select Product ID
        const productId = plan === 'scout' 
            ? process.env.DODO_PRODUCT_ID_SCOUT 
            : process.env.DODO_PRODUCT_ID_PRO || process.env.DODO_PRODUCT_ID;
        
        if (!productId) {
            console.error(`[Checkout] Product ID for ${plan} is not set`);
            return NextResponse.json({ 
                error: 'This plan is currently unavailable. Please contact support.',
            }, { status: 503 });
        }

        if (!dodo) {
            console.error('[Checkout] Dodo client not initialized.');
            return NextResponse.json({ error: 'Payment system error' }, { status: 503 });
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        const session = await dodo.checkoutSessions.create({
            customer: {
                email: profile?.email || user.email || '',
                name: profile?.email?.split('@')[0] || 'Customer',
            },
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1,
                }
            ],
            return_url: `${siteUrl}/dashboard?payment=success&plan=${plan}`,
            metadata: {
                user_id: user.id,
                plan: plan,
            },
        });

        console.log('[Checkout] Session created:', {
            id: session.session_id,
            has_url: !!session.checkout_url,
            raw_session: JSON.stringify(session)
        });

        const checkoutUrl = session.checkout_url;

        if (!checkoutUrl) {
            console.error('[Checkout] FAILED: Dodo did not return a checkout_url', session);
            return NextResponse.json({ 
                error: 'Dodo Payments did not return a checkout link. Please verify your product identifier is valid.' 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            checkout_url: checkoutUrl,
            session_id: session.session_id,
        });

    } catch (error: any) {
        console.error('[Checkout Error]', error);
        
        // Extract more details from the error
        const errorMessage = error?.message || 'Unknown error';
        const statusCode = error?.status || error?.statusCode || 500;
        
        // Log full error for debugging
        console.error('[Checkout Error Details]', {
            message: errorMessage,
            status: statusCode,
            body: error?.body,
            response: error?.response,
        });
        
        return NextResponse.json({ 
            error: `${statusCode} ${errorMessage}` 
        }, { status: 500 });
    }
}
