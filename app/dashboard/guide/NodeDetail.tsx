'use client';

import { GuideNode } from '@/types/guide';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';

interface NodeDetailProps {
    node: GuideNode;
    onNavigate: (tab: string) => void;
    onClose: () => void;
}

export default function NodeDetail({ node, onNavigate, onClose }: NodeDetailProps) {
    const router = useRouter();

    const handleAction = () => {
        if (node.action_link) {
            // Check if it's an internal tab link (e.g., ?tab=settings)
            const tabMatch = node.action_link.match(/\?tab=(\w+)/);
            if (tabMatch) {
                onNavigate(tabMatch[1]);
            } else if (node.action_link.startsWith('http')) {
                window.open(node.action_link, '_blank', 'noopener,noreferrer');
            } else {
                router.push(node.action_link);
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#050505]/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] relative"
        >
            {/* Background Textures */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none blur-3xl" />
            
            {/* Header */}
            <div className="p-8 border-b border-white/[0.06] flex justify-between items-start bg-white/[0.01]">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                            Phase {node.phase}
                        </span>
                        <span className="text-text-secondary/30">•</span>
                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.15em]">
                            Step {node.order_index}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary tracking-tight leading-tight">{node.title}</h2>
                </div>
                <button onClick={onClose} className="p-3 bg-white/[0.03] border border-white/[0.05] hover:bg-white/10 rounded-2xl text-text-secondary hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg">
                    <X size={20} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 prose prose-invert prose-orange max-w-none 
                    prose-headings:text-text-primary prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-4 prose-h1:flex prose-h1:items-center prose-h1:gap-3
                    prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-orange-400
                    prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-base
                    prose-li:text-text-secondary prose-li:text-base prose-li:marker:text-primary prose-li:leading-relaxed
                    prose-strong:text-text-primary prose-strong:font-semibold
                    prose-em:text-text-secondary/70 prose-em:not-italic
                    prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-orange-300 prose-code:text-sm prose-code:font-mono
                    prose-ul:my-5 prose-ol:my-5
                    prose-table:w-full prose-table:my-6 prose-table:text-sm prose-table:rounded-xl prose-table:overflow-hidden prose-table:border-collapse
                    prose-th:bg-white/5 prose-th:text-left prose-th:text-orange-400 prose-th:font-bold prose-th:px-4 prose-th:py-3 prose-th:border-b prose-th:border-white/10
                    prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-white/5 prose-td:text-text-secondary
                    prose-hr:border-white/10 prose-hr:my-8
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{node.content || ''}</ReactMarkdown>
                </div>

                {/* Sidebar / Context */}
                <div className="space-y-6 lg:pl-6 lg:border-l border-white/[0.05]">
                    <div className="p-1 bg-gradient-to-b from-white/10 to-white/5 border border-white/5 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <div className="p-6 rounded-[1.4rem] bg-[#0c0c0c] border border-white/[0.05] space-y-5 relative overflow-hidden backdrop-blur-md">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <h3 className="text-sm font-bold text-text-primary flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                    <ExternalLink size={14} />
                                </div>
                                Quick Actions
                            </h3>
                            
                            {node.action_link ? (
                                <button 
                                    onClick={handleAction}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] active:scale-[0.98]"
                                >
                                    {node.action_label || 'Go to Tool'}
                                </button>
                            ) : (
                                <div className="text-sm text-text-secondary italic bg-white/[0.02] p-4 rounded-xl border border-white/[0.05] text-center">
                                    No external action required.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-1 bg-white/5 border border-white/5 rounded-3xl">
                        <div className="p-6 rounded-[1.4rem] bg-[#0c0c0c] border border-white/[0.05] space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/60">Estimated Time</h3>
                            <div className="text-3xl font-black text-text-primary tracking-tight">
                                ~{(node as any).estimated_minutes || 15} <span className="text-sm text-text-secondary font-medium tracking-normal">min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
