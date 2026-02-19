import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, MessageSquarePlus, Bookmark, ExternalLink, Navigation, ChevronRight } from 'lucide-react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { createClient } from '@/lib/supabase/client';
import { useDashboardData, MonitoredLead } from '@/app/dashboard/DashboardDataContext';

export default function LiveFeed({ userId, onViewArchive }: { userId: string, onViewArchive: () => void }) {
    const { leads: allLeads, isLoading: isDataLoading, draftingLead, setDraftingLead } = useDashboardData();
    const [leads, setLeads] = useState<MonitoredLead[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    
    // Local product Context
    const [productContext, setProductContext] = useState('');

    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        setIsMounted(true);
        // Map top 20 leads from context
        setLeads(allLeads.slice(0, 20));
    }, [allLeads]);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase.from('profiles').select('description').eq('id', userId).single();
            if (data) setProductContext(data.description);
        };
        fetchProfile();
    }, [userId]);

    if (isDataLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <LoadingIcon className="w-12 h-12 text-orange-500" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-text-secondary">Syncing Stream</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            



            <div className="rounded-3xl overflow-hidden glass-panel relative">
                {/* Subtle Edge Glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                
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
                                    className="relative group flex items-start gap-3 sm:gap-5 p-3 sm:p-4 hover:bg-white/[0.03] transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center gap-2 pt-1 h-full min-w-[60px]">
                                        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary whitespace-nowrap">
                                                {lead.match_category || 'Medium'} Match
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-grow space-y-1 overflow-hidden">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-[9px] font-black text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                                                r/{lead.subreddit}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-secondary/50 uppercase tracking-widest">
                                                <Clock size={10} />
                                                {(() => {
                                                    try {
                                                        if (!isMounted) return '--:--';
                                                        const d = new Date(lead.created_at);
                                                        if (isNaN(d.getTime())) return '--:--';
                                                        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                    } catch (e) {
                                                        return '--:--';
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                        
                                        <a 
                                            href={(lead.url.startsWith('http') ? lead.url : `https://${lead.url}`)}
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="block text-xs sm:text-sm font-bold text-text-secondary group-hover:text-text-primary leading-relaxed tracking-tight transition-all"
                                        >
                                            {lead.title}
                                        </a>

                                        <div className="flex items-center gap-1.5 transition-all duration-300 pt-1">
                                            {/* ACTION: DRAFT REPLY */}
                                            <button
                                                onClick={() => setDraftingLead(lead)}
                                                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground border border-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-1.5 group/btn"
                                                title="Open Reply Generator"
                                            >
                                                <MessageSquarePlus size={12} className="text-primary-foreground" />
                                                Draft Reply
                                            </button>

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
                                                className={`p-1.5 rounded-lg transition-all duration-200 ${
                                                    lead.is_saved 
                                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                                                        : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'
                                                }`}
                                            >
                                                <Bookmark size={14} fill={lead.is_saved ? 'currentColor' : 'none'} />
                                            </button>
                                            <a 
                                                href={(lead.url.startsWith('http') ? lead.url : `https://${lead.url}`)}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-4">
                        <div className="relative inline-block">
                            <Activity className="mx-auto text-text-secondary/30" size={32} />
                            <div className="absolute inset-0 bg-primary/5 rounded-full" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-text-secondary font-black text-xs tracking-[0.2em] uppercase">monitoring communities 24/7</h4>
                            <p className="text-[9px] text-text-secondary max-w-[240px] mx-auto leading-relaxed uppercase font-black tracking-widest opacity-60">
                                Live leads will be displayed here
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {leads.length > 0 && (
                <button 
                    onClick={onViewArchive}
                    className="w-full py-4 group flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-all border border-white/5 rounded-2xl hover:bg-white/[0.02]"
                >
                    <Navigation size={12} className="rotate-90 text-text-secondary/30 group-hover:text-primary transition-colors" />
                    Open Observation Archive
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </button>
            )}
        </div>
    );
}
