import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Sparkles, Brain, Calendar, ChevronDown, Clock, MessageSquarePlus, ExternalLink, Trash2, Activity, CheckCircle2 } from 'lucide-react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { createClient } from '@/lib/supabase/client';
import { useDashboardData, MonitoredLead, LeadAnalysis } from '@/app/dashboard/DashboardDataContext';

export default function ReportsTab({ reports, user }: { reports: any[], user: any }) {
    const { 
        profile,
        leads: historyLeads, 
        analyses: leadAnalyses, 
        isLoading: isDataLoading, 
        updateLead, 
        deleteLead, 
        draftingLead, 
        setDraftingLead, 
        planDetails 
    } = useDashboardData();
    const { isGrowth, isAdmin } = planDetails;
    const [filter, setFilter] = useState<'all' | 'saved'>('all');
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const supabase = useMemo(() => createClient(), []);
    
    const hasConfig = (profile?.keywords?.length > 0);

    if (isDataLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                 <LoadingIcon className="w-12 h-12 text-orange-500" />
            </div>
        );
    }

    // Filter and Group leads by date
    let filteredLeads: MonitoredLead[] = [];
    if (filter === 'all') {
        // Show leads older than top 20
        filteredLeads = historyLeads.slice(20);
    } else {
        // Show ALL saved leads (even if recent)
        filteredLeads = historyLeads.filter((l: MonitoredLead) => l.is_saved);
    }
    const groupedLeads = filteredLeads.reduce((groups, lead: MonitoredLead) => {
        const date = (() => {
            try {
                if (!isMounted) return 'Loading date...';
                const d = new Date(lead.created_at);
                if (isNaN(d.getTime())) return 'Archive';
                return d.toLocaleDateString(undefined, {
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                });
            } catch (e) {
                return 'Archive';
            }
        })();
        if (!groups[date]) groups[date] = [];
        groups[date].push(lead);
        return groups;
    }, {} as Record<string, MonitoredLead[]>);

    // Auto-expand the first day ONLY on initial load
    // NOTE: Do NOT put groupedLeads in deps — it's a new object every render and will cause an infinite loop
    useEffect(() => {
        if (Object.keys(groupedLeads).length > 0 && !expandedDay) {
            setExpandedDay(Object.keys(groupedLeads)[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historyLeads.length, filter]);

    return (
        <div className="space-y-6 sm:space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between pb-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    Lead History
                </h2>

                <div className="flex surface-1 rounded-xl p-1 border border-white/5 bg-void">
                     <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                            filter === 'all' ? 'bg-primary text-white shadow-void' : 'text-text-secondary/60 hover:text-text-primary'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('saved')}
                        className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${
                            filter === 'saved' ? 'bg-primary text-white shadow-void' : 'text-text-secondary/60 hover:text-text-primary'
                        }`}
                    >
                        <Bookmark size={10} fill={filter === 'saved' ? 'currentColor' : 'none'} />
                        Saved
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Active Config Summary */}
                {hasConfig && (
                    <div className="p-0.5 surface-1 rounded-2xl transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[10px] font-black text-text-secondary/60 bg-void p-4 sm:p-5 rounded-[0.9rem] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500/50 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                </span>
                                <span className="tracking-widest uppercase text-text-primary/80">Monitoring Active</span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-white/5" />
                            <div className="tracking-widest uppercase">Focusing on <span className="text-text-primary font-black">{profile?.keywords?.length || 0}</span> targeting vectors</div>
                        </div>
                    </div>
                )}


                {/* SaaS 2.0: Actionable Intelligence Section */}
                {leadAnalyses.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Sparkles className="text-ai" size={14} />
                                <div className="absolute inset-0 bg-ai/5 rounded-full" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/60">neural sync</h3>
                                <p className="text-sm font-bold text-text-primary tracking-tight leading-none">Intelligence Synthesis</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {leadAnalyses.map((analysis: LeadAnalysis) => (
                                <div key={analysis.id} className="p-0.5 surface-1 rounded-[2rem] transition-all duration-300">
                                    <div className="relative overflow-hidden bg-void rounded-[1.8rem] p-8 border border-white/5 group transition-all hover:bg-white/[0.02]">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                            <Brain size={120} className="text-ai" />
                                        </div>
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-ai/10 flex items-center justify-center border border-ai/20 shadow-[0_0_15px_rgba(0,209,255,0.1)]">
                                                    <Brain size={18} className="text-ai" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-ai/60 leading-none mb-1.5">Pattern Detection</p>
                                                    <h4 className="text-base font-black text-text-primary tracking-tight">Lead Vector Analysis</h4>
                                                </div>
                                            </div>
                                            <div className="text-xs sm:text-sm text-text-primary leading-relaxed font-bold tracking-tight whitespace-pre-wrap pl-1 sm:pl-14">
                                                {analysis.content}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 sm:pl-14">
                                                <div className="px-3 py-1.5 rounded-full bg-ai-muted text-[9px] font-black text-ai uppercase tracking-widest border border-ai/10">
                                                    {analysis.lead_ids.length} Signals Correlated
                                                </div>
                                                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-text-secondary/60 uppercase tracking-widest">
                                                    {(() => {
                                                        try {
                                                            if (!isMounted) return '...';
                                                            const d = new Date(analysis.created_at);
                                                            if (isNaN(d.getTime())) return '...';
                                                            return d.toLocaleDateString();
                                                        } catch (e) {
                                                            return '...';
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {Object.keys(groupedLeads).length === 0 ? (
                    <div className="p-1 bg-white/5 border border-white/5 rounded-[2.5rem]">
                        <div className="text-center py-20 bg-[#0c0c0c] rounded-[2.2rem] border border-dashed border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            <Activity className="mx-auto text-text-secondary/60 mb-4" size={40} />
                            <h3 className="text-lg font-bold text-text-primary">No Archived Leads Yet</h3>
                            <p className="text-sm text-text-secondary max-w-xs mx-auto">
                                The most recent 20 leads appear in your Command Center. 
                                Older leads will effectively be archived here.
                            </p>
                        </div>
                    </div>
                ) : (
                <div className="space-y-4">
                    {Object.entries(groupedLeads).map(([date, leads]) => (
                        <div key={date} className="p-0.5 surface-1 rounded-[1.4rem] sm:rounded-[1.7rem] overflow-hidden mb-4 transition-all duration-300">
                            <div className="bg-void rounded-[1.2rem] sm:rounded-[1.5rem] border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                <button 
                                    onClick={() => setExpandedDay(expandedDay === date ? null : date)}
                                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.03] transition-colors"
                                >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Calendar size={16} />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest text-text-primary/90">{date}</span>
                                    <span className="bg-white/5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-text-secondary/60 border border-white/5">{leads.length} Archive Signals</span>
                                </div>
                                <ChevronDown size={14} className={`text-text-secondary/30 transition-transform ${expandedDay === date ? 'rotate-180 text-primary' : ''}`} />
                            </button>

                             {expandedDay === date && (
                                <div className="border-t border-white/5 bg-black/40">
                                    {leads.map((lead) => (
                                        <div key={lead.id} className="p-2 sm:p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex flex-col sm:flex-row gap-3 sm:gap-4 group">
                                            <div className="flex-grow space-y-1">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-[9px] font-black text-ai bg-ai-muted px-2.5 py-1 rounded-full uppercase tracking-widest border border-ai/10">r/{lead.subreddit}</span>
                                                     <div className="flex items-center gap-1.5 text-[9px] font-black text-text-secondary/30 uppercase tracking-widest">
                                                        <Clock size={10} />
                                                        {(() => {
                                                            try {
                                                                if (!isMounted) return '--:--';
                                                                const d = new Date(lead.created_at);
                                                                if (isNaN(d.getTime())) return '--:--';
                                                                return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                                            } catch (e) {
                                                                return '--:--';
                                                            }
                                                            })()}
                                                     </div>
                                                     <div className={`px-2 py-0.5 rounded border transition-all duration-300 ${
                                                        lead.match_category === 'Best Match' 
                                                            ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                                                            : 'bg-white/5 border-white/10 text-text-secondary/60'
                                                     }`}>
                                                        <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                                                            {lead.match_category || 'Good Match'}
                                                        </span>
                                                    </div>
                                                    {lead.has_responded && (
                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                            <CheckCircle2 size={10} /> Responded
                                                        </div>
                                                    )}
                                                </div>
                                                <a href={lead.url} target="_blank" rel="noreferrer" className="block text-xs sm:text-sm font-bold text-text-secondary group-hover:text-text-primary leading-relaxed tracking-tight transition-all">
                                                    {lead.title}
                                                </a>
                                            </div>
                                             <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <button 
                                                        onClick={() => setDraftingLead(lead)}
                                                        className="px-4 py-2 rounded-xl bg-primary text-white border border-primary/20 text-[10px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2 group/btn shadow-void"
                                                        title="Open Reply Generator"
                                                    >
                                                        <Sparkles size={12} className="text-white" />
                                                        Draft Intelligence
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            const newStatus = !lead.has_responded;
                                                            try {
                                                                await updateLead(lead.id, { has_responded: newStatus });
                                                            } catch (error) {
                                                                console.error('Error saving lead:', error);
                                                            }
                                                        }}
                                                        className={`p-2 rounded-lg transition-all ${
                                                            lead.has_responded 
                                                                ? 'opacity-100 bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                                : 'bg-white/5 text-text-secondary hover:text-green-500 hover:bg-green-500/10'
                                                        }`}
                                                        title={lead.has_responded ? "Mark as Unresponded" : "Mark as Responded"}
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                <button 
                                                    onClick={async () => {
                                                        const newStatus = !lead.is_saved;
                                                        try {
                                                            await updateLead(lead.id, { is_saved: newStatus });
                                                        } catch (error) {
                                                            console.error('Error saving lead:', error);
                                                            alert('Failed to save lead.');
                                                        }
                                                    }}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        lead.is_saved 
                                                            ? 'opacity-100 bg-primary text-primary-foreground' 
                                                            : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-primary/20'
                                                    }`}
                                                    title={lead.is_saved ? "Unsave Lead" : "Save Lead"}
                                                >
                                                    <Bookmark size={14} fill={lead.is_saved ? 'currentColor' : 'none'} />
                                                </button>

                                                <button 
                                                    onClick={async () => {
                                                        if (!confirm('Permanently delete this lead from history?')) return;
                                                        
                                                        try {
                                                            await deleteLead(lead.id);
                                                        } catch (error) {
                                                            console.error('Error deleting lead:', error);
                                                            alert('Failed to delete lead.');
                                                        }
                                                    }}
                                                    className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 size={14} />
                                                </button>

                                                <a 
                                                    href={lead.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary hover:bg-primary transition-all flex items-center justify-center"
                                                    title="View on Reddit"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
}
