'use client';

import { CheckCircle2, Zap } from 'lucide-react';

export default function BillingTab({ profile }: { profile: any }) {
    const isPro = profile?.subscription_tier === 'pro';

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Billing & Plan</h2>
                <p className="text-gray-400">Manage your subscription and payment methods.</p>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-orange-500/10 blur-[100px] rounded-full" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-mono text-gray-500 uppercase mb-1">Current Plan</p>
                            <h3 className="text-3xl font-black">{isPro ? 'Pro Plan' : 'Free Tier'}</h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${isPro ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-white/10 text-gray-400 border-white/10'}`}>
                            {isPro ? 'Active' : 'Limited'}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {isPro ? (
                            <>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>Unlimited Daily Scans</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>Priority Email Delivery</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>Advanced Competitor Tracking</span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-gray-500" />
                                    <span>1 Daily Scan</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-gray-500" />
                                    <span>Basic Keywords</span>
                                </li>
                            </>
                        )}
                    </div>

                    {!isPro && (
                        <button className="w-full py-4 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 transition-all shadow-lg flex items-center justify-center gap-2">
                             <Zap size={20} fill="currentColor" /> Upgrade to Pro
                        </button>
                    )}
                    
                    {isPro && (
                        <button className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                             Manage Subscription
                        </button>
                    )}
                </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
                Secure payments processed by Stripe. You can cancel anytime.
            </p>
        </div>
    );
}
