'use client';

import { CheckCircle2, Zap, Loader2, ShieldCheck, Globe, Search, Bot } from 'lucide-react';
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

    const [guardStep, setGuardStep] = useState(0); 
    const [feedbackReason, setFeedbackReason] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const trialEndsAtString = profile?.trial_ends_at || (profile?.created_at ? (() => {
        const d = new Date(profile.created_at);
        if (isNaN(d.getTime())) return null;
        return new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    })() : null);
    const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null;
    
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
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            await supabase.from('cancellation_feedback').insert({
                user_id: profile?.id,
                email: profile?.email,
                reason: feedbackReason,
                plan_at_cancellation: isPro ? 'pro' : 'scout'
            });

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
            <div className="max-w-2xl space-y-8">
                <div className="bg-[#141414] border border-white/5 rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Subscription Cancelled</h3>
                    {isWithinGuarantee ? (
                        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                            <p className="text-gray-300 font-bold mb-2">💰 Refund Initiated</p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Your full refund has been successfully initiated. You should see the amount reflected in your account within 2–4 product days.
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 mb-8">Your subscription has been stopped. You will not be charged again.</p>
                    )}
                    <button onClick={handleManageSubscription} className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all text-xs uppercase tracking-widest">Finalize in Portal</button>
                </div>
            </div>
        );
    }

    if (guardStep === 1) {
        return (
            <div className="max-w-2xl space-y-8">
                <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-12 text-center">
                    <h3 className="text-2xl font-black mb-2">Wait! Don't lose your edge.</h3>
                    <p className="text-gray-400 mb-8">If you cancel now, you'll lose access to your real-time leads radar.</p>
                    <button 
                        onClick={() => setGuardStep(0)}
                        className="w-full py-4 bg-orange-500 text-black font-black rounded-xl mb-4 hover:bg-orange-400 transition-all text-xs uppercase tracking-widest"
                    >
                        Keep {isPro ? 'Growth' : 'Starter'} Access
                    </button>
                    <button onClick={() => setGuardStep(2)} className="text-xs text-gray-500 hover:text-white underline">Still want to cancel?</button>
                </div>
            </div>
        );
    }

    if (guardStep === 2) {
        return (
            <div className="max-w-2xl space-y-8">
                <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-12">
                    <h3 className="text-2xl font-black mb-8 text-center text-white">Help us improve.</h3>
                    <div className="space-y-3 mb-8">
                        {['Too expensive', 'Not finding relevant leads', 'Too many notifications', 'No longer needed'].map((reason) => (
                            <button 
                                key={reason}
                                onClick={() => setFeedbackReason(reason)}
                                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${feedbackReason === reason ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10'}`}
                            >
                                <span className="text-sm font-bold uppercase tracking-widest">{reason}</span>
                                {feedbackReason === reason && <CheckCircle2 size={16} className="text-orange-500" />}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={submitFeedbackAndRedirect}
                        disabled={!feedbackReason || submittingFeedback}
                        className="w-full py-4 bg-white text-black font-black rounded-xl disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        {submittingFeedback ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-3xl font-black mb-2 text-white">Billing & Plan</h2>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Manage your subscriptions and upgrades</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Status Card */}
                <div className="lg:col-span-3 bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSubscribed || isAdmin ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {isMounted ? (isSubscribed || isAdmin ? 'Active' : (isInTrial ? `${daysRemaining} Days Left` : 'Expired')) : '...'}
                        </div>
                    </div>

                    <div className="mb-12">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">Membership Status</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                            {isAdmin ? 'Administrator' : isPro ? 'Growth Member' : isScout ? 'Starter Member' : (isActuallyExpired ? 'Free Tier' : '3-Day Trial')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Keywords', value: isPro ? '15 Keywords' : isScout ? '5 Keywords' : 'Free Trial', icon: <Search size={16} /> },
                            { label: 'Intelligence', value: '24/7 Monitoring', icon: <Zap size={16} /> },
                            { label: 'AI Outreach', value: isPro ? '500 Drafts / Month' : isScout ? '100 Drafts / Month' : '5 Lifetime', icon: <Bot size={16} /> },
                            { label: 'Support', value: 'Standard Support', icon: <CheckCircle2 size={16} /> }
                        ].map((stat) => (
                            <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3 mb-2 text-gray-500">
                                    {stat.icon}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <p className="text-xs font-black text-white uppercase tracking-wider">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {isSubscribed && !isAdmin && (
                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                            <button onClick={handleManageSubscription} disabled={isManaging} className="px-8 py-4 bg-white/5 text-white font-black rounded-xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest border border-white/5">
                                {isManaging ? <Loader2 size={14} className="animate-spin" /> : 'Portal Access'}
                            </button>
                            <button onClick={() => setGuardStep(1)} className="px-8 py-4 bg-transparent text-gray-600 font-black rounded-xl hover:text-red-500 transition-all text-[10px] uppercase tracking-widest">
                                Cancel Subscription
                            </button>
                        </div>
                    )}
                </div>

                {/* Subscription Options for Non-Subscribed */}
                {!isSubscribed && !isAdmin && (
                    <>
                        {[
                            { id: 'scout', name: 'Starter', price: '$15', oldPrice: '$19', desc: '5 keywords, 2 site scans & 100 AI reply drafts per month', primary: false },
                            { id: 'pro', name: 'Growth', price: '$29', oldPrice: '$39', desc: '15 keywords, 5 site scans & 500 AI reply drafts per month', primary: true }
                        ].map((plan) => (
                            <div key={plan.id} className={`p-8 rounded-[2rem] border flex flex-col ${plan.primary ? 'bg-orange-500/5 border-orange-500/20' : 'bg-white/5 border-white/5'}`}>
                                <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${plan.primary ? 'text-orange-500' : 'text-gray-500'}`}>{plan.name}</h4>
                                <div className="flex items-baseline gap-2 mb-2">
                                    {plan.oldPrice && <span className="text-sm font-bold text-gray-700 line-through tracking-tight">{plan.oldPrice}</span>}
                                    <span className="text-3xl font-black text-white">{plan.price}</span>
                                    <span className="text-[10px] font-bold text-gray-600 uppercase">/mo</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">{plan.desc}</p>
                                <button 
                                    onClick={() => handleUpgrade(plan.id as any)} 
                                    disabled={!!isLoading}
                                    className={`mt-auto w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${plan.primary ? 'bg-orange-500 text-black hover:bg-orange-400' : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/5'}`}
                                >
                                    {isLoading === plan.id ? <Loader2 size={14} className="animate-spin mx-auto" /> : `UPGRADE TO ${plan.name}`}
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
