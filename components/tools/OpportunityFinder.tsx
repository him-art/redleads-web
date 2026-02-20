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
    const [results, setResults] = useState<{ leads: SimpleLead[], totalFound: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

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

        try {
            const res = await fetch('/api/tools/opportunity-finder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: normalizedUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    setError("Daily limit reached. Sign up for free to unlock unlimited scans.");
                } else {
                    setError(data.error || "Scan failed. Please try again.");
                }
                return;
            }

            setResults({
                leads: data.leads,
                totalFound: data.totalFound
            });

        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-all duration-1000" />
                
                <h3 className="text-2xl font-black text-white mb-2 relative z-10">See who's talking about your product</h3>
                <p className="text-slate-400 mb-8 relative z-10">Enter your product URL to find high-intent Reddit threads instantly.</p>

                <form onSubmit={handleScan} className="relative z-10 mb-8">
                    <div className="relative flex items-center">
                        <div className="absolute left-4 text-slate-500">
                           <MaterialIcon name="link" size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="e.g. yourwebsite.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-600"
                        />
                        <button 
                            type="submit"
                            disabled={isScanning || !url}
                            className={`absolute right-2 px-6 py-2.5 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${
                                isScanning || !url
                                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20'
                            }`}
                        >
                            {isScanning ? (
                                <div className="flex items-center gap-2">
                                    <LoadingIcon className="w-3 h-3" />
                                    <span>Scanning</span>
                                </div>
                            ) : (
                                'Find Leads'
                            )}
                        </button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6 flex items-center gap-2">
                       <MaterialIcon name="error" size={16} />
                       {error}
                   </div>
                )}

                {/* Results Preview */}
                <AnimatePresence>
                    {results && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                <span>Found {results.totalFound} Potential Leads</span>
                            </div>

                            {results.leads.map((lead, i) => (
                                <Link 
                                    key={i} 
                                    href={lead.url} 
                                    target="_blank"
                                    className="block p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group/card"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">r/{lead.subreddit}</span>
                                        <MaterialIcon name="open_in_new" size={12} className="text-slate-600 group-hover/card:text-white transition-colors" />
                                    </div>
                                    <h4 className="text-sm font-medium text-slate-300 group-hover/card:text-white line-clamp-1">
                                        {lead.title}
                                    </h4>
                                </Link>
                            ))}
                            
                            {/* Upsell Blur */}
                            <div className="relative p-6 bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 rounded-xl text-center overflow-hidden">
                                <div className="absolute inset-0 backdrop-blur-[2px] z-0" />
                                <div className="relative z-10">
                                    <MaterialIcon name="lock" size={24} className="text-orange-500 mb-3 mx-auto" />
                                    <h4 className="text-white font-bold mb-2">Unlock {results.totalFound - 5}+ More Leads</h4>
                                    <p className="text-sm text-slate-400 mb-4">Create a free account to see all results and get daily alerts.</p>
                                    <Link 
                                        href="/login"
                                        className="inline-block px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:scale-105 transition-transform"
                                    >
                                        View Full Report
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
