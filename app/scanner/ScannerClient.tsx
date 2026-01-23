'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Zap, User, ArrowRight, CheckCircle2, Loader2, Sparkles, MessageCircle, ExternalLink, Lock, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

// --- Types ---
interface RedditLead {
    subreddit: string;
    title: string;
    url: string;
}

interface ScannerClientProps {
    initialUser: SupabaseUser | null;
}

export default function ScannerClient({ initialUser }: ScannerClientProps) {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [results, setResults] = useState<RedditLead[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [scanCount, setScanCount] = useState(0);
    const [user, setUser] = useState<SupabaseUser | null>(initialUser);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const searchParams = useSearchParams();
    const supabase = createClient();

    // Handle auto-scan from query params
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam && !isScanning && results.length === 0) {
            setUrl(urlParam);
            // Small delay to ensure state is set and UI is ready
            const timer = setTimeout(() => {
                const mockEvent = { preventDefault: () => {} } as React.FormEvent;
                handleScan(mockEvent, urlParam);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    // Load scan count from localStorage and check user session on mount
    useEffect(() => {
        const savedCount = localStorage.getItem('rl_scan_count');
        if (savedCount) setScanCount(parseInt(savedCount));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const scanSteps = [
        "Analyzing website branding...",
        "Extracting target audience pain points...",
        "Scanning live Reddit communities...",
        "Filtering for purchase intent...",
        "Generating match scores..."
    ];

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

        if (!user && scanCount >= 10) {
            setShowModal(true);
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
                if (data.code === 'LIMIT_REACHED' || data.code === 'DAILY_LIMIT_REACHED') {
                    setShowModal(true);
                    return;
                }
                throw new Error(data.error || 'Scan failed');
            }

            if (data.leads) {
                setResults(data.leads);
                // Open the first group by default
                const subreddits = Array.from(new Set(data.leads.map((l: any) => l.subreddit)));
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

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/scanner`,
            },
        });
    };

    return (
        <main className="min-h-screen bg-[#1a1a1a] text-white selection:bg-orange-500/30">
            <Navbar />
            
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
                            <Sparkles size={12} /> Free Reddit Scanner
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                            {user ? (
                                <>Welcome back, <br/><span className="text-orange-500 italic font-serif">{user.email?.split('@')[0]}</span></>
                            ) : (
                                <>Who is talking about <br/><span className="text-orange-500 italic font-serif">your business?</span></>
                            )}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            {user 
                                ? "You're all set. Drop a URL below to find high-intent leads across Reddit's biggest communities."
                                : "Drop your website URL and let RedLeads find relevant Reddit threads where people are searching for what you solve."
                            }
                        </p>
                    </motion.div>

                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleScan}
                        className="mt-12 relative max-w-2xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Globe className="text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-[#252525] border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-lg focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-600"
                                required
                            />
                            
                            {(() => {
                                let isValid = false;
                                if (url && url.trim().length >= 3) {
                                    let testUrl = url.trim();
                                    if (!/^https?:\/\//i.test(testUrl)) testUrl = `https://${testUrl}`;
                                    try {
                                        const parsed = new URL(testUrl);
                                        isValid = parsed.hostname.includes('.');
                                    } catch {}
                                }
                                
                                return (
                                    <button 
                                        type="submit"
                                        disabled={isScanning}
                                        className={`absolute right-2 top-2 bottom-2 px-8 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                                            isValid 
                                                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20' 
                                                : 'bg-white/5 text-gray-500 grayscale cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        {isScanning ? <Loader2 className="animate-spin" size={18} /> : ((!user && scanCount >= 2) ? <User size={18} /> : <Search size={18} />)}
                                        {isScanning ? 'Scanning...' : ((!user && scanCount >= 2) ? 'Sign in to Scan' : 'Scan Reddit')}
                                    </button>
                                );
                            })()}
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
                    </motion.form>
                </div>
            </section>

            <section className="pb-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence>
                        {results.length > 0 && !isScanning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{results.length} Priority Leads Found</h2>
                                            <p className="text-sm text-gray-500 font-mono tracking-tighter uppercase">Search Intensity: High</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                        <CheckCircle2 size={12} /> 98% Match Confidence
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(
                                        results.reduce((acc, lead) => {
                                            if (!acc[lead.subreddit]) acc[lead.subreddit] = [];
                                            acc[lead.subreddit].push(lead);
                                            return acc;
                                        }, {} as Record<string, RedditLead[]>)
                                    ).map(([subreddit, leads], setIndex) => {
                                        const isOpen = openGroups[subreddit];
                                        // Artificial Scarcity: show only 70% of results if not logged in
                                        const totalLeads = leads.length;
                                        const visibleLimit = user ? totalLeads : Math.ceil(totalLeads * 0.7);
                                        const visibleLeads = leads.slice(0, visibleLimit);
                                        const hiddenCount = totalLeads - visibleLimit;

                                        return (
                                            <div key={subreddit} className="bg-[#252525]/40 border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-white/10">
                                                {/* Group Header / Dropdown Toggle */}
                                                <button
                                                    onClick={() => setOpenGroups(prev => ({ ...prev, [subreddit]: !prev[subreddit] }))}
                                                    className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
                                                            <MessageCircle size={18} />
                                                        </div>
                                                        <div className="text-left">
                                                            <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">r/{subreddit}</h3>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{totalLeads} Potential Leads</p>
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                                        className="text-gray-600"
                                                    >
                                                        <ChevronDown size={20} />
                                                    </motion.div>
                                                </button>

                                                {/* Leads List */}
                                                <AnimatePresence mode="wait">
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="px-6 pb-6"
                                                        >
                                                            <div className="divide-y divide-white/5 pt-2">
                                                                {visibleLeads.map((lead, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="group flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 hover:bg-white/[0.02] rounded-xl transition-all"
                                                                    >
                                                                        <div className="flex items-center gap-4 flex-grow min-w-0 pr-4">
                                                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                                                                                <Zap size={14} />
                                                                            </div>
                                                                            <h4 className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors truncate">
                                                                                {lead.title}
                                                                            </h4>
                                                                        </div>
                                                                        <Link 
                                                                            href={lead.url} 
                                                                            target="_blank"
                                                                            className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 flex items-center gap-1.5 transition-colors"
                                                                        >
                                                                            View Post <ExternalLink size={12} className="opacity-50" />
                                                                        </Link>
                                                                    </div>
                                                                ))}

                                                                {!user && hiddenCount > 0 && (
                                                                    <div className="relative group/lock">
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent z-10" />
                                                                        <div className="relative z-20 flex flex-col items-center gap-4 py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl backdrop-blur-[2px]">
                                                                            <div className="flex items-center gap-2 text-orange-500/80">
                                                                                <Lock size={16} />
                                                                                <span className="text-sm font-bold">{hiddenCount} more target leads hidden</span>
                                                                            </div>
                                                                            <button 
                                                                                onClick={handleSignIn}
                                                                                className="group flex items-center gap-2 px-6 py-3 bg-[#f25e36] text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
                                                                            >
                                                                                Unlock more leads <ArrowRight size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>

                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 p-8 rounded-[2.5rem] mt-12 group"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-110">
                                        <Zap size={120} fill="white" />
                                    </div>
                                    <div className="relative z-10 max-w-xl space-y-4">
                                        <h3 className="text-3xl font-black text-black leading-tight">
                                            Get Live Leads Flowing Daily?
                                        </h3>
                                        <p className="text-black/80 font-medium text-lg">
                                            Don't miss a single conversation. Get real-time alerts whenever someone on Reddit needs exactly what you built.
                                        </p>
                                        <button 
                                            onClick={user ? undefined : handleSignIn}
                                            className={`inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-sm transition-all shadow-xl ${user ? 'cursor-default opacity-90' : 'hover:scale-105 active:scale-95'}`}
                                        >
                                            {user ? 'You are on the waitlist' : 'Join the waitlist'} <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#252525] border border-white/10 p-10 rounded-[2.5rem] shadow-3xl text-center"
                        >
                            <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User size={28} />
                            </div>
                            <h2 className="text-3xl font-black mb-4 leading-tight">Limit Reached</h2>
                            <p className="text-gray-400 mb-8 font-light">
                                {user 
                                    ? "You've used your 10 free scans for today. Come back tomorrow or upgrade for unlimited access!"
                                    : "You've used your free scans for today. Sign in to track your 10 daily scans or join the waitlist for unlimited access!"
                                }
                            </p>
                            <div className="space-y-4">
                                <button 
                                    onClick={handleSignIn}
                                    className="w-full py-5 bg-orange-500 hover:bg-orange-600 rounded-2xl font-black uppercase text-sm text-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/20"
                                >
                                    Sign in with Google <ArrowRight size={18} />
                                </button>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-4 text-gray-500 hover:text-white text-xs font-bold uppercase transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                            <p className="mt-8 text-[10px] text-gray-600 uppercase font-black tracking-widest border-t border-white/5 pt-6">
                                Join 50+ founders monitoring Reddit 24/7
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
