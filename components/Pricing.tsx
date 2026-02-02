'use client';

import { useState } from 'react';
import { Check, Zap, Loader2, ArrowRight } from 'lucide-react';

const Pricing = () => {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleCheckout = async (plan: 'scout' | 'pro') => {
        setIsLoading(plan);
        try {
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
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

    return (
        <section id="pricing" className="py-32 px-4 bg-[#1a1a1a] relative overflow-hidden border-t border-white/5">
             <div className="max-w-6xl mx-auto relative z-10">
                 {/* Header */}
                 <div className="text-center mb-20">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6">
                         <Zap size={12} fill="currentColor" />
                         Pricing
                     </div>
                     <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                         Scale your <span className="text-orange-500 italic font-serif">Red-Hot</span> growth.
                     </h2>
                     <p className="text-base text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
                          Choose the plan that fits your hunting style. 7-Day Money-Back Guarantee included on both plans.
                      </p>
                 </div>
 
                 {/* Pricing Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                     {/* Scout Plan */}
                     <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 md:p-12 overflow-hidden group hover:border-white/20 transition-all duration-500 flex flex-col">
                        <div className="mb-10">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Scout Plan</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white">$15</span>
                                <span className="text-sm font-black uppercase tracking-widest text-gray-600">/mo</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10 flex-grow">
                            {[
                                "2 High-Intent Spotlight Scans",
                                "5 Strategic Keywords",
                                "24/7 Monitoring",
                                "Categorical AI Scoring",
                                "Continuous Dashboard Inbox",
                                "Daily Intelligence Email"
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check size={14} className="text-orange-500/50" />
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            suppressHydrationWarning
                            onClick={() => handleCheckout('scout')}
                            disabled={!!isLoading}
                            className="w-full py-5 rounded-xl border border-white/10 bg-white/5 text-white font-black text-[12px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading === 'scout' ? <Loader2 size={16} className="animate-spin" /> : <>Start Scout</>}
                        </button>
                     </div>

                     {/* Pro Plan */}
                     <div className="relative rounded-2xl border border-orange-500/20 bg-orange-500/[0.02] backdrop-blur-xl p-8 md:p-12 overflow-hidden group hover:border-orange-500 transition-all duration-500 flex flex-col ring-1 ring-orange-500/10">
                        {/* Popular Badge */}
                        <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-orange-500 text-black text-[8px] font-black uppercase tracking-widest">
                            Most Popular
                        </div>

                        <div className="mb-10">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2">Pro Plan</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white">$29</span>
                                <span className="text-sm font-black uppercase tracking-widest text-gray-600">/mo</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10 flex-grow">
                            {[
                                "5 High-Intent Spotlight Scans",
                                "15 Strategic Keywords",
                                "24/7 Priority Monitoring",
                                "Advanced AI Categorization",
                                "Daily Intelligence Email",
                                "Priority Intelligence Email"
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check size={14} className="text-orange-500" />
                                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest leading-none">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            suppressHydrationWarning
                            onClick={() => handleCheckout('pro')}
                            disabled={!!isLoading}
                            className="w-full py-5 rounded-xl bg-orange-500 text-black font-black text-[12px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-orange-500/20"
                        >
                            {isLoading === 'pro' ? <Loader2 size={16} className="animate-spin" /> : <>Start Pro <ArrowRight size={16} /></>}
                        </button>
                     </div>
                 </div>
                 
                 <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
                    Secure Transmission & Processing by Dodo Payments
                 </p>
             </div>
        </section>
    );
};

export default Pricing;
