'use client';

import { CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BetaSurvey from '@/components/BetaSurvey';

export default function BillingTab({ profile }: { profile: any }) {
    const isPro = profile?.subscription_tier === 'pro';
    const [isLoading, setIsLoading] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [showSurvey, setShowSurvey] = useState(false);

    const handleSurveyComplete = async (surveyResponses: any) => {
        setShowSurvey(false);
        setIsLoading(true);
        try {
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ surveyResponses }),
            });
            
            const data = await res.json();
            
            if (data.beta_success) {
                window.location.href = data.redirect_url;
            } else {
                alert(data.error || 'Failed to join Beta');
            }
        } catch (error) {
            console.error('Beta join error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpgrade = async () => {
        const isBetaMode = require('@/lib/dodo').BETA_MODE;
        if (isBetaMode) {
            setShowSurvey(true);
            return;
        }

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
                alert(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleManageSubscription = async () => {
        if (profile?.is_beta_user) {
            alert("You are on a Beta plan. Billing management will be available after the public launch!");
            return;
        }
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

    const isBetaMode = require('@/lib/dodo').BETA_MODE;

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
                                {isPro ? (profile?.is_beta_user ? 'Founder Beta' : 'Pro Plan') : 'Free Tier'}
                            </h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${isPro ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-white/10 text-gray-400 border-white/10'}`}>
                            {isPro ? (profile?.is_beta_user ? 'Early Access' : 'Active') : 'Limited'}
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
                        ) : (
                            <>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-gray-500" />
                                    <span>5 total trial scans</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-gray-500" />
                                    <span>Limited Lead Discovery</span>
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
                            {isLoading ? 'Processing...' : (isBetaMode ? 'Join Founder Beta (Free)' : 'Upgrade to Pro')}
                        </button>
                    )}
                    
                    {isPro && !profile?.is_beta_user && (
                        <button 
                            onClick={handleManageSubscription}
                            disabled={isManaging}
                            className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isManaging && <Loader2 size={18} className="animate-spin" />}
                            {isManaging ? 'Opening Portal...' : 'Manage Subscription'}
                        </button>
                    )}

                    {isPro && profile?.is_beta_user && (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest text-center">
                                You have Early Founder Status! Enjoy full access during Beta.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
                {isBetaMode ? 'Join 20 founders helping build the future of RedLeads.' : 'Secure payments processed by Dodo Payments. You can cancel anytime.'}
            </p>

            <AnimatePresence>
                {showSurvey && (
                    <BetaSurvey 
                        onComplete={handleSurveyComplete} 
                        onClose={() => setShowSurvey(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
