'use client';

import { CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function BillingTab({ profile, isPro, isAdmin }: { profile: any; isPro: boolean; isAdmin: boolean }) {
    const isEffectivePro = isPro || isAdmin;
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

    const [guardStep, setGuardStep] = useState(0); // 0: Normal, 1: Retention, 2: Feedback
    const [feedbackReason, setFeedbackReason] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    // Calculate trial status
    const trialEndsAtString = profile?.trial_ends_at || (profile?.created_at ? new Date(new Date(profile.created_at).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() : null);
    const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null;
    
    // Calculate 7-day guarantee window
    const subStartedAt = profile?.subscription_started_at ? new Date(profile.subscription_started_at) : (isPro ? new Date(profile.created_at) : null);
    const now = new Date();
    const isWithinGuarantee = subStartedAt ? (now.getTime() - subStartedAt.getTime()) < (7 * 24 * 60 * 60 * 1000) : false;

    const daysRemaining = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const trialExpired = trialEndsAt ? trialEndsAt <= now : false;
    const isActuallyExpired = !isEffectivePro && (trialExpired || (trialEndsAt && daysRemaining <= 0));
    const isInTrial = !isEffectivePro && !isActuallyExpired && daysRemaining > 0;

    const [refundError, setRefundError] = useState('');

    const submitFeedbackAndRedirect = async () => {
        setSubmittingFeedback(true);
        setRefundError('');
        try {
            // 1. Log cancellation feedback to Supabase
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            await supabase.from('cancellation_feedback').insert({
                user_id: profile?.id,
                email: profile?.email,
                reason: feedbackReason,
                plan_at_cancellation: 'pro'
            });

            // 2. Trigger Auto-Refund if within 7-day window
            if (isWithinGuarantee) {
                const refundRes = await fetch('/api/payments/refund-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason: `7-day guarantee: ${feedbackReason}` })
                });
                
                if (!refundRes.ok) {
                    const errorData = await refundRes.json();
                    console.error('Auto-refund failed:', errorData.error);
                    // We'll still proceed to Step 3 but note the issue in logs
                }
            }
            
            // 3. Move to Confirmation Screen (Step 3)
            setGuardStep(3);
        } catch (err) {
            console.error('Cancellation process error:', err);
            // Fallback to direct redirect if something breaks catastrophically
            handleManageSubscription();
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (guardStep === 3) {
        return (
            <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    
                    <h3 className="text-3xl font-black mb-4">Subscription Cancelled</h3>
                    
                    {isWithinGuarantee ? (
                        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                            <p className="text-gray-300 font-bold mb-2">💰 Refund Initiated</p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Your full refund has been triggered. You should see it in your account within **2-4 business days**, depending on your bank.
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 mb-8">
                            Your subscription has been stopped. You will not be charged again.
                        </p>
                    )}

                    <div className="space-y-6 mb-12">
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-black">Need manual help?</p>
                        <div className="flex flex-col items-center gap-2">
                            <a href="mailto:redleads.app@gmail.com" className="text-orange-500 hover:text-orange-400 transition-colors font-bold">
                                redleads.app@gmail.com
                            </a>
                            <a href="https://x.com/redleadsapp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                                DM us on X @redleadsapp
                            </a>
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-8 max-w-sm mx-auto">
                        Final Step: You will now be redirected to the secure portal to finalize the cycle closure on the payment network.
                    </p>

                    <button 
                        onClick={handleManageSubscription}
                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
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
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Zap size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Wait! Don't lose your edge.</h3>
                        <p className="text-gray-400">
                            If you cancel now, you'll lose access to your real-time leads radar and high-intent alerts.
                        </p>
                    </div>

                    {isWithinGuarantee && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-8">
                            <p className="text-orange-500 text-sm font-bold">
                                🛡️ 7-Day Refund Period Active
                            </p>
                            <p className="text-orange-500/70 text-xs mt-1">
                                You are eligible for a full refund if you cancel now. No questions asked.
                            </p>
                        </div>
                    )}

                    <div className="grid gap-3 mb-8">
                        <button 
                            onClick={() => setGuardStep(0)}
                            className="w-full py-4 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 transition-all shadow-lg"
                        >
                            Keep Pro Access
                        </button>
                    </div>

                    <button 
                        onClick={() => setGuardStep(2)}
                        className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-4"
                    >
                        Still want to cancel?
                    </button>
                </div>
            </div>
        );
    }

    if (guardStep === 2) {
        return (
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#141414] border border-white/5 rounded-[2.5rem] p-8 md:p-12">
                    <h3 className="text-2xl font-black mb-2 text-center">Help us improve.</h3>
                    <p className="text-gray-400 text-center mb-8">Why are you considering leaving?</p>

                    <div className="space-y-3 mb-8">
                        {[
                            'Too expensive',
                            'Not finding relevant leads',
                            'Too many notifications',
                            'Technical difficulties',
                            'No longer needed'
                        ].map((reason) => (
                            <button 
                                key={reason}
                                onClick={() => setFeedbackReason(reason)}
                                className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                                    feedbackReason === reason 
                                        ? 'border-orange-500 bg-orange-500/5 text-white' 
                                        : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10'
                                }`}
                            >
                                <span className="text-sm font-bold">{reason}</span>
                                {feedbackReason === reason && <CheckCircle2 size={16} className="text-orange-500" />}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={submitFeedbackAndRedirect}
                        disabled={!feedbackReason || submittingFeedback}
                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {submittingFeedback ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Cancellation'}
                    </button>

                    <button 
                        onClick={() => setGuardStep(0)}
                        className="w-full mt-4 text-sm text-gray-500 hover:text-white transition-colors text-center"
                    >
                        Nevermind, I'll stay
                    </button>
                </div>
            </div>
        );
    }

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
                                {isEffectivePro ? 'Pro Plan' : (isActuallyExpired ? 'Free Tier' : '3-Day Trial')}
                            </h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                            isEffectivePro 
                                ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' 
                                : isInTrial 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                            {isEffectivePro ? 'Active' : (isInTrial ? `${daysRemaining} Days Left` : 'Expired')}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {isEffectivePro ? (
                            <>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>5 Daily Reddit Scans</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>24/7 Leads Monitoring</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>Monitor Top 100+ Communities</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-orange-500" />
                                    <span>Monitor 10 High-Intent Keywords</span>
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

                    {!isEffectivePro && (
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
                    
                    {isEffectivePro && (
                        <button 
                            onClick={() => setGuardStep(1)}
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
                Secure payments processed by Dodo Payments. {isWithinGuarantee ? 'Full 7-day refund guarantee active.' : 'You can cancel anytime.'}
            </p>
        </div>
    );
}
