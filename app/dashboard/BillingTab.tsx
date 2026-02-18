'use client';

import { CheckCircle2, Zap, Loader2, ShieldCheck, Search, Bot, Compass, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BillingTab({ profile, isGrowth, isAdmin }: { profile: any; isGrowth: boolean; isAdmin: boolean }) {
    const isStarter = profile?.subscription_tier === 'starter';
    const isLifetime = profile?.subscription_tier === 'lifetime';
    const isEffectiveGrowth = isGrowth || isAdmin || isLifetime;
    const isSubscribed = isEffectiveGrowth || isStarter;

    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isManaging, setIsManaging] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { 
        setIsMounted(true); 
    }, []);

    const handleUpgrade = async (plan: 'starter' | 'growth' | 'lifetime') => {
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
                plan_at_cancellation: isGrowth ? 'growth' : 'starter'
            });

            // Call the new cancellation API which handles Dodo cancellation AND refunds
            const res = await fetch('/api/payments/cancel-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: feedbackReason })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Cancellation failed');
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
                <div className="glass-panel rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 text-text-primary">Subscription Cancelled</h3>
                    {isWithinGuarantee ? (
                        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                            <p className="text-text-primary font-bold mb-2">💰 Refund Initiated</p>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Your full refund has been successfully initiated. You should see the amount reflected in your account within 2–4 product days.
                            </p>
                        </div>
                    ) : (
                        <p className="text-text-secondary mb-8">Your subscription has been stopped. You will not be charged again.</p>
                    )}
                    <button onClick={handleManageSubscription} className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all text-xs uppercase tracking-widest">Finalize in Portal</button>
                </div>
            </div>
        );
    }

    if (guardStep === 1) {
        return (
            <div className="max-w-2xl space-y-8">
                <div className="glass-panel rounded-[2.5rem] p-12 text-center">
                    <h3 className="text-2xl font-black mb-2 text-text-primary">Wait! Don't lose your edge.</h3>
                    <p className="text-text-secondary mb-8">If you cancel now, you'll lose access to your real-time leads radar.</p>
                    <button 
                        onClick={() => setGuardStep(0)}
                        className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl mb-4 hover:bg-primary/90 transition-all text-xs uppercase tracking-widest"
                    >
                        Keep {isGrowth ? 'Growth' : 'Starter'} Access
                    </button>
                    <button onClick={() => setGuardStep(2)} className="text-xs text-text-secondary hover:text-text-primary underline">Still want to cancel?</button>
                </div>
            </div>
        );
    }

    if (guardStep === 2) {
        return (
            <div className="max-w-2xl space-y-8">
                <div className="glass-panel rounded-[2.5rem] p-12">
                    <h3 className="text-2xl font-black mb-8 text-center text-text-primary">Help us improve.</h3>
                    <div className="space-y-3 mb-8">
                        {['Too expensive', 'Not finding relevant leads', 'Too many notifications', 'No longer needed'].map((reason) => (
                            <button 
                                key={reason}
                                onClick={() => setFeedbackReason(reason)}
                                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${feedbackReason === reason ? 'border-primary bg-primary/10 text-text-primary' : 'border-border-subtle bg-white/[0.02] text-text-secondary hover:border-white/10'}`}
                            >
                                <span className="text-sm font-bold uppercase tracking-widest">{reason}</span>
                                {feedbackReason === reason && <CheckCircle2 size={16} className="text-primary" />}
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
                <h2 className="text-3xl font-black mb-2 text-text-primary">Billing & Plan</h2>
                <p className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[10px]">Manage your subscriptions and upgrades</p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Status Card */}
                <div className="lg:col-span-3 glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSubscribed || isAdmin ? (isLifetime ? 'bg-white text-black border-white' : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(255,88,54,0.1)]') : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {isMounted ? (isSubscribed || isAdmin ? (isLifetime ? 'Founding Member' : 'Active') : (isInTrial ? `${daysRemaining} Days Left` : 'Expired')) : '...'}
                        </div>
                    </div>

                    <div className="mb-12">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-4">Membership Status</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
                            {isAdmin ? 'Administrator' : isLifetime ? 'Lifetime Founder' : isGrowth ? 'Growth Member' : isStarter ? 'Starter Member' : (isActuallyExpired ? 'Free Tier' : '3-Day Trial')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Keywords', value: isLifetime ? '15 Keywords' : isGrowth ? '15 Keywords' : isStarter ? '5 Keywords' : 'Free Trial', icon: <Search size={16} /> },
                            { label: 'Power Searches', value: isLifetime ? '5/Day' : isGrowth ? '5/Day' : isStarter ? '2/Day' : 'Free Trial', icon: <Compass size={16} /> },
                            { label: 'AI Outreach', value: isLifetime ? '500 Drafts / Month' : isGrowth ? '500 Drafts / Month' : isStarter ? '100 Drafts / Month' : '5 Lifetime', icon: <Bot size={16} /> },
                            { label: 'Support', value: isLifetime ? 'Priority Founder' : 'Standard Support', icon: <CheckCircle2 size={16} /> }
                        ].map((stat) => (
                            <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3 mb-2 text-text-secondary">
                                    {stat.icon}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <p className="text-xs font-black text-text-primary uppercase tracking-wider">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {isSubscribed && !isAdmin && !isLifetime && (
                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                            <button onClick={handleManageSubscription} disabled={isManaging} className="px-8 py-4 bg-white/5 text-text-primary font-black rounded-xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest border border-white/5">
                                {isManaging ? <Loader2 size={14} className="animate-spin" /> : 'Portal Access'}
                            </button>
                            <button onClick={() => setGuardStep(1)} className="px-8 py-4 bg-transparent text-text-secondary font-black rounded-xl hover:text-red-500 transition-all text-[10px] uppercase tracking-widest">
                                Cancel Subscription
                            </button>
                        </div>
                    )}
                </div>

                {/* Subscription Options for Non-Subscribed */}
                {!isSubscribed && !isAdmin && (
                    <>
                        {[
                            { id: 'starter', name: 'Starter', price: '$15', oldPrice: '$19', desc: '5 keywords, 2 site scans & 100 AI reply drafts per month', primary: false },
                            { id: 'growth', name: 'Growth', price: '$29', oldPrice: '$39', desc: '15 keywords, 5 site scans & 500 AI reply drafts per month', primary: true }
                        ].map((plan) => (
                            <div key={plan.id} className={`p-8 rounded-[2rem] border flex flex-col ${plan.primary ? 'glass-panel border-primary/20' : 'bg-white/[0.02] border-border-subtle'}`}>
                                <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${plan.primary ? 'text-primary' : 'text-text-secondary'}`}>{plan.name}</h4>
                                <div className="flex items-baseline gap-2 mb-2">
                                    {plan.oldPrice && <span className="text-sm font-bold text-text-secondary line-through tracking-tight">{plan.oldPrice}</span>}
                                    <span className="text-3xl font-black text-text-primary">{plan.price}</span>
                                    <span className="text-[10px] font-bold text-text-secondary uppercase">/mo</span>
                                </div>
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-8">{plan.desc}</p>
                                <button 
                                    onClick={() => handleUpgrade(plan.id as any)} 
                                    disabled={!!isLoading}
                                    className={`mt-auto w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${plan.primary ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/5 text-text-primary hover:bg-white hover:text-black border border-white/5'}`}
                                >
                                    {isLoading === plan.id ? <Loader2 size={14} className="animate-spin mx-auto" /> : `UPGRADE TO ${plan.name}`}
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Lifetime Upgrade Invitation for existing users or trial users */}
            {!isLifetime && (
                <div className="mt-12 relative rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-[#141414] border-2 border-red-500/50 p-8 md:p-12 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown size={180} className="text-white -rotate-12 translate-x-20 -translate-y-20" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-grow">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-6">
                                <Crown size={12} className="fill-yellow-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">For Limited Members</span>
                            </div>
                            
                            <h3 className="text-3xl sm:text-4xl font-black text-text-primary mb-4 tracking-tight flex items-center gap-3">
                                Lock in Growth Forever. <Sparkles size={24} className="text-orange-500 animate-pulse" />
                            </h3>
                            
                            <p className="text-text-secondary font-medium max-w-xl mb-8 leading-relaxed">
                                Stop the monthly "SaaS Tax." Pay once and get every lead, every power search, and every future AI update without ever seeing another invoice.
                            </p>

                            <div className="flex flex-wrap gap-8 mb-8">
                                {[
                                    { label: 'One-Time', value: '$199', icon: <Zap size={14} /> },
                                    { label: 'Value', value: '$348/Year', icon: <CheckCircle2 size={14} /> }
                                ].map((pill) => (
                                    <div key={pill.label} className="flex flex-col">
                                        <div className="flex items-center gap-2 text-text-secondary mb-1">
                                            {pill.icon}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{pill.label}</span>
                                        </div>
                                        <p className="text-lg font-black text-text-primary">{pill.value}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade('lifetime')}
                                disabled={!!isLoading}
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all text-xs uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50"
                            >
                                {isLoading === 'lifetime' ? <Loader2 size={16} className="animate-spin" /> : <>Claim My Lifetime Seat <ArrowRight size={16} /></>}
                            </button>
                        </div>

                        <div className="w-full md:w-72 flex-shrink-0">
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest text-center mb-2">Growth Features +</p>
                                {[
                                    '15 Tracked Keywords',
                                    '5 Power Searches / Day',
                                    '500 AI Drafts / Month',
                                    'Priority Beta Access'
                                ].map((feat) => (
                                    <div key={feat} className="flex items-center gap-3">
                                        <div className="p-1 rounded-md bg-orange-500/10 text-orange-500">
                                            <CheckCircle2 size={12} />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
