'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Loader2, ArrowRight, Globe, Search, Activity, ZapIcon, Mail, MessageSquare, Bot, ShieldCheck, Crown, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const Pricing = () => {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [slots, setSlots] = useState<{ sold: number; total: number } | null>(null);

    useEffect(() => {
        const fetchSlots = async () => {
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

    const handleCheckout = async (plan: string) => {
        setIsLoading(plan);
        try {
            // Map our UI plans to the backend plan keys
            const planKey = plan === 'Starter' ? 'starter' : plan === 'Growth' ? 'growth' : 'lifetime';
            
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planKey })
            });
            
            const data = await res.json().catch(() => ({}));
            
            if (res.ok && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else if (res.status === 401) {
                window.location.href = `/login?next=/#pricing`;
            } else {
                alert(data.error || `Error ${res.status}: Failed to initiate checkout`);
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Network error: ${error.message || 'Something went wrong.'}`);
        } finally {
            setIsLoading(null);
        }
    };

    const plans = [
        {
            name: 'Starter',
            price: 15,
            originalPrice: 19,
            description: 'Perfect for getting started with Reddit marketing',
            features: {
                inbound: [
                    { name: '2 website power scan per day', icon: <Globe size={14} /> },
                    { name: '5 tracked keywords', icon: <Search size={14} /> },
                    { name: 'Daily SEO opportunities', icon: <Activity size={14} /> },
                    { name: 'Live Reddit monitoring', icon: <ZapIcon size={14} /> },
                    { name: 'AI Intent Scoring', icon: <Zap size={14} /> },
                    { name: 'Daily Email notifications', icon: <Mail size={14} /> }
                ],
                engage: [
                    { name: '100 AI Replies /mo', icon: <Bot size={14} /> },
                    { name: 'Anti-Ban Safety Engine', icon: <ShieldCheck size={14} className="text-green-500" /> },
                    { name: '30 daily auto DMs', icon: <MessageSquare size={14} />, soon: true }
                ]
            }
        },
        {
            name: 'Growth',
            price: 29,
            originalPrice: 39,
            description: 'For growing startups to get maximum benefits',
            highlight: true,
            badge: 'BEST VALUE',
            features: {
                inbound: [
                    { name: '5 website power scan per day', icon: <Globe size={14} /> },
                    { name: '15 tracked keywords', icon: <Search size={14} /> },
                    { name: 'Daily SEO opportunities', icon: <Activity size={14} /> },
                    { name: 'Live Reddit monitoring', icon: <ZapIcon size={14} /> },
                    { name: 'AI Intent Scoring', icon: <Zap size={14} className="text-orange-500" /> },
                    { name: 'Daily Email notifications', icon: <Mail size={14} /> }
                ],
                engage: [
                    { name: '500 AI Replies /mo', icon: <Bot size={14} /> },
                    { name: 'Anti-Ban Safety Engine', icon: <ShieldCheck size={14} className="text-green-500" /> },
                    { name: '100 daily auto DMs', icon: <MessageSquare size={14} />, soon: true }
                ]
            }
        }
    ];

    return (
        <section id="pricing" className="pt-32 pb-10 px-4 bg-[#1a1a1a] relative overflow-hidden border-t border-white/5">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff914d] mb-6 font-mono">PRICING</p>
                    <h2 className="text-4xl md:text-[5rem] font-black text-white mb-6 tracking-tighter leading-[1.05] max-w-[90vw] mx-auto">
                        <span className="block whitespace-nowrap">Start getting</span>
                        <span className="block text-[#ff914d] font-serif-italic whitespace-nowrap">customers from Reddit</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto font-medium uppercase tracking-widest leading-relaxed mb-10">
                        Find the perfect conversations from Reddit to promote your product.
                    </p>
                    
                   
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan) => (
                        <div 
                            key={plan.name} 
                            className={`relative rounded-[2.5rem] border transition-all duration-500 flex flex-col p-8 lg:p-12 ${
                                plan.highlight 
                                    ? 'bg-[#ff914d]/[0.02] border-[#ff914d]/20 ring-1 ring-[#ff914d]/10' 
                                    : 'bg-[#141414]/50 border-white/5 hover:border-white/10'
                            }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 right-10 bg-[#ff824d] px-6 py-2.5 rounded-2xl flex items-center gap-3 z-20 shadow-2xl border-none">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-black flex items-center gap-3">
                                        <Bot size={14} className="text-black/80" />
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            <div className="mb-10">
                                <h3 className="text-2xl font-black mb-6 text-white">{plan.name}</h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    {plan.originalPrice && (
                                        <span className="text-2xl font-bold text-gray-700 line-through decoration-1 decoration-orange-500/30 tracking-tight">${plan.originalPrice}</span>
                                    )}
                                    <span className="text-6xl font-black text-white tracking-tighter">${plan.price}</span>
                                    <span className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">/mo</span>
                                </div>
                                <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[240px] uppercase tracking-wider">{plan.description}. Start finding users.</p>
                            </div>

                            <div className="space-y-10 flex-grow mb-14">
                                {/* Inbound Group */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Globe size={14} className="text-gray-700" />
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
                                        <ZapIcon size={14} className="text-gray-700" />
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
                                                    {item.soon && (
                                                        <span className="bg-[#1a1a1a] text-gray-700 text-[8px] px-1.5 py-0.5 rounded-md font-black tracking-[0.2em] border border-white/5">SOON</span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button
                                    onClick={() => handleCheckout(plan.name)}
                                    disabled={!!isLoading}
                                    suppressHydrationWarning
                                    className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 border border-[#ff914d]/20 ${
                                        plan.highlight 
                                            ? 'bg-[#ff914d] text-white hover:bg-white hover:text-black' 
                                            : 'bg-white/5 border-white/5 text-white hover:bg-white hover:text-black'
                                    }`}
                                >
                                    {isLoading === plan.name ? <Loader2 size={16} className="animate-spin" /> : <>Start 3-day free trial <ArrowRight size={16} /></>}
                                </button>
                                <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 transition-colors">
                                    7 DAY MONEY BACK GUARANTEE
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Lifetime Plan (Obsidian Style) */}
                    <div className="relative h-full p-8 md:p-12 bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-red-500/50 rounded-[2.5rem] group flex flex-col">
                        {/* Sold Out Overlay */}
                        {slots && slots.sold >= slots.total && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-[2.5rem]">
                                <div className="text-center">
                                    <div className="bg-red-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs mb-4">Sold Out</div>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Join the waitlist</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="absolute -top-4 right-10 bg-yellow-500 text-black px-6 py-2.5 rounded-2xl flex items-center gap-3 z-20 shadow-2xl border-none">
                            <span className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                <Crown size={14} className="text-black" />
                                ONLY 10 SEATS LEFT
                            </span>
                        </div>

                        <div className="mb-10 relative">
                            <h3 className="text-2xl font-black mb-6 text-white flex items-center gap-2">
                                Lifetime Plan
                            </h3>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-6xl font-black text-white tracking-tighter">$199</span>
                                <span className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">One-time</span>
                            </div>
                            <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[240px] uppercase tracking-wider">Full lifetime access and all future features included.</p>
                        </div>


                        <div className="flex-grow mb-14">
                            {/* Everything in Growth callout */}
                            <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 mb-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                                    <Check size={14} /> Everything in Growth
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <Crown size={14} className="text-gray-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">PLUS</span>
                                <div className="h-[1px] bg-white/5 flex-grow ml-2" />
                            </div>
                            <ul className="space-y-5">
                                {[
                                    { name: 'All future features included', icon: <Crown size={14} /> },
                                    { name: '24/7 personal support', icon: <Bot size={14} /> },
                                    { name: 'Life time access', icon: <Crown size={14} /> }
                                    
                                ].map((item) => (
                                    <li key={item.name} className="flex items-center gap-4">
                                        <div className="p-1.5 rounded-lg text-white bg-white/5 border border-white/10">
                                            {item.icon}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-white">
                                            {item.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={() => handleCheckout('Lifetime')}
                                disabled={!!isLoading || (slots ? slots.sold >= slots.total : false)}
                                className="w-full py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-2xl shadow-white/5"
                            >
                                {isLoading === 'Lifetime' ? <Loader2 size={16} className="animate-spin" /> : <>Get Lifetime Access <ArrowRight size={16} /></>}
                            </button>
                            <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/70">
                                14-DAY MONEY BACK GUARANTEE
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Info Banner */}
                <div className="mt-20 max-w-3xl mx-auto rounded-[3rem] bg-[#141414] border border-white/5 p-12 md:p-16 text-center relative overflow-hidden group hover:border-orange-500/10 transition-all">
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Start with a 3-day free trial</h3>
                    <p className="text-gray-500 text-[15px] font-medium tracking-[0.2em] leading-[1.8] max-w-xl mx-auto opacity-70">
                        Ads can cost you thousands of dollars. RedLeads discovers hidden opportunities on Reddit and drives organic growth for the fraction of the cost. Literally pays itself if you get a single new customer.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
