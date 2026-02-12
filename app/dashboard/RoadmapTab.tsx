'use client';

import { useDashboardData } from '@/app/dashboard/DashboardDataContext';
import RoadmapView from './roadmap/RoadmapView';

export default function RoadmapTab({ user, onNavigate }: { user: any; onNavigate: (tab: string) => void }) {
    const { roadmapNodes: nodes, roadmapProgress: progress, isLoading: loading } = useDashboardData();

    if (loading) return <div className="p-10 text-center text-gray-500">Loading your path...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Roadmap</h2>
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
