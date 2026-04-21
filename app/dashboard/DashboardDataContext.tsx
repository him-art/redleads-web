'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { calculateTrialStatus, getPlanDetails } from '@/lib/dashboard-utils';

export interface MonitoredLead {
// ... (keeping existing interfaces)
    id: string;
    title: string;
    subreddit: string;
    url: string;
    status: string;
    match_score: number;
    created_at: string;
    is_saved?: boolean;
    has_responded?: boolean;
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
    trialStatus: {
        isActuallyExpired: boolean;
        isInTrial: boolean;
        daysRemaining: number;
        trialEndsAt: Date | null;
    };
    planDetails: any;
    profile: any;
    refreshProfile: () => Promise<void>;
}

const DashboardDataContext = createContext<DashboardData | undefined>(undefined);

export function DashboardDataProvider({ children, userId, draftingState, profile }: { children: React.ReactNode; userId: string; draftingState?: { draftingLead: any, setDraftingLead: (l: any) => void }, profile: any }) {
    const [leads, setLeads] = useState<MonitoredLead[]>([]);
    const [analyses, setAnalyses] = useState<LeadAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeProfile, setActiveProfile] = useState(profile);
    
    useEffect(() => {
        if (profile) setActiveProfile(profile);
    }, [profile]);

    // Remove local state if draftingState is provided
    const [localDraftingLead, setLocalDraftingLead] = useState<MonitoredLead | null>(null);
    
    const currentDraftingLead = draftingState?.draftingLead || localDraftingLead;
    const currentSetDraftingLead = draftingState?.setDraftingLead || setLocalDraftingLead;
    
    const trialStatus = React.useMemo(() => calculateTrialStatus(activeProfile), [activeProfile]);
    const planDetails = React.useMemo(() => getPlanDetails(activeProfile), [activeProfile]);

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
                .select('id, title, subreddit, url, status, match_score, match_category, is_saved, has_responded, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(100);
            
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

    const refreshProfile = useCallback(async () => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (!error && data) {
                setActiveProfile(data);
            }
        } catch (err) {
            console.error('Error refreshing profile:', err);
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
                { event: 'INSERT', schema: 'public', table: 'monitored_leads', filter: `user_id=eq.${userId}` },
                (payload) => {
                    // Append new lead to state instead of re-fetching all
                    if (payload.new) {
                        setLeads(prev => [payload.new as MonitoredLead, ...prev]);
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'monitored_leads', filter: `user_id=eq.${userId}` },
                (payload) => {
                    // Update single lead in state instead of re-fetching all
                    if (payload.new) {
                        setLeads(prev => prev.map(l => l.id === (payload.new as MonitoredLead).id ? { ...l, ...payload.new } as MonitoredLead : l));
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'monitored_leads', filter: `user_id=eq.${userId}` },
                (payload) => {
                    if (payload.old && (payload.old as any).id) {
                        setLeads(prev => prev.filter(l => l.id !== (payload.old as any).id));
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
                (payload) => { 
                    if (payload.new) {
                        setActiveProfile((prev: any) => ({ ...prev, ...payload.new }));
                    }
                }
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
          setDraftingLead: currentSetDraftingLead,
          trialStatus,
          planDetails,
          profile: activeProfile,
          refreshProfile
      }), [leads, analyses, isLoading, fetchLeads, updateLead, deleteLead, currentDraftingLead, currentSetDraftingLead, trialStatus, planDetails, activeProfile, refreshProfile]);

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
