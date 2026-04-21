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
        profile?.keywords?.length > 0 &&
        profile?.website_url
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
        <section className="space-y-10 max-w-7xl mx-auto">
            {/* 1. Status Cards Grid (Premium Version) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
                {/* Card 1: Plan Status */}
                <div className="p-0.5 surface-1 rounded-[2rem] transition-all duration-700">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden rounded-[1.8rem] bg-[#0c0c0c] border border-white/[0.08] backdrop-blur-xl p-8 group transition-all hover:bg-[#0c0c0c]/20"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary flex items-center justify-center border border-primary/20">
                                {isActuallySubscribed ? <ShieldCheck size={18} /> : <Clock size={18} />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/40">Operation Status</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">
                                {planDetails.name}
                            </h3>
                            <p className="text-[11px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40">
                                {isInTrial 
                                    ? `${daysRemaining} Days Remaining` 
                                    : isActuallySubscribed 
                                        ? 'Verified Active' 
                                        : 'Radar Offline'}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Card 2: Usage Stats */}
                <div className="p-0.5 surface-1 rounded-[2rem] transition-all duration-700">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden rounded-[1.8rem] bg-[#0c0c0c] border border-white/[0.08] backdrop-blur-xl p-8 group transition-all hover:bg-[#0c0c0c]/20"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 flex items-center justify-center border border-blue-500/20">
                                <Activity size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/40">Intelligence Limit</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">
                                {isMounted ? `${currentUsage}/${searchLimit}` : '...'}
                            </h3>
                            <p className="text-[11px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40">
                                Global Scans Today
                            </p>
                        </div>
                        {/* High-end Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.02] overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (currentUsage / searchLimit) * 100)}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] relative" 
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Card 3: Keywords / Setup */}
                <div className="p-0.5 surface-1 rounded-[2rem] transition-all duration-700">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="relative overflow-hidden rounded-[1.8rem] bg-[#0c0c0c] border border-white/[0.08] backdrop-blur-xl p-8 group transition-all hover:bg-[#0c0c0c]/20 cursor-pointer" 
                        onClick={() => onNavigate('settings')}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 flex items-center justify-center border border-purple-500/20">
                                <Compass size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/40">Radar Filter</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">
                                {profile?.keywords?.length || 0}
                            </h3>
                            <div className="flex items-center gap-2">
                                <p className="text-[11px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40">Active Directives</p>
                                {!isSetupComplete && (
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Hover Hint */}
                        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                            <ArrowRight size={18} className="text-text-secondary/40" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* 2. Main Search Area - Elevated Elevation */}
            <div className="relative group mb-12">
                <div className="p-0.5 surface-1 rounded-[2.5rem]">
                    <div className={`relative bg-[#0c0c0c] backdrop-blur-xl border border-white/[0.08] rounded-[2.3rem] p-1 transition-all duration-700 ${
                        hasResults ? 'border-primary/40 shadow-[0_0_50px_rgba(255,88,54,0.15)]' : ''
                    }`}>
                        <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-[pulse_1.5s_infinite] shadow-[0_0_12px_rgba(255,88,54,0.8)]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-text-secondary/60">Power Search Hub</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-10">
                            {profile?.website_url ? (
                                <LeadSearch 
                                    user={user} 
                                    isDashboardView={true} 
                                    initialUrl={initialSearch || profile?.website_url} 
                                    autoScan={!!initialSearch && !profile?.has_initial_scan}
                                    isLocked={true}
                                    onResultsFound={(count) => setHasResults(count > 0)}
                                    onNavigate={onNavigate}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 space-y-8 text-center">
                                    <div className="p-6 bg-orange-500/10 rounded-3xl text-primary flex items-center justify-center border border-white/5">
                                        <Compass size={48} className="animate-pulse" />
                                    </div>
                                    <div className="space-y-3 max-w-sm">
                                        <h3 className="text-xl font-bold text-text-primary">Intelligence Bridge Offline</h3>
                                        <p className="text-[11px] text-text-secondary leading-relaxed uppercase tracking-[0.15em] font-black opacity-40">
                                            {profile?.description && profile?.keywords?.length > 0 
                                                ? "Bridge online but target URL missing. Provide your website to calibrate."
                                                : "Radar needs directives. Complete tracking setup to activate."}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => onNavigate('settings')}
                                        className="px-10 py-4 bg-primary text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-[0_10px_30px_rgba(255,88,54,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Activate Radar
                                    </button>
                                </div>
                            )}
                        </div>
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
                                <h2 className="text-[10px] font-black tracking-[0.2em] text-text-secondary/60 uppercase leading-none">automated</h2>
                                <p className="text-sm font-bold text-text-primary tracking-tight">Live Intelligence</p>
                            </div>
                        </div>
                        <div className="p-0.5 surface-1 rounded-full">
                            <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full border bg-void relative overflow-hidden transition-all duration-500 ${
                                isSetupComplete 
                                    ? 'border-green-500/20' 
                                    : 'border-red-500/20'
                            }`}>
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <div className={`w-1.5 h-1.5 rounded-full animate-[pulse_2s_infinite] ${
                                    isSetupComplete ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                                }`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                    isSetupComplete ? 'text-green-500/60' : 'text-red-500/60'
                                }`}>
                                    {isSetupComplete 
                                        ? 'System Online' 
                                        : 'System Offline'
                                    }
                                </span>
                            </div>
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
                                            {isUpgrading ? <LoadingIcon className="w-5 h-5" /> : <>Get Growth Access — $29/mo</>}
                                        </button>
                                        <button 
                                            onClick={() => handleUpgrade('starter')}
                                            disabled={isUpgrading}
                                            className="w-full py-5 bg-white/10 hover:bg-white/20 text-text-primary font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpgrading ? <LoadingIcon className="w-5 h-5" /> : <>Get Starter Access — $19/mo</>}
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
                        <div className="p-6 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 transition-all rounded-3xl text-text-primary border border-white/5 shadow-xl relative overflow-hidden group">
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
                                        {isUpgrading ? <LoadingIcon className="w-4 h-4" /> : <>Starter (${planDetails.id === 'starter' ? 'Current' : PLANS.STARTER.price})</>}
                                    </button>
                                    <button 
                                        onClick={() => handleUpgrade('growth')}
                                        disabled={isUpgrading}
                                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isUpgrading ? <LoadingIcon className="w-4 h-4" /> : <>Growth (${PLANS.GROWTH.price})</>}
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
