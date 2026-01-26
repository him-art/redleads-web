
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DraftCard from './DraftCard';
import CreateDraft from './CreateDraft';
import ConfigToggle from '@/app/admin/ConfigToggle';
import { CheckCircle, XCircle, Send, Edit, Clock } from 'lucide-react';

export default async function AdminDashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Server-Side Security Check: Is Dev Admin?
    const { data: status } = await supabase
        .from('user_access_status')
        .select('is_dev')
        .eq('id', user.id)
        .single();
    
    if (!status?.is_dev) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">403 Forbidden</h1>
                    <p className="text-gray-400">You do not have permission to access the Command Center.</p>
                    <Link href="/" className="mt-8 inline-block text-orange-500 hover:underline">Go Home</Link>
                </div>
            </div>
        );
    }

    // Fetch Drafts
    const { data: drafts } = await supabase
        .from('email_drafts')
        .select(`
            *,
            profiles:user_id (email, website_url)
        `)
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

    // Fetch Stats
    // Fetch Stats & Users for Dropdown
    const { data: allUsers } = await supabase
        .from('profiles')
        .select('subscription_tier');

    const stats = {
        free: allUsers?.filter(u => u.subscription_tier === 'free').length || 0,
        trial: allUsers?.filter(u => u.subscription_tier === 'trial').length || 0,
        pro: allUsers?.filter(u => u.subscription_tier === 'pro').length || 0,
        total: allUsers?.length || 0
    };

    const { data: users } = await supabase
        .from('profiles')
        .select('*');

    // Fetch Statuses
    const { data: worker } = await supabase
        .from('worker_status')
        .select('*')
        .eq('id', 'sentinel')
        .single();
    
    const { data: approvalSetting } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'report_approval_required')
        .single();

    const isWorkerActive = worker?.last_heartbeat 
        ? (new Date().getTime() - new Date(worker.last_heartbeat).getTime()) < 600000 // 10 mins
        : false;

    return (
        <main className="min-h-screen bg-[#111] text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/10 pb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">Command Center</h1>
                        <p className="text-gray-500 text-sm">Operation RedLeads: Overview of all sectors</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[100px]">
                            <span className="block text-xl font-black">{stats.free}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Free Users</span>
                        </div>
                        <div className="px-5 py-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center min-w-[100px]">
                            <span className="block text-xl font-black text-blue-400">{stats.trial}</span>
                            <span className="text-[10px] text-blue-500/70 uppercase font-bold tracking-widest">Trial Users</span>
                        </div>
                        <div className="px-5 py-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-center min-w-[100px]">
                            <span className="block text-xl font-black text-orange-500">{stats.pro}</span>
                            <span className="text-[10px] text-orange-500/70 uppercase font-bold tracking-widest">Pro Users</span>
                        </div>
                        <div className="px-5 py-3 bg-orange-500 rounded-2xl text-center min-w-[80px] flex flex-col justify-center">
                            <span className="block text-xl font-black text-black leading-none">{stats.total}</span>
                            <span className="text-[8px] text-black/60 uppercase font-black tracking-tighter">Total</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Drafts */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Clock className="text-orange-500" size={20} />
                            Pending Approval
                        </h2>

                        {drafts?.length === 0 ? (
                            <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <p className="text-gray-500">All clear! No drafts waiting for review.</p>
                            </div>
                        ) : (
                            drafts?.map((draft: any) => (
                                <DraftCard key={draft.id} draft={draft} />
                            ))
                        )}
                    </div>

                    {/* Sidebar: Quick Actions & Health */}
                    <div className="space-y-6">
                         <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                            <CreateDraft users={users || []} />
                         </div>

                         {/* System Settings */}
                         <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4">System Settings</h3>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <span className="text-sm font-bold">Manual Review Mode</span>
                                <ConfigToggle 
                                    settingKey="report_approval_required" 
                                    initialValue={approvalSetting?.value === true || approvalSetting?.value === 'true'} 
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 px-1">
                                If enabled, new daily reports will be saved as drafts for your review.
                            </p>
                         </div>

                         {/* System Status */}
                         <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold mb-4">System Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Sentinel Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isWorkerActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className={`font-bold ${isWorkerActive ? 'text-green-500' : 'text-red-500'}`}>
                                            {isWorkerActive ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Last Pulse</span>
                                    <span className="text-gray-300 font-medium">
                                        {worker?.last_heartbeat ? new Date(worker.last_heartbeat).toLocaleTimeString() : 'Never'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Active AI Keys</span>
                                    <span className="text-orange-500 font-bold">
                                        {worker?.active_keys_count || 0} detected
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-white/5 pt-3">
                                    <span className="text-gray-500">Database</span>
                                    <span className="text-green-500 font-bold">Healthy</span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </main>
    );
}



