
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
    const { data: profile } = await supabase
        .from('user_access_status')
        .select('*, subscription_tier:effective_tier')
        .eq('id', user.id)
        .single();
    
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
                    profile={profile} 
                    reports={reports || []} 
                    user={user}
                    initialSearch={initialSearch}
                />
            </Suspense>
        </main>
    );
}
