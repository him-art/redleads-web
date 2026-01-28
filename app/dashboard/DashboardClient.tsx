'use client';

import { useState } from 'react';
import { FileText, Settings, CreditCard, LayoutDashboard, Radar, Search } from 'lucide-react';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import LiveDiscoveryTab from './LiveDiscoveryTab';

interface DashboardClientProps {
    profile: any;
    reports: any[];
    user: any;
}

export default function DashboardClient({ profile, reports, user }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<'reports' | 'discovery' | 'live' | 'settings' | 'billing'>('reports');

    const tabs = [
        { id: 'reports', label: 'Lead History', icon: FileText },
        // { id: 'saved', label: 'Saved Leads', icon: FileText }, // Merged into Reports
        { id: 'live', label: 'Live Discovery', icon: Radar },
        { id: 'settings', label: 'Tracking Configuration', icon: Settings },
        { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <nav className="w-full lg:w-64 flex-shrink-0 space-y-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${
                                isActive 
                                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            {/* Main Content Area */}
            <div className="flex-grow bg-[#1a1a1a] rounded-3xl border border-white/5 p-6 lg:p-10 min-h-[500px]">
                {activeTab === 'reports' && <ReportsTab reports={reports} profile={profile} />}
                {activeTab === 'live' && <LiveDiscoveryTab user={user} profile={profile} onNavigate={(tab) => setActiveTab(tab as any)} />}
                {activeTab === 'settings' && <SettingsTab profile={profile} user={user} />}
                {activeTab === 'billing' && <BillingTab profile={profile} />}
            </div>
        </div>
    );
}
