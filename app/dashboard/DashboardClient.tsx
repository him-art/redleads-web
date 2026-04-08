'use client';

import React, { useState } from 'react';
import { X, Menu, Sparkles, Lock, Navigation, Archive, BookOpen, SlidersHorizontal, ShieldCheck, LogOut } from 'lucide-react';
import Image from 'next/image';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import LiveDiscoveryTab from './LiveDiscoveryTab';
import PaywallModal from '@/components/PaywallModal';
import { createClient } from '@/lib/supabase/client';
import OnboardingWizard from './OnboardingWizard';
import GuideTab from './GuideTab'; // [NEW]
import { DashboardDataProvider } from '@/app/dashboard/DashboardDataContext';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';
import ReplyPanel from '@/components/dashboard/ReplyPanel';
import { calculateTrialStatus, getPlanDetails } from '@/lib/dashboard-utils';
import { useDashboardData } from '@/app/dashboard/DashboardDataContext';

interface DashboardClientProps {
    profile: any;
    reports: any[];
    user: any;
    initialSearch?: string;
}

export default function DashboardClient({ profile, reports, user, initialSearch = '' }: DashboardClientProps) {
    return (
        <DashboardDataProvider userId={user.id} profile={profile}>
            <InnerDashboard reports={reports} user={user} initialSearch={initialSearch} />
        </DashboardDataProvider>
    );
}

function InnerDashboard({ reports, user, initialSearch }: { reports: any[], user: any, initialSearch: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const effectiveSearch = searchParams.get('search') || initialSearch;
    
    // Consume reactive data from context
    const { profile, planDetails, trialStatus, draftingLead, setDraftingLead, updateLead } = useDashboardData();
    const { isActuallyExpired } = trialStatus;

    const [activeTab, setActiveTab] = useState<'reports' | 'live' | 'settings' | 'billing' | 'Guide'>(effectiveSearch ? 'live' : 'live'); 
    
    // Check onboarding status reactive to profile from context
    const hasCompletedOnboarding = profile?.onboarding_completed || (profile?.description && profile?.keywords?.length > 0);
    const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);

    // Force Billing tab if expired - only if not in onboarding
    useEffect(() => {
        if (isActuallyExpired && !showOnboarding && activeTab !== 'billing') {
            setActiveTab('billing');
        }
    }, [isActuallyExpired, showOnboarding, activeTab]);

    // [FIX] Support query parameter for tab deep-linking (e.g. /dashboard?tab=billing)
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['reports', 'live', 'settings', 'billing', 'Guide'].includes(tabParam)) {
            setActiveTab(tabParam as any);
        }
    }, [searchParams]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const showPaywall = isActuallyExpired; 

    const handleCheckout = async (plan: 'starter' | 'growth' | 'lifetime' = 'growth') => {
        const res = await fetch('/api/payments/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan })
        });
        const data = await res.json();
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        } else {
            throw new Error(data.error || 'Failed to create checkout session');
        }
    };

    const tabs = [
        { id: 'live', label: 'Command Center', icon: Navigation, protected: true },
        { id: 'Guide', label: 'Guide', icon: BookOpen, protected: true },
        { id: 'reports', label: 'Leads Archive', icon: Archive, protected: true },
        { id: 'settings', label: 'Tracking Setup', icon: SlidersHorizontal, protected: true },
        { id: 'billing', label: 'Billing & Plan', icon: ShieldCheck, protected: false },
    ];

    return (
        <>
            {showOnboarding && (
                <OnboardingWizard 
                    userEmail={user.email} 
                    keywordLimit={planDetails.keywordLimit}
                    onComplete={(data, onboardingUrl) => {
                        setShowOnboarding(false);
                        router.push(`/dashboard?search=${encodeURIComponent(onboardingUrl || '')}`);
                        router.refresh();
                    }} 
                />
            )}
            {showPaywall && !showOnboarding && activeTab !== 'billing' && <PaywallModal onCheckout={handleCheckout} />}
            
            <div className="flex h-screen text-text-primary overflow-hidden font-sans selection:bg-primary/30 relative">
                
                {/* Mobile Header Toggle */}
                <div className="lg:hidden absolute top-0 left-0 right-0 z-50 p-4 backdrop-blur-xl bg-void/80 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative">
                            <Image 
                                src="/redleads-logo-white.webp" 
                                alt="RedLeads Logo" 
                                fill
                                priority={true}
                                sizes="32px"
                                className="object-contain" 
                            />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-text-primary">RedLeads</span>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Tab Identifier (Subtle) */}
                {!isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:hidden fixed top-[4.5rem] left-6 z-40"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 bg-primary/5 px-3 py-1 rounded-full border border-primary/10 backdrop-blur-sm">
                            {tabs.find(t => t.id === activeTab)?.label || activeTab}
                        </span>
                    </motion.div>
                )}

                {/* Sidebar Navigation - Floating Glass Panel */}
                <motion.aside 
                    initial={false}
                    animate={isMobileMenuOpen ? { x: 0 } : { x: 0 }}
                    className={`
                        fixed inset-y-0 left-0 z-[70] lg:z-40 w-72 
                        lg:backdrop-blur-2xl lg:bg-void/40 lg:border-r lg:border-white/5
                        bg-void lg:bg-transparent
                        transform lg:transform-none transition-transform duration-300 ease-in-out
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        flex flex-col p-6
                    `}
                >
                    {/* Brand Header */}
                    <div className="flex flex-col mb-10">
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-6 px-2 opacity-50">Command Center</span>
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 flex items-center justify-center relative">
                                <Image
                                    src="/redleads-logo-white.webp" 
                                    alt="RedLeads Logo" 
                                    fill
                                    priority={true}
                                    sizes="40px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <h1 className="font-bold text-xl tracking-tight leading-none text-text-primary">RedLeads</h1>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Intelligence</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1.5 flex-1">
                        <div className="px-3 mb-2">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Operations</span>
                        </div>
                        {tabs.map((tab) => {
                            const TabIcon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const isLocked = isActuallyExpired && tab.protected;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (isLocked) return;
                                        setActiveTab(tab.id as any);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                                        isLocked
                                            ? 'opacity-40 cursor-not-allowed grayscale'
                                            : isActive 
                                                ? 'bg-white/[0.08] text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                                                : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {isActive && !isLocked && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_12px_rgba(255,88,54,0.6)]" />
                                    )}
                                    <TabIcon size={18} className={`relative z-10 transition-colors duration-300 ${isLocked ? 'text-text-secondary' : isActive ? 'text-primary' : 'group-hover:text-text-primary'}`} />
                                    <span className={`relative z-10 text-xs font-bold uppercase tracking-widest ${isActive && !isLocked ? 'text-text-primary' : ''}`}>
                                        {tab.label}
                                    </span>
                                    {isLocked && (
                                        <Lock size={12} className="ml-auto text-text-secondary opacity-50" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* User Profile / Footer - Double Framed */}
                    <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                        <div className="p-0.5 surface-1 rounded-2xl group transition-all duration-500">
                            <div className="bg-void p-4 rounded-[0.9rem] border border-white/5 relative overflow-hidden flex items-center gap-3">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-white/10 text-text-primary shrink-0 transition-transform group-hover:scale-105">
                                    <span className="text-xs font-black uppercase text-ai">
                                        {user.email?.[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="overflow-hidden space-y-0.5">
                                    <p className="text-[11px] font-bold text-text-primary truncate">{user.email}</p>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest opacity-80">
                                        {planDetails.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                const supabase = createClient();
                                await supabase.auth.signOut();
                                window.location.href = '/';
                            }}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
                        >
                            <LogOut size={14} className="group-hover:text-red-400 transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Log Out</span>
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-[20rem] relative flex flex-col min-w-0">
                    {/* Content Container */}
                    <div className="flex-1 p-0 overflow-hidden">
                        <div className="w-full h-full relative flex flex-col">
                            {/* Scrollable Content Container - Custom Scrollbar */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-4 custom-scrollbar scrollbar-hide lg:scrollbar-default">
                                
                                {trialStatus.isInTrial && activeTab !== 'billing' && (
                                    <div className="max-w-7xl mx-auto mb-6 mt-16 lg:mt-0 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-40 relative text-orange-500 text-sm font-medium shadow-lg shadow-orange-500/5 backdrop-blur-md">
                                        <div className="flex items-center gap-2 font-bold tracking-tight">
                                            <Sparkles size={16} className="text-orange-500 shrink-0" /> 
                                            <span>Your 7-day free trial ends in {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''}.</span>
                                        </div>
                                        <button 
                                            onClick={() => setActiveTab('billing')}
                                            className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-black rounded-lg uppercase tracking-[0.1em] text-[10px] font-black shadow-md hover:from-orange-400 hover:to-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Upgrade Plan
                                        </button>
                                    </div>
                                )}

                                {/* Win-back banner for expired trial users */}
                                {isActuallyExpired && activeTab !== 'billing' && (
                                    <div className="max-w-7xl mx-auto mb-6 mt-16 lg:mt-0 bg-red-500/10 border border-red-500/30 rounded-xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-40 relative shadow-lg shadow-red-500/5 backdrop-blur-md">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2 font-black text-red-400 text-sm tracking-tight">
                                                <span>⏰</span>
                                                <span>Your trial ended — your leads are still being collected</span>
                                            </div>
                                            <p className="text-[11px] text-red-400/60 font-medium pl-6">Upgrade in 60 seconds to unlock all your leads and keep monitoring.</p>
                                        </div>
                                        <button 
                                            onClick={() => setActiveTab('billing')}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-lg uppercase tracking-[0.1em] text-[10px] font-black shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                                        >
                                            Unlock My Leads →
                                        </button>
                                    </div>
                                )}

                                {/* Content Wrapper limit width */}
                                <div className={`max-w-7xl mx-auto space-y-10 ${(trialStatus.isInTrial || isActuallyExpired) && activeTab !== 'billing' ? '' : 'mt-16 lg:mt-0'}`}>

                                    
                                    {/* Dynamic Tab Content - Hidden but mounted for caching */}
                                    <DashboardErrorBoundary>
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'live' && (
                                            <motion.div
                                                key="live"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <LiveDiscoveryTab 
                                                    user={user} 
                                                    initialSearch={effectiveSearch}
                                                    onNavigate={(tab) => setActiveTab(tab as any)} 
                                                />
                                            </motion.div>
                                        )}

                                        {activeTab === 'reports' && (
                                            <motion.div
                                                key="reports"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ReportsTab reports={reports} user={user} />
                                            </motion.div>
                                        )}

                                        {activeTab === 'Guide' && (
                                            <motion.div
                                                key="Guide"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <GuideTab onNavigate={(tab) => setActiveTab(tab as any)} />
                                            </motion.div>
                                        )}

                                        {activeTab === 'settings' && (
                                            <motion.div
                                                key="settings"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <SettingsTab user={user} />
                                            </motion.div>
                                        )}

                                        {activeTab === 'billing' && (
                                            <motion.div
                                                key="billing"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <BillingTab />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    </DashboardErrorBoundary>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                
                {/* AI Intelligence Sidebar (Cursor-Style) */}
                <AnimatePresence>
                    {draftingLead && (
                        <motion.aside
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 z-[60] w-full sm:w-[500px] h-screen bg-[#0A0A0A] border-l border-white/5 shadow-2xl flex flex-col pt-20 lg:pt-0"
                        >
                            {/* Sidebar Content */}
                            <div className="flex-1 overflow-hidden">
                                <ReplyPanel 
                                    lead={draftingLead}
                                    productContext={profile?.description || ''}
                                    websiteUrl={profile?.website_url || ''}
                                    onClose={() => setDraftingLead(null)}
                                    isSidebar={true}
                                    onResponded={() => {
                                        if (draftingLead && !draftingLead.has_responded) {
                                            updateLead(draftingLead.id, { has_responded: true });
                                        }
                                    }}
                                />
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

            </div>
        </>
    );
}
