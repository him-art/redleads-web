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
        <div className="space-y-6">
            {leads.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {leads.map((lead, i) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 30,
                                    delay: i * 0.05 
                                }}
                                className="relative group"
                            >
                                {/* The Glass Card */}
                                <div className="p-0.5 surface-1 rounded-[2rem] transition-all duration-700 group-hover:scale-[1.01]">
                                    <div className="relative overflow-hidden rounded-[1.8rem] bg-[#0c0c0c] border border-white/[0.08] backdrop-blur-xl transition-all duration-500 group-hover:border-white/15 group-hover:bg-[#0c0c0c]/80">
                                        
                                        <div className="flex flex-col sm:flex-row items-stretch gap-6 p-6 sm:p-8">
                                            {/* Left Column: Match Status & Metadata */}
                                            <div className="flex flex-col items-center sm:items-start gap-4 min-w-[100px]">
                                                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ${
                                                    lead.match_category === 'Best Match' 
                                                        ? 'bg-green-500/10 border-green-500/40 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20' 
                                                        : 'bg-white/5 border-white/10 text-text-secondary/60 group-hover:text-text-secondary'
                                                }`}>
                                                    {lead.match_category || 'Good Match'}
                                                </div>
                                                
                                                <div className="flex flex-col items-center sm:items-start gap-2">
                                                    <span className="text-[9px] font-black text-ai bg-ai/5 px-3 py-1.5 rounded-full uppercase tracking-widest border border-ai/10">
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
                                                </div>
                                            </div>

                                            {/* Right Column: Title & Actions */}
                                            <div className="flex-grow space-y-4 overflow-hidden flex flex-col justify-between">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        {lead.has_responded && (
                                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-[8px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                                <CheckCircle2 size={10} /> Responded
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <a 
                                                        href={(lead.url.startsWith('http') ? lead.url : `https://${lead.url}`)}
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="block text-base sm:text-lg font-bold text-text-primary/90 group-hover:text-gray-200 leading-tight tracking-tight transition-all"
                                                    >
                                                        {lead.title}
                                                    </a>
                                                </div>

                                                <div className="flex items-center gap-2 transition-all duration-300">
                                                    {/* ACTION: DRAFT REPLY */}
                                                    <button
                                                        onClick={() => setDraftingLead(lead)}
                                                        className="px-6 py-3 rounded-2xl bg-primary text-white border border-primary/20 text-[11px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2.5 group/btn hover:-translate-y-0.5 active:translate-y-0"
                                                    >
                                                        <Sparkles size={14} className="text-white group-hover/btn:rotate-12 transition-transform" />
                                                        Draft Intelligence
                                                    </button>

                                                    <div className="flex items-center gap-1.5 ml-2">
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
                                                            className={`p-2.5 rounded-xl transition-all duration-300 ${
                                                                lead.has_responded 
                                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                                                                    : 'bg-white/5 text-text-secondary/50 hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/20 border border-transparent'
                                                            }`}
                                                        >
                                                            <CheckCircle2 size={16} />
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
                                                            className={`p-2.5 rounded-xl transition-all duration-300 ${
                                                                lead.is_saved 
                                                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                                                                    : 'bg-white/5 text-text-secondary/50 hover:text-text-primary hover:bg-white/10 hover:border-white/20 border border-transparent'
                                                            }`}
                                                        >
                                                            <Bookmark size={16} fill={lead.is_saved ? 'currentColor' : 'none'} />
                                                        </button>
                                                        
                                                        <a 
                                                            href={(lead.url.startsWith('http') ? lead.url : `https://${lead.url}`)}
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="p-2.5 rounded-xl bg-white/5 text-text-secondary/50 hover:text-text-primary hover:bg-white/10 hover:border-white/20 border border-transparent transition-all duration-300 flex items-center justify-center"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-32 text-center space-y-6">
                    <div className="relative inline-block">
                        <Activity className="mx-auto text-text-secondary/20" size={48} />
                        <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-text-secondary font-black text-sm tracking-[0.3em] uppercase opacity-80">
                            {profile?.keywords?.length > 0 ? 'Radar Sweep in Progress' : 'Radar offline'}
                        </h4>
                        <p className="text-[10px] text-text-secondary max-w-[280px] mx-auto leading-relaxed uppercase font-black tracking-widest opacity-40">
                            {profile?.keywords?.length > 0 
                                ? 'Live intelligence will appear here as the radar discovers and scores new leads.' 
                                : 'Please configure your keywords and website in tracking setup to start the radar.'}
                        </p>
                    </div>
                </div>
            )}

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
