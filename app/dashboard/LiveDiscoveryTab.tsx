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
    const supabase = createClient();
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
        <section className="space-y-4 max-w-6xl mx-auto">
            {/* 1. Header Area with Sentinel Status & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
                

                <div className="flex flex-wrap items-center gap-3">
                    {!isSetupComplete && canSeeLiveFeed && (
                        <button 
                            onClick={() => onNavigate('settings')}
                            className="px-5 py-2.5 bg-orange-500 text-black border border-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2"
                        >
                            Configure Tracking <ChevronRight size={12} />
                        </button>
                    )}

                    {isInTrial && (
                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
                            <ShieldCheck size={12} /> Trial Active ({daysRemaining} days left)
                        </div>
                    )}

                    {isSetupComplete && (
                        <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                           <Activity size={12} /> Tracking {profile?.keywords?.length || 0} Keywords
                        </div>
                    )}
                </div>
            </div>

            <div className="relative group">
                <div className={`relative bg-white/[0.02] border rounded-3xl lg:rounded-[2.5rem] p-1 lg:p-2 transition-all hover:bg-white/[0.04] ${
                    hasResults ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]' : 'border-white/5'
                }`}>
                    <div className="px-4 sm:px-8 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Compass className="text-gray-500" size={18} />
                            <div className="flex flex-col">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Spotlight search</span>
                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                                    Active: {isAdmin ? 'Admin' : isPro ? 'Pro Plan' : isScout ? 'Scout Plan' : 'Free Trial'}
                                </span>
                            </div>
                        </div>
                        {profile?.scan_count !== undefined && (canSeeLiveFeed) && (
                            <div className="flex items-center gap-3">
                                {isInTrial && (
                                    <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20 animate-pulse">
                                        Trial Ends in {daysRemaining} days
                                    </span>
                                )}
                                 <span className="text-xs font-mono text-gray-600">
                                    {isMounted ? `Usage: ${currentUsage}/${searchLimit} ${isActuallySubscribed ? 'Today' : 'Total'}` : 'Loading usage...'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-2 sm:p-4 lg:p-6">
                        <LeadSearch 
                            user={user} 
                            isDashboardView={true} 
                            initialUrl={initialSearch} 
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
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-green-500/5 border border-green-500/10 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_2s_infinite]" />
                            <span className="text-[9px] font-black text-green-500/60 uppercase tracking-widest">System Online</span>
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
                                            Upgrade to Pro to unlock unlimited access to high-intent leads.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleUpgrade('pro')}
                                            disabled={isUpgrading}
                                            className="w-full py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpgrading ? 'Loading...' : 'Get Pro Access — $29/mo'}
                                        </button>
                                        <button 
                                            onClick={() => handleUpgrade('scout')}
                                            disabled={isUpgrading}
                                            className="w-full py-5 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpgrading ? 'Loading...' : 'Get Scout Access — $15/mo'}
                                        </button>
                                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            Trial Ended {isMounted && trialEndsAt ? trialEndsAt.toLocaleDateString() : '...'}
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
                                        Scout ($15)
                                    </button>
                                    <button 
                                        onClick={() => handleUpgrade('pro')}
                                        disabled={isUpgrading}
                                        className="w-full py-3 bg-orange-500 text-black rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-orange-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        Pro ($29)
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
