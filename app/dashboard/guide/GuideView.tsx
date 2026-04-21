'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Target, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import { GuideNode } from '@/types/guide';
import { Guide_NODES as FALLBACK_NODES } from './data';
import NodeDetail from './NodeDetail';
import { useState, useRef, useEffect } from 'react';
import { useDashboardData } from '../DashboardDataContext';
import { useRateLimit } from '@/lib/useRateLimit';

const PHASE_META: Record<number, { title: string; icon: React.ElementType; color: string; gradient: string; days: string }> = {
    1: { title: 'The Foundation', icon: Target, color: 'text-orange-500', gradient: 'from-orange-500/20 to-orange-500/5', days: 'Days 1-7' },
    2: { title: 'The Value Drop', icon: Rocket, color: 'text-blue-500', gradient: 'from-blue-500/20 to-blue-500/5', days: 'Days 8-21' },
    3: { title: 'Conversion Engine', icon: Target, color: 'text-green-500', gradient: 'from-green-500/20 to-green-500/5', days: 'Days 22-45' },
    4: { title: 'The Authority', icon: Target, color: 'text-purple-500', gradient: 'from-purple-500/20 to-purple-500/5', days: 'Days 46-75' },
    5: { title: 'The Scale System', icon: Rocket, color: 'text-cyan-500', gradient: 'from-cyan-500/20 to-cyan-500/5', days: 'Days 76-90' },
};

const formatTime = (minutes: number | null | undefined): string => {
    if (!minutes) return '~15 min';
    if (minutes >= 60) return `~${Math.round(minutes / 60)}h`;
    return `~${minutes} min`;
};

export default function GuideView({ onNavigate, user }: { onNavigate: (tab: string) => void, user: any }) {
    const { profile } = useDashboardData();
    const [nodes, setNodes] = useState<GuideNode[]>([]);
    const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
    const [selectedNode, setSelectedNode] = useState<GuideNode | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Limit to 2 per 24 hours
    const { consume } = useRateLimit('guide-regeneration', 2, 24 * 60 * 60 * 1000);

    useEffect(() => {
        if (!profile?.id) return;
        
        const storageKey = `redleads_custom_guide_${profile.id}`;
        const completionKey = `redleads_guide_completion_${profile.id}`;
        
        const storedGuide = localStorage.getItem(storageKey);
        const storedCompletion = localStorage.getItem(completionKey);
        
        if (storedCompletion) {
            try { setCompletedDays(JSON.parse(storedCompletion)); } catch (e) {}
        }

        if (storedGuide) {
            try {
                const parsed = JSON.parse(storedGuide);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setNodes(parsed);
                } else {
                    setNodes(FALLBACK_NODES.slice(0, 14));
                }
            } catch (e) {
                setNodes(FALLBACK_NODES.slice(0, 14));
            }
        }
        setHasLoaded(true);
    }, [profile?.id]);

    const handleGenerate = async () => {
        if (!profile) return;
        setError(null);

        // Check client-side rate limit first
        if (!consume()) {
            setError("You have reached your daily limit for generating custom strategies. Please try again tomorrow.");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/generate-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    website_url: profile.website_url,
                    description: profile.description,
                    keywords: profile.keywords
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.nodes && Array.isArray(data.nodes)) {
                    setNodes(data.nodes);
                    localStorage.setItem(`redleads_custom_guide_${profile.id}`, JSON.stringify(data.nodes));
                }
            } else if (res.status === 429) {
                const data = await res.json();
                setError(data.error || "Daily limit reached.");
            } else {
                console.error("Failed to generate custom guide, using fallback.");
                setNodes(FALLBACK_NODES.slice(0, 14));
            }
        } catch (error) {
            console.error("Error generating guide:", error);
            setNodes(FALLBACK_NODES.slice(0, 14));
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleComplete = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        if (!profile?.id) return;
        const newCompleted = { ...completedDays, [nodeId]: !completedDays[nodeId] };
        setCompletedDays(newCompleted);
        localStorage.setItem(`redleads_guide_completion_${profile.id}`, JSON.stringify(newCompleted));
    };

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 20);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener('scroll', updateScrollState);
        return () => el.removeEventListener('scroll', updateScrollState);
    }, [nodes]); // Re-bind if nodes change

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    };

    if (!hasLoaded) return null;

    if (nodes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 rounded-[2rem] bg-ai/10 flex items-center justify-center border border-ai/20">
                    <Sparkles size={32} className="text-ai" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-bold text-text-primary tracking-tight flex items-center justify-center gap-2">
                        RedLeads OS 
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Beta</span>
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        We use AI to instantly generate a hyper-personalized Reddit strategy based on your website and tracked keywords.
                    </p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-8 py-4 bg-ai text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-ai/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(0,209,255,0.2)]"
                >
                    {isGenerating ? 'Analyzing & Generating...' : 'Generate Custom Strategy'}
                </button>
                {error && <p className="text-[10px] text-red-400 font-bold mt-2 uppercase tracking-wider max-w-xs">{error}</p>}
            </div>
        );
    }

    const allNodes = nodes.map((node, i) => ({ node, globalIndex: i }));

    return (
        <div className="relative">
            {/* Control Bar for Regenerating */}
            <div className="absolute -top-12 right-0 flex flex-col items-end gap-1">
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="text-[9px] font-black uppercase tracking-widest text-text-secondary hover:text-ai transition-colors flex items-center gap-1.5"
                >
                    {isGenerating ? 'Regenerating...' : 'Regenerate Strategy'}
                </button>
                {error && <p className="text-[8px] text-red-400 font-bold uppercase tracking-wider">{error}</p>}
            </div>

            {/* Scroll Buttons */}
            <AnimatePresence>
                {canScrollLeft && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all shadow-lg"
                    >
                        <ChevronLeft size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {canScrollRight && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all shadow-lg"
                    >
                        <ChevronRight size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg-void to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg-void to-transparent z-20 pointer-events-none" />

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                className="overflow-x-auto custom-scrollbar pb-4"
                style={{ scrollbarWidth: 'thin' }}
            >
                <div className="relative min-w-max px-10 py-4">
                    {/* Nodes laid out horizontally */}
                    <div className="flex items-center gap-0 relative z-10" style={{ minHeight: '520px' }}>
                        {allNodes.map(({ node, globalIndex }, i) => {
                            const isTop = i % 2 === 0;
                            const phaseMeta = PHASE_META[node.phase || 1] || { title: `Phase ${node.phase}`, icon: Target, color: 'text-text-secondary', gradient: 'from-white/10 to-transparent', days: '' };
                            const PhaseIcon = phaseMeta.icon;
                            const isSelected = selectedNode?.id === node.id;
                            const isComplete = completedDays[node.id] || false;

                            return (
                                <div
                                    key={node.id}
                                    className="flex flex-col items-center relative"
                                    style={{ width: '360px', minWidth: '360px' }}
                                >
                                    {/* Top Card (even index) */}
                                    {isTop && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            onClick={() => setSelectedNode(node)}
                                            className="w-[320px] cursor-pointer mb-6 transition-all duration-300 group p-1 bg-white/[0.02] border border-white/5 rounded-[2rem]"
                                        >
                                            <div className={`rounded-[1.8rem] border p-6 space-y-4 transition-all duration-300 relative overflow-hidden backdrop-blur-xl
                                                ${isSelected 
                                                    ? `bg-gradient-to-b ${phaseMeta.gradient} border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]` 
                                                    : 'bg-[#0a0a0a] border-white/[0.05] hover:border-white/10 hover:bg-[#0c0c0c] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'}
                                                ${isComplete ? 'opacity-50 grayscale hover:grayscale-0' : ''}
                                            `}>
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                
                                                {/* Phase Tag */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${phaseMeta.color}`}>
                                                            Phase {node.phase || 1}
                                                        </span>
                                                        <span className="text-text-secondary/30">•</span>
                                                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.1em]">
                                                            Day {(node as any).day_number || '?'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => toggleComplete(e, node.id)}
                                                        className={`shrink-0 ${isComplete ? 'text-green-500' : 'text-text-secondary/30 hover:text-green-500'} transition-colors`}
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                </div>

                                                {/* Title */}
                                                <h4 className={`font-bold text-base tracking-tight leading-snug ${isComplete ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                                                    {node.title}
                                                </h4>

                                                {/* Description */}
                                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                                    {node.description}
                                                </p>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-2">
                                                    <span className="text-[10px] text-text-secondary/60 font-medium">
                                                        {formatTime((node as any).estimated_minutes)}
                                                    </span>
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1 ${phaseMeta.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    Learn More <ArrowRight size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Vertical Connector Stem */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-[1px] h-4 ${isComplete ? 'bg-green-500/30' : 'bg-white/10'}`} />

                                        {/* Timeline Node (on the center line) */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                                            onClick={() => setSelectedNode(node)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer z-20 border transition-all duration-300 shrink-0 shadow-xl
                                                ${isComplete ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-white/[0.04] border-white/[0.08] text-text-secondary/50 backdrop-blur-md'}
                                                ${isSelected && !isComplete ? 'ring-2 ring-white/20 scale-110 bg-primary/10 text-primary border-primary/30' : ''}
                                                ${!isSelected && !isComplete ? 'hover:scale-105 hover:bg-white/[0.08] hover:text-text-primary hover:border-white/20' : ''}
                                            `}
                                        >
                                            {isComplete ? <CheckCircle2 size={20} /> : <PhaseIcon size={20} />}
                                        </motion.div>

                                        <div className={`w-[1px] h-4 ${isComplete ? 'bg-green-500/30' : 'bg-white/10'}`} />
                                    </div>

                                    {/* Bottom Card (odd index) */}
                                    {!isTop && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            onClick={() => setSelectedNode(node)}
                                            className="w-[320px] cursor-pointer mt-6 transition-all duration-300 group p-1 bg-white/[0.02] border border-white/5 rounded-[2rem]"
                                        >
                                            <div className={`rounded-[1.8rem] border p-6 space-y-4 transition-all duration-300 relative overflow-hidden backdrop-blur-xl
                                                ${isSelected 
                                                    ? `bg-gradient-to-b ${phaseMeta.gradient} border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]` 
                                                    : 'bg-[#0a0a0a] border-white/[0.05] hover:border-white/10 hover:bg-[#0c0c0c] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'}
                                                ${isComplete ? 'opacity-50 grayscale hover:grayscale-0' : ''}
                                            `}>
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                
                                                {/* Phase Tag */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${phaseMeta.color}`}>
                                                            Phase {node.phase || 1}
                                                        </span>
                                                        <span className="text-text-secondary/30">•</span>
                                                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.1em]">
                                                            Day {(node as any).day_number || '?'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => toggleComplete(e, node.id)}
                                                        className={`shrink-0 ${isComplete ? 'text-green-500' : 'text-text-secondary/30 hover:text-green-500'} transition-colors`}
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                </div>

                                                {/* Title */}
                                                <h4 className={`font-bold text-base tracking-tight leading-snug ${isComplete ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                                                    {node.title}
                                                </h4>

                                                {/* Description */}
                                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                                    {node.description}
                                                </p>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-2">
                                                    <span className="text-[10px] text-text-secondary/60 font-medium">
                                                        {formatTime((node as any).estimated_minutes)}
                                                    </span>
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-1 ${phaseMeta.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    Learn More <ArrowRight size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Static Spacer to maintain vertical alignment of nodes */}
                                    <div className="w-[320px] flex-1" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                    >
                        <div id="Guide-detail-panel" className="px-6 pb-8 pt-0 max-w-5xl mx-auto relative">
                            {/* Mark complete big button */}
                            <div className="absolute top-4 right-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleComplete(e as any, selectedNode.id);
                                        setSelectedNode(null);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        completedDays[selectedNode.id]
                                            ? 'bg-transparent text-text-secondary border border-white/10 hover:border-white/20'
                                            : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                                    }`}
                                >
                                    {completedDays[selectedNode.id] ? 'Mark Incomplete' : 'Complete Mission'}
                                </button>
                            </div>
                            
                            <NodeDetail 
                                node={selectedNode} 
                                onNavigate={onNavigate}
                                onClose={() => setSelectedNode(null)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
