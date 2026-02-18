
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
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
    const [{ data: profile }, { data: accessStatus }] = await Promise.all([
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
    
    // Merge data: profiles has website_url, accessStatus has effective_tier
    const mergedProfile = {
        ...profile,
        ...accessStatus,
        subscription_tier: accessStatus?.subscription_tier || profile?.subscription_tier
    };
    
    // Fetch Reports (Drafts + Sent) - Removed as Daily Reports feature is decommissioned
    const reports: any[] = [];

    return (
        <main className="min-h-screen bg-[#050505]">
            <Suspense fallback={
                <div className="flex h-screen items-center justify-center bg-[#050505] text-orange-500">
                    <Loader2 className="animate-spin" size={40} />
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
