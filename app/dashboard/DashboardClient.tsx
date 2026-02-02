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
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-12rem)] relative p-2 sm:p-0">
            {/* Mobile Header Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white/[0.03] border border-white/10 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                    {(() => {
                        const activeTabData = tabs.find(t => t.id === activeTab);
                        if (!activeTabData) return null;
                        const Icon = activeTabData.icon;
                        return (
                            <>
                                <div className="text-orange-500">
                                    <Icon size={20} />
                                </div>
                                <span className="font-bold text-white">{activeTabData.label}</span>
                            </>
                        );
                    })()}
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className={`
                ${isMobileMenuOpen ? 'flex' : 'hidden'} 
                lg:flex flex-col w-full lg:w-72 flex-shrink-0 space-y-1 pr-0 lg:pr-8 mb-6 lg:mb-0
                absolute lg:relative top-20 lg:top-0 left-0 z-50 bg-[#0d0d0d] lg:bg-transparent
                p-4 lg:p-0 border lg:border-0 border-white/10 rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none
            `}>
                <div className="px-4 mb-6 hidden lg:block">
                    {/* Subscription Status Badge */}
                    <div className="mb-8">
                        {isPro || isScout || isAdmin ? (
                            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-2xl group/status">
                                <div className="p-2 bg-green-500/20 rounded-xl text-green-500 group-hover/status:scale-110 transition-transform">
                                    <Zap size={16} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/60">Subscription</p>
                                    <p className="text-sm font-bold text-green-500">
                                        {isAdmin ? 'Admin Access' : isPro ? 'Pro Plan Active' : 'Scout Plan Active'}
                                    </p>
                                </div>
                            </div>
                        ) : isActuallyExpired ? (
                            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl group/status">
                                <div className="p-2 bg-red-500/20 rounded-xl text-red-500 group-hover/status:scale-110 transition-transform">
                                    <AlertTriangle size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">Subscription</p>
                                    <p className="text-sm font-bold text-red-400">Trial Expired</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl group/status">
                                <div className="p-2 bg-orange-500/20 rounded-xl text-orange-500 group-hover/status:scale-110 transition-transform">
                                    <Clock size={16} />
                                </div>
                                 <div className="flex flex-col">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60 leading-none mb-1">Free Trial</p>
                                    <p className="text-sm font-bold text-orange-500 leading-none">
                                        {(() => {
                                            try {
                                                if (!isMounted) return '...';
                                                return `${daysRemaining} Days Left`;
                                            } catch (e) {
                                                return 'Active';
                                            }
                                        })()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Workspace</h3>
                </div>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            suppressHydrationWarning
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`group relative w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-left ${
                                isActive 
                                    ? 'bg-white/[0.03] text-white shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1 h-6 bg-orange-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon size={20} className={`transition-colors ${isActive ? 'text-orange-500' : 'group-hover:text-gray-300'}`} />
                            <span className={`text-base font-semibold tracking-tight ${isActive ? 'font-bold' : ''}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}

                <div className="mt-auto pt-10 px-4 hidden lg:block">
                    <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                        <p className="text-xs font-bold text-orange-500/60 uppercase tracking-widest mb-1">System Load</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-orange-500/40 rounded-full" />
                            </div>
                            <span className="text-xs font-mono text-gray-500 italic">Optimal</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow bg-white/[0.02] rounded-3xl lg:rounded-[2.5rem] border border-white/5 p-4 sm:p-6 lg:p-12 overflow-hidden relative group">
                <div className="h-full">
                    {activeTab === 'reports' && <ReportsTab reports={reports} profile={profile} user={user} isPro={isPro} isAdmin={isAdmin} />}
                    {activeTab === 'live' && <LiveDiscoveryTab user={user} profile={profile} isPro={isPro} isScout={isScout} isAdmin={isAdmin} initialSearch={initialSearch} onNavigate={(tab) => setActiveTab(tab as any)} />}
                    {activeTab === 'settings' && <SettingsTab profile={profile} user={user} />}
                    {activeTab === 'billing' && <BillingTab profile={profile} isPro={isPro} isAdmin={isAdmin} />}
                </div>
            </main>
        </div>
        </>
    );
}
