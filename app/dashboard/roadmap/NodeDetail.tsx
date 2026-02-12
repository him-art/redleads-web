'use client';

import { RoadmapNode } from '@/types/roadmap';
import { createClient } from '@/lib/supabase/client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ExternalLink, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';

interface NodeDetailProps {
    node: RoadmapNode;
    status: 'locked' | 'active' | 'completed';
    userId: string;
    onNavigate: (tab: string) => void;
    onClose: () => void;
}

export default function NodeDetail({ node, status, userId, onNavigate, onClose }: NodeDetailProps) {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const [completing, setCompleting] = useState(false);

    const handleComplete = async () => {
        setCompleting(true);
        // Optimistic update handled by parent refetch or subscription ideally, 
        // but for now we just write and reload
        const { error } = await supabase.from('user_roadmap_progress').insert({
            user_id: userId,
            node_id: node.id,
            status: 'completed'
        });

        if (!error) {
            router.refresh(); // Refresh server data
            onClose(); // Close detail to show progress on map
        }
        setCompleting(false);
    };

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
            className="h-full bg-[#111] rounded-2xl border border-white/10 flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-gray-900 to-black">
                <div>
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 block">
                        Phase {node.phase} • Step {node.order_index}
                    </span>
                    <h2 className="text-2xl font-bold text-white leading-tight">{node.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Content Scroller */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {/* Render markdown content properly */}
                <div className="prose prose-invert prose-sm prose-orange max-w-none 
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-xl prose-h1:mb-4 prose-h1:mt-0 prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-3
                    prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-orange-400
                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-sm
                    prose-li:text-gray-300 prose-li:text-sm prose-li:marker:text-orange-500
                    prose-strong:text-white prose-strong:font-semibold
                    prose-em:text-gray-400 prose-em:not-italic
                    prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-orange-300 prose-code:text-xs
                    prose-ul:my-3 prose-ol:my-3
                    prose-table:w-full prose-table:my-4 prose-table:text-sm
                    prose-th:bg-white/5 prose-th:text-left prose-th:text-orange-400 prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:border prose-th:border-white/10
                    prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-white/10 prose-td:text-gray-300
                    prose-hr:border-white/10 prose-hr:my-6
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{node.content || ''}</ReactMarkdown>
                </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-white/5 bg-[#0A0A0A] space-y-4">
                
                {node.action_link && (
                    <button 
                        onClick={handleAction}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl font-medium transition-colors border border-white/5"
                    >
                        {node.action_label || 'Go to Tool'}
                        <ExternalLink size={16} />
                    </button>
                )}

                {status !== 'completed' ? (
                    <button 
                        onClick={handleComplete}
                        disabled={completing}
                        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20 active:scale-[0.98]"
                    >
                        {completing ? 'Verifying...' : 'Mark Complete'}
                        <CheckCircle2 size={18} />
                    </button>
                ) : (
                    <div className="w-full p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center gap-2 font-bold">
                        <CheckCircle2 size={18} />
                        Completed
                    </div>
                )}
            </div>
        </motion.div>
    );
}
