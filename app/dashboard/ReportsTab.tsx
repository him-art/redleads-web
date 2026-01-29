'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ExternalLink, Clock, Radar, Bookmark, Trash2, Brain, Sparkles } from 'lucide-react';
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

interface LeadAnalysis {
    id: string;
    content: string;
    created_at: string;
    lead_ids: string[];
}

export default function ReportsTab({ reports, profile }: { reports: any[], profile: any }) {
    const [filter, setFilter] = useState<'all' | 'saved'>('all');
    const [historyLeads, setHistoryLeads] = useState<MonitoredLead[]>([]);
    const [leadAnalyses, setLeadAnalyses] = useState<LeadAnalysis[]>([]);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    const supabase = createClient();
    
    const hasConfig = (profile?.keywords?.length > 0) || (profile?.subreddits?.length > 0);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data } = await supabase
                .from('monitored_leads')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });
            
            if (data) setHistoryLeads(data);
        };

        const fetchAnalyses = async () => {
            const { data } = await supabase
                .from('lead_analyses')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false })
                .limit(5);
            
            if (data) setLeadAnalyses(data);
        };
        
        if (profile?.id) {
            fetchHistory();
            fetchAnalyses();
        }
    }, [profile, supabase]);

    // Filter and Group leads by date
    const filteredLeads = historyLeads.filter(l => filter === 'all' || (filter === 'saved' && l.is_saved));
    const groupedLeads = filteredLeads.reduce((groups, lead) => {
        const date = new Date(lead.created_at).toLocaleDateString(undefined, {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(lead);
        return groups;
    }, {} as Record<string, MonitoredLead[]>);

    // Auto-expand the first day ONLY on initial load
    useEffect(() => {
        if (Object.keys(groupedLeads).length > 0 && !expandedDay) {
            setExpandedDay(Object.keys(groupedLeads)[0]);
        }
    }, [historyLeads.length, groupedLeads, expandedDay]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-500">
                    Lead History
                </h2>

                <div className="flex bg-white/5 rounded-lg p-1">
                     <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            filter === 'all' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('saved')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                            filter === 'saved' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Bookmark size={10} fill={filter === 'saved' ? "currentColor" : "none"} />
                        Saved
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Active Config Summary */}
                {hasConfig && (
                     <div className="flex items-center gap-4 text-xs text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Monitoring Active
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div>Tracking <b>{profile?.subreddits?.length || 0}</b> subreddits</div>
                        <div className="w-px h-4 bg-white/10" />
                        <div>Focusing on <b>{profile?.keywords?.length || 0}</b> keywords</div>
                     </div>
                )}

                {/* SaaS 2.0: Actionable Intelligence Section */}
                {leadAnalyses.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Sparkles size={14} className="text-orange-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">High-Intent Intelligence</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {leadAnalyses.map((analysis) => (
                                <div key={analysis.id} className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-3xl p-6 group transition-all hover:border-orange-500/30">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                        <Brain size={80} className="text-white" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                                <Brain size={20} className="text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500/60">Neural Synthesis</p>
                                                <h4 className="text-sm font-black text-white uppercase tracking-tight">Pattern Analysis</h4>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                                            {analysis.content}
                                        </div>
                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                {analysis.lead_ids.length} Leads Analyzed
                                            </div>
                                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                {new Date(analysis.created_at).toLocaleDateString()}
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
                        <Radar className="mx-auto text-gray-600 mb-4" size={40} />
                        <h3 className="text-lg font-bold text-gray-300">No History Yet</h3>
                        <p className="text-sm text-gray-500">Leads will be archived here safely.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(groupedLeads).map(([date, leads]) => (
                            <div key={date} className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                                <button 
                                    onClick={() => setExpandedDay(expandedDay === date ? null : date)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Calendar size={16} className="text-orange-500" />
                                        <span className="font-bold text-gray-200">{date}</span>
                                        <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-gray-400">{leads.length} leads</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${expandedDay === date ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedDay === date && (
                                    <div className="border-t border-white/5 bg-black/40">
                                        {leads.map((lead) => (
                                            <div key={lead.id} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex gap-4 group">
                                                <div className="flex-grow space-y-1">
                                                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500">
                                                        <span className="text-orange-500">r/{lead.subreddit}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                    <a href={lead.url} target="_blank" rel="noreferrer" className="block text-sm font-medium text-gray-200 group-hover:text-white leading-snug">
                                                        {lead.title}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={async () => {
                                                            const newStatus = !lead.is_saved;
                                                            // Optimistic UI update
                                                            setHistoryLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_saved: newStatus } : l));
                                                            const { error } = await supabase.from('monitored_leads').update({ is_saved: newStatus }).eq('id', lead.id);
                                                            if (error) {
                                                                console.error('Error saving lead:', error);
                                                                // Revert optimistic update
                                                                setHistoryLeads(prev => prev.map(l => l.id === lead.id ? { ...l, is_saved: !newStatus } : l));
                                                                alert('Failed to save lead.');
                                                            }
                                                        }}
                                                        className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                                            lead.is_saved 
                                                                ? 'opacity-100 bg-orange-500 text-white' 
                                                                : 'bg-white/5 text-gray-500 hover:text-white hover:bg-orange-500/20'
                                                        }`}
                                                        title={lead.is_saved ? "Unsave Lead" : "Save Lead"}
                                                    >
                                                        <Bookmark size={14} fill={lead.is_saved ? "currentColor" : "none"} />
                                                    </button>

                                                    <button 
                                                        onClick={async () => {
                                                            if (!confirm('Permanently delete this lead from history?')) return;
                                                            
                                                            // Optimistic UI update
                                                            setHistoryLeads(prev => prev.filter(l => l.id !== lead.id));
                                                            
                                                            const { error } = await supabase
                                                                .from('monitored_leads')
                                                                .delete()
                                                                .eq('id', lead.id);
                                                                
                                                            if (error) {
                                                                console.error('Error deleting lead:', error);
                                                                alert('Failed to delete lead.');
                                                            }
                                                        }}
                                                        className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Delete Lead"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>

                                                    <a 
                                                        href={lead.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-orange-500 transition-all opacity-0 group-hover:opacity-100"
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
