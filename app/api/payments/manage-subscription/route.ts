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

        // 3. Create Dodo Customer Portal Session
        // Note: The Dodo SDK might have a different method name or we might need a direct fetch 
        // if it's not in the SDK yet. Based on research, it's a POST to /customers/{id}/customer-portal/session
        
        // Let's try to use the SDK if available, or fetch as fallback
        try {
            // Check if portal sessions are in the SDK (hypothetical SDK structure)
            // If not, we use the standard fetch against the Dodo API
            const response = await fetch(`https://${process.env.NODE_ENV === 'production' ? 'live' : 'test'}.dodopayments.com/customers/${profile.dodo_customer_id}/customer-portal/session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.DODO_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.link) {
                return NextResponse.json({ url: data.link });
            } else {
                throw new Error(data.message || 'Failed to generate portal link');
            }
        } catch (apiErr: any) {
            console.error('[Dodo Portal API Error]', apiErr);
            return NextResponse.json({ error: 'Failed to access billing portal. Please try again later.' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('[Manage Subscription Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
