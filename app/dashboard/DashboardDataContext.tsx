'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DashboardData {
    leads: MonitoredLead[];
    roadmapNodes: RoadmapNode[];
    roadmapProgress: RoadmapProgress[];
    analyses: LeadAnalysis[];
    isLoading: boolean;
    refreshLeads: () => Promise<void>;
    refreshRoadmap: () => Promise<void>;
    updateLead: (id: string, updates: Partial<MonitoredLead>) => Promise<void>;
    deleteLead: (id: string) => Promise<void>;
}

export interface MonitoredLead {
    id: string;
    title: string;
    subreddit: string;
    url: string;
    status: string;
    match_score: number;
    created_at: string;
    is_saved?: boolean;
    match_category?: string;
}

export interface RoadmapNode {
    id: string;
    title: string;
    description: string;
    order_index: number;
    tasks: string[];
    phase: number;
    content: string | null;
    action_label: string | null;
    action_link: string | null;
    created_at: string;
}

export interface RoadmapProgress {
    node_id: string;
    completed_at: string;
    status: string;
    user_id: string;
}

export interface LeadAnalysis {
    id: string;
    content: string;
    created_at: string;
    lead_ids: string[];
}

const DashboardDataContext = createContext<DashboardData | undefined>(undefined);

export function DashboardDataProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
    const [leads, setLeads] = useState<MonitoredLead[]>([]);
    const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNode[]>([]);
    const [roadmapProgress, setRoadmapProgress] = useState<RoadmapProgress[]>([]);
    const [analyses, setAnalyses] = useState<LeadAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchLeads = useCallback(async () => {
        if (!userId) return;
        const { data, error } = await supabase
            .from('monitored_leads')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1000);
        
        if (!error && data) setLeads(data);
    }, [userId, supabase]);

    const updateLead = async (id: string, updates: any) => {
        // Optimistic update
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
        const { error } = await supabase.from('monitored_leads').update(updates).eq('id', id);
        if (error) {
            // Revert on error
            fetchLeads();
            throw error;
        }
    };

    const deleteLead = async (id: string) => {
        // Optimistic update
        setLeads(prev => prev.filter(l => l.id !== id));
        const { error } = await supabase.from('monitored_leads').delete().eq('id', id);
        if (error) {
            fetchLeads();
            throw error;
        }
    };

    const fetchRoadmap = useCallback(async () => {
        if (!userId) return;
        const [nodesRes, progressRes] = await Promise.all([
            supabase.from('roadmap_nodes').select('*').order('order_index'),
            supabase.from('user_roadmap_progress').select('*').eq('user_id', userId)
        ]);

        if (nodesRes.data) setRoadmapNodes(nodesRes.data);
        if (progressRes.data) setRoadmapProgress(progressRes.data);
    }, [userId, supabase]);

    const fetchAnalyses = useCallback(async () => {
        if (!userId) return;
        const { data } = await supabase
            .from('lead_analyses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);
        if (data) setAnalyses(data);
    }, [userId, supabase]);

    useEffect(() => {
        async function init() {
            if (!userId) return;
            setIsLoading(true);
            await Promise.all([fetchLeads(), fetchRoadmap(), fetchAnalyses()]);
            setIsLoading(false);
        }
        init();

        // Realtime subscription for leads
        const channel = supabase
            .channel('dashboard-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'monitored_leads', filter: `user_id=eq.${userId}` },
                () => { fetchLeads(); }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, fetchLeads, fetchRoadmap, fetchAnalyses, supabase]);

    return (
        <DashboardDataContext.Provider value={{
            leads,
            roadmapNodes,
            roadmapProgress,
            analyses,
            isLoading,
            refreshLeads: fetchLeads,
            refreshRoadmap: fetchRoadmap,
            updateLead,
            deleteLead
        }}>
            {children}
        </DashboardDataContext.Provider>
    );
}

export function useDashboardData() {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
}
