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
        <section id="pricing" className="py-24 px-4 bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
                        <Zap size={16} fill="currentColor" />
                        Simple Pricing
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                        One Plan. <span className="text-orange-500">Everything Included.</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto">
                        No complicated tiers. Get full access to RedLeads and start finding high-intent leads today.
                    </p>
                </div>

                {/* Single Pricing Card */}
                <div className="max-w-md mx-auto">
                    <div className="relative rounded-3xl border-2 border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-transparent p-8 overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 blur-[80px] -mr-20 -mt-20" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                                <span className="px-3 py-1 rounded-full bg-orange-500 text-black text-xs font-black uppercase">
                                    Full Access
                                </span>
                            </div>
                            
                            <div className="mb-8">
                                <div className="flex items-baseline">
                                    <span className="text-6xl font-black text-white">$25</span>
                                    <span className="text-gray-400 ml-2 text-lg">/month</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Daily high-intent lead reports",
                                    "Monitor unlimited subreddits",
                                    "Unlimited keyword tracking",
                                    "Ban-proof monitoring system",
                                    "AI-powered lead analysis",
                                    "Priority email delivery",
                                    "Direct founder support"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-white">
                                        <Check className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-orange-500 text-black font-black text-lg hover:bg-orange-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-500/25"
                            >
                                {isLoading ? (
                                    <Loader2 size={22} className="animate-spin" />
                                ) : (
                                    <>Get Started <ArrowRight size={20} /></>
                                )}
                            </button>

                            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Check size={14} className="text-green-500" />
                                    Cancel anytime
                                </span>
                                <span className="flex items-center gap-1">
                                    <Check size={14} className="text-green-500" />
                                    Instant access
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
