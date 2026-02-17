'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

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

export interface LeadAnalysis {
    id: string;
    content: string;
    created_at: string;
    lead_ids: string[];
}

interface DashboardData {
    leads: MonitoredLead[];
    analyses: LeadAnalysis[];
    isLoading: boolean;
    refreshLeads: () => Promise<void>;
    updateLead: (id: string, updates: Partial<MonitoredLead>) => Promise<void>;
    deleteLead: (id: string) => Promise<void>;
    draftingLead: MonitoredLead | null;
    setDraftingLead: (lead: MonitoredLead | null) => void;
}

const DashboardDataContext = createContext<DashboardData | undefined>(undefined);

export function DashboardDataProvider({ children, userId, draftingState }: { children: React.ReactNode; userId: string; draftingState?: { draftingLead: any, setDraftingLead: (l: any) => void } }) {
    const [leads, setLeads] = useState<MonitoredLead[]>([]);
    const [analyses, setAnalyses] = useState<LeadAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // Remove local state if draftingState is provided
    const [localDraftingLead, setLocalDraftingLead] = useState<MonitoredLead | null>(null);
    
    const currentDraftingLead = draftingState?.draftingLead || localDraftingLead;
    const currentSetDraftingLead = draftingState?.setDraftingLead || setLocalDraftingLead;
    
    // Use useRef for tracking fetch times to avoid re-triggering memoized fetchers
    const lastLeadsFetch = React.useRef<number>(0);
    
    const supabase = React.useMemo(() => createClient(), []);

    const fetchLeads = useCallback(async (force = false) => {
        if (!userId) return;
        
        const now = Date.now();
        // 1-Minute Cache Check using ref to avoid dependency loop
        if (!force && lastLeadsFetch.current > 0 && now - lastLeadsFetch.current < 60000) {
            return;
        }

        try {
            const { data, error } = await supabase
                .from('monitored_leads')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1000);
            
            if (!error && data) {
                setLeads(data);
                lastLeadsFetch.current = now;
            }
        } catch (err) {
            console.error('Error fetching leads:', err);
        }
    }, [userId, supabase]);

    const updateLead = useCallback(async (id: string, updates: any) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
        const { error } = await supabase.from('monitored_leads').update(updates).eq('id', id);
        if (error) {
            fetchLeads(true); // Sync back on error
            throw error;
        }
    }, [supabase, fetchLeads]);

    const deleteLead = useCallback(async (id: string) => {
        setLeads(prev => prev.filter(l => l.id !== id));
        const { error } = await supabase.from('monitored_leads').delete().eq('id', id);
        if (error) {
            fetchLeads(true);
            throw error;
        }
    }, [supabase, fetchLeads]);

    const fetchAnalyses = useCallback(async () => {
        if (!userId) return;
        try {
            const { data } = await supabase
                .from('lead_analyses')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);
            if (data) setAnalyses(data);
        } catch (err) {
            console.error('Error fetching analyses:', err);
        }
    }, [userId, supabase]);

    useEffect(() => {
        let isMounted = true;
        
        async function init() {
            if (!userId) return;
            setIsLoading(true);
            await Promise.all([fetchLeads(), fetchAnalyses()]);
            if (isMounted) setIsLoading(false);
        }
        
        init();

        const channel = supabase
            .channel(`dashboard-updates-${userId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'monitored_leads', filter: `user_id=eq.${userId}` },
                () => { fetchLeads(true); }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [userId, fetchLeads, fetchAnalyses, supabase]);

    const value = React.useMemo(() => ({
          leads,
          analyses,
          isLoading,
          refreshLeads: fetchLeads,
          updateLead,
          deleteLead,
          draftingLead: currentDraftingLead,
          setDraftingLead: currentSetDraftingLead
      }), [leads, analyses, isLoading, fetchLeads, updateLead, deleteLead, currentDraftingLead, currentSetDraftingLead]);

    return (
        <DashboardDataContext.Provider value={value}>
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
