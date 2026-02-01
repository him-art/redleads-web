import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';
import { z } from 'zod';

const checkoutSchema = z.object({
    plan: z.enum(['scout', 'growth']).optional(),
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
        
        const { plan = 'growth' } = result.data;

        // 3. Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, subscription_tier')
            .eq('id', user.id)
            .single();

        if (profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'growth') {
            return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
        }

        // 4. Standard Flow (Dodo Payments)
        const productId = process.env.DODO_PRODUCT_ID;
        
        if (!productId) {
            console.error('[Checkout] DODO_PRODUCT_ID is not set');
            return NextResponse.json({ 
                error: 'Payment system not configured. Please contact support.',
            }, { status: 503 });
        }

        if (!dodo) {
            const hasKey = !!process.env.DODO_API_KEY;
            console.error('[Checkout] Dodo client not initialized.', { hasKey });
            return NextResponse.json({ 
                error: hasKey ? 'Payment system initialization failed.' : 'DODO_API_KEY is missing in environment.',
            }, { status: 503 });
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
                plan: plan || 'growth',
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
