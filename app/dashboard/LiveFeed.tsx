'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, ExternalLink, Clock, MoreHorizontal, Bookmark } from 'lucide-react';
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
        // 1. Initial Fetch
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

        // 2. Real-time Subscription
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
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Radar className="animate-spin text-orange-500/20" size={48} />
                <p className="text-gray-500 font-medium animate-pulse">Scanning the horizon...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Live Lead Stream</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                    Recent Matches
                </span>
            </div>

            <div className="grid gap-3">
                <AnimatePresence mode="popLayout">
                    {leads.length > 0 ? (
                        leads.map((lead) => (
                            <motion.div
                                key={lead.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white/[0.03] border border-white/5 hover:border-orange-500/30 rounded-2xl p-4 transition-all hover:bg-white/[0.05]"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full uppercase">
                                                r/{lead.subreddit}
                                            </span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                                            {lead.title}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button 
                                            onClick={async () => {
                                                const newStatus = !lead.is_saved;
                                                // Optimistic UI update
                                                setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_saved: newStatus } : l));
                                                const { error } = await supabase.from('monitored_leads').update({ is_saved: newStatus }).eq('id', lead.id);
                                                if (error) {
                                                    console.error('Error saving lead:', error);
                                                    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_saved: !newStatus } : l));
                                                    alert('Failed to save lead. Check console for details.');
                                                }
                                            }}
                                            className={`p-2 rounded-lg transition-all ${
                                                lead.is_saved 
                                                    ? 'bg-orange-500 text-white' 
                                                    : 'bg-white/5 text-gray-500 hover:text-white hover:bg-orange-500/20'
                                            }`}
                                        >
                                            <Bookmark size={16} fill={lead.is_saved ? "currentColor" : "none"} />
                                        </button>
                                        <a 
                                            href={lead.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-orange-500 transition-all"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                            <Radar className="mx-auto text-gray-700 mb-4" size={40} />
                            <h4 className="text-gray-400 font-bold mb-1 border-gray-400">No live leads yet</h4>
                            <p className="text-xs text-gray-600 max-w-[200px] mx-auto">
                                Once your Sentinel is running, matching posts will appear here automatically.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {leads.length > 0 && (
                <button 
                    onClick={onViewArchive}
                    className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-gray-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                    <MoreHorizontal size={14} />
                    View Archived Leads
                </button>
            )}
        </div>
    );
}
