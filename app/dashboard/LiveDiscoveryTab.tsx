import { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Activity, Compass, ArrowRight, Lock } from 'lucide-react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { motion } from 'framer-motion';
import LiveFeed from './LiveFeed';
import LeadSearch from '@/components/LeadSearch';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/app/dashboard/DashboardDataContext';
import { calculateTrialStatus, getPlanDetails } from '@/lib/dashboard-utils';
import { PLANS } from '@/lib/constants';

export default function LiveDiscoveryTab({ 
    user, 
    initialSearch = '', 
    onNavigate 
}: { 
    user: any, 
    initialSearch?: string, 
    onNavigate: (tab: string) => void 
}) {
    const { profile, trialStatus, planDetails } = useDashboardData();
    const { isActuallyExpired, isInTrial, daysRemaining, trialEndsAt } = trialStatus;
    const { isStarter, isGrowth, isAdmin, isLifetime, powerSearchLimit: searchLimit } = planDetails;

    const isActuallySubscribed = isStarter || isGrowth || isAdmin;
    const [isUpgrading, setIsUpgrading] = useState(false);

    const router = useRouter();
    const [hasResults, setHasResults] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    

 
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const canSeeLiveFeed = isActuallySubscribed || isInTrial;
    const currentUsage = (() => {
        try {
            if (!isActuallySubscribed || !profile?.last_scan_at) return profile?.scan_count || 0;
            const lastScan = new Date(profile.last_scan_at);
            const today = new Date();
            if (isNaN(lastScan.getTime())) return profile?.scan_count || 0;
            return (lastScan.toDateString() !== today.toDateString()) ? 0 : (profile?.scan_count || 0);
        } catch (e) {
            return profile?.scan_count || 0;
        }
    })();

    const isSetupComplete = !!(
        profile?.description?.length > 10 && 
        profile?.keywords?.length > 0
    );

    const handleUpgrade = async (plan: 'starter' | 'growth' = 'growth') => {
        try {
            setIsUpgrading(true);
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            });

            const data = await res.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || 'Failed to create checkout');
            }
        } catch (err: any) {
            console.error('Upgrade failed:', err.message);
            alert(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsUpgrading(false);
        }
    };

    // Unified trial logic is now at the top

    return (
        <section className="space-y-6 max-w-7xl mx-auto">
            {/* 1. Status Cards Grid (Slimmer Version) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                {/* Card 1: Plan Status */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-2xl glass-panel p-5 group transition-all hover:bg-white/[0.04]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary flex items-center justify-center">
                             {isActuallySubscribed ? <ShieldCheck size={16} /> : <Clock size={16} />}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">Plan Status</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-0.5 tracking-tight">
                            {planDetails.name}
                        </h3>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-60">
                            {isInTrial 
                                ? `${daysRemaining} Days Left` 
                                : isActuallySubscribed 
                                    ? 'Active' 
                                    : 'Trial Expired'}
                        </p>
                    </div>
                </motion.div>

                {/* Card 2: Usage Stats */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="relative overflow-hidden rounded-2xl glass-panel p-5 group transition-all hover:bg-white/[0.04]"
                >
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500 flex items-center justify-center">
                             <Activity size={16} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">Usage</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-0.5 tracking-tight">
                            {isMounted ? `${currentUsage}/${searchLimit}` : '...'}
                        </h3>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-60">
                            Scans Today
                        </p>
                    </div>
                    {/* Thinner Progress Bar background */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
                        <div 
                            className="h-full bg-blue-500/50" 
                            style={{ width: `${Math.min(100, (currentUsage / searchLimit) * 100)}%` }} 
                        />
                    </div>
                </motion.div>

                {/* Card 3: Keywords / Setup */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="relative overflow-hidden rounded-2xl glass-panel p-5 group transition-all hover:bg-white/[0.04] cursor-pointer" 
                    onClick={() => onNavigate('settings')}
                >
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-500 flex items-center justify-center">
                             <Compass size={16} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-secondary">Tracking</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-0.5 tracking-tight">
                            {profile?.keywords?.length || 0}
                        </h3>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-60">Active Keywords</p>
                            {!isSetupComplete && (
                                <span className="flex h-1.5 w-1.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Hover Hint */}
                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ArrowRight size={14} className="text-text-secondary" />
                    </div>
                </motion.div>
            </motion.div>

            {/* 2. Main Search Area */}
            <div className="relative group mb-8">
                <div className={`relative glass-panel rounded-3xl p-1 transition-all ${
                    hasResults ? 'border-primary/50 shadow-[0_0_30px_rgba(255,88,54,0.1)]' : ''
                }`}>
                    <div className="px-4 sm:px-6 py-4 border-b border-subtle flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Power Search</span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        {profile?.website_url ? (
                            <LeadSearch 
                                user={user} 
                                isDashboardView={true} 
                                initialUrl={profile?.website_url} 
                                autoScan={false}
                                isLocked={true}
                                onResultsFound={(count) => setHasResults(count > 0)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
                                <div className="p-4 bg-orange-500/10 rounded-2xl text-primary flex items-center justify-center">
                                    <ShieldCheck size={40} className="animate-pulse" />
                                </div>
                                <div className="space-y-2 max-w-sm">
                                    <h3 className="text-lg font-bold text-text-primary">Tracking Setup Incomplete</h3>
                                    <p className="text-xs text-text-secondary leading-relaxed uppercase tracking-widest font-black opacity-60">
                                        Connect your website in settings to unlock target-specific power searching.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => onNavigate('settings')}
                                    className="px-8 py-3 bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,88,54,0.2)]"
                                >
                                    Go to Tracking Setup
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Main Discovery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
                {/* Live Stream Column */}
                <div className={`${isActuallyExpired ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 sm:space-y-8`}>
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <Activity className="text-primary" size={18} />
                                <div className="absolute inset-0 bg-primary/5 rounded-full" />
                            </div>
                            <div className="space-y-0.5">
                                <h2 className="text-[10px] font-black tracking-[0.2em] text-text-secondary uppercase">automated</h2>
                                <p className="text-sm font-bold text-text-primary tracking-tight">Live Intelligence</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full border ${
                            isSetupComplete 
                                ? 'bg-green-500/5 border-green-500/10' 
                                : 'bg-red-500/5 border-red-500/10'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full animate-[pulse_2s_infinite] ${
                                isSetupComplete ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                isSetupComplete ? 'text-green-500/60' : 'text-red-500/60'
                            }`}>
                                {isSetupComplete 
                                    ? 'System Online' 
                                    : 'System Offline - Complete Tracking Set-up'
                                }
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <LiveFeed onViewArchive={() => onNavigate('reports')} />
                        
                        {/* Trial Expired Overlay */}
                        {isActuallyExpired && (
                            <div className="absolute inset-0 z-20 bg-black/80 rounded-3xl lg:rounded-[2rem] flex items-center justify-center p-4 sm:p-8 text-center border border-white/10">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="max-w-sm space-y-8"
                                >
                                    <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto rotate-3">
                                        <Lock size={32} className="text-black" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black leading-tight text-text-primary">Trial Access Ended</h3>
                                        <p className="text-text-secondary text-sm leading-relaxed font-medium">
                                            Upgrade to Growth to unlock unlimited access to high-intent leads.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleUpgrade('growth')}
                                            disabled={isUpgrading}
                                            className="w-full py-5 bg-[#ff914d] hover:bg-[#ff914d]/90 text-black font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpgrading ? <LoadingIcon className="w-5 h-5" /> : <>Get Growth Access   $14/mo <span className="line-through opacity-50 ml-1 text-[10px]">$29</span></>}
                                        </button>
                                        <button 
                                            onClick={() => handleUpgrade('starter')}
                                            disabled={isUpgrading}
                                            className="w-full py-5 bg-white/10 hover:bg-white/20 text-text-primary font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpgrading ? <LoadingIcon className="w-5 h-5" /> : <>Get Starter Access   $7/mo <span className="line-through opacity-50 ml-1 text-[10px]">$15</span></>}
                                        </button>
                                         <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                                            Trial Ended {isMounted && trialEndsAt ? trialEndsAt?.toLocaleDateString() : '...'}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info / Sidebar Column */}
                {isActuallyExpired && (
                    <div className="lg:col-span-4 space-y-8">
                        <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl text-text-primary border border-white/5 shadow-xl relative overflow-hidden group">
                           <div className="relative z-10 space-y-4">
                                <h3 className="font-black text-lg leading-tight">Pick Your Plan</h3>
                                <p className="text-xs font-bold opacity-80 leading-relaxed text-text-secondary">
                                    Unlock the full intelligence radar and find every customer searching for you.
                                </p>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => handleUpgrade('starter')}
                                        disabled={isUpgrading}
                                        className="w-full py-3 bg-white/10 text-text-primary border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isUpgrading ? <LoadingIcon className="w-4 h-4" /> : <>Starter (${planDetails.id === 'starter' ? 'Current' : PLANS.STARTER.price}) <span className="line-through text-text-secondary">${PLANS.STARTER.originalPrice}</span></>}
                                    </button>
                                    <button 
                                        onClick={() => handleUpgrade('growth')}
                                        disabled={isUpgrading}
                                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isUpgrading ? <LoadingIcon className="w-4 h-4" /> : <>Growth (${PLANS.GROWTH.price}) <span className="line-through text-white/50">${PLANS.GROWTH.originalPrice}</span></>}
                                    </button>
                                </div>
                           </div>
                           <Compass size={80} className="absolute -right-4 -bottom-4 text-white/5 transition-transform group-hover:scale-110" />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
