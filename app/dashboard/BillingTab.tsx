'use client';

import { CheckCircle2, Search, Compass, Bot, ShieldCheck, Crown, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import LoadingIcon from '@/components/ui/LoadingIcon';
import { useDashboardData } from '@/app/dashboard/DashboardDataContext';
import { PLANS } from '@/lib/constants';

export default function BillingTab() {
    const { profile, trialStatus, planDetails } = useDashboardData();
    const { isStarter, isGrowth, isAdmin, isLifetime } = planDetails;
    const isSubscribed = isStarter || isGrowth || isAdmin;

    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isManaging, setIsManaging] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [slots, setSlots] = useState<{ sold: number; total: number } | null>(null);

    // Dynamic Pricing Logic ($10 every 20 users) - Aligned with Pricing.tsx
    const currentUsers = slots?.sold || 73; 
    const isEarlyBird = currentUsers < 80;
    const currentPrice = isEarlyBird ? 20 : 30 + Math.floor((currentUsers - 80) / 20) * 10;
    const spotsLeft = isEarlyBird ? 80 - currentUsers : 80 + (Math.floor((currentUsers - 80) / 20) + 1) * 20 - currentUsers;

    useEffect(() => { 
        setIsMounted(true);
        const fetchSlots = async () => {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data } = await supabase
                .from('lifetime_slots')
                .select('sold_slots, total_slots')
                .single();
            
            if (data) {
                setSlots({ sold: data.sold_slots, total: data.total_slots });
            }
        };
        fetchSlots();
    }, []);

    const handleUpgrade = async (plan: 'starter' | 'growth' | 'lifetime') => {
        if (isLifetime && plan !== 'lifetime') {
            alert("You already have Lifetime Access! This includes all features from other plans as well.");
            return;
        }
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
                        Keep {isGrowth ? 'Growth' : 'Starter'} Plan Access
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
                        className="w-full py-4 bg-white text-black font-black rounded-xl disabled:opacity-50 text-xs uppercase tracking-widest flex items-center justify-center"
                    >
                        {submittingFeedback ? <LoadingIcon className="w-[18px] h-[18px]" /> : 'Confirm Cancellation'}
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
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSubscribed || isAdmin ? (isLifetime ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(255,88,54,0.1)]') : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {isMounted ? (isSubscribed || isAdmin ? (isLifetime ? 'Lifetime Plan' : 'Active') : (isInTrial ? `${daysRemaining} Days Left` : 'Expired')) : '...'}
                        </div>
                    </div>

                    <div className="mb-12">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-4">Membership Status</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
                            {planDetails.name}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Keywords', value: isLifetime ? '15 Keywords' : isGrowth ? '15 Keywords' : isStarter ? '5 Keywords' : 'Trial Plan', icon: <Search size={16} /> },
                            { label: 'Power Searches', value: isLifetime ? '5/Day' : isGrowth ? '5/Day' : isStarter ? '2/Day' : 'Trial Plan', icon: <Compass size={16} /> },
                            { label: 'AI Outreach', value: isLifetime ? '500 Drafts / Month' : isGrowth ? '500 Drafts / Month' : isStarter ? '100 Drafts / Month' : '5 Drafts', icon: <Bot size={16} /> },
                            { label: 'Support', value: isLifetime ? 'Priority Support' : 'Standard Support', icon: <CheckCircle2 size={16} /> }
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
                            <button onClick={handleManageSubscription} disabled={isManaging} className="px-8 py-4 bg-white/5 text-text-primary font-black rounded-xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest border border-white/5 flex items-center justify-center">
                                {isManaging ? <LoadingIcon className="w-3.5 h-3.5" /> : 'Portal Access'}
                            </button>
                            <button onClick={() => setGuardStep(1)} className="px-8 py-4 bg-transparent text-text-secondary font-black rounded-xl hover:text-red-500 transition-all text-[10px] uppercase tracking-widest">
                                Cancel Subscription
                            </button>
                        </div>
                    )}
                </div>

            {/* Subscription Options - Always Visible */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                {[
                    { id: 'starter', name: 'Starter Plan', price: '$7', oldPrice: '$15', desc: '5 keywords, 2 power searches & 100 AI reply drafts per month', primary: false, active: planDetails.id === 'starter' },
                    { id: 'growth', name: 'Growth Plan', price: '$14', oldPrice: '$29', desc: '15 keywords, 5 power searches & 500 AI reply drafts per month', primary: true, active: planDetails.id === 'growth' }
                ].map((plan) => (
                    <div key={plan.id} className={`p-8 sm:p-10 rounded-[2.5rem] border flex flex-col transition-all relative overflow-hidden ${plan.active ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.03]' : plan.primary ? 'glass-panel border-primary/20' : 'bg-white/[0.02] border-border-subtle'}`}>
                        {plan.active && (
                            <div className="absolute top-0 right-0 px-5 py-2 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest rounded-bl-2xl flex items-center gap-1.5 shadow-lg">
                                <Sparkles size={10} /> Current Plan
                            </div>
                        )}

                        <h4 className={`text-base font-black uppercase tracking-[0.25em] mb-6 ${plan.primary || plan.active ? 'text-primary' : 'text-text-secondary'}`}>{plan.name}</h4>
                        
                        <div className="flex items-baseline gap-3 mb-4">
                            {plan.oldPrice && <span className="text-lg font-bold text-text-secondary/30 line-through tracking-tight">{plan.oldPrice}</span>}
                            <span className="text-5xl font-black text-text-primary tracking-tighter">{plan.price}</span>
                            <span className="text-xs font-bold text-text-secondary/50 uppercase tracking-widest">/mo</span>
                        </div>

                        <p className="text-xs font-medium text-text-secondary/80 leading-relaxed mb-10 max-w-[280px]">{plan.desc}</p>
                        
                        <button 
                            onClick={() => !plan.active && !isLifetime && handleUpgrade(plan.id as any)} 
                            disabled={!!isLoading || plan.active || isLifetime}
                            className={`mt-auto w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                                plan.active 
                                    ? 'bg-white/5 text-primary/40 border border-white/5 cursor-not-allowed'
                                    : isLifetime
                                        ? 'bg-white/5 text-text-secondary/20 border border-white/5 cursor-default'
                                        : plan.primary 
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(255,88,54,0.2)] active:scale-95' 
                                            : 'bg-white text-black hover:bg-gray-200 active:scale-95'
                            }`}
                        >
                            {isLoading === plan.id ? (
                                <LoadingIcon className="w-5 h-5" />
                            ) : plan.active ? (
                                <CheckCircle2 size={16} />
                            ) : isLifetime ? (
                                'Owned via Lifetime'
                            ) : (
                                `Upgrade to ${plan.id}`
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>

            {/* Lifetime Upgrade Invitation for existing users or trial users */}
            {!isLifetime && (
                <div className="mt-12 relative rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-[#141414] border-2 border-red-500/50 p-8 md:p-12 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown size={180} className="text-white -rotate-12 translate-x-20 -translate-y-20" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-grow">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-6 font-bold">
                                <Crown size={12} />
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
                                    { label: 'One-Time', value: `$${currentPrice}`, icon: <Zap size={14} /> },
                                    { label: 'Limited', value: `${spotsLeft} Seats Left`, icon: <CheckCircle2 size={14} /> }
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
                                {isLoading === 'lifetime' ? <LoadingIcon className="w-4 h-4" /> : <>Claim My Lifetime Seat <ArrowRight size={16} /></>}
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
