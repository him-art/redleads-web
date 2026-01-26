'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, ChevronDown, ExternalLink, Clock, Radar, Bookmark } from 'lucide-react';
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

export default function ReportsTab({ reports, profile }: { reports: any[], profile: any }) {
    const [activeSection, setActiveSection] = useState<'leads' | 'reports'>('leads');
    const [filter, setFilter] = useState<'all' | 'saved'>('all');
    const [historyLeads, setHistoryLeads] = useState<MonitoredLead[]>([]);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const supabase = createClient();
    
    const hasConfig = profile?.website_url || (profile?.keywords?.length > 0) || (profile?.subreddits?.length > 0);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data } = await supabase
                .from('monitored_leads')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });
            
            if (data) setHistoryLeads(data);
        };
        
        if (profile?.id) fetchHistory();
    }, [profile]);

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
        // ESLint disable to run only once when data loads
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [/* Run once when data is first ready */ historyLeads.length]);

    return (
        <div className="space-y-8">
            {/* Toggle Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveSection('leads')}
                        className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                            activeSection === 'leads' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        Lead History
                    </button>
                    <button 
                        onClick={() => setActiveSection('reports')}
                        className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                            activeSection === 'reports' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        Daily Reports
                    </button>
                </div>

                {activeSection === 'leads' && (
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
                )}
            </div>

            {activeSection === 'leads' && (
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
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'reports' && (
                <div className="space-y-4">
                     {/* Existing Reports Logic Preserved */}
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold">Daily Email Reports</h2>
                        <span className="text-xs text-gray-500">Past 30 days</span>
                    </div>

                    {reports.length === 0 ? (
                        <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-white/5">
                            <Mail className="mx-auto text-gray-600 mb-4" size={32} />
                            <p className="text-sm text-gray-500">No email reports sent yet.</p>
                        </div>
                    ) : (
                        reports.map((report) => (
                             <div key={report.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-200">{report.subject}</h4>
                                    <p className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-md font-bold uppercase">Sent</span>
                             </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
