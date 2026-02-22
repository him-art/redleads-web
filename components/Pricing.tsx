'use client';

import { useState, useEffect } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';
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
                    { name: '2 Power Search for top ranking post /day', icon: <MaterialIcon name="public" size={14} /> },
                    { name: '5 tracked keywords', icon: <MaterialIcon name="search" size={14} /> },
                    { name: 'Daily SEO opportunities', icon: <MaterialIcon name="monitoring" size={14} /> },
                    { name: 'Live Reddit monitoring', icon: <MaterialIcon name="bolt" size={14} /> },
                    { name: 'AI Intent Scoring', icon: <MaterialIcon name="bolt" size={14} /> },
                    { name: 'Daily Email notifications', icon: <MaterialIcon name="mail" size={14} /> }
                ],
                engage: [
                    { name: '100 AI Replies /mo', icon: <MaterialIcon name="smart_toy" size={14} /> },
                    { name: 'Anti-Ban Safety Engine', icon: <MaterialIcon name="verified_user" size={14} className="text-green-500" /> },
                    { name: '30 daily auto DMs', icon: <MaterialIcon name="chat" size={14} />, soon: true }
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
                    { name: '5 Power Search for top ranking post /day', icon: <MaterialIcon name="public" size={14} /> },
                    { name: '15 tracked keywords', icon: <MaterialIcon name="search" size={14} /> },
                    { name: 'Daily SEO opportunities', icon: <MaterialIcon name="monitoring" size={14} /> },
                    { name: 'Live Reddit monitoring', icon: <MaterialIcon name="bolt" size={14} /> },
                    { name: 'AI Intent Scoring', icon: <MaterialIcon name="bolt" size={14} className="text-orange-500" /> },
                    { name: 'Daily Email notifications', icon: <MaterialIcon name="mail" size={14} /> }
                ],
                engage: [
                    { name: '500 AI Replies /mo', icon: <MaterialIcon name="smart_toy" size={14} /> },
                    { name: 'Anti-Ban Safety Engine', icon: <MaterialIcon name="verified_user" size={14} className="text-green-500" /> },
                    { name: '100 daily auto DMs', icon: <MaterialIcon name="chat" size={14} />, soon: true }
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
                        <span className="block text-orange-500 font-serif-italic whitespace-nowrap">customers from Reddit</span>
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
                                    {isLoading === plan.name ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Start 3-day free trial <MaterialIcon name="arrow_right" size={16} /></>}
                                </button>
                                <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 transition-colors">
                                    7 DAY MONEY BACK GUARANTEE
                                </p>
                            </div>
                            </div>
                        </div>
                    ))}

                    {/* Lifetime Plan (Obsidian Style) */}
                    <div className="p-2 bg-white/5 border border-red-500/10 rounded-[2.5rem] relative">
                        <div className="absolute -top-3 right-8 bg-yellow-500 text-black px-6 py-2 rounded-2xl flex items-center gap-3 z-30 shadow-none border-none">
                            <span className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                <MaterialIcon name="workspace_premium" size={14} className="text-black" />
                                10 SEATS LEFT
                            </span>
                        </div>
                        <div className="relative h-full p-8 md:p-12 bg-gradient-to-br from-[#0c0c0c] to-black border-2 border-red-500/50 rounded-[2rem] group flex flex-col overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            {/* Sold Out Overlay */}
                            {slots && slots.sold >= slots.total && (
                                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center rounded-[2rem]">
                                    <div className="text-center">
                                        <div className="bg-red-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs mb-4">Sold Out</div>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Join the waitlist</p>
                                    </div>
                                </div>
                            )}
                            
                            

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
                                <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 mb-8 shadow-none">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                                        <MaterialIcon name="check" size={14} /> Everything in Growth
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <MaterialIcon name="workspace_premium" size={14} className="text-gray-600" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">PLUS</span>
                                    <div className="h-[1px] bg-white/5 flex-grow ml-2" />
                                </div>
                                <ul className="space-y-5">
                                    {[
                                        { name: 'All future features included', icon: <MaterialIcon name="workspace_premium" size={14} /> },
                                        { name: '24/7 personal support', icon: <MaterialIcon name="smart_toy" size={14} /> },
                                        { name: 'Life time access', icon: <MaterialIcon name="workspace_premium" size={14} /> }
                                        
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
                                    suppressHydrationWarning
                                    className="w-full py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-none"
                                >
                                    {isLoading === 'Lifetime' ? <div className="w-4 h-4 border-2 border-white/30 border-t-black rounded-full animate-spin" /> : <>Get Lifetime Access <MaterialIcon name="arrow_right" size={16} /></>}
                                </button>
                                <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    14-DAY MONEY BACK GUARANTEE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Info Banner */}
                <div className="mt-20 max-w-3xl mx-auto p-2 bg-white/5 border border-white/5 rounded-[3.5rem]">
                    <div className="rounded-[3rem] bg-[#0c0c0c] border border-white/5 p-12 md:p-16 text-center relative overflow-hidden group hover:border-orange-500/20 transition-all shadow-none">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Start with a 3-day free trial</h3>
                        <p className="text-gray-500 text-[15px] font-medium tracking-[0.2em] leading-[1.8] max-w-xl mx-auto opacity-70">
                            Ads can cost you thousands of dollars. RedLeads discovers hidden opportunities on Reddit and drives organic growth for the fraction of the cost. Literally pays itself if you get a single new customer.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
