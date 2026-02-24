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
            } else {
                router.push(node.action_link);
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-gray-900 to-black">
                <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                        Phase {node.phase} • Step {node.order_index}
                    </span>
                    <h2 className="text-2xl font-bold text-text-primary leading-tight">{node.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center">
                    <X size={20} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 prose prose-invert prose-sm prose-orange max-w-none 
                    prose-headings:text-text-primary prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-xl prose-h1:mb-4 prose-h1:mt-0 prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-3
                    prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-orange-400
                    prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-sm
                    prose-li:text-text-secondary prose-li:text-sm prose-li:marker:text-primary
                    prose-strong:text-text-primary prose-strong:font-semibold
                    prose-em:text-text-secondary/70 prose-em:not-italic
                    prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-orange-300 prose-code:text-xs
                    prose-ul:my-3 prose-ol:my-3
                    prose-table:w-full prose-table:my-4 prose-table:text-sm
                    prose-th:bg-white/5 prose-th:text-left prose-th:text-orange-400 prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:border prose-th:border-white/10
                    prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-white/10 prose-td:text-text-secondary
                    prose-hr:border-white/10 prose-hr:my-6
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{node.content || ''}</ReactMarkdown>
                </div>

                {/* Sidebar / Context */}
                <div className="space-y-6">
                    <div className="p-1 bg-white/5 border border-white/5 rounded-2xl">
                        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-white/5 space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                            <span className="w-1 h-4 bg-orange-500 rounded-full"/>
                            Quick Actions
                            </h3>
                            
                            {node.action_link ? (
                                <button 
                                    onClick={handleAction}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-lg font-bold transition-all shadow-lg shadow-primary/10 active:scale-[0.98]"
                                >
                                    {node.action_label || 'Go to Tool'}
                                    <ExternalLink size={16} />
                                </button>
                            ) : (
                            <div className="text-xs text-text-secondary italic">No external action required.</div>
                            )}
                        </div>
                    </div>

                    <div className="p-1 bg-white/5 border border-white/5 rounded-2xl">
                        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-white/5 space-y-2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            <h3 className="text-sm font-bold text-text-primary">Estimated Time</h3>
                            <div className="text-2xl font-black text-text-secondary/50">
                                ~{(node as any).estimated_minutes || 15} min
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </motion.div>
    );
}
