'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Target, Rocket } from 'lucide-react';
import { GuideNode } from '@/types/guide';
import { Guide_NODES } from './data';
import NodeDetail from './NodeDetail';
import { useState, useRef, useEffect } from 'react';

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

export default function GuideView({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const [selectedNode, setSelectedNode] = useState<GuideNode | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Auto-scroll to current phase? No, just start at beginning as it's a guide.
    // Or maybe restoration? User wanted "resume" position.
    // Since we removed DB tracking, we can't really "resume" unless we use localStorage.
    // For now, let's keep it simple as requested: "keep it as a guide".

    // Update scroll indicators
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
    }, []);

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    };

    // Flatten all nodes with global index
    const allNodes = Guide_NODES.map((node, i) => ({
        node,
        globalIndex: i,
    }));

    return (
        <div className="relative">
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
                    <div className="flex items-center gap-0 relative z-10" style={{ minHeight: '480px' }}>
                        {allNodes.map(({ node, globalIndex }, i) => {
                            const isTop = i % 2 === 0;
                            const phaseMeta = PHASE_META[node.phase] || { title: `Phase ${node.phase}`, icon: Target, color: 'text-text-secondary', gradient: 'from-white/10 to-transparent', days: '' };
                            const PhaseIcon = phaseMeta.icon;
                            const isSelected = selectedNode?.id === node.id;
                            
                            // All nodes are active now
                            const status = 'active'; 

                            return (
                                <div
                                    key={node.id}
                                    className="flex flex-col items-center relative"
                                    style={{ width: '280px', minWidth: '280px' }}
                                >
                                    {/* Top Card (even index) */}
                                    {isTop && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            onClick={() => setSelectedNode(node)}
                                            className="w-[260px] cursor-pointer mb-4 transition-all duration-300 group p-1 bg-white/5 border border-white/5 rounded-[2rem]"
                                        >
                                            <div className={`rounded-[1.8rem] border p-5 space-y-3 transition-all duration-300 relative overflow-hidden
                                                ${isSelected 
                                                    ? `bg-gradient-to-b ${phaseMeta.gradient} border-white/20 shadow-lg` 
                                                    : 'bg-[#0c0c0c] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.05]'}
                                            `}>
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                                
                                                {/* Phase Tag */}
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${phaseMeta.color}`}>
                                                        Phase {node.phase}
                                                    </span>
                                                    <span className="text-text-secondary/30">•</span>
                                                    <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">
                                                        Day {(node as any).day_number || '?'}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h4 className="font-bold text-sm leading-snug text-text-primary">
                                                    {node.title}
                                                </h4>

                                                {/* Description */}
                                                <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                                                    {node.description}
                                                </p>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-1">
                                                    <span className="text-[9px] text-text-secondary/60 font-medium">
                                                        {formatTime((node as any).estimated_minutes)}
                                                    </span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${phaseMeta.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    Learn More <ArrowRight size={10} />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Vertical Connector Stem */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-[1px] h-0 bg-white/10" />

                                        {/* Timeline Node (on the center line) */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                                            onClick={() => setSelectedNode(node)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer z-20 border transition-all duration-300 shrink-0
                                                bg-white/[0.04] border-white/[0.08] text-text-secondary/50
                                                ${isSelected ? 'ring-2 ring-white/20 scale-110 bg-primary/10 text-primary border-primary/30' : 'hover:scale-105 hover:bg-white/[0.08] hover:text-text-primary'}
                                            `}
                                        >
                                            <PhaseIcon size={16} />
                                        </motion.div>

                                        <div className="w-[1px] h-0 bg-white/10" />
                                    </div>

                                    {/* Bottom Card (odd index) */}
                                    {!isTop && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            onClick={() => setSelectedNode(node)}
                                            className="w-[260px] cursor-pointer mt-4 transition-all duration-300 group p-1 bg-white/5 border border-white/5 rounded-[2rem]"
                                        >
                                            <div className={`rounded-[1.8rem] border p-5 space-y-3 transition-all duration-300 relative overflow-hidden
                                                ${isSelected 
                                                    ? `bg-gradient-to-b ${phaseMeta.gradient} border-white/20 shadow-lg` 
                                                    : 'bg-[#0c0c0c] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.05]'}
                                            `}>
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                                
                                                {/* Phase Tag */}
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${phaseMeta.color}`}>
                                                        Phase {node.phase}
                                                    </span>
                                                    <span className="text-text-secondary/30">•</span>
                                                    <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">
                                                        Day {(node as any).day_number || '?'}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h4 className="font-bold text-sm leading-snug text-text-primary">
                                                    {node.title}
                                                </h4>

                                                {/* Description */}
                                                <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                                                    {node.description}
                                                </p>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-1">
                                                    <span className="text-[9px] text-text-secondary/60 font-medium">
                                                        {formatTime((node as any).estimated_minutes)}
                                                    </span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${phaseMeta.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    Learn More <ArrowRight size={10} />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Static Spacer to maintain vertical alignment of nodes */}
                                    <div className="w-[240px] flex-1" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Node Detail Overlay */}
            {/* Detail Panel (Below Guide) */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                    >


                        <div id="Guide-detail-panel" className="px-6 pb-8 pt-0 max-w-5xl mx-auto">
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
