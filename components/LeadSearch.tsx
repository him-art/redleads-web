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
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [teaserInfo, setTeaserInfo] = useState<{ isTeaser: boolean, totalFound: number } | null>(null);
    const { draftingLead, setDraftingLead, profile } = useDashboardData();
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
            setUrl(initialUrl);
            hasAutoScanned.current = true;
            handleScan(null as any);
            
            // Mark initial scan as done in DB so it never re-fires on refresh
            if (user?.id) {
                supabase.from('profiles').update({ has_initial_scan: true }).eq('id', user.id).then();
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
    }, [initialUrl, initialLeads, autoScan]);

    const scanSteps = [
        "Analyzing target product model...",
        "Identifying high-intent keywords...",
        "Querying global Reddit communities...",
        "Filtering for social selling signals...",
        "Finalizing intel report..."
    ];

    const handleScan = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!url) return;

        let normalizedUrl = url.trim();
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
        setScanStep(0);
        setResults([]);



        const scannerPromise = fetch('/api/scanner', {
            method: 'POST',
            body: JSON.stringify({ url: normalizedUrl, action: 'SCAN', timeRange }),
            headers: { 'Content-Type': 'application/json' }
        });

        // Sophisticated progress loop
        const interval = setInterval(() => {
            setScanStep(s => (s < scanSteps.length - 1 ? s + 1 : s));
        }, 1200);

        try {
            const response = await scannerPromise;
            const data = await response.json();
            
            clearInterval(interval);

            if (response.status === 403 && data.code === 'DAILY_LIMIT_REACHED') {
                onShowModal?.();
                return;
            }

            if (data.leads) {
                setTeaserInfo(data.isTeaser ? { isTeaser: true, totalFound: data.totalFound } : null);
                const enrichedLeads = data.leads.map((lead: any) => ({
                    ...lead,
                    relevance: lead.match_category || 'Good Match',
                }));
                setResults(enrichedLeads);
                onResultsFound?.(enrichedLeads.length);
                if (enrichedLeads.length > 0) {
                    setOpenGroups({ 'Best Match': true, 'Good Match': true, 'Low': true });
                }
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsScanning(false);
            setScanStep(0);
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
                            className={`w-full bg-black/50 border border-white/10 rounded-2xl py-4 sm:py-6 pl-12 sm:pl-16 pr-24 sm:pr-32 text-base sm:text-lg focus:outline-none focus:bg-black/70 focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,88,54,0.15)] transition-all placeholder:text-text-secondary/60 font-medium tracking-tight text-text-primary shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] ${isLocked ? 'cursor-default' : ''}`}
                        />
                        <button 
                            type="submit"
                            disabled={isScanning || url.trim().length < 3}
                            className={`absolute right-2 sm:right-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest transition-all duration-300 flex items-center gap-2 ${
                                !isScanning && url.trim().length >= 3 
                                    ? 'bg-primary hover:bg-[#ff6900] transform hover:scale-[1.03] active:scale-95 hover:shadow-[0_0_30px_rgba(255,88,54,0.5)] text-white shadow-[0_0_15px_rgba(255,88,54,0.3)]' 
                                    : 'bg-white/5 text-text-secondary cursor-not-allowed opacity-50'
                            }`}
                        >
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
                                exit={{ opacity: 0 }}
                                className="mt-4 flex items-center justify-center gap-2"
                            >
                                <MaterialIcon name="activity" size={12} className="text-primary/50" />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary animate-pulse">
                                    {scanSteps[scanStep]}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            {/* Results Section */}
            <AnimatePresence>
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
                                {teaserInfo?.isTeaser ? `Top 3 Sample Leads` : `Intel Report: ${results.length} Potential Leads`}
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
                                                    {(() => {
                                                        const isTrialUser = profile?.subscription_tier === 'trial' || profile?.subscription_tier === 'free';
                                                        const visibleCount = isTrialUser ? Math.ceil(leads.length / 2) : leads.length;
                                                        const visibleLeads = leads.slice(0, visibleCount);
                                                        const blurredLeads = leads.slice(visibleCount);

                                                        return (
                                                            <>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {visibleLeads.map((lead, i) => (
                                                                        <div key={i} className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all relative overflow-hidden flex flex-col justify-between gap-4">
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
                                                                                <h4 className="text-xs sm:text-sm font-bold text-text-secondary group-hover:text-text-primary leading-relaxed tracking-tight line-clamp-3 transition-all">{lead.title}</h4>
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
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {blurredLeads.length > 0 && (
                                                                    <div className="relative mt-4">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 filter blur-md opacity-50 select-none pointer-events-none">
                                                                            {blurredLeads.map((lead, i) => (
                                                                                <div key={`blurred-${i}`} className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden">
                                                                                    <div className="flex flex-col h-full justify-between gap-4">
                                                                                        <div className="space-y-3">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-orange-500/10">r/{lead.subreddit}</span>
                                                                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-gray-500/10 text-gray-500 border border-gray-500/20">{lead.relevance} Match</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <h4 className="text-xs sm:text-sm font-bold text-text-secondary leading-relaxed tracking-tight line-clamp-3">{lead.title.replace(/./g, '█')}</h4>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center">
                                                                           <div className="bg-black/60 p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center">
                                                                               <MaterialIcon name="lock" size={28} className="text-orange-500 mb-3" />
                                                                               <h4 className="text-white font-bold text-lg mb-2">🔒 {blurredLeads.length} more {groupKey} relevancy leads</h4>
                                                                               <p className="text-sm text-gray-400 mb-4 max-w-sm">Upgrade to unlock the second half of these high-intent leads and directly engage with them.</p>
                                                                               <button 
                                                                                   onClick={() => {
                                                                                       if (onNavigate) {
                                                                                           onNavigate('billing');
                                                                                       } else {
                                                                                           router.push('/dashboard?tab=billing');
                                                                                       }
                                                                                   }} 
                                                                                   className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
                                                                               >
                                                                                   Unlock Full Results
                                                                               </button>
                                                                           </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </motion.div>

                    {teaserInfo?.isTeaser && (
                        <div className="pt-8 flex flex-col items-center text-center space-y-6">
                            <div className="h-[1px] w-20 bg-white/10" />
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                                    <MaterialIcon name="lock" size={16} className="text-gray-500" /> 
                                    {teaserInfo.totalFound - 3} additional leads filtered
                                </h3>
                                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                                    Unlock the full intelligence report and watch your dashboard populate automatically.
                                </p>
                            </div>
                            <button 
                                onClick={onShowModal}
                                className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Get Full Access
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}
