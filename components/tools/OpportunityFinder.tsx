'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Link from 'next/link';
import LoadingIcon from '@/components/ui/LoadingIcon';

interface SimpleLead {
    subreddit: string;
    title: string;
    url: string;
}

export default function OpportunityFinder() {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [dataPoints, setDataPoints] = useState(0);
    const [results, setResults] = useState<{ leads: SimpleLead[], totalFound: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadingMessages = [
        "Crawling target website for semantic signals...",
        "Extracting core value propositions...",
        "Querying Reddit neural graph for matching intent...",
        "Filtering through thousands of active discussions...",
        "Scoring potential opportunities by conversion intent...",
        "Generating high-intent lead report..."
    ];

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResults(null);

        if (!url.trim()) return;

        let normalizedUrl = url.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        setIsScanning(true);
        setLoadingStep(0);
        setLoadingProgress(0);
        setDataPoints(0);

        // Simulated progress logic for "Deep Work" feel
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 95) return prev;
                return prev + Math.random() * 15;
            });
            setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
            setDataPoints(prev => prev + Math.floor(Math.random() * 250000));
        }, 1200);

        try {
            const res = await fetch('/api/tools/opportunity-finder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: normalizedUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    setError(data.error);
                } else {
                    setError(data.error || "Scan failed. Please try again.");
                }
                return;
            }

            // Artificial delay to let the user see the "work" being done if request is too fast
            await new Promise(resolve => setTimeout(resolve, 4000));

            setResults({
                leads: data.leads,
                totalFound: data.totalFound
            });

        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            clearInterval(progressInterval);
            setIsScanning(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Outer Halo Layer */}
            <div className="p-2 bg-white/5 border border-orange-500/10 rounded-[2.5rem]">
                {/* Inner Core Card */}
                <div className="bg-[#0c0c0c] border border-orange-500/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group min-h-[400px]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <h3 className="text-2xl font-black text-white mb-2 relative z-10 uppercase tracking-tighter">Market Opportunity Scanner</h3>
                <p className="text-slate-400 mb-8 relative z-10 text-sm font-medium uppercase tracking-[0.1em]">Enter your product URL to find high-intent Reddit threads instantly.</p>

                <form onSubmit={handleScan} className="relative z-20 mb-8">
                    <div className="relative flex items-center">
                        <div className="absolute left-4 text-slate-500">
                           <MaterialIcon name="link" size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="e.g. yourwebsite.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-40 text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600 font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={isScanning || !url}
                            className={`absolute right-2 px-8 py-2.5 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all min-w-[120px] flex items-center justify-center gap-2 ${
                                isScanning || !url
                                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 shadow-orange-500/20'
                            }`}
                        >
                            {isScanning ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Scanning
                                </>
                            ) : (
                                'Find Leads'
                            )}
                        </button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6 flex items-center gap-2 justify-center">
                       <MaterialIcon name="error" size={16} />
                       {error}
                   </div>
                )}

                {/* Immersive Loading & Results Preview */}
                <AnimatePresence mode="wait">
                    {isScanning ? (
                        <motion.div 
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-12 flex flex-col items-center justify-center text-center relative z-10"
                        >
                            <div className="mb-8 relative">
                                <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-orange-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MaterialIcon name="hub" size={28} className="text-orange-500 animate-pulse" />
                                </div>
                            </div>

                            <motion.p 
                                key={loadingStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-lg font-black text-white mb-4 tracking-tight"
                            >
                                {loadingMessages[loadingStep]}
                            </motion.p>
                            
                            <div className="w-full max-w-sm bg-white/5 h-1.5 rounded-full overflow-hidden mb-6">
                                <motion.div 
                                    className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${loadingProgress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="flex flex-col gap-1 items-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Cross-Referencing Neural Nodes</span>
                                <span className="text-xl font-mono font-black text-orange-500/70 tracking-tighter">
                                    {dataPoints.toLocaleString()} <span className="text-[10px] text-slate-600 uppercase">Signals</span>
                                </span>
                            </div>
                        </motion.div>
                    ) : results ? (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4 relative z-10"
                        >
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                                <span>Targeting {results.leads.length} High-Intent Signals</span>
                            </div>

                            {results.leads.map((lead, i) => (
                                <Link 
                                    key={i} 
                                    href={lead.url} 
                                    target="_blank"
                                    className="block p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group/card"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full tracking-wider">r/{lead.subreddit}</span>
                                        <MaterialIcon name="open_in_new" size={12} className="text-slate-600 group-hover/card:text-white transition-colors" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-300 group-hover/card:text-white line-clamp-1 tracking-tight">
                                        {lead.title}
                                    </h4>
                                </Link>
                            ))}
                            
                            {/* Upsell Card */}
                            <div className="pt-8 text-center border-t border-white/5">
                                <h4 className="text-white font-bold mb-3">Unlock 35+ Hidden Leads</h4>
                                <p className="text-sm text-slate-500 mb-6 font-medium">Create an account to unlock unlimited research and 24/7 automated monitoring.</p>
                                <Link 
                                    href="/login"
                                    className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-full text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                                >
                                    Unlock Full Monitoring
                                    <MaterialIcon name="trending_up" size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
