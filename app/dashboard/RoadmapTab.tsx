'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import RoadmapView from './roadmap/RoadmapView';

export default function RoadmapTab({ user, onNavigate }: { user: any; onNavigate: (tab: string) => void }) {
    const [loading, setLoading] = useState(true);
    const [nodes, setNodes] = useState<any[]>([]);
    const [progress, setProgress] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [nodesRes, progressRes] = await Promise.all([
                supabase.from('roadmap_nodes').select('*').order('order_index'),
                supabase.from('user_roadmap_progress').select('*').eq('user_id', user?.id)
            ]);

            if (nodesRes.data) setNodes(nodesRes.data);
            if (progressRes.data) setProgress(progressRes.data);
            setLoading(false);
        }

        if (user?.id) fetchData();
    }, [user?.id]);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading your path...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">RedLeads Academy</h2>
                    <p className="text-gray-400">Your 90-day roadmap to your first 100 users.</p>
                </div>
                <div className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/20">
                    Phase 1: The Trojan Horse
                </div>
            </div>

            <RoadmapView nodes={nodes} progress={progress} userId={user.id} onNavigate={onNavigate} />
        </div>
    );
}
