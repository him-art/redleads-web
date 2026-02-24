
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { Suspense } from 'react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function DashboardPage(props: { searchParams: Promise<{ search?: string }> }) {
    const searchParams = await props.searchParams;
    const initialSearch = searchParams.search || '';
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Fetch Profile (Settings + Billing + Effective Admin/Pro status)
    const [profileRes, accessStatusRes] = await Promise.all([
        supabase
            .from('profiles')
            .select('*')
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
    const reports: any[] = [];

    return (
        <main className="min-h-screen bg-[#050505]">
            <Suspense fallback={
                <div className="flex h-screen items-center justify-center bg-[#050505] text-orange-500">
                    <LoadingIcon className="w-10 h-10 text-orange-500" />
                </div>
            }>
                <DashboardClient 
                    profile={mergedProfile as any} 
                    reports={reports || []} 
                    user={user}
                    initialSearch={initialSearch}
                />
            </Suspense>
        </main>
    );
}
