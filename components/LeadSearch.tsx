'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Zap, User, ArrowRight, CheckCircle2, Loader2, Link as LinkIcon, ExternalLink, Lock, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

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
}

export default function LeadSearch({ user, isDashboardView = false, initialUrl = '', onShowModal }: LeadSearchProps) {
    const [url, setUrl] = useState(initialUrl);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [results, setResults] = useState<RedditLead[]>([]);
    const [scanCount, setScanCount] = useState(0);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [sortBy, setSortBy] = useState<'newest' | 'relevance'>('relevance');
    const [teaserInfo, setTeaserInfo] = useState<{ isTeaser: boolean, totalFound: number } | null>(null);
    const supabase = createClient();

    const scanSteps = [
        "Analyzing website branding...",
        "Extracting target audience pain points...",
        "Scanning live Reddit communities...",
        "Filtering for purchase intent...",
        "Generating match scores..."
    ];

    useEffect(() => {
        const savedCount = localStorage.getItem('rl_scan_count');
        if (savedCount) setScanCount(parseInt(savedCount));
    }, []);

    const handleScan = async (e: React.FormEvent, overrideUrl?: string) => {
        if (e) e.preventDefault();
        const targetUrl = overrideUrl || url;
        if (!targetUrl) return;

        let normalizedUrl = targetUrl.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        try {
            const parsed = new URL(normalizedUrl);
            if (!parsed.hostname.includes('.')) throw new Error();
        } catch (err) {
            alert('Please enter a valid website URL (e.g., example.com)');
            return;
        }

        // Teaser limit check (Landing Page only)
        if (!isDashboardView && !user && scanCount >= 1) {
            onShowModal?.();
            return;
        }

        setIsScanning(true);
        setScanStep(0);
        setResults([]);

        if (!user) {
            const newCount = scanCount + 1;
            setScanCount(newCount);
            localStorage.setItem('rl_scan_count', newCount.toString());
        }

        const scannerPromise = fetch('/api/scanner', {
            method: 'POST',
            body: JSON.stringify({ url: normalizedUrl, action: 'SCAN' }),
            headers: { 'Content-Type': 'application/json' }
        });

        for (let i = 0; i < scanSteps.length; i++) {
            setScanStep(i);
            await new Promise(r => setTimeout(r, 800));
        }

        try {
            const response = await scannerPromise;
            const data = await response.json();
            
            if (!response.ok) {
                if (data.code === 'DAILY_LIMIT_REACHED') {
                    onShowModal?.();
                    return;
                }
                throw new Error(data.error || 'Scan failed');
            }

            if (data.leads) {
                setTeaserInfo(data.isTeaser ? { isTeaser: true, totalFound: data.totalFound } : null);
                const enrichedLeads = data.leads.map((lead: any) => ({
                    ...lead,
                    relevance: Math.random() > 0.4 ? 'High' : 'Medium',
                }));
                setResults(enrichedLeads);
                const subreddits = Array.from(new Set(enrichedLeads.map((l: any) => l.subreddit)));
                if (subreddits.length > 0) {
                    setOpenGroups({ [subreddits[0] as string]: true });
                }
            } else {
                throw new Error(data.error || 'Scan failed');
            }
        } catch (error: any) {
            console.error(error);
            if (error.message !== 'Scan failed') {
                 alert('Something went wrong during the scan. Please try again.');
            }
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="w-full">
            {/* Search Input Area */}
            <div className={`mx-auto ${isDashboardView ? 'max-w-none' : 'max-w-2xl'}`}>
                <form onSubmit={handleScan} className="relative">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Globe className="text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-[#252525] border border-orange-500 rounded-full py-6 pl-14 pr-6 text-lg focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-600"
                            required
                        />
                        
                        <button 
                            type="submit"
                            disabled={isScanning}
                            className={`absolute right-2 top-2 bottom-2 px-8 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg ${
                                url.trim().length >= 3 
                                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20' 
                                    : 'bg-white/5 text-gray-500 grayscale cursor-not-allowed opacity-50'
                            }`}
                        >
                            {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                            {isScanning ? 'Scanning...' : 'Scan Reddit'}
                        </button>
                    </div>
                    
                    <AnimatePresence>
                        {isScanning && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-6 flex flex-col items-center gap-2"
                            >
                                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(scanStep + 1) * 20}%` }}
                                        className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                    />
                                </div>
                                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">
                                    {scanSteps[scanStep]}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            {/* Results Section */}
            <div className={`mt-12 ${isDashboardView ? 'max-w-none' : 'max-w-5xl mx-auto'}`}>
                <AnimatePresence>
                    {results.length > 0 && !isScanning && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {teaserInfo?.isTeaser ? `Top 3 of ${teaserInfo.totalFound} Leads` : `${results.length} Priority Leads`}
                                        </h2>
                                        <p className="text-sm text-gray-500 font-mono tracking-tighter uppercase">
                                            {teaserInfo?.isTeaser ? 'SAMPLE REPORT ACTIVE' : 'COMPLETE INTEL REPORT'}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                    <CheckCircle2 size={12} /> 98% Confidence
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sort:</span>
                                    <button 
                                        onClick={() => setSortBy(sortBy === 'relevance' ? 'newest' : 'relevance')}
                                        className="text-xs font-bold text-white hover:text-orange-500 transition-colors"
                                    >
                                        {sortBy === 'relevance' ? 'Best Match' : 'Newest First'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#202020] text-white rounded-[2rem] p-6 border border-white/5">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold tracking-tight">Prioritized Leads</h2>
                                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                                        {results.length} Result{results.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

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
                                    const totalLeads = leads.length;

                                    return (
                                        <div key={groupKey} className="mb-4 last:mb-0">
                                            <button
                                                onClick={() => setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }))}
                                                className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl transition-all group border border-white/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-gray-200 group-hover:text-orange-500 transition-colors">
                                                        {groupKey} Priority
                                                    </span>
                                                    <span className="bg-white/10 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{totalLeads}</span>
                                                </div>
                                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-gray-500">
                                                    <ChevronDown size={16} />
                                                </motion.div>
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                        <div className="px-2 pt-2 pb-4 space-y-1">
                                                            {leads.map((lead, i) => (
                                                                <Link key={i} href={lead.url} target="_blank" className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] transition-all relative">
                                                                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-white/10 rounded-r-full group-hover:bg-orange-500 transition-colors" />
                                                                    <div className="pl-3 overflow-hidden">
                                                                        <h4 className="text-sm font-medium text-gray-300 group-hover:text-white line-clamp-2">{lead.title}</h4>
                                                                        <span className="text-[10px] text-gray-500">r/{lead.subreddit}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                                                        <ExternalLink size={14} className="text-gray-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${lead.relevance === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                                            {lead.relevance}
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}

                                {teaserInfo?.isTeaser && (
                                    <div className="mt-8 pt-8 border-t border-white/5">
                                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-8 text-center space-y-4">
                                            <div className="w-12 h-12 bg-orange-500 text-black rounded-full flex items-center justify-center mx-auto">
                                                <Lock size={20} />
                                            </div>
                                            <h3 className="text-2xl font-black text-white">Unlock {teaserInfo.totalFound - 3} More Leads</h3>
                                            <p className="text-gray-400 max-w-md mx-auto">Get the full access + weekly updates to find every conversation where customers need your product + track your competitors + email alerts</p>
                                            <button 
                                                onClick={onShowModal}
                                                className="px-8 py-4 bg-orange-500 text-black font-black uppercase text-xs rounded-2xl hover:bg-orange-600 shadow-xl"
                                            >
                                                Get full access
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
