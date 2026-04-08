'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ExternalLink, X, Check, Copy, RotateCcw, ChevronRight, MessageSquare, Pencil, Coffee, Briefcase, Zap, Feather, Target, HeartHandshake, Brain, FileText } from 'lucide-react';
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
    has_responded?: boolean;
    match_category?: string;
}

interface Draft {
    type: string;
    text: string;
}

interface ReplyPanelProps {
    lead: MonitoredLead | null;
    productContext: string;
    websiteUrl?: string; // Kept for backwards compatibility 
    onClose: () => void;
    isSidebar?: boolean;
    onResponded?: () => void;
}

// --- Configuration Data ---
const TONE_OPTIONS = [
    { id: 'Casual & Friendly', title: 'Casual', desc: 'Native Reddit voice', icon: Coffee },
    { id: 'Professional & Direct', title: 'Professional', desc: 'Authoritative', icon: Briefcase },
    { id: 'Witty & Passionate', title: 'Witty', desc: 'Founder energy', icon: Zap }
];

const PITCH_OPTIONS = [
    { id: 'Subtle Side-note', title: 'Subtle', desc: 'Value first, pitch later', icon: Feather },
    { id: 'Direct Pitch', title: 'Direct', desc: 'Straight to solution', icon: Target },
    { id: 'Pure Value (No Pitch)', title: 'Pure Value', desc: 'No product mention', icon: HeartHandshake }
];

const SMART_CHIPS = ['Mention free trial', 'Ask a question', 'Keep it short'];

// --- UI Components ---
const BentoCard = ({ icon: Icon, title, description, isSelected, onClick }: any) => (
    <button 
        type="button"
        onClick={onClick} 
        className={`text-left p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-3 w-full ${
            isSelected 
                ? 'bg-ai/[0.04] border-ai/30 shadow-[inset_0_0_20px_rgba(0,209,255,0.05)]' 
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
        }`}
    >
        <div className={`p-2 rounded-[0.8rem] shrink-0 transition-colors ${isSelected ? 'bg-ai/10 text-ai' : 'bg-white/5 text-text-secondary'}`}>
            <Icon size={16} />
        </div>
        <div className="space-y-0.5 mt-0.5">
            <h4 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-ai' : 'text-text-primary'}`}>{title}</h4>
            <p className="text-[9px] text-text-secondary/70 font-bold uppercase tracking-widest leading-relaxed">{description}</p>
        </div>
    </button>
);

// --- Labor Illusion 2.0 ---
const LaborIllusion20 = () => {
    const [logs, setLogs] = useState<string[]>([]);
    
    useEffect(() => {
        const sequence = [
            "> Initializing AI drafting core...",
            "> Fetching r/subreddit strict rules... [DONE]",
            "> Calibrating emotional tone matrix... [DONE]",
            "> Setting product mention strategy... [DONE]",
            "> Generating 'Feedback Loop' playbook...",
            "> Generating 'The Sidekick' playbook...",
            "> Finalizing output formatting..."
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < sequence.length) {
                const currentLog = sequence[i];
                setLogs(prev => [...prev, currentLog]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 450);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-full flex flex-col pt-12 space-y-10 overflow-hidden px-8">
            {/* Glowing Orb */}
            <div className="flex justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-t-2 border-ai/80 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-2 border-r-2 border-ai/30 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-0 bg-ai/10 blur-[20px] rounded-full animate-pulse transition-all"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="text-ai/90 w-8 h-8 animate-pulse shadow-ai" />
                    </div>
                </div>
            </div>

            {/* Terminal Logs */}
            <div className="font-mono text-[9px] text-ai/60 space-y-3 uppercase tracking-widest z-10">
                {logs.map((log, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className={log?.includes?.('[DONE]') ? 'text-green-400' : ''}
                    >
                        {log}
                    </motion.div>
                ))}
                <motion.div 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="inline-block w-2.5 h-3 bg-ai mt-3"
                />
            </div>

            {/* Skeleton Cards Background */}
            <div className="absolute bottom-[-100px] left-6 right-6 flex flex-col gap-4 opacity-[0.15] blur-[2px]" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))' }}>
                <div className="h-32 surface-1 border border-white/5 rounded-2xl w-full"></div>
                <div className="h-32 surface-1 border border-white/5 rounded-2xl w-full"></div>
            </div>
        </div>
    );
};


// --- Main Component ---
export default function ReplyPanel({ lead, productContext, onClose, isSidebar = false, onResponded }: ReplyPanelProps) {
    const [view, setView] = useState<'picking' | 'generating' | 'results'>('picking');
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ remaining: number, total: number } | null>(null);

    // Strategy picker state
    const [tone, setTone] = useState<string>('Casual & Friendly');
    const [mentionStrategy, setMentionStrategy] = useState<string>('Subtle Side-note');
    const [customRules, setCustomRules] = useState<string>('');

    // Reset when a new lead is selected
    useEffect(() => {
        if (lead) {
            setView('picking');
            setDrafts([]);
            setError(null);
            setUsageInfo(null);
        } else {
            setDrafts([]);
            setError(null);
            setUsageInfo(null);
        }
    }, [lead]);

    const handleGenerate = async () => {
        if (!lead) return;
        
        setView('generating');
        setError(null);
        setDrafts([]);

        // Small delay to allow Labor Illusion to run even if API is fast
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3800));
        
        try {
            const apiCall = axios.post('/api/draft-reply', {
                title: lead.title,
                subreddit: lead.subreddit,
                productContext, 
                tone,
                mentionStrategy,
                customRules: customRules.trim()
            });

            const [res] = await Promise.all([apiCall, minLoadingTime]);
            
            if (res.data.variations) {
                setDrafts(res.data.variations);
                if (res.data.remaining !== undefined) {
                    setUsageInfo({ 
                        remaining: res.data.remaining, 
                        total: res.data.total_limit 
                    });
                }
                setView('results');
            } else {
                throw new Error('No drafts generated');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to generate drafts.');
            setView('results');
        }
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2500);
        if (onResponded) onResponded();
    };

    const handleRegenerate = () => {
        setView('picking');
        setDrafts([]);
        setError(null);
    };

    if (!lead) return null;

    return (
        <motion.div 
            initial={isSidebar ? undefined : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isSidebar ? undefined : { opacity: 0, scale: 0.98 }}
            className={`
                flex flex-col overflow-hidden h-full w-full relative
                ${isSidebar 
                    ? 'bg-transparent border-0 shadow-none' 
                    : 'sticky top-6 bg-void border border-white/5 shadow-void rounded-[2rem] max-h-[85vh] 2xl:max-h-[800px]'
                }
            `}
        >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-void/80 backdrop-blur-md z-20">
                <div className="space-y-1 overflow-hidden">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary flex items-center gap-2">
                        <Sparkles size={14} className="text-ai" />
                        {view === 'picking' ? 'Draft Strategy' : view === 'generating' ? 'Drafting Details...' : 'Generated Replies'}
                    </h3>
                    <div className="flex items-center gap-2 text-[9px] font-black text-ai/60 uppercase tracking-widest">
                        r/{lead.subreddit}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <a 
                        href={lead.url.startsWith('http') ? lead.url : `https://${lead.url}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-xl text-text-secondary hover:text-primary transition-all"
                        title="Open on Reddit"
                    >
                        <ExternalLink size={16} />
                    </a>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-void">
                <AnimatePresence mode="wait">

                    {/* ── SETTINGS PICKER ── */}
                    {view === 'picking' && (
                        <motion.div
                            key="picker"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="pb-6"
                        >
                            {/* Quote Format Context Strip */}
                            <div className="px-6 py-4 bg-ai/[0.02] border-b border-white/5 flex items-start gap-3">
                                <div className="mt-1 w-1 h-8 bg-ai/40 rounded-full shrink-0"></div>
                                <div>
                                    <h4 className="text-[8px] font-black uppercase tracking-widest text-text-secondary mb-1 opacity-50">Post Context</h4>
                                    <p className="text-[11px] text-text-primary/80 leading-relaxed font-bold italic line-clamp-2">
                                        "{lead.title}"
                                    </p>
                                </div>
                            </div>
                        
                            <div className="p-6 space-y-8">
                                {/* Tone Bento */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-text-primary/90">
                                        <MessageSquare size={14} className="text-ai/80" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">AI Tone</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {TONE_OPTIONS.map(opt => (
                                            <BentoCard 
                                                key={opt.id} 
                                                icon={opt.icon} 
                                                title={opt.title} 
                                                description={opt.desc} 
                                                isSelected={tone === opt.id} 
                                                onClick={() => setTone(opt.id)} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Pitch Strategy Bento */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-text-primary/90">
                                        <Target size={14} className="text-ai/80" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Product Mention Strategy</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {PITCH_OPTIONS.map(opt => (
                                            <BentoCard 
                                                key={opt.id} 
                                                icon={opt.icon} 
                                                title={opt.title} 
                                                description={opt.desc} 
                                                isSelected={mentionStrategy === opt.id} 
                                                onClick={() => setMentionStrategy(opt.id)} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Rules Area */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-text-primary/90">
                                        <Pencil size={14} className="text-ai/80" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Custom Instructions <span className="opacity-40 font-bold lowercase">(optional)</span></span>
                                    </div>
                                    
                                    <div className="p-0.5 surface-1 rounded-2xl group transition-all duration-300 focus-within:shadow-[0_0_12px_rgba(0,209,255,0.1)]">
                                        <div className="bg-void rounded-[0.9rem] relative overflow-hidden">
                                            <textarea
                                                value={customRules}
                                                onChange={(e) => setCustomRules(e.target.value)}
                                                placeholder="e.g. Include our 14-day free trial."
                                                rows={2}
                                                className="w-full bg-transparent border border-white/5 rounded-[0.9rem] px-4 py-3 text-xs font-bold text-text-primary focus:border-ai/40 outline-none resize-none placeholder:text-text-secondary/30 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Smart Chips */}
                                    <div className="flex flex-wrap gap-2">
                                        {SMART_CHIPS.map(chip => (
                                            <button 
                                                key={chip}
                                                onClick={() => setCustomRules(prev => prev + (prev.trim().length ? ' ' : '') + chip)}
                                                className="text-[9px] px-3 py-1.5 rounded-full border border-white/10 text-text-secondary/70 hover:text-ai hover:border-ai/30 transition-colors tracking-widest font-black uppercase bg-white/[0.01] hover:bg-ai/[0.05]"
                                                title={`Add "${chip}"`}
                                            >
                                                + {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Button Wrapper */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleGenerate}
                                        className="w-full py-4 bg-ai text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-ai/90 transition-all shadow-[0_8px_24px_rgba(0,209,255,0.2)] group flex items-center justify-center gap-2.5 relative overflow-hidden"
                                    >
                                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                                        <span className="relative z-10 flex items-center gap-2.5">    
                                            <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                                            Generate 3 Premium Drafts
                                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── GENERATING ── */}
                    {view === 'generating' && (
                        <motion.div
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            <LaborIllusion20 />
                        </motion.div>
                    )}

                    {/* ── RESULTS ── */}
                    {view === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 px-6">
                                    <X size={24} className="text-red-500/50 mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-primary">{(typeof error === 'string' && error.includes('Limit')) ? 'Quota Exceeded' : 'Generation Failed'}</p>
                                    <p className="text-[10px] text-text-secondary leading-relaxed uppercase tracking-widest font-bold opacity-60">
                                        {typeof error === 'string' ? error : 'An unexpected error occurred.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-6 space-y-6">
                                    {drafts.map((draft, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.15, ease: "easeOut" }}
                                            className="surface-1 rounded-[1.25rem] border border-white/5 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                                        >
                                            <div className="border-b border-white/5 px-5 py-3 flex items-center justify-between bg-white/[0.02]">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={12} className="text-ai/70" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-ai glow-text-sm">{draft.type}</span>
                                                </div>
                                            </div>
                                            <div className="p-5 text-[13px] text-text-primary/90 leading-relaxed font-bold tracking-tight whitespace-pre-wrap bg-void/50">
                                                {draft.text}
                                            </div>
                                            <div className="p-2 border-t border-white/5 bg-void">
                                                <button 
                                                    onClick={() => handleCopy(draft.text, i)}
                                                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${
                                                        copiedIndex === i 
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                                                            : 'bg-white/[0.04] text-text-primary hover:bg-white/10 hover:shadow-[0_2px_12px_rgba(0,0,0,0.5)] border border-white/5'
                                                    }`}
                                                >
                                                    {copiedIndex === i ? <Check size={14} className="mb-0.5" /> : <Copy size={14} className="mb-0.5 opacity-70" />}
                                                    {copiedIndex === i ? 'Copied to clipboard!' : (i === 0 ? 'Copy Best Match' : 'Copy Draft')}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Footer */}
            {view === 'results' && !error && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 bg-void border-t border-white/5 flex items-center justify-between px-6 z-20"
                >
                    {usageInfo && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary/60">
                            {usageInfo.remaining} Credits Left
                        </span>
                    )}
                    <button 
                        onClick={handleRegenerate}
                        className="text-[9px] font-black uppercase tracking-widest text-text-secondary hover:text-ai transition-colors flex items-center gap-1.5 group ml-auto"
                    >
                        <RotateCcw size={11} className="group-hover:-rotate-180 transition-transform duration-500" /> 
                        Adjust Strategy
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}
