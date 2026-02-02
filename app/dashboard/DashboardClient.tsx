'use client';

import { useState } from 'react';
import { Archive, Sliders, ShieldCheck, Navigation, Layout, Search, Menu, X, Sparkles, Clock, AlertTriangle, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import LiveDiscoveryTab from './LiveDiscoveryTab';
import PaywallModal from '@/components/PaywallModal';

interface DashboardClientProps {
    profile: any;
    reports: any[];
    user: any;
    initialSearch?: string;
}

export default function DashboardClient({ profile, reports, user, initialSearch = '' }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'reports' | 'live' | 'settings' | 'billing'>(initialSearch ? 'live' : 'live'); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    // Prevent ANY rendering until mounted to ensure 100% hydration sync on mobile
    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );
    }

    // Trial expiration check - ONLY RUNS ON CLIENT NOW
    const isPro = profile?.subscription_tier === 'pro' || profile?.effective_tier === 'pro';
    const isScout = profile?.subscription_tier === 'scout' || profile?.effective_tier === 'scout';
    const isAdmin = profile?.is_admin === true || user?.email === 'hjayaswar@gmail.com';
    
    // Explicitly use trial_ends_at or fallback to created_at + 3 days
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
    
    // Final status override
    const isActuallyExpired = !isPro && !isScout && !isAdmin && (trialExpired || (trialEndsAt && daysRemaining <= 0));
    const showPaywall = isActuallyExpired && !isPro && !isScout && !isAdmin;

    const handleCheckout = async (plan: 'scout' | 'pro' = 'pro') => {
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
        { id: 'live', label: 'Command Center', icon: Navigation },
        { id: 'reports', label: 'Leads Archive', icon: Archive },
        { id: 'settings', label: 'Tracking Setup', icon: Sliders },
        { id: 'billing', label: 'Billing & Plan', icon: ShieldCheck },
    ];

    return (
        <>
            {showPaywall && <PaywallModal onCheckout={handleCheckout} />}
            
            {/* Main Layout Container - Full Dark Theme */}
            <div className="flex h-screen bg-[#1a1a1a] text-white overflow-hidden font-sans selection:bg-[#ff9053]/30">
                
                {/* Mobile Header Toggle */}
                <div className="lg:hidden absolute top-0 left-0 right-0 z-50 p-4 bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/redleads-logo-white.png" alt="RedLeads Logo" className="w-8 h-8 object-contain" />
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
                        fixed inset-y-0 left-0 z-40 w-72 bg-[#1a1a1a] border-r border-white/5
                        transform lg:transform-none transition-transform duration-300 ease-in-out
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        flex flex-col p-6
                    `}
                >
                    {/* Brand Header */}
                    <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img src="/redleads-logo-white.png" alt="RedLeads Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight leading-none text-white">RedLeads</h1>
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Intelligence</span>
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
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id as any);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${
                                        isActive 
                                            ? 'bg-white/[0.08] text-white shadow-inner border border-white/5' 
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ff9053] rounded-r-full" />
                                    )}
                                    <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-[#ff9053]' : 'group-hover:text-gray-300'}`} />
                                    <span className={`relative z-10 text-sm font-medium tracking-wide ${isActive ? 'text-white' : ''}`}>
                                        {tab.label}
                                    </span>
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
                                    {isAdmin ? 'Administrator' : isPro ? 'Pro Member' : 'Scout Member'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-72 relative flex flex-col min-w-0 bg-[#1a1a1a]">
                     {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 scrollbar-hide">
                         {/* Content Wrapper limit width */}
                        <div className="max-w-7xl mx-auto space-y-8 mt-14 lg:mt-0">
                             
                             {/* Dynamic Tab Content */}
                             <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'reports' && <ReportsTab reports={reports} profile={profile} user={user} isPro={isPro} isAdmin={isAdmin} />}
                                    {activeTab === 'live' && <LiveDiscoveryTab user={user} profile={profile} isPro={isPro} isScout={isScout} isAdmin={isAdmin} initialSearch={initialSearch} onNavigate={(tab) => setActiveTab(tab as any)} />}
                                    {activeTab === 'settings' && <SettingsTab profile={profile} user={user} />}
                                    {activeTab === 'billing' && <BillingTab profile={profile} isPro={isPro} isAdmin={isAdmin} />}
                                </motion.div>
                             </AnimatePresence>
                        </div>
                    </div>
                </main>

            </div>
        </>
    );
}
