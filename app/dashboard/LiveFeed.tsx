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
            <div className="border border-white/10 rounded-[2rem] overflow-hidden bg-black/40">
                {/* Attached Header */}
                <div className="flex items-center justify-between p-6 bg-white/[0.02] border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Radar className="text-orange-500" size={18} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Live Lead Stream</h3>
                        <span className="bg-white/10 text-[10px] px-2 py-0.5 rounded-full text-gray-500 font-bold">RECENT</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>

                <div className="bg-black/20">
                    <AnimatePresence mode="popLayout">
                        {leads.length > 0 ? (
                            leads.map((lead) => (
                                <motion.div
                                    key={lead.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex gap-4 group"
                                >
                                    <div className="flex-grow space-y-1 overflow-hidden">
                                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500">
                                            <span className="text-orange-500">r/{lead.subreddit}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <a 
                                            href={lead.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="block text-sm font-medium text-gray-200 group-hover:text-white leading-snug line-clamp-2"
                                        >
                                            {lead.title}
                                        </a>
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
                                            className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                                lead.is_saved 
                                                    ? 'opacity-100 bg-orange-500 text-white' 
                                                    : 'bg-white/5 text-gray-500 hover:text-white hover:bg-orange-500/20'
                                            }`}
                                        >
                                            <Bookmark size={14} fill={lead.is_saved ? "currentColor" : "none"} />
                                        </button>
                                        <a 
                                            href={lead.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-orange-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center">
                                <Radar className="mx-auto text-gray-700 mb-4 animate-pulse" size={40} />
                                <h4 className="text-gray-400 font-bold mb-1">Scanning for leads...</h4>
                                <p className="text-xs text-gray-600 max-w-[200px] mx-auto">
                                    Your Sentinel is active and looking for matches.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {leads.length > 0 && (
                <button 
                    onClick={onViewArchive}
                    className="w-full py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                    <MoreHorizontal size={14} />
                    View Archived History
                </button>
            )}
        </div>
    );
}
