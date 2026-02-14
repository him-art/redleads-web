'use client';

import { useState } from 'react';
import { Check, Zap, Loader2, ArrowRight, Globe, Search, Activity, ZapIcon, Mail, MessageSquare, Bot, ShieldCheck } from 'lucide-react';

const Pricing = () => {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleCheckout = async (plan: string) => {
        setIsLoading(plan);
        try {
            // Map our UI plans to the backend plan keys
            const planKey = plan === 'Starter' ? 'scout' : 'pro';
            
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
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-6 font-mono">PRICING</p>
                    <h2 className="text-4xl md:text-[5rem] font-black text-white mb-6 tracking-tighter leading-[1.05] max-w-[90vw] mx-auto">
                        <span className="block whitespace-nowrap">Start getting</span>
                        <span className="block text-orange-500 font-serif-italic whitespace-nowrap">customers from Reddit</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto font-medium uppercase tracking-widest leading-relaxed mb-10">
                        Find the perfect conversations from Reddit to promote your product.
                    </p>
                    
                   
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                    {plans.map((plan) => (
                        <div 
                            key={plan.name} 
                            className={`relative rounded-[2.5rem] border-5 transition-all duration-500 flex flex-col p-8 md:p-12 ${
                                plan.highlight 
                                    ? 'bg-orange-500/[0.02] border-orange-500/20 ring-1 ring-orange-500/10' 
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
                                    className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 ${
                                        plan.highlight 
                                            ? 'bg-orange-500 text-white hover:bg-white hover:text-black border border-orange-500/20' 
                                            : 'bg-white/5 border border-white/5 text-white hover:bg-white hover:text-black'
                                    }`}
                                >
                                    {isLoading === plan.name ? <Loader2 size={16} className="animate-spin" /> : <>Start 3-day free trial <ArrowRight size={16} /></>}
                                </button>
                                <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 transition-colors">
                                    Cancel anytime
                                </p>
                            </div>
                        </div>
                    ))}
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
