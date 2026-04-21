'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { CheckCircle2, Bookmark, ExternalLink, MessageSquarePlus, Brain } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { useDashboardData } from '@/app/dashboard/DashboardDataContext';
import LoadingIcon from '@/components/ui/LoadingIcon';

interface RedditLead {
    id?: string;
    subreddit: string;
    title: string;
    url: string;
    relevance: 'Best Match' | 'Good Match' | 'Low';
    has_responded?: boolean;
    is_saved?: boolean;
}

interface LeadSearchProps {
    user: SupabaseUser | null;
    isDashboardView?: boolean;
    initialUrl?: string;
    onShowModal?: () => void;
    onResultsFound?: (count: number) => void;
    onNavigate?: (tab: string) => void;
    initialLeads?: RedditLead[];
    autoScan?: boolean;
    isLocked?: boolean;
}

export default function LeadSearch({ user, isDashboardView = false, initialUrl = '', initialLeads = [], autoScan = false, isLocked = false, onShowModal, onResultsFound, onNavigate }: LeadSearchProps) {
    const [url, setUrl] = useState(initialUrl);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [results, setResults] = useState<RedditLead[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [teaserInfo, setTeaserInfo] = useState<{ isTeaser: boolean, totalFound: number } | null>(null);
    const [activeQuery, setActiveQuery] = useState<string | null>(null);
    const { draftingLead, setDraftingLead, profile, refreshProfile } = useDashboardData();
    const [productContext, setProductContext] = useState('');
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasAutoScanned = useRef(false);

    const timeRanges = [
        { label: '24 Hours', value: '24h' },
        { label: '7 Days', value: '7d' },
        { label: '30 Days', value: '30d' }
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            const { data } = await supabase.from('profiles').select('description').eq('id', user.id).single();
            if (data) setProductContext(data.description);
        };
        fetchProfile();
    }, [user?.id]);

    // Auto-load initial leads or auto-scan
    useEffect(() => {
        if (initialLeads && initialLeads.length > 0 && results.length === 0) {
            setResults(initialLeads);
            if (initialLeads.length > 0) {
                setOpenGroups({ 'Best Match': true, 'Good Match': true });
            }
            onResultsFound?.(initialLeads.length);
            hasAutoScanned.current = true; // Prevent duplicate scan
        } else if (autoScan && initialUrl && !isScanning && results.length === 0 && !hasAutoScanned.current) {
            console.log('[LeadSearch] Auto-scan triggered for:', initialUrl);
            hasAutoScanned.current = true;
            
            // Fix: Use direct URL to bypass React state update delay
            handleScan(undefined, initialUrl);
            
            // Mark initial scan as done in DB so it never re-fires on refresh
            if (user?.id) {
                supabase.from('profiles').update({ has_initial_scan: true }).eq('id', user.id).then(({ error }) => {
                    if (error) console.error('[LeadSearch] Failed to mark has_initial_scan:', error);
                    else console.log('[LeadSearch] Mark has_initial_scan complete');
                });
            }

            // Consume the URL parameter
            try {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                const newQuery = params.toString();
                router.replace(`/dashboard${newQuery ? `?${newQuery}` : ''}`, { scroll: false });
            } catch (e) {
                console.warn('Router replace failed:', e);
            }
        } else if (initialUrl) {
            setUrl(initialUrl);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialUrl, initialLeads, autoScan, user?.id]);

    const scanSteps = [
        "Initializing Precision Search Interface...",
        "AI is drafting high-intent search vectors...",
        "Executing Mega-Query across Reddit...",
        "Processing real-time social signals...",
        "Generating Intelligence Report..."
    ];

    const handleScan = async (e?: React.FormEvent, overrideUrl?: string) => {
        if (e) e.preventDefault();
        if (isScanning) return;
        
        const scanUrl = overrideUrl || url;
        if (!scanUrl) return;

        // If we have an overrideUrl, ensure the input state matches for visual consistency
        if (overrideUrl) setUrl(overrideUrl);

        let normalizedUrl = scanUrl.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        try {
            const parsed = new URL(normalizedUrl);
            if (!parsed.hostname.includes('.')) throw new Error();
        } catch (err) {
            return;
        }

        setIsScanning(true);
        setResults([]);
        setSuggestions([]);

        const scannerPromise = fetch('/api/scanner', {
            method: 'POST',
            body: JSON.stringify({ url: normalizedUrl, action: 'SCAN', timeRange }),
            headers: { 'Content-Type': 'application/json' }
        });

        try {
            const response = await scannerPromise;
            const data = await response.json();

            if (response.status === 403 && data.code === 'DAILY_LIMIT_REACHED') {
                onShowModal?.();
                return;
            }

            if (data.leads && data.leads.length > 0) {
                setTeaserInfo(data.isTeaser ? { isTeaser: true, totalFound: data.totalFound } : null);
                setActiveQuery(data.query || null);
                const enrichedLeads = data.leads.map((lead: any) => ({
                    ...lead,
                    relevance: lead.match_category || 'Good Match',
                }));
                setResults(enrichedLeads);
                onResultsFound?.(enrichedLeads.length);
                setOpenGroups({ 'Best Match': true, 'Good Match': true, 'Low': true });
                
                // Immediately sync profile stats (e.g. scan count)
                refreshProfile();
            } else if (data.suggestions) {
                 setSuggestions(data.suggestions);
                 onResultsFound?.(0);
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsScanning(false);
        }
    };

    const toggleResponded = async (lead: RedditLead) => {
        if (!lead.id) return;
        const newStatus = !lead.has_responded;
        
        // Optimistic UI update
        setResults(prev => prev.map(l => l.url === lead.url ? { ...l, has_responded: newStatus } : l));
        
        const { error } = await supabase.from('monitored_leads').update({ has_responded: newStatus }).eq('id', lead.id);
        if (error) {
            console.error('Error updating responded status:', error);
            // Rollback
            setResults(prev => prev.map(l => l.url === lead.url ? { ...l, has_responded: !newStatus } : l));
        }
    };

    const toggleSaved = async (lead: RedditLead) => {
        if (!lead.id) return;
        const newStatus = !lead.is_saved;
        
        // Optimistic UI update
        setResults(prev => prev.map(l => l.url === lead.url ? { ...l, is_saved: newStatus } : l));
        
        const { error } = await supabase.from('monitored_leads').update({ is_saved: newStatus }).eq('id', lead.id);
        if (error) {
            console.error('Error updating saved status:', error);
            // Rollback
            setResults(prev => prev.map(l => l.url === lead.url ? { ...l, is_saved: !newStatus } : l));
        }
    };

    return (
        <div className="w-full">
            {/* Spotlight Implementation */}
            <div className={`mx-auto ${isDashboardView ? 'max-w-none' : 'max-w-2xl'}`}>
                <form onSubmit={handleScan} className="relative group">
                    {/* Top Progress Bar (Extremely thin) */}
                    {isScanning && (
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 overflow-hidden z-10 rounded-t-full">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="h-full bg-primary"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-6 ml-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-50 mr-2">time frame:</span>
                        <div className="flex items-center p-1 bg-white/5 border border-white/5 rounded-full">
                            {timeRanges.map((range) => (
                                <button
                                    key={range.value}
                                    type="button"
                                    onClick={() => setTimeRange(range.value as any)}
                                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                        timeRange === range.value 
                                            ? 'bg-primary text-white shadow-lg' 
                                            : 'text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex items-center">
                        <div className="absolute left-4 sm:left-6 text-text-secondary group-focus-within:text-primary transition-colors flex items-center justify-center">
                            {isScanning ? <LoadingIcon className="w-4 h-4" /> : isLocked ? <MaterialIcon name="public" size={18} className="text-primary/50" /> : <MaterialIcon name="public" size={18} />}
                        </div>
                        <input 
                            id="product-url-search"
                            name="product-url"
                            type="text" 
                            placeholder={isLocked ? "Website set in Tracking Setup" : "Type product URL to scan..."}
                            value={url}
                            onChange={(e) => !isLocked && setUrl(e.target.value)}
                            disabled={isScanning}
                            readOnly={isLocked}
                            suppressHydrationWarning
                            className={`w-full bg-black/50 border rounded-2xl py-4 sm:py-6 pl-12 sm:pl-16 pr-24 sm:pr-32 text-base sm:text-lg focus:outline-none transition-all placeholder:text-text-secondary/60 font-medium tracking-tight text-text-primary shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] ${
                                isScanning 
                                ? 'border-primary/50 bg-black/70 shadow-[0_0_30px_rgba(255,88,54,0.15)] ring-1 ring-primary/30' 
                                : 'border-white/10 focus:bg-black/70 focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,88,54,0.15)]'
                            } ${isLocked ? 'cursor-default' : ''}`}
                        />
                        <button 
                            type="submit"
                            disabled={isScanning || url.trim().length < 3}
                            className={`absolute right-2 sm:right-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest transition-all duration-500 overflow-hidden flex items-center gap-2 ${
                                isScanning
                                    ? 'bg-transparent text-primary border border-primary/30 shadow-[0_0_20px_rgba(255,88,54,0.2)]'
                                    : url.trim().length >= 3 
                                        ? 'bg-primary hover:bg-[#ff6900] transform hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_30px_rgba(255,88,54,0.5)] text-white shadow-[0_0_15px_rgba(255,88,54,0.3)]' 
                                        : 'bg-white/5 text-text-secondary cursor-not-allowed opacity-50'
                            }`}
                        >
                            {isScanning && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-[shimmer_2s_infinite]" />
                            )}
                            {isScanning ? (
                                <>
                                    <LoadingIcon className="w-3.5 h-3.5" />
                                    <span>Analyzing</span>
                                </>
                            ) : (
                                <>
                                    <Brain size={14} className="-ml-0.5" />
                                    <span>AI Scan</span>
                                </>
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isScanning && (
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="mt-8 flex flex-col items-center justify-center gap-4"
                            >
                                {/* Magic Pulse Visual */}
                                <div className="relative flex items-center justify-center h-16 w-16">
                                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                    <div className="absolute inset-2 rounded-full border border-primary/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
                                    <div className="absolute inset-4 rounded-full bg-primary/20 animate-pulse backdrop-blur-sm" />
                                    <Brain className="text-primary relative z-10 animate-pulse" size={24} />
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 animate-pulse">
                                        Expanding Intelligence
                                    </p>
                                    <p className="text-xs text-text-secondary/60 font-medium">
                                        Scanning millions of subreddits to find your target audience...
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            {/* Results Section */}
            <AnimatePresence mode="popLayout">
            {suggestions.length > 0 && results.length === 0 && !isScanning && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    className="mt-8 space-y-6 max-w-xl mx-auto"
                >
                    <div className="p-8 rounded-[2rem] bg-void border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary group-hover:text-white transition-colors">
                                <MaterialIcon name="travel_explore" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Zero Matches Found</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    No high-intent discussions matched your exact criteria in the last {timeRanges.find(t => t.value === timeRange)?.label || 'period'}. 
                                    Your scanning quota was <strong className="text-green-500">not deducted</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/60 mb-4 flex items-center gap-2">
                                <Brain size={12} className="text-primary/70" />
                                Smart Suggestions
                            </h4>
                            <div className="space-y-3">
                                {suggestions.map((suggestion, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                                    >
                                        <div className="mt-0.5 text-primary">
                                            <MaterialIcon name="lightbulb" size={16} />
                                        </div>
                                        <p className="text-sm text-text-secondary/90 leading-relaxed">
                                            {suggestion}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {timeRange === '24h' && (
                            <div className="mt-6 flex justify-center">
                                <button 
                                    onClick={() => setTimeRange('7d')}
                                    className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-text-primary transition-all border border-white/5 hover:border-white/10 flex items-center gap-2"
                                >
                                    <MaterialIcon name="history" size={14} />
                                    Scan Last 7 Days Instead
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {results.length > 0 && !isScanning && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mt-8 sm:mt-16 space-y-8 sm:space-y-12"
                >

                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                <MaterialIcon name="search" size={18} className="text-primary" />
                                Intel Report: {results.length} Potential Leads
                            </h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                High-intent conversations identified
                            </p>
                        </div>
                    </div>

                        <motion.div 
                            layout
                            className="space-y-4"
                        >
                            {Object.entries(
                                results.reduce((acc, lead) => {
                                    const groupKey = lead.relevance;
                                    if (!acc[groupKey]) acc[groupKey] = [];
                                    acc[groupKey].push(lead);
                                    return acc;
                                }, {} as Record<string, RedditLead[]>)
                            )
                            .sort(([keyA], [keyB]) => {
                                const order: Record<string, number> = { 'Best Match': 0, 'Good Match': 1, 'Low': 2 };
                                return (order[keyA] ?? 9) - (order[keyB] ?? 9);
                            })
                            .map(([groupKey, leads]) => {
                                const isOpen = openGroups[groupKey];
                                return (
                                    <div key={groupKey} className="space-y-3">
                                        <button
                                            onClick={() => setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }))}
                                            className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            <MaterialIcon name="expand_more" size={14} className={`transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                                            {groupKey} RELEVANCY • {leads.length}
                                        </button>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {leads.map((lead, i) => (
                                                            <motion.div 
                                                                key={i}
                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                transition={{ delay: i * 0.05 }}
                                                                className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all relative overflow-hidden flex flex-col justify-between gap-4"
                                                            >
                                                                <div className="space-y-3">
                                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-orange-500/10">r/{lead.subreddit}</span>
                                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                                                                                lead.relevance === 'Best Match' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                                                lead.relevance === 'Good Match' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                                                'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                                                            }`}>
                                                                                {lead.relevance}
                                                                            </span>
                                                                            {lead.has_responded && (
                                                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 rounded-md border border-green-500/20 text-[9px] font-black uppercase tracking-widest">
                                                                                    <CheckCircle2 size={10} /> Responded
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 ml-auto">
                                                                            <a href={lead.url} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-600 hover:text-white transition-colors">
                                                                                <ExternalLink size={14} />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="text-xs sm:text-sm font-bold text-text-secondary group-hover:text-gray-200 leading-relaxed tracking-tight line-clamp-3 transition-all">{lead.title}</h4>
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setDraftingLead(lead as any);
                                                                        }}
                                                                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground border border-primary text-[10px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-1.5 group/btn whitespace-nowrap"
                                                                        title="Open Reply Generator"
                                                                    >
                                                                        <MessageSquarePlus size={12} className="text-primary-foreground" />
                                                                        Draft Reply
                                                                    </button>

                                                                    {lead.id && (
                                                                        <>
                                                                            <button 
                                                                                onClick={() => toggleResponded(lead)}
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
                                                                                onClick={() => toggleSaved(lead)}
                                                                                className={`p-1.5 rounded-lg transition-all duration-200 ${
                                                                                    lead.is_saved 
                                                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                                                                        : 'bg-white/5 text-text-secondary hover:text-primary hover:bg-primary/10'
                                                                                }`}
                                                                                title={lead.is_saved ? "Unsave Lead" : "Save Lead"}
                                                                            >
                                                                                <Bookmark size={14} fill={lead.is_saved ? 'currentColor' : 'none'} />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </motion.div>

                    {/* Removed trial access footer */}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}
