import { useState, useEffect } from 'react';
import { Navigation, Activity, Lock, ArrowRight, Compass, ShieldCheck, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import LiveFeed from './LiveFeed';
import LeadSearch from '@/components/LeadSearch';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LiveDiscoveryTab({ 
    user, 
    profile, 
    isPro,
    isScout,
    isAdmin,
    initialSearch = '', 
    onNavigate 
}: { 
    user: any, 
    profile: any, 
    isPro: boolean,
    isScout?: boolean,
    isAdmin: boolean,
    initialSearch?: string, 
    onNavigate: (tab: string) => void 
}) {
    const isEffectivePro = isPro || isAdmin;
    const isActuallySubscribed = isEffectivePro || isScout;
    const [isUpgrading, setIsUpgrading] = useState(false);

    const router = useRouter();
    const [hasResults, setHasResults] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
 
    useEffect(() => {
        setIsMounted(true);
    }, []);
    // Auto-calculate trial status
    const trialEndsAtString = profile?.trial_ends_at || (profile?.created_at ? (() => {
        const d = new Date(profile.created_at);
        if (isNaN(d.getTime())) return null;
        return new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    })() : null);
    const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null;
    
    const now = new Date();
    const trialExpired = trialEndsAt ? trialEndsAt <= now : false; 
    const daysRemaining = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
    
    const isActuallyExpired = !isActuallySubscribed && (trialExpired || (trialEndsAt && daysRemaining <= 0));
    const isInTrial = !isActuallySubscribed && !isActuallyExpired && daysRemaining > 0;
    const canSeeLiveFeed = isActuallySubscribed || isInTrial;

    const searchLimit = isEffectivePro ? 5 : isScout ? 2 : 5;
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

    const handleUpgrade = async (plan: 'scout' | 'pro' = 'pro') => {
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
            {/* 1. Status Cards Grid (Skeleton Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Plan Status */}
                <div className="relative overflow-hidden rounded-3xl bg-[#0F0F0F] border border-white/5 p-5 sm:p-6 flex flex-col justify-between h-32 md:h-40 group hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                             {isActuallySubscribed ? <ShieldCheck size={20} /> : <Clock size={20} />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Plan Status</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {isAdmin ? 'Admin' : isPro ? 'Growth Plan' : isScout ? 'Starter Plan' : 'Free Trial'}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                            {isInTrial 
                                ? `${daysRemaining} Days Remaining` 
                                : isActuallySubscribed 
                                    ? 'Active Subscription' 
                                    : 'Trial Expired'}
                        </p>
                    </div>
                </div>

                {/* Card 2: Usage Stats */}
                <div className="relative overflow-hidden rounded-3xl bg-[#0F0F0F] border border-white/5 p-5 sm:p-6 flex flex-col justify-between h-32 md:h-40 group hover:border-white/10 transition-colors">
                     <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                             <Activity size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Usage</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {isMounted ? `${currentUsage}/${searchLimit}` : '...'}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                            Daily Scans Used
                        </p>
                    </div>
                    {/* Progress Bar background */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                        <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${Math.min(100, (currentUsage / searchLimit) * 100)}%` }} 
                        />
                    </div>
                </div>

                {/* Card 3: Keywords / Setup */}
                <div className="relative overflow-hidden rounded-3xl bg-[#0F0F0F] border border-white/5 p-5 sm:p-6 flex flex-col justify-between h-32 md:h-40 group hover:border-white/10 transition-colors cursor-pointer" onClick={() => onNavigate('settings')}>
                     <div className="flex justify-between items-start">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                             <Compass size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tracking</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {profile?.keywords?.length || 0}
                        </h3>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500 font-medium">Active Keywords</p>
                            {!isSetupComplete && (
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Hover Hint */}
                     <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={16} className="text-gray-500" />
                    </div>
                </div>
            </div>

            {/* 2. Main Search Area */}
            <div className="relative group mb-8">
                <div className={`relative bg-[#0F0F0F] border rounded-3xl p-1 transition-all ${
                    hasResults ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]' : 'border-white/5'
                }`}>
                    <div className="px-4 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Power Scan</span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <LeadSearch 
                            user={user} 
                            isDashboardView={true} 
                            initialUrl={initialSearch || profile?.website_url || ''} 
                            onResultsFound={(count) => setHasResults(count > 0)}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Main Discovery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
                {/* Live Stream Column */}
                <div className={`${isActuallyExpired ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 sm:space-y-8`}>
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Activity className="text-orange-500" size={18} />
                                <div className="absolute inset-0 bg-orange-500/20 blur-md animate-pulse rounded-full" />
                            </div>
                            <div className="space-y-0.5">
                                <h2 className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Neural Stream</h2>
                                <p className="text-sm font-bold text-white tracking-tight">Live Intelligence</p>
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
                        <LiveFeed userId={user.id} onViewArchive={() => onNavigate('reports')} />
                        
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
                                        <h3 className="text-2xl font-black leading-tight text-white">Trial Access Ended</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                            Upgrade to Growth to unlock unlimited access to high-intent leads.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleUpgrade('pro')}
                                            disabled={isUpgrading}
                                            className="w-full py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpgrading ? 'Loading...' : <>Get Growth Access   $29/mo <span className="line-through opacity-50 ml-1 text-[10px]">$39</span></>}
                                        </button>
                                        <button 
                                            onClick={() => handleUpgrade('scout')}
                                            disabled={isUpgrading}
                                            className="w-full py-5 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpgrading ? 'Loading...' : <>Get Starter Access   $15/mo <span className="line-through opacity-50 ml-1 text-[10px]">$19</span></>}
                                        </button>
                                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
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
                        <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl text-white border border-white/5 shadow-xl relative overflow-hidden group">
                           <div className="relative z-10 space-y-4">
                                <h3 className="font-black text-lg leading-tight">Pick Your Plan</h3>
                                <p className="text-xs font-bold opacity-80 leading-relaxed text-gray-400">
                                    Unlock the full intelligence radar and find every customer searching for you.
                                </p>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => handleUpgrade('scout')}
                                        disabled={isUpgrading}
                                        className="w-full py-3 bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Starter ($15) <span className="line-through text-gray-500">$19</span>
                                    </button>
                                    <button 
                                        onClick={() => handleUpgrade('pro')}
                                        disabled={isUpgrading}
                                        className="w-full py-3 bg-orange-500 text-black rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-orange-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        Growth ($29) <span className="line-through text-black/40">$39</span>
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
