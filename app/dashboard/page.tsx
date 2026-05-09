
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { Suspense } from 'react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import TawkToScript from '@/components/TawkToScript';

export default async function DashboardPage(props: { searchParams: Promise<{ search?: string }> }) {
    const searchParams = await props.searchParams;
    const initialSearch = searchParams.search || '';
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
        return redirect('/login');
    }

    // Fetch Profile (Settings + Billing + Effective Admin/Pro status)
    const [profileRes, accessStatusRes] = await Promise.all([
        supabase
            .from('profiles')
            .select('id, email, subscription_tier, trial_started_at, description, keywords, website_url, subreddits, user_metadata, onboarding_completed, has_initial_scan, daily_scans_used, reply_credits_used, is_admin')
            .eq('id', user.id)
            .single(),
        supabase
            .from('user_access_status')
            .select('*, subscription_tier:effective_tier')
            .eq('id', user.id)
            .single()
    ]);
    
    if (profileRes.error) console.error('[Dashboard] Profile fetch error:', profileRes.error);
    if (accessStatusRes.error) console.error('[Dashboard] Access status fetch error:', accessStatusRes.error);

    const profile = profileRes.data;
    const accessStatus = accessStatusRes.data;
    
    // Merge data: profiles has website_url, accessStatus has effective_tier
    // We prioritize active tiers from profiles (like lifetime) over the effective_tier from the view if needed
    const activeTiers = ['lifetime', 'growth', 'starter', 'professional'];
    const pTier = profile?.subscription_tier;
    const aTier = accessStatus?.subscription_tier; // this is the aliased effective_tier
    
    const finalTier = activeTiers.includes(pTier) ? pTier : (aTier || pTier);

    const mergedProfile = {
        ...(profile || {}),
        ...(accessStatus || {}),
        subscription_tier: finalTier
    };
    
    // Fetch Reports (Drafts + Sent) - Removed as Daily Reports feature is decommissioned
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reports: any[] = [];

    return (
        <main className="min-h-screen bg-transparent relative">
            {/* Mobile Restricted Overlay */}
            <div className="md:hidden fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d1117] text-white p-6">
                <div className="bg-orange-500/10 p-4 rounded-full mb-6 ring-1 ring-orange-500/20">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">Desktop Recommended</h2>
                <p className="text-gray-400 text-center mb-8 max-w-sm">
                    The RedLeads dashboard is designed for larger screens. For the best experience, please switch to a tablet or desktop device.
                </p>
                <div className="w-full max-w-sm p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                    <p className="text-sm text-gray-400">
                        Please log in from your computer to access the command center and manage your leads.
                    </p>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="hidden md:block w-full h-full">
                <Suspense fallback={
                    <div className="flex h-screen items-center justify-center bg-transparent text-orange-500">
                        <LoadingIcon className="w-10 h-10 text-orange-500" />
                    </div>
                }>
                    <DashboardClient 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        profile={mergedProfile as any} 
                        reports={reports || []} 
                        user={user}
                        initialSearch={initialSearch}
                    />
                </Suspense>
                <TawkToScript />
            </div>
        </main>
    );
}
