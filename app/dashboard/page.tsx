
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Fetch Profile (Settings + Billing + Effective Admin/Pro status)
    const { data: profile } = await supabase
        .from('user_access_status')
        .select('*, subscription_tier:effective_tier, is_admin:is_dev')
        .eq('id', user.id)
        .single();

    // Fetch Reports (Drafts + Sent)
    const { data: reports } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-[#111] text-white flex flex-col">
            <Navbar />
            <div className="flex-grow pt-24 px-6 pb-20">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl font-black tracking-tight mb-2">Dashboard</h1>
                        <p className="text-gray-500">Manage your daily reports and tracking settings.</p>
                    </header>
                    
                    <DashboardClient 
                        profile={profile} 
                        reports={reports || []} 
                        user={user}
                    />
                </div>
            </div>
            <Footer />
        </main>
    );
}
