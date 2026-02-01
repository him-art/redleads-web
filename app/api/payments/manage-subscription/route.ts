import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';

/**
 * Generates a Dodo Payments Customer Portal session URL.
 * Redirects the user to manage their subscription, invoices, and payment methods.
 */
export async function GET(req: Request) {
    try {
        // 1. Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get user's Dodo Customer ID from profiles
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('dodo_customer_id')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.dodo_customer_id) {
            console.error('[Dodo Portal] Customer ID not found or error:', profileError);
            return NextResponse.json({ 
                error: 'No active subscription found to manage.' 
            }, { status: 404 });
        }

        // 3. Create Dodo Customer Portal Session using the SDK
        try {
            if (!dodo) {
                throw new Error('Dodo client not initialized');
            }

            const portalSession = await dodo.customers.customerPortal.create(profile.dodo_customer_id);

            if (portalSession.link) {
                return NextResponse.json({ url: portalSession.link });
            } else {
                throw new Error('Failed to generate portal link via SDK');
            }
        } catch (apiErr: any) {
            console.error('[Dodo Portal SDK Error]', apiErr);
            return NextResponse.json({ 
                error: 'Failed to access billing portal. Please ensure you have an active subscription and try again.' 
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('[Manage Subscription Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
