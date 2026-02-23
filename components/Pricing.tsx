'use client';

import { useState, useEffect } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { createClient } from '@/lib/supabase/client';

const Pricing = () => {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [slots, setSlots] = useState<{ sold: number; total: number } | null>(null);

    // New Dynamic Pricing Logic ($10 every 20 users)
    const currentUsers = slots?.sold || 73; 
    const isEarlyBird = currentUsers < 80;
    const currentPrice = isEarlyBird ? 20 : 30 + Math.floor((currentUsers - 80) / 20) * 10;
    const nextPrice = currentPrice + 10;
    const nextCheckpoint = isEarlyBird ? 80 : 80 + (Math.floor((currentUsers - 80) / 20) + 1) * 20;
    const spotsLeft = nextCheckpoint - currentUsers;

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
            price: 7,
            originalPrice: 15,
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
            price: 14,
            originalPrice: 29,
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
                                                        <span className="bg-orange-500/10 text-orange-400 text-[8px] px-1.5 py-0.5 rounded-md font-black tracking-[0.2em] border border-orange-500/20">SOON</span>
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
                                    {isLoading === plan.name ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Get Started <MaterialIcon name="arrow_right" size={16} /></>}
                                </button>
                                <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 transition-colors">
                                    CANCEL ANYTIME
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
                                Limited Time Offer
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
                                <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-6">
                                    Lifetime Plan
                                </h3>
                                
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-6xl font-black text-white tracking-tighter">${currentPrice}</span>
                                    <span className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">One-time</span>
                                </div>
                                <div className="flex items-center gap-2 mb-8">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Next Price:</span>
                                    <span className="text-xs font-black text-orange-500/50 tracking-tighter">${nextPrice}</span>
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
                                    <li className="flex items-center gap-4 group pt-2 border-t border-white/5">
                                        <div className="p-1.5 rounded-lg text-red-500 bg-red-500/10 border border-red-500/20">
                                            <MaterialIcon name="bolt" size={14} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-red-500">
                                            Price increase by $10 after {spotsLeft} users
                                        </span>
                                    </li>
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
                                    CANCEL ANYTIME
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Info Banner */}
                <div className="mt-20 max-w-3xl mx-auto p-2 bg-white/5 border border-white/5 rounded-[3.5rem]">
                    <div className="rounded-[3rem] bg-[#0c0c0c] border border-white/5 p-12 md:p-16 text-center relative overflow-hidden group hover:border-orange-500/20 transition-all shadow-none">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-[10px] font-black text-[#ff914d] uppercase tracking-[0.4em]">Lifetime Plan</p>
                                <p className="text-[14px] font-black text-white uppercase tracking-[0.4em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                    {currentUsers} FOUNDERS JOINED
                                </p>
                            </div>
                            
                            {/* Global Roadmap Visual */}
                            <div className="relative mb-8 pt-4">
                                {/* Checkpoints and Price Labels (Above/Below bar for legibility) */}
                                <div className="absolute inset-0 flex justify-between items-start z-20 pointer-events-none">
                                    {[60, 80, 100, 120, 140].map((tick) => {
                                        const pos = ((tick - 50) / 100) * 100;
                                        const tickPrice = tick < 80 ? 20 : 30 + Math.floor((tick - 80) / 20) * 10;
                                        return (
                                            <div key={tick} className="absolute flex flex-col items-center" style={{ left: `${pos}%` }}>
                                                {/* Vertical Notch */}
                                                <div className={`w-[2px] h-8 mb-2 ${currentUsers >= tick ? 'bg-green-500' : 'bg-white/10'}`} />
                                                {/* Price Label (Below) */}
                                                <span className={`text-[16px] font-black tracking-tighter ${currentUsers >= tick ? 'text-green-500' : 'text-gray-700'}`}>
                                                    ${tickPrice}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Main Progress Bar Track */}
                                <div className="relative h-4 bg-white/5 rounded-full border border-white/10 overflow-hidden shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 rounded-r-full shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min(100, Math.max(0, ((currentUsers - 50) / 100) * 100))}%` }}
                                    />
                                </div>
                            </div>

                            {/* End Scale Labels */}
                            <div className="flex justify-between items-center text-[13px] font-black text-white/70 uppercase tracking-[0.2em] px-2">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-white/20">|</span>
                                    <span>50 USERS</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-white/20">|</span>
                                    <span>150 USERS</span>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-xl mx-auto">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Lock In The Lowest Price Forever</h3>
                            <p className="text-gray-400 text-[14px] font-medium tracking-[0.1em] leading-[1.8] opacity-90">
                                We reward the fast movers. RedLeads' value grows every day as we ship new features. 
                                Secure your lifetime access before the next milestone is hit.
                                <span className="block mt-4 text-orange-500/80 font-black">Once a tier is gone, it never returns.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
