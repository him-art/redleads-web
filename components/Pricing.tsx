'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { createClient } from '@/lib/supabase/client';
import { PLANS } from '@/lib/constants';

const Pricing = () => {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [slots, setSlots] = useState<{ sold: number; total: number } | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    // Legacy slots state kept for database/UI metrics if needed
    const currentUsers = slots?.sold || 0; 
    const currentPrice = 199;

    useEffect(() => {
        const fetchSlots = async () => {
            const supabase = createClient();
            try {
                const { data, error } = await supabase
                    .from('total_users')
                    .select('user_count, total_slots')
                    .single();
                
                if (error) return;

                if (data && typeof data.user_count === 'number') {
                    setSlots({ sold: data.user_count, total: Math.max(data.total_slots || 500, 500) });
                }
            } catch (err) {
                // Silently fail — slots display defaults
            }
        };
        fetchSlots();
    }, []);

    const handleCheckout = useCallback(async (plan: string, overrideInterval?: string) => {
        setIsLoading(plan);
        try {
            // Map our UI plans to the backend plan keys
            const planKey = plan === 'Starter' ? 'starter' : plan === 'Growth' ? 'growth' : 'one_time';
            const interval = overrideInterval ?? (planKey === 'one_time' ? 'monthly' : billingCycle);
            
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planKey, interval })
            });
            
            const data = await res.json().catch(() => ({}));
            
            if (res.ok && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else if (res.status === 401) {
                // Set a short-lived checkout intent cookie (server-readable for fast-track)
                const cookieVal = `${planKey}:${planKey === 'one_time' ? 'monthly' : billingCycle}`;
                document.cookie = `rl_checkout_intent=${cookieVal}; path=/; max-age=600; SameSite=Lax`;
                window.location.href = `/login?next=/`;
            } else {
                alert(data.error || `Error ${res.status}: Failed to initiate checkout`);
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Network error: ${error.message || 'Something went wrong.'}`);
        } finally {
            setIsLoading(null);
        }
    }, [billingCycle]);

    // Fallback for email/password login: read checkout intent from cookie
    useEffect(() => {
        const match = document.cookie.match(/rl_checkout_intent=([^;]+)/);
        if (!match) return;

        const [pendingPlan, pendingInterval] = match[1].split(':');
        if (!pendingPlan) return;

        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                // Clear the cookie immediately to prevent re-trigger
                document.cookie = 'rl_checkout_intent=; path=/; max-age=0; SameSite=Lax';
                if (pendingInterval === 'annual') setBillingCycle('annual');

                const lowerPlan = pendingPlan.toLowerCase();
                const planName = lowerPlan === 'starter' ? 'Starter'
                               : lowerPlan === 'growth' ? 'Growth'
                               : 'One-Time';

                // Small delay to let the session hydrate before triggering checkout
                setTimeout(() => handleCheckout(planName, pendingInterval ?? undefined), 500);
            }
        });
    }, [handleCheckout]);

    const plans = [
        {
            name: 'Starter',
            price: PLANS.STARTER.price,
            annualPrice: PLANS.STARTER.annualPrice,
            description: 'For solo founders finding their first Reddit customers',
            features: {
                inbound: [
                    { name: '5 Deep AI Reddit Search /day', icon: <MaterialIcon name="public" size={14} /> },
                    { name: 'Live Reddit monitoring', icon: <MaterialIcon name="bolt" size={14} /> },
                    { name: '10 tracked keywords', icon: <MaterialIcon name="search" size={14} /> },
                    { name: 'Daily Email alerts', icon: <MaterialIcon name="mail" size={14} /> }
                ],
                engage: [
                    { name: 'Personalised Outreach', icon: <MaterialIcon name="smart_toy" size={14} /> },
                ]
            }
        },
        {
            name: 'Growth',
            price: PLANS.GROWTH.price,
            annualPrice: PLANS.GROWTH.annualPrice,
            description: 'For founders ready to turn Reddit into a repeatable user acquisition channel',
            highlight: true,
            badge: 'BEST VALUE',
            features: {
                inbound: [
                    { name: '10 Deep AI Reddit Search /day', icon: <MaterialIcon name="public" size={14} /> },
                    { name: 'Live Reddit monitoring', icon: <MaterialIcon name="bolt" size={14} /> },
                    { name: '20 tracked keywords', icon: <MaterialIcon name="search" size={14} /> },
                    { name: 'Daily Email alerts', icon: <MaterialIcon name="mail" size={14} /> }
                ],
                engage: [
                    { name: 'Personalised Outreach', icon: <MaterialIcon name="smart_toy" size={14} /> },
                    { name: 'Priority email support', icon: <MaterialIcon name="mail" size={14} /> }
                ]
            }
        }
    ];

    return (
        <section id="pricing" className="pt-32 pb-10 px-4 bg-[#1a1a1a] relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff914d] mb-6 font-mono">PRICING</p>
                    <h2 className="text-4xl md:text-[5rem] font-black text-white mb-16 tracking-tighter leading-[1.05] max-w-[90vw] mx-auto">
                        <span className="block sm:whitespace-nowrap">Find your first users</span>
                        <span className="block text-orange-500 font-serif-italic sm:whitespace-nowrap">this week.</span>
                    </h2>
                    
                    {/* Billing Toggle with Card Border */}
                    <div className={`inline-flex items-center p-1 bg-white/5 border rounded-[2.5rem] mx-auto transition-all duration-500 ${billingCycle === 'annual' ? 'border-orange-500/40' : 'border-white/10'}`}>
                        <div className={`bg-[#0c0c0c] border rounded-[2.2rem] py-3 px-4 sm:py-4 sm:px-12 flex items-center justify-center gap-4 sm:gap-10 relative overflow-hidden transition-all duration-500 ${billingCycle === 'annual' ? 'border-orange-500/20' : 'border-white/5'}`}>
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            
                            <div className="flex items-center gap-4 sm:gap-10">
                                <button 
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-300 transform ${billingCycle === 'monthly' ? 'text-white scale-110' : 'text-gray-600 hover:text-gray-400'}`}
                                >
                                    Monthly
                                </button>
                                
                                <div 
                                    onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                                    className="relative w-16 h-8 bg-white/5 rounded-full border border-white/10 p-1 cursor-pointer group transition-colors hover:bg-white/10"
                                >
                                    <motion.div 
                                        className="w-5.5 h-5.5 bg-white rounded-full shadow-xl"
                                        animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                    />
                                </div>

                                <button 
                                    onClick={() => setBillingCycle('annual')}
                                    className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-300 transform ${billingCycle === 'annual' ? 'text-white scale-110' : 'text-gray-600 hover:text-gray-400'}`}
                                >
                                    Annual
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan) => (
                        <div 
                            key={plan.name} 
                            className={`p-2 rounded-[2.5rem] border transition-all duration-500 bg-white/5 relative ${
                                plan.highlight ? 'border-orange-500/10' : 'border-white/5'
                            }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 right-8 bg-[#ff824d] px-6 py-2 rounded-2xl flex items-center gap-3 z-30 shadow-none border-none">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-black flex items-center gap-3">
                                        <MaterialIcon name="smart_toy" size={14} className="text-black/80" />
                                        {plan.badge}
                                    </span>
                                </div>
                            )}
                            <div className={`relative rounded-[2rem] border flex flex-col p-8 lg:p-12 h-full overflow-hidden ${
                                plan.highlight 
                                    ? 'bg-[#0c0c0c] border-[#ff914d]/20 shadow-none' 
                                    : 'bg-[#0c0c0c] border-white/5 shadow-none'
                            }`}>
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="mb-10 min-h-[300px] flex flex-col">
                                <h3 className="text-2xl font-black mb-6 text-white">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-4 h-16">
                                        <div className="relative h-16 flex items-baseline overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                <motion.span
                                                    key={billingCycle}
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -20, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="text-6xl font-black text-white tracking-tighter"
                                                >
                                                    ${billingCycle === 'annual' && plan.annualPrice ? Math.round(plan.annualPrice / 12) : plan.price}
                                                </motion.span>
                                            </AnimatePresence>
                                            <span className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
                                                /mo
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        <AnimatePresence>
                                            {billingCycle === 'annual' && (
                                                <motion.p 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest mb-4"
                                                >
                                                    Save 2 month
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[240px] uppercase tracking-wider mb-4">{plan.description}</p>
                                
                                
                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleCheckout(plan.name)}
                                        disabled={!!isLoading}
                                        suppressHydrationWarning
                                        className="w-full py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-none"
                                    >
                                        {isLoading === plan.name ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Get {plan.name} Access <MaterialIcon name="arrow_right" size={16} /></>}
                                    </button>

                                </div>
                            </div>

                            <div className="space-y-10 flex-grow mb-14">
                                {/* Inbound Group */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <MaterialIcon name="public" size={14} className="text-gray-700" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">INBOUND</span>
                                        <div className="h-[1px] bg-white/5 flex-grow ml-2" />
                                    </div>
                                    <ul className="space-y-5">
                                        {plan.features.inbound.map((item) => (
                                            <li key={item.name} className="flex items-center gap-4">
                                                <div className={`p-1.5 rounded-lg ${plan.highlight ? 'text-orange-500 bg-orange-500/10 border border-orange-500/20' : 'text-gray-500 bg-white/5 border border-white/5'}`}>
                                                    {item.icon}
                                                </div>
                                                <span className={`text-xs font-bold tracking-tight uppercase tracking-widest ${plan.highlight ? 'text-gray-200' : 'text-gray-400'}`}>
                                                    {item.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Engage Group */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <MaterialIcon name="bolt" size={14} className="text-gray-700" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">ENGAGE</span>
                                        <div className="h-[1px] bg-white/5 flex-grow ml-2" />
                                    </div>
                                    <ul className="space-y-5">
                                        {plan.features.engage.map((item) => (
                                            <li key={item.name} className="flex items-center gap-4">
                                                <div className={`p-1.5 rounded-lg ${plan.highlight ? 'text-orange-500 bg-orange-500/10 border border-orange-500/20' : 'text-gray-500 bg-white/5 border border-white/5'}`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold tracking-tight uppercase tracking-widest ${plan.highlight ? 'text-gray-200' : 'text-gray-400'}`}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            
                            </div>
                        </div>
                    ))}

                    {/* Lifetime Plan (Premium White Style) */}
                    <div className="p-2 bg-white/10 border border-white/20 rounded-[2.5rem] relative">
                        <div className="absolute -top-3 right-8 bg-black text-white px-6 py-2 rounded-2xl flex items-center gap-3 z-30 shadow-none border-none">
                            <span className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                <MaterialIcon name="workspace_premium" size={14} className="text-orange-500" />
                                ONE TIME PAYMENT
                            </span>
                        </div>
                        <div className="relative h-full p-8 md:p-12 bg-white border-2 border-white rounded-[2rem] group flex flex-col overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                            {/* Sold Out Overlay Removed */}
                            
                            

                            <div className="mb-10 relative min-h-[300px] flex flex-col">
                                <h3 className="text-2xl font-black text-black flex items-center gap-2 mb-6">
                                    One Time Payment
                                </h3>
                                
                                <div className="flex items-baseline gap-2 mb-4 h-16">
                                    <span className="text-6xl font-black text-black tracking-tighter">${currentPrice}</span>
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">One-time</span>
                                </div>
                                <div className="h-6" />                                <p className="text-xs font-bold text-gray-600 leading-relaxed max-w-[240px] uppercase tracking-wider mb-4">Pay once and enjoy lifetime access to upgraded limits, forever.</p>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleCheckout('One-Time')}
                                        disabled={!!isLoading}
                                        suppressHydrationWarning
                                        className="w-full py-6 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-none"
                                    >
                                        {isLoading === 'One-Time' ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <>Get Lifetime Access <MaterialIcon name="arrow_right" size={16} /></>}
                                    </button>

                                </div>
                            </div>


                            <div className="space-y-10 flex-grow mb-14">
                                {/* Inbound Group */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <MaterialIcon name="public" size={14} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">INBOUND</span>
                                        <div className="h-[1px] bg-black/5 flex-grow ml-2" />
                                    </div>
                                    <ul className="space-y-5">
                                        {[
                                            { name: '10 Deep AI Reddit Search /day', icon: <MaterialIcon name="public" size={14} /> },
                                            { name: 'Live Reddit monitoring', icon: <MaterialIcon name="bolt" size={14} /> },
                                            { name: '20 tracked keywords', icon: <MaterialIcon name="search" size={14} /> }
                                        ].map((item) => (
                                            <li key={item.name} className="flex items-center gap-4">
                                                <div className="p-1.5 rounded-lg text-black bg-black/5 border border-black/10">
                                                    {item.icon}
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-black">
                                                    {item.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Engage Group */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <MaterialIcon name="bolt" size={14} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">ENGAGE</span>
                                        <div className="h-[1px] bg-black/5 flex-grow ml-2" />
                                    </div>
                                    <ul className="space-y-5">
                                        {[
                                            { name: 'Personalised Outreach', icon: <MaterialIcon name="smart_toy" size={14} /> }
                                        ].map((item) => (
                                            <li key={item.name} className="flex items-center gap-4">
                                                <div className="p-1.5 rounded-lg text-black bg-black/5 border border-black/10">
                                                    {item.icon}
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-black">
                                                    {item.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Plus Group */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <MaterialIcon name="workspace_premium" size={14} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">LIFETIME PLUS</span>
                                        <div className="h-[1px] bg-black/5 flex-grow ml-2" />
                                    </div>
                                    <ul className="space-y-5">
                                        {[
                                            { name: 'Priority email support', icon: <MaterialIcon name="mail" size={14} /> },
                                            { name: 'No recurring monthly fees', icon: <MaterialIcon name="workspace_premium" size={14} /> }
                                        ].map((item) => (
                                            <li key={item.name} className="flex items-center gap-4">
                                                <div className="p-1.5 rounded-lg text-black bg-black/5 border border-black/10">
                                                    {item.icon}
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-black">
                                                    {item.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                           

                        </div>
                    </div>
                </div>

                {/* Urgency Banner */}
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400">
                            ⚡ <span className="text-white">Find warm, high-intent users from Reddit within your first week, or your money back.</span>
                        </span>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default Pricing;
