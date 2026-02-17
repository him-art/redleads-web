import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ExternalLink, Clock, Radar, Bookmark, Trash2, Brain, Sparkles, MessageSquarePlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useDashboardData, MonitoredLead, LeadAnalysis } from '@/app/dashboard/DashboardDataContext';

export default function ReportsTab({ reports, profile, user, isGrowth, isAdmin }: { reports: any[], profile: any, user: any, isGrowth: boolean, isAdmin: boolean }) {
    const { leads: historyLeads, analyses: leadAnalyses, isLoading: isDataLoading, updateLead, deleteLead, draftingLead, setDraftingLead } = useDashboardData();
    const [filter, setFilter] = useState<'all' | 'saved'>('all');
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const supabase = useMemo(() => createClient(), []);
    
    const hasConfig = (profile?.keywords?.length > 0);

    if (isDataLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                 <div className="w-12 h-12 border border-orange-500/10 border-t-orange-500 rounded-full animate-spin" />
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
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    Lead History
                </h2>

                <div className="flex bg-black/20 rounded-xl p-1.5 border border-border-subtle">
                     <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                            filter === 'all' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('saved')}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${
                            filter === 'saved' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Bookmark size={12} fill={filter === 'saved' ? "currentColor" : "none"} />
                        Saved
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Active Config Summary */}
                {hasConfig && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[10px] font-bold text-text-secondary glass-panel p-4 sm:p-5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500/50 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="tracking-wide">Monitoring Active</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-white/5" />
                        <div className="tracking-wide">Focusing on <span className="text-text-primary font-black">{profile?.keywords?.length || 0}</span> keywords</div>
                      </div>
                )}


                {/* SaaS 2.0: Actionable Intelligence Section */}
                {leadAnalyses.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Sparkles size={14} className="text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">High-Intent Intelligence</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {leadAnalyses.map((analysis: LeadAnalysis) => (
                                <div key={analysis.id} className="relative overflow-hidden glass-panel rounded-3xl p-6 group transition-all hover:border-primary/30">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                        <Brain size={80} className="text-text-primary" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <Brain size={16} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 leading-none mb-1">Neural Synthesis</p>
                                                <h4 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-tight">Pattern Analysis</h4>
                                            </div>
                                        </div>
                                         <div className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium whitespace-pre-wrap">
                                            {analysis.content}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                                            <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/5 text-[8px] sm:text-[9px] font-black text-text-secondary uppercase tracking-widest">
                                                {analysis.lead_ids.length} Leads Analyzed
                                            </div>
                                             <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 border border-white/5 text-[8px] sm:text-[9px] font-black text-text-secondary uppercase tracking-widest">
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
                            ))}
                        </div>
                    </div>
                )}

                {Object.keys(groupedLeads).length === 0 ? (
                    <div className="text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/5">
                        <Radar className="mx-auto text-text-secondary/60 mb-4" size={40} />
                        <h3 className="text-lg font-bold text-text-primary">No Archived Leads Yet</h3>
                        <p className="text-sm text-text-secondary max-w-xs mx-auto">
                            The most recent 20 leads appear in your Command Center. 
                            Older leads will effectively be archived here.
                        </p>
                    </div>
                ) : (
                <div className="space-y-4">
                    {Object.entries(groupedLeads).map(([date, leads]) => (
                        <div key={date} className="border border-border-subtle rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden bg-white/[0.02] mb-4">
                            <button 
                                onClick={() => setExpandedDay(expandedDay === date ? null : date)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <Calendar size={18} className="text-primary" />
                                    <span className="font-black text-xs uppercase tracking-wider text-text-primary">{date}</span>
                                    <span className="bg-white/5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-text-secondary border border-white/5">{leads.length} leads</span>
                                </div>
                                <ChevronDown size={14} className={`text-text-secondary transition-transform ${expandedDay === date ? 'rotate-180' : ''}`} />
                            </button>

                             {expandedDay === date && (
                                <div className="border-t border-white/5 bg-black/40">
                                    {leads.map((lead) => (
                                        <div key={lead.id} className="p-2 sm:p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex flex-col sm:flex-row gap-3 sm:gap-4 group">
                                            <div className="flex-grow space-y-1">
                                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-text-secondary">
                                                    <span className="text-primary">r/{lead.subreddit}</span>
                                                    <span>•</span>
                                                     <span className="flex items-center gap-1">
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
                                                     </span>
                                                     <span>•</span>
                                                     <span className="text-text-primary italic">
                                                        {lead.match_category || 'Medium'} Match
                                                     </span>
                                                </div>
                                                <a href={lead.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-sm font-medium text-text-primary group-hover:text-text-primary leading-snug transition-colors">
                                                    <span className="mt-0.5">🧠</span>
                                                    <span className="flex-1">{lead.title}</span>
                                                </a>
                                            </div>
                                             <div className="flex items-center gap-1.5 sm:gap-2">
                                                <button 
                                                    onClick={() => setDraftingLead(lead)}
                                                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground border border-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-1.5 group/btn whitespace-nowrap"
                                                    title="Open Reply Generator"
                                                >
                                                    <MessageSquarePlus size={14} className="text-primary-foreground" />
                                                    Draft Reply
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
                                                    <Bookmark size={14} fill={lead.is_saved ? "currentColor" : "none"} />
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
                                                    className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 size={14} />
                                                </button>

                                                <a 
                                                    href={lead.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-text-primary hover:bg-primary transition-all"
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
                    ))}
                </div>
                )}
            </div>
        </div>
    );
}
