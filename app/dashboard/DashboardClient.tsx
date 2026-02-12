'use client';

import { useState } from 'react';
import { Archive, Sliders, ShieldCheck, Navigation, Layout, Search, Menu, X, Sparkles, Clock, AlertTriangle, Zap, Loader2, GraduationCap, Lock } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import LiveDiscoveryTab from './LiveDiscoveryTab';
import PaywallModal from '@/components/PaywallModal';
import OnboardingWizard from './OnboardingWizard';
import RoadmapTab from './RoadmapTab'; // [NEW]
import { DashboardDataProvider } from '@/app/dashboard/DashboardDataContext';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
    profile: any;
    reports: any[];
    user: any;
    initialSearch?: string;
}

export default function DashboardClient({ profile, reports, user, initialSearch = '' }: DashboardClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'reports' | 'live' | 'settings' | 'billing' | 'roadmap'>(initialSearch ? 'live' : 'live'); 
    // Note: It's currently hardcoded to 'live', keeping as is for now but fixed the syntax.
    
    // Check onboarding status
    const hasCompletedOnboarding = profile?.onboarding_completed || (profile?.description && profile?.keywords?.length > 0);
    const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    // Trial expiration check - Moved up to use for initialization
    const isPro = profile?.subscription_tier === 'pro' || profile?.effective_tier === 'pro';
    const isScout = profile?.subscription_tier === 'scout' || profile?.effective_tier === 'scout' || isPro;
    const isAdmin = profile?.is_admin === true || user?.email === 'hjayaswar@gmail.com';
    
    const trialEndsAtString = profile?.trial_ends_at || (profile?.created_at ? (() => {
        const d = new Date(profile.created_at);
        if (isNaN(d.getTime())) return null;
        const ends = new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000);
        return ends.toISOString();
    })() : null);
    const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null;
    const now = new Date();
    const trialExpired = trialEndsAt ? (trialEndsAt.getTime() <= now.getTime()) : false;
    const daysRemaining = (() => {
        try {
            if (!trialEndsAt) return 0;
            const diff = trialEndsAt.getTime() - now.getTime();
            return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        } catch (e) {
            return 0;
        }
    })();
    const isActuallyExpired = !isScout && !isAdmin && (trialExpired || (trialEndsAt && daysRemaining <= 0));

    // Force Billing tab if expired on mount
    useEffect(() => {
        if (isActuallyExpired && activeTab !== 'billing') {
            setActiveTab('billing');
        }
    }, [isActuallyExpired]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const showPaywall = isActuallyExpired && !isScout && !isAdmin;

    const handleCheckout = async (plan: 'scout' | 'pro' | 'professional' = 'pro') => {
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
        { id: 'roadmap', label: 'Roadmap (Beta)', icon: GraduationCap, protected: true },
        { id: 'reports', label: 'Leads Archive', icon: Archive, protected: true },
        { id: 'settings', label: 'Tracking Setup', icon: Sliders, protected: true },
        { id: 'billing', label: 'Billing & Plan', icon: ShieldCheck, protected: false },
    ];

    // Prevent ANY rendering until mounted to ensure 100% hydration sync on mobile
    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );
    }

    return (
        <>
            {showOnboarding && (
                <OnboardingWizard 
                    userEmail={user.email} 
                    keywordLimit={isScout && !isPro ? 5 : 15}
                    onComplete={(data, onboardingUrl) => {
                        setShowOnboarding(false);
                        const searchParam = onboardingUrl ? `?search=${encodeURIComponent(onboardingUrl)}` : '';
                        router.push(`/dashboard${searchParam}`);
                        router.refresh();
                    }} 
                />
            )}
            {/* PaywallModal only shows if trial is expired and they aren't on billing yet */}
            {showPaywall && !showOnboarding && activeTab !== 'billing' && <PaywallModal onCheckout={handleCheckout} />}
            
            <DashboardDataProvider userId={user.id}>
                {/* Main Layout Container - Full Dark Theme */}
            <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-orange-500/30">
                
                {/* Mobile Header Toggle */}
                <div className="lg:hidden absolute top-0 left-0 right-0 z-50 p-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 relative">
                            <Image 
                                src="/redleads-logo-white.png" 
                                alt="RedLeads Logo" 
                                fill
                                className="object-contain" 
                            />
                        </div>
                        <span className="font-bold text-lg tracking-tight">RedLeads</span>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Sidebar Navigation - Fixed Left */}
                <motion.aside 
                    initial={false}
                    animate={isMobileMenuOpen ? { x: 0 } : { x: 0 }}
                    className={`
                        fixed inset-y-0 left-0 z-40 w-72 bg-[#050505]
                        transform lg:transform-none transition-transform duration-300 ease-in-out
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        flex flex-col p-8
                    `}
                >
                    {/* Brand Header */}
                    <div className="flex flex-col mb-12">
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-8 px-2">Workspace</span>
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 flex items-center justify-center relative">
                                <Image
                                    src="/redleads-logo-white.png" 
                                    alt="RedLeads Logo" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight leading-none text-white">RedLeads</h1>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Intelligence</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1 flex-1">
                        <div className="px-3 mb-2">
                             <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Menu</span>
                        </div>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
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
                                    className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group overflow-hidden ${
                                        isLocked
                                            ? 'opacity-40 cursor-not-allowed grayscale'
                                            : isActive 
                                                ? 'bg-white/[0.05] text-white shadow-inner' 
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                                    }`}
                                >
                                    {isActive && !isLocked && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                                    )}
                                    <Icon size={18} className={`relative z-10 transition-colors ${isLocked ? 'text-gray-600' : isActive ? 'text-orange-500' : 'group-hover:text-gray-300'}`} />
                                    <span className={`relative z-10 text-sm font-medium tracking-wide ${isActive && !isLocked ? 'text-white' : ''}`}>
                                        {tab.label}
                                    </span>
                                    {isLocked && (
                                        <Lock size={12} className="ml-auto text-gray-700" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* User Profile / Footer */}
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                                <span className="text-xs font-bold text-gray-300">
                                    {user.email?.[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">{user.email}</p>
                                <p className="text-[10px] text-gray-500 truncate">
                                    {isAdmin ? 'Administrator' : isPro ? 'Growth Member' : isScout ? 'Starter Member' : 'Free Trial'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-72 relative flex flex-col min-w-0 bg-[#050505]">
                    {/* Frame Container - Flush on mobile, Framed on desktop */}
                    <div className="flex-1 p-0 lg:pt-6 lg:px-6 lg:pb-0 overflow-hidden">
                        <div className="w-full h-full bg-[#0F0F0F] rounded-none lg:rounded-t-[2.5rem] border-0 lg:border-x lg:border-t border-white/5 overflow-hidden relative flex flex-col shadow-none lg:shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                            {/* Scrollable Content Container - Custom Scrollbar */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-12 custom-scrollbar scrollbar-hide lg:scrollbar-default">
                                {/* Content Wrapper limit width */}
                                <div className="max-w-6xl mx-auto space-y-10 mt-16 lg:mt-0">
                                    
                                    {/* Dynamic Tab Content - Hidden but mounted for caching */}
                                    <AnimatePresence mode="wait">
                                        <div className="relative">
                                            {/* Live & Archive share common data */}
                                            <div style={{ display: activeTab === 'live' ? 'block' : 'none' }}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <LiveDiscoveryTab user={user} profile={profile} isPro={isPro} isScout={isScout} isAdmin={isAdmin} initialSearch={initialSearch} onNavigate={(tab) => setActiveTab(tab as any)} />
                                                </motion.div>
                                            </div>

                                            <div style={{ display: activeTab === 'reports' ? 'block' : 'none' }}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ReportsTab reports={reports} profile={profile} user={user} isPro={isPro} isAdmin={isAdmin} />
                                                </motion.div>
                                            </div>

                                            <div style={{ display: activeTab === 'roadmap' ? 'block' : 'none' }}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <RoadmapTab user={user} onNavigate={(tab) => setActiveTab(tab as any)} />
                                                </motion.div>
                                            </div>

                                            <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <SettingsTab profile={profile} user={user} />
                                                </motion.div>
                                            </div>

                                            <div style={{ display: activeTab === 'billing' ? 'block' : 'none' }}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <BillingTab profile={profile} isPro={isPro} isAdmin={isAdmin} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
            </DashboardDataProvider>
        </>
    );
}
