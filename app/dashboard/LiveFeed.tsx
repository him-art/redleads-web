import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ExternalLink, Clock, Navigation, Bookmark, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MonitoredLead {
    id: string;
    title: string;
    subreddit: string;
    url: string;
    status: string;
    match_score: number;
    created_at: string;
    is_saved?: boolean;
}

export default function LiveFeed({ userId, onViewArchive }: { userId: string, onViewArchive: () => void }) {
    const [leads, setLeads] = useState<MonitoredLead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchLeads = async () => {
            const { data, error } = await supabase
                .from('monitored_leads')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                setLeads(data);
            }
            setIsLoading(false);
        };

        fetchLeads();

        const channel = supabase
            .channel('live-leads')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'monitored_leads',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newLead = payload.new as MonitoredLead;
                    setLeads((prev) => [newLead, ...prev].slice(0, 20));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative">
                    <div className="w-12 h-12 border border-orange-500/10 border-t-orange-500 rounded-full animate-spin" />
                    <Activity className="absolute inset-0 m-auto text-orange-500/50 animate-pulse" size={16} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Syncing Stream</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-md relative">
                {/* Subtle Edge Glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                
                {leads.length > 0 ? (
                    <div className="divide-y divide-white/[0.03]">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {leads.map((lead) => (
                                <motion.div
                                    key={lead.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                    className="relative group flex items-start gap-5 p-6 hover:bg-white/[0.03] transition-all duration-300"
                                >
                                    {/* Minimal Match Score Track */}
                                    <div className="flex flex-col items-center gap-2 pt-1 h-full">
                                        <div className="w-1.5 h-10 bg-white/5 rounded-full overflow-hidden relative">
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${lead.match_score * 100}%` }}
                                                className={`absolute bottom-0 w-full rounded-full transition-colors duration-500 ${
                                                    lead.match_score > 0.8 ? 'bg-orange-500/60' : lead.match_score > 0.5 ? 'bg-orange-500/30' : 'bg-gray-700'
                                                }`}
                                            />
                                        </div>
                                        <span className="text-[8px] font-mono font-bold text-gray-700 group-hover:text-orange-500/40 transition-colors">
                                            {Math.round(lead.match_score * 100)}%
                                        </span>
                                    </div>

                                    <div className="flex-grow space-y-2.5 overflow-hidden">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-[9px] font-black text-orange-500/80 bg-orange-500/5 px-2.5 py-1 rounded-full uppercase tracking-widest border border-orange-500/10">
                                                r/{lead.subreddit}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                                <Clock size={10} />
                                                {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        
                                        <a 
                                            href={lead.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="block text-sm font-bold text-gray-300 group-hover:text-white leading-relaxed tracking-tight transition-all"
                                        >
                                            {lead.title}
                                        </a>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-green-500/40" />
                                                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none">High Intent</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button 
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                const newStatus = !lead.is_saved;
                                                setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_saved: newStatus } : l));
                                                const { error } = await supabase.from('monitored_leads').update({ is_saved: newStatus }).eq('id', lead.id);
                                                if (error) {
                                                    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_saved: !newStatus } : l));
                                                }
                                            }}
                                            className={`p-2.5 rounded-xl transition-all duration-200 ${
                                                lead.is_saved 
                                                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20 scale-105' 
                                                    : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            <Bookmark size={14} fill={lead.is_saved ? "currentColor" : "none"} />
                                        </button>
                                        <a 
                                            href={lead.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-4">
                        <div className="relative inline-block">
                            <Activity className="mx-auto text-gray-800/50" size={32} />
                            <div className="absolute inset-0 bg-orange-500/5 blur-xl rounded-full" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-gray-500 font-black text-xs tracking-[0.2em] uppercase">Stream Standby</h4>
                            <p className="text-[9px] text-gray-600 max-w-[240px] mx-auto leading-relaxed uppercase font-black tracking-widest">
                                System monitoring communities
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {leads.length > 0 && (
                <button 
                    onClick={onViewArchive}
                    className="w-full py-4 group flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-all border border-white/5 rounded-2xl hover:bg-white/[0.02]"
                >
                    <Navigation size={12} className="rotate-90 text-gray-700 group-hover:text-orange-500 transition-colors" />
                    Open Observation Archive
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
            )}
        </div>
    );
}
