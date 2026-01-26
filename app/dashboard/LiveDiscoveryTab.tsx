import { Radar, Zap } from 'lucide-react';
import LiveFeed from './LiveFeed';

interface LiveDiscoveryTabProps {
    user: any;
    profile: any;
}

export default function LiveDiscoveryTab({ user, profile, onNavigate }: { user: any, profile: any, onNavigate: (tab: string) => void }) {
    const isPro = profile?.subscription_tier === 'pro';

    return (
        <section className="space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                        <Radar size={22} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Live Monitoring</h2>
                </div>
                <p className="text-gray-400">Your 24/7 autonomous lead monitor. It scans your subreddits every 15 minutes.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Stream Column */}
                <div className="lg:col-span-2 bg-[#202020]/50 rounded-[2.5rem] p-6 lg:p-8 border border-white/5">
                    <LiveFeed userId={user.id} onViewArchive={() => onNavigate('reports')} />
                </div>

                {/* Sentinel Status / Pro Promo Column */}
                <div className="space-y-4">
                    <div className="bg-orange-500 rounded-3xl p-6 text-black relative overflow-hidden group">
                       <div className="relative z-10">
                            <h3 className="font-black text-xl mb-1">Sentinel Status</h3>
                            <div className="flex items-center gap-2 text-sm font-bold opacity-80 mb-4">
                                <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                                Active & Monitoring
                            </div>
                            <p className="text-xs font-medium leading-relaxed opacity-90">
                                Currently tracking {profile?.subreddits?.length || 0} subreddits for your product.
                            </p>
                       </div>
                    </div>

                    {!isPro && (
                        <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-amber-500">
                                <Zap size={18} fill="currentColor" />
                                <span className="text-xs font-black uppercase">Free Mode</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                You're seeing a sample of the stream. Upgrade to Pro to monitor unlimited subreddits 24/7.
                            </p>
                            <button className="w-full py-3 bg-white text-black rounded-xl text-xs font-black uppercase hover:scale-[1.02] transition-all">
                                Upgrade Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
