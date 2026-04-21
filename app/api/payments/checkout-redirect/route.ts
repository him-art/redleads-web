import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';
import { cookies } from 'next/headers';

const PLAN_PRODUCT_MAP: Record<string, (interval: string) => string | undefined> = {
    starter: (i) => i === 'annual' ? process.env.DODO_PRODUCT_ID_STARTER_ANNUAL : process.env.DODO_PRODUCT_ID_STARTER,
    growth:  (i) => i === 'annual' ? process.env.DODO_PRODUCT_ID_GROWTH_ANNUAL  : process.env.DODO_PRODUCT_ID_GROWTH,
    lifetime: ()  => process.env.DODO_PRODUCT_ID_LTD,
};

/**
 * GET /api/payments/checkout-redirect
 * 
 * Server-side fast-track: reads the rl_checkout_intent cookie set by Pricing.tsx,
 * creates a Dodo checkout session, and immediately redirects the user to the 
 * payment page — no client-side JS round-trip needed.
 * 
 * Called by /auth/callback after Google OAuth to eliminate the landing page flash.
 */
export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const fallback = `${siteUrl}/#pricing`;

    // 1. Read intent from the cookie
    const intentCookie = cookieStore.get('rl_checkout_intent')?.value;
    const { searchParams } = new URL(req.url);

    let plan = searchParams.get('plan') || (intentCookie ? intentCookie.split(':')[0] : null);
    let interval = searchParams.get('interval') || (intentCookie ? intentCookie.split(':')[1] : null) || 'monthly';

    // 2. Clear the cookie immediately (prevent re-trigger on refresh)
    const response = NextResponse.redirect(fallback); // placeholder — will be overridden
    
    if (!plan || !PLAN_PRODUCT_MAP[plan]) {
        console.warn('[Checkout Redirect] No valid plan found, falling back to pricing page.');
        return NextResponse.redirect(fallback);
    }

    // 3. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(`${siteUrl}/login`);
    }

    // 4. Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('email, subscription_tier')
        .eq('id', user.id)
        .single();

    // 5. Resolve Product ID
    const productId = PLAN_PRODUCT_MAP[plan](interval);

    if (!productId) {
        console.error(`[Checkout Redirect] No product ID for plan=${plan} interval=${interval}`);
        return NextResponse.redirect(fallback);
    }

    if (!dodo) {
        console.error('[Checkout Redirect] Dodo client not initialized.');
        return NextResponse.redirect(fallback);
    }

    // 6. Create Dodo checkout session and redirect
    try {
        const session = await dodo.checkoutSessions.create({
            customer: {
                email: profile?.email || user.email || '',
                name: profile?.email?.split('@')[0] || 'Customer',
            },
            product_cart: [{ product_id: productId, quantity: 1 }],
            return_url: `${siteUrl}/dashboard?payment=success&plan=${plan}`,
            metadata: { user_id: user.id, plan },
        });

        if (session.checkout_url) {
            const redirect = NextResponse.redirect(session.checkout_url);
            // Clear the intent cookie on the outgoing response
            redirect.cookies.set('rl_checkout_intent', '', { path: '/', maxAge: 0 });
            return redirect;
        }
    } catch (err) {
        console.error('[Checkout Redirect Error]:', err);
    }

    return NextResponse.redirect(fallback);
}
