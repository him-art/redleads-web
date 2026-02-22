'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Link from 'next/link';

interface NicheData {
    subreddits: Array<{ name: string; relevance: number; reason: string }>;
    painPoints: Array<{ quote: string; context: string; url: string }>;
    vibeKeywords: string[];
}

export default function NicheExplorer() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [dataPoints, setDataPoints] = useState(0);
    const [data, setData] = useState<NicheData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadingMessages = [
        "Initializing deep scan of Reddit clusters...",
        "Analyzing 4.2M+ active discussions...",
        "Identifying high-intent user segments...",
        "Calculating keyword relevance scores...",
        "Decoding community sentiment patterns...",
        "Finalizing niche intelligence report..."
    ];

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setLoadingStep(0);
        setLoadingProgress(0);
        setDataPoints(0);
        setError(null);
        setData(null);

        // Simulated progress logic for "Deep Work" feel
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 95) return prev;
                return prev + Math.random() * 15;
            });
            setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
            setDataPoints(prev => prev + Math.floor(Math.random() * 450000));
        }, 1200);

        try {
            const res = await fetch('/api/tools/niche-explorer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    setError(result.error);
                } else {
                    setError(result.error || "Failed to analyze niche.");
                }
                return;
            }

            // Artificial delay to let the user see the "work" being done if request is too fast
            await new Promise(resolve => setTimeout(resolve, 4000));
            setData(result);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            clearInterval(progressInterval);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            {/* Outer Halo Layer */}
            <div className="p-2 bg-white/5 border border-orange-500/10 rounded-[2.5rem]">
                {/* Inner Core Card */}
                <div className="bg-[#0c0c0c] border border-orange-500/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden min-h-[400px]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Reddit Niche Intelligence</h3>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.1em]">Discover where your audience hangs out and what makes them frustrated.</p>
                </div>

                <form onSubmit={handleSearch} className="mb-12 relative z-20">
                    <div className="relative flex items-center max-w-2xl mx-auto">
                        <div className="absolute left-5 text-slate-500">
                           <MaterialIcon name="explore" size={24} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="e.g. Fitness tracker, Website builder..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-40 text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600 font-medium text-lg"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading || !query}
                            className={`absolute right-3 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all min-w-[140px] flex items-center justify-center gap-2 ${
                                isLoading || !query
                                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Scanning
                                </>
                            ) : 'Start Research'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6 flex items-center gap-2 justify-center max-w-md mx-auto">
                        <MaterialIcon name="error_outline" size={16} />
                        {error}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-12 flex flex-col items-center justify-center text-center relative z-10"
                        >
                            <div className="mb-8 relative">
                                <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-orange-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MaterialIcon name="psychology" size={32} className="text-orange-500 animate-pulse" />
                                </div>
                            </div>

                            <motion.p 
                                key={loadingStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-black text-white mb-4 tracking-tight"
                            >
                                {loadingMessages[loadingStep]}
                            </motion.p>
                            
                            <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden mb-6">
                                <motion.div 
                                    className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${loadingProgress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="flex flex-col gap-1 items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Processing Intelligence Streams</span>
                                <span className="text-2xl font-mono font-black text-orange-500/80 tracking-tighter">
                                    {dataPoints.toLocaleString()} <span className="text-xs text-slate-600">UNITS</span>
                                </span>
                            </div>
                        </motion.div>
                    ) : data ? (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-12"
                        >
                            {/* Subreddits Section */}
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">
                                        <MaterialIcon name="groups" size={16} className="text-orange-500" />
                                        Primary Subreddits
                                    </h4>
                                    <div className="space-y-4">
                                        {data.subreddits.map((sub, i) => (
                                            <div key={i} className="group">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-white font-bold text-sm">r/{sub.name}</span>
                                                    <span className="text-xs text-slate-500 font-medium">{sub.relevance}% Relevance</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${sub.relevance}%` }}
                                                        transition={{ delay: i * 0.1, duration: 1 }}
                                                        className="h-full bg-orange-500/80 group-hover:bg-orange-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">
                                        <MaterialIcon name="psychology" size={16} className="text-orange-500" />
                                        Niche Keywords
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.vibeKeywords.map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs font-bold hover:border-orange-500/30 hover:text-white transition-all">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-8 p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                        <p className="text-xs text-slate-400 leading-relaxed italic">
                                            "Marketers in this niche find the most success by focusing on **{data.vibeKeywords[0]}** and **{data.vibeKeywords[1]}**."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pain Points Section */}
                            <div>
                                <h4 className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">
                                    <MaterialIcon name="warning" size={16} className="text-red-500" />
                                    Active Pain Points (Frustrations)
                                </h4>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {data.painPoints.map((pp, i) => (
                                        <Link 
                                            key={i} 
                                            href={pp.url} 
                                            target="_blank"
                                            className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.07] hover:border-white/10 transition-all flex flex-col justify-between"
                                        >
                                            <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{pp.quote}"</p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[120px]">
                                                    {pp.context}
                                                </span>
                                                <MaterialIcon name="north_east" size={12} className="text-slate-600" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="pt-8 text-center border-t border-white/5">
                                <h4 className="text-white font-bold mb-3">Want more depth?</h4>
                                <p className="text-sm text-slate-500 mb-6">Create an account to unlock unlimited research and 24/7 automated monitoring.</p>
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
