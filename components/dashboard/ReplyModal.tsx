'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Copy, Check, X, Search, BrainCircuit, 
    MessageSquare, ShieldCheck, Zap, Activity 
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

interface ReplyModalProps {
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
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-orange-500/10 rounded-full animate-ping opacity-20" />
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center relative z-10 border border-white/5">
                    {(() => { const Icon = steps[step].icon; return <Icon size={32} className={steps[step].color} />; })()}
                </div>
            </div>
            
            <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-white tracking-tight animate-pulse">
                    {steps[step].text}
                </h3>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                    <motion.div 
                        className="h-full bg-orange-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default function ReplyModal({ lead, productContext, onClose }: ReplyModalProps) {
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                            <div className="space-y-1.5">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                                        <Sparkles size={18} className="text-orange-500 fill-orange-500" />
                                    </div>
                                    Smart Reply Studio
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/60">r/{lead.subreddit}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                    <p className="text-[10px] text-gray-500 truncate max-w-[200px] sm:max-w-md font-bold uppercase tracking-wider">
                                        {lead.title}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all hover:rotate-90 duration-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar bg-[url('/grid.svg')] bg-[length:40px_40px] bg-fixed">
                            {isGenerating ? (
                                <LaborIllusion />
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
                                        <X size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white font-bold">{error.includes('Limit reached') ? 'Limit Reached' : 'Generation Failed'}</p>
                                        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                                            {error}
                                        </p>
                                    </div>
                                    {error.includes('Limit reached') && (
                                        <button 
                                            onClick={() => window.location.hash = '#billing'}
                                            className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                                        >
                                            Upgrade Plan
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {drafts.map((draft, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4 group hover:border-orange-500/30 transition-all duration-300 relative"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/10">
                                                        {draft.type} Approach
                                                    </span>
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/5 border border-green-500/10 text-[8px] font-black uppercase text-green-500/60">
                                                        <ShieldCheck size={10} /> Safe
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleCopy(draft.text, i)}
                                                    className={`text-[10px] group flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase tracking-widest transition-all duration-300 ${
                                                        copiedIndex === i 
                                                            ? 'bg-green-500 text-black' 
                                                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                                    }`}
                                                >
                                                    {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                                                    {copiedIndex === i ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-wrap font-medium font-sans">
                                                {draft.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        {usageInfo && !isGenerating && !error && (
                            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-1">
                                        {[1,2,3].map(i => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= (usageInfo.remaining / usageInfo.total) * 3 ? 'bg-orange-500' : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        {usageInfo.remaining * 3} Replies Remaining
                                    </span>
                                </div>
                                <button 
                                    onClick={handleGenerate}
                                    className="text-[9px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1.5"
                                >
                                    <Zap size={10} className="fill-current" /> Redraft Variants
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
