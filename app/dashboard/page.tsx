
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
        <main className="min-h-screen bg-[#111] text-white flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 px-6 pb-20">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-black tracking-tight mb-2">Dashboard</h1>
                        <p className="text-gray-500">Manage your tracking settings and view lead history.</p>
                    </header>
                    
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                            <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Initializing Terminal...</p>
                        </div>
                    }>
                        <DashboardClient 
                            profile={profile} 
                            reports={reports || []} 
                            user={user}
                            initialSearch={initialSearch}
                        />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </main>
    );
}
