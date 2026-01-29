'use client';

import { useState } from 'react';
import { Check, Zap, Loader2, ArrowRight } from 'lucide-react';

const Pricing = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            
            const data = await res.json();
            
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else if (data.error === 'Unauthorized') {
                window.location.href = '/login?next=/pricing';
            } else {
                alert(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
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
                         {require('@/lib/dodo').BETA_MODE ? 'Public Beta now ' : 'Scale your '}<span className="text-orange-500 italic font-serif">{require('@/lib/dodo').BETA_MODE ? 'Open' : 'Red-Hot'}</span>{require('@/lib/dodo').BETA_MODE ? '.' : ' growth.'}
                     </h2>
                     <p className="text-base text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
                         {require('@/lib/dodo').BETA_MODE 
                            ? 'The first 20 founders get full Pro access for free in exchange for feedback. Help us shape the future.' 
                            : 'One transparent plan designed for autonomous lead generation. Full intelligence suite included.'}
                     </p>
                 </div>
 
                 {/* Single Pricing Card */}
                 <div className="max-w-2xl mx-auto">
                     <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-12 md:p-16 overflow-hidden group hover:border-orange-500/20 transition-all duration-500">
                         {/* Subtle Background Elements */}
                         <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 blur-[120px] -mr-40 -mt-40 pointer-events-none" />
                         <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent w-full pointer-events-none" />
                         
                         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                             <div className="space-y-10">
                                 <div>
                                     <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Growth Suite</h3>
                                     <div className="flex items-baseline gap-1">
                                         <span className="text-7xl font-black text-white">$25</span>
                                         <span className="text-sm font-black uppercase tracking-widest text-gray-600">/mo</span>
                                     </div>
                                 </div>
 
                                 <button
                                     onClick={handleCheckout}
                                     disabled={isLoading}
                                     className="w-full py-6 rounded-xl bg-orange-500 text-black font-black text-[14px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-2xl shadow-orange-500/10 active:scale-95"
                                 >
                                     {isLoading ? (
                                         <Loader2 size={20} className="animate-spin" />
                                     ) : (
                                         <>Pro Plan <ArrowRight size={18} /></>
                                     )}
                                 </button>
 
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-green-500/80">
                                        <Check size={14} className="text-green-500" />
                                        3-Day Sentinel Trial
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <Check size={14} className="text-green-500/50" />
                                        Cancel Anytime
                                    </div>
                                 </div>
                             </div>
                             
                             <div className="space-y-8 md:border-l md:border-white/5 md:pl-16">
                                 <ul className="space-y-6">
                                     {[
                                         "24/7 Autonomous Monitoring",
                                         "5 Daily Deep Signal Scans",
                                         "Track 10 Active Subreddits",
                                         "Monitor 15 High-Intent Keywords",
                                         "Priority System Access"
                                     ].map((feature) => (
                                         <li key={feature} className="flex items-start gap-4 group/item">
                                             <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500/50 group-hover/item:bg-orange-500 transition-colors" />
                                             <span className="text-[12px] font-bold text-gray-400 group-hover/item:text-white transition-colors uppercase tracking-wider leading-tight">
                                                 {feature}
                                             </span>
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                         </div>
                     </div>
                     
                     <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
                        Secure Transmission & Processing by Dodo Payments
                     </p>
                 </div>
             </div>
         </section>
    );
};

export default Pricing;
