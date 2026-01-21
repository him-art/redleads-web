'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Zap, Lock, Mail, ArrowRight, CheckCircle2, Loader2, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// --- Types ---
interface RedditLead {
    subreddit: string;
    title: string;
    url: string;
}

export default function ScannerPage() {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const [results, setResults] = useState<RedditLead[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const scanSteps = [
        "Analyzing website branding...",
        "Extracting target audience pain points...",
        "Scanning live Reddit communities...",
        "Filtering for purchase intent...",
        "Generating match scores..."
    ];

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsScanning(true);
        setScanStep(0);
        setResults([]);

        // Simulate scanning steps for UI feel
        const scannerPromise = fetch('/api/scanner', {
            method: 'POST',
            body: JSON.stringify({ url, action: 'SCAN' }),
            headers: { 'Content-Type': 'application/json' }
        });

        for (let i = 0; i < scanSteps.length; i++) {
            setScanStep(i);
            await new Promise(r => setTimeout(r, 800));
        }

        try {
            const response = await scannerPromise;
            const data = await response.json();
            if (data.leads) {
                setResults(data.leads);
            } else {
                throw new Error(data.error || 'Scan failed');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong during the scan. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/scanner', {
                method: 'POST',
                body: JSON.stringify({ email, url, action: 'UNLOCK' }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                setIsUnlocked(true);
                setShowModal(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#1a1a1a] text-white selection:bg-orange-500/30">
            <Navbar />
            
            {/* Hero / Input Section */}
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
                            Who is talking about <br/>
                            <span className="text-orange-500 italic font-serif">your business?</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Drop your website URL. Our AI will analyze your niche and find 5 live Reddit threads where people are searching for what you solve.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
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
                                type="url" 
                                placeholder="https://yourwebsite.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-[#252525] border border-white/10 rounded-2xl py-6 pl-14 pr-40 text-lg focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-600"
                                required
                            />
                            <button 
                                type="submit"
                                disabled={isScanning}
                                className="absolute right-2 top-2 bottom-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-white px-8 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                {isScanning ? 'Scanning...' : 'Scan Reddit'}
                            </button>
                        </div>
                        
                        {/* Scanning Progress */}
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

            {/* Results Section */}
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
                                            <h2 className="text-2xl font-bold">5 Priority Leads Found</h2>
                                            <p className="text-sm text-gray-500 font-mono tracking-tighter uppercase">Source: site:reddit.com • Search Intensity: High</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                        <CheckCircle2 size={12} /> 98% Match Confidence
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((lead, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group relative bg-[#252525] border border-white/5 p-6 rounded-3xl hover:border-orange-500/30 transition-all flex flex-col h-full"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                                                    <MessageCircle size={12} className="text-orange-500" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">r/{lead.subreddit}</span>
                                            </div>

                                            <h3 className={`text-base font-semibold leading-snug mb-6 flex-grow ${!isUnlocked && 'blur-sm select-none'}`}>
                                                {lead.title}
                                            </h3>

                                            {isUnlocked ? (
                                                <Link 
                                                    href={lead.url} 
                                                    target="_blank"
                                                    className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
                                                >
                                                    View Lead on Reddit <ExternalLink size={12} />
                                                </Link>
                                            ) : (
                                                <button 
                                                    onClick={() => setShowModal(true)}
                                                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-black uppercase text-center transition-all flex items-center justify-center gap-2 text-black"
                                                >
                                                    <Lock size={12} fill="currentColor" /> Unlock This Lead
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Upsell Banner */}
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
                                            Want to find these leads while you sleep?
                                        </h3>
                                        <p className="text-black/80 font-medium text-lg">
                                            RedLeads monitors 100+ subreddits 24/7. When someone asks for your solution, we DM you instantly.
                                        </p>
                                        <Link 
                                            href="https://tally.so/r/7RK9g0"
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-sm hover:scale-105 transition-all shadow-xl"
                                        >
                                            Get Early Access <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Unlock Modal */}
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
                                <Mail size={28} />
                            </div>
                            <h2 className="text-3xl font-black mb-4 leading-tight">Unlock the Results</h2>
                            <p className="text-gray-400 mb-8 font-light">
                                We've found 5 high-intent conversations for your niche. Enter your email to unlock all links and get notified when new leads appear.
                            </p>
                            <form onSubmit={handleUnlock} className="space-y-4">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-orange-500/50 transition-all text-center"
                                    required
                                />
                                <button 
                                    className="w-full py-5 bg-orange-500 hover:bg-orange-600 rounded-2xl font-black uppercase text-sm text-black flex items-center justify-center gap-2 transition-all"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Reveal Threads <ArrowRight size={18} /></>}
                                </button>
                            </form>
                            <p className="mt-6 text-[10px] text-gray-600 uppercase font-black tracking-widest">
                                100% Ban-Safe • No Spam • Immediate Access
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
