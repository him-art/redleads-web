import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, MessageSquarePlus, Bookmark, ExternalLink, Navigation, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { createClient } from '@/lib/supabase/client';
import { useDashboardData, MonitoredLead } from '@/app/dashboard/DashboardDataContext';

export default function LiveFeed({ onViewArchive }: { onViewArchive: () => void }) {
    const { leads: allLeads, isLoading: isDataLoading, draftingLead, setDraftingLead, profile } = useDashboardData();
    const [leads, setLeads] = useState<MonitoredLead[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    
    // Use product context from profile
    const productContext = profile?.description || '';

    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        setIsMounted(true);
        // Map top 20 leads from context
        setLeads(allLeads.slice(0, 20));
    }, [allLeads]);

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
            



            <div className="p-0.5 surface-1 rounded-[2rem]">
                <div className="rounded-[1.8rem] overflow-hidden bg-void border border-white/5 relative shadow-void h-full">
                    {/* Subtle Edge Glow */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    
                    {leads.length > 0 ? (
                        <div className="divide-y divide-white/[0.03]">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {leads.map((lead) => (
                                    <motion.div
                                        key={lead.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                        className="relative group flex items-start gap-3 sm:gap-5 p-4 sm:p-5 hover:bg-white/[0.04] transition-all duration-500 border-b border-white/[0.03]"
                                    >
                                        <div className="flex flex-col items-center gap-2 pt-1 h-full min-w-[70px]">
                                            <div className={`px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${
                                                lead.match_category === 'High' 
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                                                    : 'bg-white/5 border-white/10 text-text-secondary/60'
                                            }`}>
                                                {lead.match_category || 'Medium'} Match
                                            </div>
                                        </div>

                                        <div className="flex-grow space-y-1 overflow-hidden">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-[9px] font-black text-ai bg-ai-muted px-2.5 py-1 rounded-full uppercase tracking-widest border border-ai/10">
                                                    r/{lead.subreddit}
                                                </span>
                                                <div suppressHydrationWarning className="flex items-center gap-1.5 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest">
                                                    <Clock size={10} className="text-text-secondary/30" />
                                                    <span suppressHydrationWarning>{(() => {
                                                        try {
                                                            const d = new Date(lead.created_at);
                                                            if (isNaN(d.getTime())) return '--:--';
                                                            return new Intl.DateTimeFormat('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            }).format(d);
                                                        } catch (e) {
                                                            return '--:--';
                                                        }
                                                    })()}</span>
                                                </div>
                                                {lead.has_responded && (
                                                    <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                        <CheckCircle2 size={10} /> Responded
                                                    </div>
                                                )}
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
                                                    className="px-4 py-2 rounded-xl bg-primary text-white border border-primary/20 text-[10px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2 group/btn shadow-[0_4px_15px_rgba(255,88,54,0.2)]"
                                                    title="Open Reply Generator"
                                                >
                                                    <Sparkles size={12} className="text-white group-hover/btn:rotate-12 transition-transform" />
                                                    Draft Intelligence
                                                </button>

                                                <button 
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        const newStatus = !lead.has_responded;
                                                        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, has_responded: newStatus } : l));
                                                        const { error } = await supabase.from('monitored_leads').update({ has_responded: newStatus }).eq('id', lead.id);
                                                        if (error) {
                                                            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, has_responded: !newStatus } : l));
                                                        }
                                                    }}
                                                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                                                        lead.has_responded 
                                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                                                            : 'bg-white/5 text-text-secondary hover:text-green-500 hover:bg-green-500/10'
                                                    }`}
                                                    title={lead.has_responded ? "Mark as Unresponded" : "Mark as Responded"}
                                                >
                                                    <CheckCircle2 size={14} />
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
                                <h4 className="text-text-secondary font-black text-xs tracking-[0.2em] uppercase">
                                    {profile?.keywords?.length > 0 ? 'Monitoring communities 24/7' : 'Tracking Setup Incomplete'}
                                </h4>
                                <p className="text-[9px] text-text-secondary max-w-[240px] mx-auto leading-relaxed uppercase font-black tracking-widest opacity-60">
                                    {profile?.keywords?.length > 0 
                                        ? 'Live leads will be displayed here as they are discovered.' 
                                        : 'Please configure your keywords and website in settings to start monitoring.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
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
