'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Compass, ExternalLink, Lock, Loader2, ChevronDown, Activity, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import ReplyModal from './dashboard/ReplyModal';

interface RedditLead {
    subreddit: string;
    title: string;
    url: string;
    relevance: 'High' | 'Medium' | 'Low';
}

interface LeadSearchProps {
    user: SupabaseUser | null;
    isDashboardView?: boolean;
    initialUrl?: string;
    onShowModal?: () => void;
    onResultsFound?: (count: number) => void;
    initialLeads?: RedditLead[];
    autoScan?: boolean;
}

export default function LeadSearch({ user, isDashboardView = false, initialUrl = '', initialLeads = [], autoScan = false, onShowModal, onResultsFound }: LeadSearchProps) {
    const [url, setUrl] = useState(initialUrl);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [results, setResults] = useState<RedditLead[]>([]);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [teaserInfo, setTeaserInfo] = useState<{ isTeaser: boolean, totalFound: number } | null>(null);
    const [draftingLead, setDraftingLead] = useState<any | null>(null);
    const [productContext, setProductContext] = useState('');
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasAutoScanned = useRef(false);

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
                setOpenGroups({ 'High': true, 'Medium': true });
            }
            onResultsFound?.(initialLeads.length);
            hasAutoScanned.current = true; // Prevent duplicate scan
        } else if (autoScan && initialUrl && !isScanning && results.length === 0 && !hasAutoScanned.current) {
            setUrl(initialUrl);
            hasAutoScanned.current = true;
            handleScan(null as any);
            
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
            body: JSON.stringify({ url: normalizedUrl, action: 'SCAN' }),
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
                    relevance: lead.match_category || 'Medium',
                }));
                setResults(enrichedLeads);
                onResultsFound?.(enrichedLeads.length);
                if (enrichedLeads.length > 0) {
                    setOpenGroups({ 'High': true, 'Medium': true, 'Low': true });
                }


            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsScanning(false);
            setScanStep(0);
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
                                className="h-full bg-orange-500"
                            />
                        </div>
                    )}

                    <div className="relative flex items-center">
                        <div className="absolute left-4 sm:left-6 text-gray-500 group-focus-within:text-orange-500 transition-colors">
                            {isScanning ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
                        </div>
                        <input 
                            id="product-url-search"
                            name="product-url"
                            type="text" 
                            placeholder="Type product URL to scan..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isScanning}
                            suppressHydrationWarning
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 sm:py-6 pl-12 sm:pl-16 pr-24 sm:pr-32 text-base sm:text-lg focus:outline-none focus:bg-white/[0.05] focus:border-white/10 transition-all placeholder:text-gray-600 font-medium tracking-tight"
                        />
                        <button 
                            type="submit"
                            disabled={isScanning || url.trim().length < 3}
                            className={`absolute right-2 sm:right-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest transition-all ${
                                !isScanning && url.trim().length >= 3 
                                    ? 'bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-[pulse_3s_infinite]' 
                                    : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
                            }`}
                        >
                            {isScanning ? 'Analyzing' : 'Power Scan'}
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
                                <Activity size={12} className="text-orange-500/50" />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 animate-pulse">
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
                    <ReplyModal 
                        lead={draftingLead} 
                        productContext={productContext} 
                        onClose={() => setDraftingLead(null)} 
                    />
                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                <Search size={18} className="text-orange-500" />
                                {teaserInfo?.isTeaser ? `Top 3 Sample Leads` : `Intel Report: ${results.length} Matches`}
                            </h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                High-intent conversations identified
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(
                            results.reduce((acc, lead) => {
                                const groupKey = lead.relevance;
                                if (!acc[groupKey]) acc[groupKey] = [];
                                acc[groupKey].push(lead);
                                return acc;
                            }, {} as Record<string, RedditLead[]>)
                        )
                        .sort(([keyA], [keyB]) => {
                            const order: Record<string, number> = { 'High': 0, 'Medium': 1, 'Low': 2 };
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
                                        <ChevronDown size={14} className={`transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                                        {groupKey} RELEVANCY • {leads.length}
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {leads.map((lead, i) => (
                                                    <Link key={i} href={lead.url} target="_blank" className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all relative overflow-hidden">
                                                        <div className="flex flex-col h-full justify-between gap-4">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">r/{lead.subreddit}</span>
                                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                                                            lead.relevance === 'High' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                                            lead.relevance === 'Medium' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                                            'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                                                        }`}>
                                                                            {lead.relevance} Match
                                                                        </span>
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setDraftingLead(lead);
                                                                            }}
                                                                            className="ml-2 px-3 py-1.5 rounded-lg bg-[#ff914d] text-black border border-[#ff914d] text-[10px] font-black uppercase tracking-wider hover:bg-[#ff914d]/90 transition-all flex items-center gap-1.5 group/btn whitespace-nowrap"
                                                                            title="Open Reply Generator"
                                                                        >
                                                                            <MessageSquarePlus size={12} className="text-black" />
                                                                            Draft Reply
                                                                        </button>
                                                                    </div>
                                                                    <ExternalLink size={12} className="text-gray-600 group-hover:text-white transition-colors" />
                                                                </div>
                                                                <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white leading-relaxed line-clamp-3 transition-colors">{lead.title}</h4>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {teaserInfo?.isTeaser && (
                        <div className="pt-8 flex flex-col items-center text-center space-y-6">
                            <div className="h-[1px] w-20 bg-white/10" />
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                                    <Lock size={16} className="text-gray-500" /> 
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
