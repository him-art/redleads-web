'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Copy, Check, X, Search, BrainCircuit, 
    ShieldCheck, Activity, RotateCcw, Globe, ArrowRight, Sparkles, ExternalLink
} from 'lucide-react';
import axios from 'axios';

interface MonitoredLead {
    id?: string;
    title: string;
    subreddit: string;
    url: string;
    status?: string;
    match_score?: number;
    created_at?: string;
    is_saved?: boolean;
    match_category?: string;
}

interface Draft {
    type: string;
    text: string;
}

interface ReplySidebarProps {
    lead: MonitoredLead | null;
    productContext: string;
    onClose: () => void;
}

// --- Labor Illusion Component ---
const LaborIllusion = () => {
    const [step, setStep] = useState(0);
    const steps = [
        { text: "Scanning subreddit rules...", icon: Search, color: "text-blue-400" },
        { text: "Analyzing audience tone...", icon: MessageSquare, color: "text-purple-400" },
        { text: "Checking ban-risk factors...", icon: ShieldCheck, color: "text-green-400" },
        { text: "Drafting high-value replies...", icon: BrainCircuit, color: "text-orange-500" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s < steps.length - 1 ? s + 1 : s));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-24 space-y-6 h-full">
            <div className="relative">
                <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center relative z-10 border border-white/5 shadow-inner">
                    {(() => { const Icon = steps[step].icon; return <Icon size={28} className={steps[step].color} />; })()}
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 bg-white/5 rounded-2xl animate-ping opacity-20" />
            </div>
            
            <div className="text-center space-y-3 px-8">
                <h3 className="text-sm font-bold text-text-primary tracking-tight">
                    {steps[step].text}
                </h3>
                <div className="w-48 h-1 bg-white/[0.05] rounded-full overflow-hidden mx-auto border border-white/5">
                    <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default function ReplySidebar({ lead, productContext, onClose }: ReplySidebarProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ remaining: number, total: number } | null>(null);

    useEffect(() => {
        if (lead) {
            handleGenerate();
        } else {
            setDrafts([]);
            setError(null);
            setUsageInfo(null);
        }
    }, [lead]);

    const handleGenerate = async () => {
        if (!lead) return;
        
        setIsGenerating(true);
        setError(null);
        setDrafts([]);

        try {
            const res = await axios.post('/api/draft-reply', {
                title: lead.title,
                subreddit: lead.subreddit,
                productContext
            });
            
            if (res.data.variations) {
                setDrafts(res.data.variations);
                if (res.data.remaining !== undefined) {
                    setUsageInfo({ 
                        remaining: res.data.remaining, 
                        total: res.data.total_limit 
                    });
                }
            } else {
                throw new Error('No drafts generated');
            }
        } catch (err: any) {
            console.error('Draft generation failed:', err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to generate drafts. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <AnimatePresence>
            {lead && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent"
                    />

                    {/* Sidebar Panel */}
                    <motion.div 
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-4 bottom-4 right-4 left-4 sm:left-auto sm:w-[500px] z-[100] bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="space-y-1.5 overflow-hidden">
                                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                    <Sparkles size={16} className="text-primary" />
                                    Draft Intelligence
                                </h3>
                                <div className="flex items-center gap-2 text-xs">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                        r/{lead.subreddit}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <a 
                                    href={lead.url.startsWith('http') ? lead.url : `https://${lead.url}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-white/10 rounded-full text-text-secondary hover:text-primary transition-all duration-300"
                                    title="Open Post on Reddit"
                                >
                                    <ExternalLink size={20} />
                                </a>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full text-text-secondary hover:text-text-primary transition-all duration-300"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                            {/* Context Header */}
                             <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Original Context</h4>
                                <p className="text-sm text-text-primary/80 leading-relaxed line-clamp-3">
                                    {lead.title}
                                </p>
                             </div>

                            {isGenerating ? (
                                <LaborIllusion />
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 px-8">
                                    <div className="w-12 h-12 bg-red-500/5 rounded-2xl flex items-center justify-center text-red-500/50 border border-red-500/10">
                                        <X size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-text-primary font-bold">{error.includes('Limit reached') ? 'Quota Exceeded' : 'Generation Failed'}</p>
                                        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                                            {error}
                                        </p>
                                    </div>
                                    {error.includes('Limit reached') && (
                                        <button 
                                            onClick={() => window.location.hash = '#billing'}
                                            className="px-6 py-2.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                        >
                                            Upgrade Plan
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 space-y-6">
                                    {drafts.map((draft, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4 group hover:bg-white/[0.04] transition-all duration-300 relative"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-text-secondary bg-white/[0.05] px-2.5 py-1 rounded-md border border-white/5">
                                                        {draft.type}
                                                    </span>
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/[0.03] border border-green-500/10 text-[8px] font-black uppercase text-green-500/40">
                                                        <ShieldCheck size={10} /> Safe
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleCopy(draft.text, i)}
                                                    className={`text-[10px] flex items-center gap-2 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest transition-all duration-300 ${
                                                        copiedIndex === i 
                                                            ? 'bg-green-500 text-white' 
                                                            : 'bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10'
                                                    }`}
                                                >
                                                    {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                                                    {copiedIndex === i ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="text-sm text-text-primary/90 leading-relaxed whitespace-pre-wrap font-medium">
                                                {draft.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        {usageInfo && !isGenerating && !error && (
                            <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        {[1,2,3].map(i => (
                                            <div key={i} className={`w-3 h-1 rounded-full ${i <= (usageInfo.remaining / usageInfo.total) * 3 ? 'bg-primary' : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                                        {usageInfo.remaining} Credits Left
                                    </span>
                                </div>
                                <button 
                                    onClick={handleGenerate}
                                    className="text-[9px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5 group"
                                >
                                    <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" /> 
                                    Regenerate
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
