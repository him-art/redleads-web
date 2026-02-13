
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
// Daily Reports components removed
// ConfigToggle removed
import { CheckCircle, XCircle, Send, Edit, Clock, Users, Activity } from 'lucide-react';
import TrendGraph from '@/components/admin/TrendGraph';


export default async function AdminDashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Server-Side Security Check: Is Admin?
    const { data: status } = await supabase
        .from('user_access_status')
        .select('is_admin')
        .eq('id', user.id)
        .single();
    
    if (!status?.is_admin) {
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

    const [
        { data: allProfiles },
        { data: workerStatuses },
        { data: recentEmails }
    ] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('worker_status').select('*'),
        supabase.from('email_logs').select('*').order('sent_at', { ascending: false }).limit(20)
    ]);

    const stats = {
        free: allProfiles?.filter(u => u.subscription_tier === 'free').length || 0,
        trial: allProfiles?.filter(u => !['pro', 'scout', 'professional'].includes(u.subscription_tier || '')).length || 0,
        pro: allProfiles?.filter(u => ['pro', 'scout', 'professional'].includes(u.subscription_tier || '')).length || 0,
        total: allProfiles?.length || 0
    };

    const scanner = workerStatuses?.find(w => w.id === 'scanner');
    const digest = workerStatuses?.find(w => w.id === 'digest');

    const isScannerActive = scanner?.last_heartbeat 
        ? (Date.now() - new Date(scanner.last_heartbeat).getTime()) < 1200000 // 20 mins (cron is 15)
        : false;



    // --- Graph Data Processing ---
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

    const getDaysArray = (start: Date, end: Date) => {
        const arr = [];
        for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt).toISOString().split('T')[0]);
        }
        return arr;
    };
    const days = getDaysArray(thirtyDaysAgo, new Date());

    const processTrendData = (items: any[], dateKey: string) => {
        const counts: Record<string, number> = {};
        items?.forEach(item => {
            const date = item[dateKey]?.split('T')[0];
            if (date) counts[date] = (counts[date] || 0) + 1;
        });
        return days.map(date => ({ date, value: counts[date] || 0 }));
    };

    const signupsTrend = processTrendData(allProfiles?.filter(p => p.created_at >= thirtyDaysAgoStr) || [], 'created_at');
    const totalSignupsPeriod = allProfiles?.filter(p => p.created_at >= thirtyDaysAgoStr).length || 0;

    return (
        <main className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-10 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <CheckCircle className="text-orange-500" size={24} />
                             <h1 className="text-4xl font-black tracking-tighter uppercase italic">HQ Command</h1>
                        </div>
                        <p className="text-gray-500 font-medium">Global Operations Intelligence • {new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        {[
                            { label: 'Growth', count: stats.pro, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                            { label: 'Trials', count: stats.trial, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                            { label: 'Total Intel', count: stats.total, color: 'text-white', bg: 'bg-white/5', bold: true }
                        ].map((s, i) => (
                            <div key={i} className={`px-6 py-4 rounded-3xl border border-white/5 ${s.bg} min-w-[120px]`}>
                                <span className={`block text-3xl font-black ${s.color}`}>{s.count}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Users & Emails */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* 0. Trend Graphs */}
                        <section className="grid grid-cols-1 gap-6">
                            <TrendGraph 
                                title="New Users" 
                                data={signupsTrend} 
                                total={totalSignupsPeriod} 
                                color="#3b82f6" // Blue
                            />
                        </section>

                        {/* 1. User intelligence list */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2">
                                <Users size={14} /> Agent Manifest
                            </h2>
                            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Identity</th>
                                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Sector (Tier)</th>
                                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Last Pulse</th>
                                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Activity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {allProfiles?.slice(0, 10).map((p) => (
                                                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{p.email}</span>
                                                            <span className="text-[10px] text-gray-600 font-medium">UID: {p.id.slice(0, 8)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                            p.subscription_tier === 'pro' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                            p.subscription_tier === 'scout' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                            'bg-white/5 text-gray-500 border border-white/5'
                                                        }`}>
                                                            {p.subscription_tier || 'Trial'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] text-gray-500 font-medium">
                                                            {p.last_scan_at ? new Date(p.last_scan_at).toLocaleTimeString() : 'Standby'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                                                            <span className="text-xs text-gray-400 font-bold">{p.scan_count || 0} scans</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">View All Operating Agents</button>
                                </div>
                            </div>
                        </section>
                        
                        {/* 2. Email Transmission Logs */}
                        <section className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2">
                                <Send size={14} /> Transmission Feed
                            </h2>
                            <div className="space-y-3">
                                {recentEmails?.length === 0 ? (
                                    <div className="p-10 border border-dashed border-white/5 rounded-3xl text-center">
                                        <p className="text-gray-600 uppercase font-black text-[10px] tracking-widest">No transmissions logged in this cycle</p>
                                    </div>
                                ) : (
                                    recentEmails?.map((log) => (
                                        <div key={log.id} className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-orange-500/10 transition-colors">
                                                    <Edit size={16} className="text-gray-500 group-hover:text-orange-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-white">{log.to_email}</p>
                                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Subject: {log.subject}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-500 font-black block mb-1">
                                                    {new Date(log.sent_at).toLocaleTimeString()}
                                                </span>
                                                {log.context?.leads && (
                                                    <span className="text-[9px] text-orange-500/60 font-black uppercase tracking-tighter">
                                                        {log.context.leads.length} Leads Attached
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: System Status & Vitals */}
                    <div className="lg:col-span-4 space-y-10">
                         {/* Radar Health */}
                         <section className="bg-[#0A0A0A] rounded-[2rem] border border-white/5 p-8 space-y-8 sticky top-12">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600">Vital Signs</h3>
                                <p className="text-2xl font-black italic">Systems Active</p>
                            </div>

                            <div className="space-y-4">
                                {/* SCANNER STATUS */}
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                     <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Scanner Radar</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${isScannerActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                            <span className={`text-[10px] font-black uppercase ${isScannerActive ? 'text-green-500' : 'text-red-500'}`}>
                                                {isScannerActive ? 'Online' : 'Signal Lost'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-600 uppercase">Last Pulse</p>
                                            <p className="text-xs font-bold text-gray-300">
                                                {scanner?.last_heartbeat ? new Date(scanner.last_heartbeat).toLocaleTimeString() : '---'}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-600 uppercase">Cycle Result</p>
                                            <p className="text-xs font-bold text-orange-500">
                                                {scanner?.meta?.last_scan_counts?.leads || 0} Leads Found
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* DIGEST STATUS */}
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                     <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Digest Comms</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                                            <span className="text-[10px] font-black uppercase text-blue-500/70">Scheduled</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-600 uppercase">Last Op</p>
                                            <p className="text-xs font-bold text-gray-300">
                                                {digest?.last_heartbeat ? new Date(digest.last_heartbeat).toLocaleDateString() : '---'}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-600 uppercase">Transmissions</p>
                                            <p className="text-xs font-bold text-blue-400">
                                                {digest?.meta?.last_run_sent_count || 0} Sent
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Database</p>
                                    <p className="text-xs font-black text-green-500 uppercase tracking-widest">Secure</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Neural API</p>
                                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Active</p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-orange-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20">
                                <Activity size={16} /> Broadcast System Pulse
                            </button>
                         </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
