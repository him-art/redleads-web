'use client';

import { CheckCircle2, Zap, Loader2, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BillingTab({ profile, isPro, isAdmin }: { profile: any; isPro: boolean; isAdmin: boolean }) {
    const isScout = profile?.subscription_tier === 'scout';
    const isEffectivePro = isPro || isAdmin;
    const isSubscribed = isEffectivePro || isScout;

    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isManaging, setIsManaging] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => { setIsMounted(true); }, []);

    const handleUpgrade = async (plan: 'scout' | 'pro') => {
        setIsLoading(plan);
        try {
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            });
            
            const data = await res.json();
            
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                alert(data.error || 'Failed to create checkout session.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(null);
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

    const [guardStep, setGuardStep] = useState(0); // 0: Normal, 1: Retention, 2: Feedback, 3: Success
    const [feedbackReason, setFeedbackReason] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    // Calculate trial status
    const trialEndsAtString = profile?.trial_ends_at || (profile?.created_at ? (() => {
        const d = new Date(profile.created_at);
        if (isNaN(d.getTime())) return null;
        return new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    })() : null);
    const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null;
    
    // Calculate 7-day guarantee window
    const subStartedAt = profile?.subscription_started_at ? new Date(profile.subscription_started_at) : (isSubscribed ? new Date(profile.created_at) : null);
    const now = new Date();
    const isWithinGuarantee = subStartedAt ? (now.getTime() - subStartedAt.getTime()) < (7 * 24 * 60 * 60 * 1000) : false;

    const daysRemaining = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const trialExpired = trialEndsAt ? trialEndsAt <= now : false;
    const isActuallyExpired = !isSubscribed && (trialExpired || (trialEndsAt && daysRemaining <= 0));
    const isInTrial = !isSubscribed && !isActuallyExpired && daysRemaining > 0;

    const submitFeedbackAndRedirect = async () => {
        setSubmittingFeedback(true);
        try {
            // 1. Log cancellation feedback
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            await supabase.from('cancellation_feedback').insert({
                user_id: profile?.id,
                email: profile?.email,
                reason: feedbackReason,
                plan_at_cancellation: isPro ? 'pro' : 'scout'
            });

            // 2. Trigger Auto-Refund if applicable
            if (isWithinGuarantee) {
                await fetch('/api/payments/refund-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason: `7-day guarantee: ${feedbackReason}` })
                });
            }
            
            setGuardStep(3);
        } catch (err) {
            console.error('Cancellation process error:', err);
            handleManageSubscription();
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (guardStep === 3) {
        return (
            <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-[#141414] border border-white/5 rounded-3xl lg:rounded-[2.5rem] p-6 sm:p-8 md:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Subscription Cancelled</h3>
                    {isWithinGuarantee ? (
                        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                            <p className="text-gray-300 font-bold mb-2">💰 Refund Initiated</p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Your full refund has been successfully initiated. You should see the amount reflected in your account within 2–4 product days. For any questions, feel free to reach out to us directly at redleads.app@gmail.com 
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 mb-8">Your subscription has been stopped. You will not be charged again.</p>
                    )}
                    <button 
                        onClick={handleManageSubscription}
                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Finalize in Portal
                    </button>
                </div>
            </div>
        );
    }

    if (guardStep === 1) {
        return (
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center">
                    <h3 className="text-2xl font-black mb-2">Wait! Don't lose your edge.</h3>
                    <p className="text-gray-400 mb-8">If you cancel now, you'll lose access to your real-time leads radar.</p>
                    <button 
                        onClick={() => setGuardStep(0)}
                        className="w-full py-4 bg-orange-500 text-black font-black rounded-xl mb-4 hover:bg-orange-400 transition-all"
                    >
                        Keep {isPro ? 'Pro' : 'Scout'} Access
                    </button>
                    <button onClick={() => setGuardStep(2)} className="text-xs text-gray-500 hover:text-white underline">Still want to cancel?</button>
                </div>
            </div>
        );
    }

    if (guardStep === 2) {
        return (
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#141414] border border-white/5 rounded-3xl lg:rounded-[2.5rem] p-6 sm:p-8 md:p-12">
                    <h3 className="text-2xl font-black mb-8 text-center">Help us improve.</h3>
                    <div className="space-y-3 mb-8">
                        {['Too expensive', 'Not finding relevant leads', 'Too many notifications', 'No longer needed'].map((reason) => (
                            <button 
                                key={reason}
                                onClick={() => setFeedbackReason(reason)}
                                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center ${feedbackReason === reason ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-white/5 bg-white/[0.02] text-gray-400'}`}
                            >
                                <span className="text-sm font-bold">{reason}</span>
                                {feedbackReason === reason && <CheckCircle2 size={16} className="text-orange-500" />}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={submitFeedbackAndRedirect}
                        disabled={!feedbackReason || submittingFeedback}
                        className="w-full py-4 bg-white text-black font-black rounded-xl disabled:opacity-50"
                    >
                        {submittingFeedback ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Billing & Plan</h2>
                <p className="text-gray-400">Manage your subscription and plan settings.</p>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-mono text-gray-500 uppercase mb-1">Current Plan</p>
                            <h3 className="text-2xl sm:text-3xl font-black">
                                {isAdmin ? 'Admin' : isPro ? 'Pro Plan' : isScout ? 'Scout Plan' : (isActuallyExpired ? 'Free Tier' : '3-Day Trial')}
                            </h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${isSubscribed || isAdmin ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {isMounted ? (isSubscribed || isAdmin ? 'Active' : (isInTrial ? `${daysRemaining} Days Left` : 'Expired')) : '...'}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-gray-300">
                            <CheckCircle2 size={18} className="text-orange-500" />
                            <span>{isAdmin || isPro || !isScout ? '15 Keywords' : '5 Keywords'}</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <CheckCircle2 size={18} className="text-orange-500" />
                            <span>{isAdmin || isPro || !isScout ? '5 Daily Spotlight Scans' : '2 Daily Spotlight Scans'}</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <CheckCircle2 size={18} className="text-orange-500" />
                            <span>24/7 Monitoring</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <CheckCircle2 size={18} className="text-orange-500" />
                            <span>Categorical AI Scoring</span>
                        </li>
                    </div>

                    {!isSubscribed && !isAdmin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => handleUpgrade('scout')} disabled={!!isLoading} className="w-full py-4 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 flex items-center justify-center gap-2">
                                {isLoading === 'scout' ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />} Upgrade to Scout ($15)
                            </button>
                            <button onClick={() => handleUpgrade('pro')} disabled={!!isLoading} className="w-full py-4 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 flex items-center justify-center gap-2">
                                {isLoading === 'pro' ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} fill="currentColor" />} Upgrade to Pro ($29)
                            </button>
                        </div>
                    )}
                    
                    {isScout && !isAdmin && (
                        <div className="space-y-4">
                            <button onClick={() => handleUpgrade('pro')} disabled={!!isLoading} className="w-full py-4 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 flex items-center justify-center gap-2">
                                {isLoading === 'pro' ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} fill="currentColor" />} Upgrade to Pro (10 more keywords)
                            </button>
                            <button onClick={() => setGuardStep(1)} disabled={isManaging} className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20">Manage Subscription</button>
                        </div>
                    )}

                    {isPro && !isAdmin && (
                        <button onClick={() => setGuardStep(1)} disabled={isManaging} className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20">Manage Subscription</button>
                    )}
                </div>
            </div>
        </div>
    );
}
