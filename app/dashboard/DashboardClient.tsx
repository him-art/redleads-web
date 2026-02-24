'use client';

import React, { useState } from 'react';
import { X, Menu, Sparkles, Lock, Navigation, Archive, BookOpen, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import LiveDiscoveryTab from './LiveDiscoveryTab';
import PaywallModal from '@/components/PaywallModal';
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
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
                <LoadingIcon className="w-10 h-10 text-orange-500" />
            </div>
        );
    }

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
    const { profile, planDetails, trialStatus, draftingLead, setDraftingLead } = useDashboardData();
    const { isActuallyExpired } = trialStatus;

    const [activeTab, setActiveTab] = useState<'reports' | 'live' | 'settings' | 'billing' | 'Guide'>(effectiveSearch ? 'live' : 'live'); 
    
    // Check onboarding status reactive to profile from context
    const hasCompletedOnboarding = profile?.onboarding_completed || (profile?.description && profile?.keywords?.length > 0);
    const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);

    // Force Billing tab if expired
    useEffect(() => {
        if (isActuallyExpired && activeTab !== 'billing') {
            setActiveTab('billing');
        }
    }, [isActuallyExpired, activeTab]);

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
            
            <div className="flex h-screen bg-void text-text-primary overflow-hidden font-sans selection:bg-primary/30 relative">
                
                {/* Mobile Header Toggle */}
                <div className="lg:hidden absolute top-0 left-0 right-0 z-50 p-4 bg-void border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative">
                            <Image 
                                src="/redleads-logo-white.png" 
                                alt="RedLeads Logo" 
                                fill
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
                        lg:glass-panel lg:bg-card/50
                        bg-[#0A0A0A] lg:bg-transparent
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
                                    src="/redleads-logo-white.png" 
                                    alt="RedLeads Logo" 
                                    fill
                                    sizes="40px"
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight leading-none text-text-primary">RedLeads</h1>
                                <span className="text-[10px] font-medium text-primary uppercase tracking-widest">Intelligence</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1 flex-1">
                        <div className="px-3 mb-2">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Menu</span>
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
                                    className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${
                                        isLocked
                                            ? 'opacity-40 cursor-not-allowed grayscale'
                                            : isActive 
                                                ? 'bg-white/[0.08] text-text-primary shadow-void border border-white/5' 
                                                : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {isActive && !isLocked && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(255,88,54,0.5)]" />
                                    )}
                                    <TabIcon size={18} className={`relative z-10 transition-colors ${isLocked ? 'text-text-secondary' : isActive ? 'text-primary' : 'group-hover:text-text-primary'}`} />
                                    <span className={`relative z-10 text-sm font-medium tracking-wide ${isActive && !isLocked ? 'text-text-primary' : ''}`}>
                                        {tab.label}
                                    </span>
                                    {isLocked && (
                                        <Lock size={12} className="ml-auto text-text-secondary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* User Profile / Footer */}
                    <div className="mt-auto pt-6 border-t border-subtle">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-subtle flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-white/10 text-text-primary">
                                <span className="text-xs font-bold">
                                    {user.email?.[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-text-primary truncate">{user.email}</p>
                                <p className="text-[10px] text-text-secondary truncate">
                                    {planDetails.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-[20rem] relative flex flex-col min-w-0 bg-void">
                    {/* Content Container */}
                    <div className="flex-1 p-0 overflow-hidden">
                        <div className="w-full h-full relative flex flex-col">
                            {/* Scrollable Content Container - Custom Scrollbar */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-4 custom-scrollbar scrollbar-hide lg:scrollbar-default">
                                {/* Content Wrapper limit width */}
                                <div className="max-w-7xl mx-auto space-y-10 mt-16 lg:mt-0">
                                    
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
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-void/80">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Sparkles size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">AI Intelligence</h3>
                                        <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider opacity-60">Drafting Response</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setDraftingLead(null)}
                                    className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="flex-1 overflow-hidden">
                                <ReplyPanel 
                                    lead={draftingLead}
                                    productContext={profile?.description || ''}
                                    onClose={() => setDraftingLead(null)}
                                    isSidebar={true}
                                />
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

            </div>
        </>
    );
}
