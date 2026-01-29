import { useState } from 'react';
import { Navigation, Activity, Lock, ArrowRight, Compass, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LiveFeed from './LiveFeed';
import LeadSearch from '@/components/LeadSearch';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LiveDiscoveryTab({ 
    user, 
    profile, 
    initialSearch = '', 
    onNavigate 
}: { 
    user: any, 
    profile: any, 
    initialSearch?: string, 
    onNavigate: (tab: string) => void 
}) {
    const [isStartingTrial, setIsStartingTrial] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    
    const isPro = profile?.subscription_tier === 'pro' || profile?.effective_tier === 'pro';
    const trialEndsAt = profile?.trial_ends_at;
    const isInTrial = trialEndsAt ? new Date(trialEndsAt) > new Date() : false;
    const canSeeLiveFeed = isPro || isInTrial;

    const isSetupComplete = !!(
        profile?.description?.length > 10 && 
        profile?.keywords?.length > 0 && 
        profile?.subreddits?.length > 0
    );

    const handleStartTrial = async () => {
        try {
            setIsStartingTrial(true);
            const trialEnd = new Date();
            trialEnd.setDate(trialEnd.getDate() + 3);

            const { error } = await supabase
                .from('profiles')
                .update({ trial_ends_at: trialEnd.toISOString() })
                .eq('id', user.id);

            if (error) throw error;
            router.refresh();
        } catch (err: any) {
            console.error('Failed to start trial:', err.message);
        } finally {
            setIsStartingTrial(false);
        }
    };

    const handleUpgrade = async () => {
        try {
            setIsUpgrading(true);
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: 'growth' })
            });

            const data = await res.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || 'Failed to create checkout');
            }
        } catch (err: any) {
            console.error('Upgrade failed:', err.message);
            alert('Payment system is currently being configured. Please check back in a few minutes!');
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <section className="space-y-12 max-w-6xl mx-auto">
            {/* 1. Header Area with Sentinel Status & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Navigation className="text-orange-500" size={18} />
                        <h1 className="text-3xl font-bold tracking-tight text-white">Command Center</h1>
                    </div>
                    <p className="text-gray-500 text-sm max-w-md leading-relaxed font-medium">
                        Autonomous monitoring activity across your target communities. 
                        Live leads are surfaced as they happen.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Sentinel Status Pill */}
                    <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-500 font-black uppercase tracking-widest text-[10px] ${
                        canSeeLiveFeed && isSetupComplete 
                            ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' 
                            : !isSetupComplete && canSeeLiveFeed
                                ? 'bg-white/5 border-orange-500/30 text-orange-500 animate-pulse'
                                : 'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            canSeeLiveFeed && isSetupComplete 
                                ? 'bg-orange-500 animate-pulse' 
                                : !isSetupComplete && canSeeLiveFeed
                                    ? 'bg-orange-500'
                                    : 'bg-gray-600'
                        }`} />
                        <span>
                            {canSeeLiveFeed 
                                ? isSetupComplete ? 'Sentinel Active' : 'Setup Required' 
                                : 'Sentinel Standby'}
                        </span>
                    </div>

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
                            <ShieldCheck size={12} /> Trial Period
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Spotlight Quick Scan */}
            <div className="relative group">
                <div className="relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-1 lg:p-2 transition-all hover:bg-white/[0.04]">
                    <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Compass className="text-gray-500" size={18} />
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Spotlight search</span>
                        </div>
                        {profile?.scan_count !== undefined && (canSeeLiveFeed) && (
                            <div className="flex items-center gap-3">
                                {profile?.trial_ends_at && profile?.subscription_tier !== 'pro' && (
                                    <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20 animate-pulse">
                                        Trial Ends in {Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
                                    </span>
                                )}
                                <span className="text-xs font-mono text-gray-600">
                                    Usage: {isPro && profile?.last_scan_at && (new Date(profile.last_scan_at).toDateString() !== new Date().toDateString()) ? 0 : profile?.scan_count || 0}/5 {isPro ? 'Today' : 'Total'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 lg:p-6">
                        <LeadSearch user={user} isDashboardView={true} initialUrl={initialSearch} />
                    </div>
                </div>
            </div>

            {/* 3. Main Discovery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
                {/* Live Stream Column */}
                <div className="lg:col-span-8 space-y-8">
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
                        
                        {!canSeeLiveFeed && (
                            <div className="absolute inset-0 z-20 bg-black/80 rounded-[2rem] flex items-center justify-center p-8 text-center border border-white/10">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="max-w-sm space-y-8"
                                >
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto rotate-3">
                                        <Lock size={32} className="text-black" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black leading-tight text-white">Unlock Live Intel</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                            Watch high-intent conversations appear in real-time. 
                                            Free users get scans; Pros get the whole feed.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {!profile?.trial_ends_at ? (
                                            <button 
                                                onClick={handleStartTrial}
                                                disabled={isStartingTrial}
                                                className="w-full py-5 bg-white hover:bg-gray-100 text-black font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {isStartingTrial ? 'Initializing...' : 'Start 3-Day Free Trial'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleUpgrade}
                                                disabled={isUpgrading}
                                                className="w-full py-5 bg-white hover:bg-gray-100 text-black font-black uppercase text-xs rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isUpgrading ? 'Redirecting...' : 'Upgrade to Pro'}
                                            </button>
                                        )}

                                        {!isPro && profile?.trial_ends_at && (
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                Trial {new Date(profile.trial_ends_at) > new Date() ? 'Ends' : 'Expired'} {new Date(profile.trial_ends_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info / Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-2 px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Monitor Insights</h3>
                        <p className="text-xs text-gray-600 font-medium">Real-time performance of your automated sentinel.</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <span>Scanning efficiency</span>
                                <span className="text-orange-500">92%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[92%] bg-orange-500/40 rounded-full" />
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-white/5 text-gray-400">
                                    <Compass size={14} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-200">Autonomous Mode</p>
                                    <p className="text-[10px] text-gray-500 leading-relaxed">System checking subreddits every 30 mins for matches.</p>
                                </div>
                            </div>

                            {canSeeLiveFeed && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                                        <ShieldCheck size={14} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-white">Lead Verification</p>
                                        <p className="text-[10px] text-gray-500 leading-relaxed">AI scoring each lead to ensure relevancy.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isPro && !isInTrial && (
                        <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl text-black shadow-xl shadow-orange-500/20 relative overflow-hidden group">
                           <div className="relative z-10 space-y-4">
                                <h3 className="font-black text-lg leading-tight">Go Unlimited</h3>
                                <p className="text-xs font-bold opacity-80 leading-relaxed">
                                    Unlock the full live stream and find every customer searching for you right now.
                                </p>
                                <button 
                                    onClick={handleUpgrade}
                                    disabled={isUpgrading}
                                    className="w-full py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                                >
                                    {isUpgrading ? 'Redirecting...' : 'Upgrade to Pro'}
                                </button>
                           </div>
                           <Compass size={80} className="absolute -right-4 -bottom-4 text-black/10 transition-transform group-hover:scale-110" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
