'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    MessageSquare, Copy, Check, X, Search, BrainCircuit, 
    ShieldCheck, RotateCcw, Sparkles, ExternalLink
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

interface ReplyPanelProps {
    lead: MonitoredLead | null;
    productContext: string;
    onClose: () => void;
    isSidebar?: boolean;
}

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
        <div className="flex flex-col items-center justify-center py-16 space-y-6 h-full">
            <div className="relative">
                <div className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center relative z-10 border border-white/5 shadow-inner">
                    {(() => { const Icon = steps[step].icon; return <Icon size={24} className={steps[step].color} />; })()}
                </div>
                <div className="absolute inset-0 bg-white/5 rounded-2xl animate-ping opacity-20" />
            </div>
            
            <div className="text-center space-y-3 px-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary opacity-80">
                    {steps[step].text}
                </h3>
                <div className="w-32 h-1 bg-white/[0.05] rounded-full overflow-hidden mx-auto border border-white/5">
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

export default function ReplyPanel({ lead, productContext, onClose, isSidebar = false }: ReplyPanelProps) {
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
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to generate drafts.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (!lead) return null;

    return (
        <motion.div 
            initial={isSidebar ? undefined : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isSidebar ? undefined : { opacity: 0, scale: 0.98 }}
            className={`
                flex flex-col overflow-hidden h-full w-full
                ${isSidebar 
                    ? 'bg-transparent border-0 shadow-none' 
                    : 'sticky top-6 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] max-h-[85vh]'
                }
            `}
        >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="space-y-1 overflow-hidden">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        Intelligence
                    </h3>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-primary/60">
                        r/{lead.subreddit}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <a 
                        href={lead.url.startsWith('http') ? lead.url : `https://${lead.url}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-xl text-text-secondary hover:text-primary transition-all shadow-inner"
                        title="Open on Reddit"
                    >
                        <ExternalLink size={16} />
                    </a>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl text-text-secondary hover:text-text-primary transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Context */}
                <div className="px-5 py-3 border-b border-white/5 bg-white/[0.01]">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-text-secondary mb-1">Post Context</h4>
                    <p className="text-[11px] text-text-primary/70 leading-relaxed line-clamp-2">
                        {lead.title}
                    </p>
                </div>

                {isGenerating ? (
                    <LaborIllusion />
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 px-6">
                        <X size={20} className="text-red-500/50" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-primary">{error.includes('Limit') ? 'Quota Exceeded' : 'Failed'}</p>
                        <p className="text-[10px] text-text-secondary leading-relaxed">
                            {error}
                        </p>
                    </div>
                ) : (
                    <div className="p-5 space-y-5">
                        {drafts.map((draft, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3 hover:bg-white/[0.04] transition-all relative group">
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-text-secondary bg-white/[0.05] px-2 py-0.5 rounded border border-white/5">
                                        {draft.type}
                                    </span>
                                    <button 
                                        onClick={() => handleCopy(draft.text, i)}
                                        className={`text-[8px] flex items-center gap-1 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest transition-all ${
                                            copiedIndex === i 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-white/5 text-text-secondary hover:text-text-primary'
                                        }`}
                                    >
                                        {copiedIndex === i ? <Check size={10} /> : <Copy size={10} />}
                                        {copiedIndex === i ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-xs text-text-primary/90 leading-relaxed whitespace-pre-wrap font-medium">
                                    {draft.text}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {usageInfo && !isGenerating && !error && (
                <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between px-6">
                    <span className="text-[8px] font-black uppercase tracking-widest text-text-secondary">
                        {usageInfo.remaining} Credits Left
                    </span>
                    <button 
                        onClick={handleGenerate}
                        className="text-[8px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                        <RotateCcw size={10} className="group-hover:-rotate-180 transition-transform duration-500" /> 
                        Regenerate
                    </button>
                </div>
            )}
        </motion.div>
    );
}
