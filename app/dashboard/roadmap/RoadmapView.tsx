'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Star, Zap, Sparkles, Target, Rocket } from 'lucide-react';
import { RoadmapNode, UserProgress } from '@/types/roadmap';
import NodeDetail from './NodeDetail';
import { useState, useMemo } from 'react';

interface RoadmapViewProps {
    nodes: RoadmapNode[];
    progress: UserProgress[];
    userId: string;
    onNavigate: (tab: string) => void;
}

const PHASE_META: Record<number, { title: string; icon: React.ElementType; color: string; days: string }> = {
    1: { title: 'The Foundation', icon: Target, color: 'text-orange-500', days: 'Days 1-7' },
    2: { title: 'The Value Drop', icon: Sparkles, color: 'text-blue-500', days: 'Days 8-21' },
    3: { title: 'Conversion Engine', icon: Rocket, color: 'text-green-500', days: 'Days 22-45' },
    4: { title: 'The Authority', icon: Target, color: 'text-purple-500', days: 'Days 46-75' },
    5: { title: 'The Scale System', icon: Rocket, color: 'text-cyan-500', days: 'Days 76-90' },
};

const formatTime = (minutes: number | null | undefined): string => {
    if (!minutes) return '~15 min';
    if (minutes >= 60) return `~${Math.round(minutes / 60)}h`;
    return `~${minutes} min`;
};

export default function RoadmapView({ nodes, progress, userId, onNavigate }: RoadmapViewProps) {
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

    // Calculate status for each node
    const getNodeStatus = (node: RoadmapNode, index: number) => {
        const userNode = progress.find(p => p.node_id === node.id);
        if (userNode?.status === 'completed') return 'completed';
        
        if (index === 0) return 'active';
        const prevNode = nodes[index - 1];
        const prevProgress = progress.find(p => p.node_id === prevNode.id);
        
        if (prevProgress?.status === 'completed') return 'active';
        return 'locked';
    };

    // Group nodes by phase
    const nodesByPhase = useMemo(() => {
        const grouped: Record<number, RoadmapNode[]> = {};
        nodes.forEach(node => {
            if (!grouped[node.phase]) grouped[node.phase] = [];
            grouped[node.phase].push(node);
        });
        return grouped;
    }, [nodes]);

    // Calculate global index
    const getGlobalIndex = (phase: number, localIndex: number) => {
        let globalIndex = 0;
        for (let p = 1; p < phase; p++) {
            globalIndex += nodesByPhase[p]?.length || 0;
        }
        return globalIndex + localIndex;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-14rem)] lg:h-[650px]">
            {/* Timeline Area */}
            <div className="flex-1 relative bg-gradient-to-b from-[#0A0A0A] to-[#080808] rounded-2xl border border-white/5 overflow-hidden">
                
                {/* Gradient overlay at top */}
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20 pointer-events-none" />

                <div className="h-full overflow-y-auto custom-scrollbar p-6 lg:p-8">
                    {Object.entries(nodesByPhase).map(([phaseNum, phaseNodes]) => {
                        const phase = parseInt(phaseNum);
                        const phaseMeta = PHASE_META[phase] || { title: `Phase ${phase}`, icon: Star, color: 'text-gray-500' };
                        const PhaseIcon = phaseMeta.icon;
                        
                        return (
                            <div key={phase} className="mb-10 last:mb-0">
                                {/* Phase Header */}
                                <div className="flex items-center gap-3 mb-6 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-sm py-2 -mx-2 px-2 z-10">
                                    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${phaseMeta.color}`}>
                                        <PhaseIcon size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phase {phase}</span>
                                        <h3 className={`font-bold text-sm ${phaseMeta.color}`}>{phaseMeta.title}</h3>
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                                        {phaseMeta.days}
                                    </span>
                                </div>

                                {/* Phase Nodes */}
                                <div className="relative ml-4 border-l-2 border-white/5 pl-6 space-y-6">
                                    {phaseNodes.map((node, localIndex) => {
                                        const globalIndex = getGlobalIndex(phase, localIndex);
                                        const status = getNodeStatus(node, globalIndex);
                                        const isSelected = selectedNode?.id === node.id;
                                        const isLocked = status === 'locked';

                                        return (
                                            <motion.div 
                                                key={node.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: localIndex * 0.05 }}
                                                className={`relative group cursor-pointer transition-all duration-300 ${isLocked ? 'pointer-events-none' : ''}`}
                                                onClick={() => !isLocked && setSelectedNode(node)}
                                            >
                                                {/* Connection dot */}
                                                <div className={`absolute -left-[31px] top-3 w-4 h-4 rounded-full border-2 flex items-center justify-center
                                                    ${status === 'completed' ? 'bg-green-500 border-green-500' : 
                                                      status === 'active' ? 'bg-orange-500 border-orange-500 animate-pulse' : 
                                                      'bg-gray-800 border-gray-700'}
                                                `}>
                                                    {status === 'completed' && <Check size={10} strokeWidth={3} className="text-white" />}
                                                </div>

                                                {/* Card */}
                                                <div className={`p-4 rounded-xl border transition-all duration-200 
                                                    ${isSelected ? 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5' : 
                                                      status === 'active' ? 'bg-white/[0.03] border-white/10 hover:border-orange-500/30 hover:bg-white/[0.05]' : 
                                                      'bg-transparent border-transparent'}
                                                    ${isLocked ? 'opacity-40 blur-[2px]' : ''}
                                                `}>
                                                    {/* Day & Time Badge */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${status === 'completed' ? 'text-gray-600' : 'text-gray-500'}`}>
                                                            Day {(node as any).day_number || '?'}
                                                        </span>
                                                        <span className="text-gray-700">•</span>
                                                        <span className={`text-[10px] ${status === 'completed' ? 'text-gray-600' : 'text-gray-500'}`}>
                                                            {formatTime((node as any).estimated_minutes)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className={`font-bold text-base truncate ${status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                                                                    {node.title}
                                                                </h4>
                                                                {status === 'active' && (
                                                                    <span className="shrink-0 bg-orange-500 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                                                                        Up Next
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-sm line-clamp-1 ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                                                                {node.description}
                                                            </p>
                                                        </div>
                                                        
                                                        {isLocked && (
                                                            <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0">
                                                                <Lock size={14} className="text-gray-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail View */}
            <div className="w-full lg:w-[420px] shrink-0 h-[450px] lg:h-full">
                <AnimatePresence mode="wait">
                    {selectedNode ? (
                        <NodeDetail 
                            key={selectedNode.id}
                            node={selectedNode} 
                            status={getNodeStatus(selectedNode, nodes.findIndex(n => n.id === selectedNode.id))}
                            userId={userId}
                            onNavigate={onNavigate}
                            onClose={() => setSelectedNode(null)}
                        />
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full rounded-2xl border border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#080808] flex flex-col items-center justify-center text-center p-8"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent flex items-center justify-center mb-6 border border-orange-500/10">
                                <Zap className="text-orange-500" size={32} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Your Mission Briefing</h3>
                            <p className="text-gray-500 text-sm max-w-[250px]">Select an active quest from the timeline to view detailed instructions.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

