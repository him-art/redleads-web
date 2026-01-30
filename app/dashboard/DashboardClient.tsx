'use client';

import { useState } from 'react';
import { Archive, Sliders, ShieldCheck, Navigation, Layout, Search, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import LiveDiscoveryTab from './LiveDiscoveryTab';

interface DashboardClientProps {
    profile: any;
    reports: any[];
    user: any;
    initialSearch?: string;
}

export default function DashboardClient({ profile, reports, user, initialSearch = '' }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'reports' | 'discovery' | 'live' | 'settings' | 'billing'>(initialSearch ? 'live' : 'live'); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const tabs = [
        { id: 'live', label: 'Command Center', icon: Navigation },
        { id: 'reports', label: 'Leads Archive', icon: Archive },
        { id: 'settings', label: 'Tracking Setup', icon: Sliders },
        { id: 'billing', label: 'Billing & Plan', icon: ShieldCheck },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-12rem)] relative">
            {/* Mobile Header Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                    {tabs.find(t => t.id === activeTab)?.icon && (
                        <div className="text-orange-500">
                            {(() => {
                                const Icon = tabs.find(t => t.id === activeTab)!.icon;
                                return <Icon size={20} />;
                            })()}
                        </div>
                    )}
                    <span className="font-bold text-white">{tabs.find(t => t.id === activeTab)?.label}</span>
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
                lg:flex flex-col w-full lg:w-72 flex-shrink-0 space-y-1 pr-0 lg:pr-8 mb-8 lg:mb-0
                absolute lg:relative top-16 lg:top-0 left-0 z-50 bg-[#1a1a1a] lg:bg-transparent
                p-4 lg:p-0 border lg:border-0 border-white/5 rounded-3xl lg:rounded-none
            `}>
                <div className="px-4 mb-6 hidden lg:block">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Workspace</h3>
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

            {/* Main Content Area */}
            <main className="flex-grow bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-6 lg:p-12 overflow-hidden relative group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="h-full"
                    >
                        {activeTab === 'reports' && <ReportsTab reports={reports} profile={profile} />}
                        {activeTab === 'live' && <LiveDiscoveryTab user={user} profile={profile} initialSearch={initialSearch} onNavigate={(tab) => setActiveTab(tab as any)} />}
                        {activeTab === 'settings' && <SettingsTab profile={profile} user={user} />}
                        {activeTab === 'billing' && <BillingTab profile={profile} />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
