'use client';

import { CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function BillingTab({ profile }: { profile: any }) {
    const isPro = profile?.subscription_tier === 'pro';
    const [isLoading, setIsLoading] = useState(false);
    const [isManaging, setIsManaging] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            
            const data = await res.json();
            
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                // Show the specific error from API
                alert(data.error || 'Failed to create checkout session. Please check your configuration.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleManageSubscription = async () => {
        setIsManaging(true);
        try {
            const res = await fetch('/api/payments/manage-subscription');
            const data = await res.json();
            
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to open billing portal');
            }
        } catch (error) {
            console.error('Portal error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsManaging(false);
        }
    };

    // Calculate trial status
    const trialEndsAt = profile?.trial_ends_at 
        ? new Date(profile.trial_ends_at) 
        : (profile?.created_at ? new Date(new Date(profile.created_at).getTime() + 3 * 24 * 60 * 60 * 1000) : null);
    const isInTrial = trialEndsAt ? trialEndsAt > new Date() : false;
    const trialExpired = trialEndsAt && trialEndsAt <= new Date() && !isPro;
    const daysRemaining = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Billing & Plan</h2>
                <p className="text-gray-400">The Sentinel finds your next customers on Reddit while you sleep.</p>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-orange-500/10 blur-[100px] rounded-full" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-mono text-gray-500 uppercase mb-1">Current Plan</p>
                            <h3 className="text-3xl font-black">
                                {isPro ? 'Pro Plan' : (isInTrial ? '3-Day Trial' : 'Free Tier')}
                            </h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                            isPro 
                                ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' 
                                : isInTrial 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-white/10 text-gray-400 border-white/10'
                        }`}>
                            {isPro ? 'Active' : (isInTrial ? `${daysRemaining} Days Left` : 'Expired')}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {isPro ? (
                            <>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>24/7 Leads Monitoring</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>5 Daily Reddit Scans</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>Track up to 10 Subreddits</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>Monitor up to 15 Keywords</span>
                                </li>
                            </>
                        ) : isInTrial ? (
                            <>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-green-500" />
                                    <span>Full Pro Features for {daysRemaining} more days</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-green-500" />
                                    <span>5 Reddit Scans</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-green-500" />
                                    <span>Live Lead Discovery</span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-gray-500" />
                                    <span>Trial period ended</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-gray-500" />
                                    <span>Upgrade to Pro for full access</span>
                                </li>
                            </>
                        )}
                    </div>

                    {!isPro && (
                        <button 
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className="w-full py-4 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Zap size={20} fill="currentColor" />
                            )}
                            {isLoading ? 'Processing...' : 'Upgrade to Pro'}
                        </button>
                    )}
                    
                    {isPro && (
                        <button 
                            onClick={handleManageSubscription}
                            disabled={isManaging}
                            className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isManaging && <Loader2 size={18} className="animate-spin" />}
                            {isManaging ? 'Opening Portal...' : 'Manage Subscription'}
                        </button>
                    )}
                </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
                Secure payments processed by Dodo Payments. You can cancel anytime.
            </p>
        </div>
    );
}
