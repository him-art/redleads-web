'use client';

import { useState } from 'react';
import { Check, Zap, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PricingPage() {
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
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            
            <section className="pt-32 pb-24 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
                            <Zap size={16} fill="currentColor" />
                            Simple Pricing
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
                            One Plan. <span className="text-orange-500">Everything Included.</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto">
                            No complicated tiers. Get full access to RedLeads and start finding high-intent leads today.
                        </p>
                    </div>

                    {/* Single Pricing Card */}
                    <div className="max-w-md mx-auto">
                        <div className="relative rounded-3xl border-2 border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-transparent p-8 overflow-hidden">
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

                    {/* FAQ */}
                    <div className="mt-20 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-white text-center mb-8">Common Questions</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "What happens after I subscribe?",
                                    a: "You'll get instant access to the RedLeads dashboard where you can configure your keywords, subreddits, and start receiving daily lead reports."
                                },
                                {
                                    q: "Can I cancel anytime?",
                                    a: "Yes! You can cancel your subscription at any time from your dashboard. No questions asked."
                                },
                                {
                                    q: "Is there a free trial?",
                                    a: "We offer a free demo scan on the homepage so you can see the quality of leads we find before subscribing."
                                }
                            ].map((faq) => (
                                <div key={faq.q} className="rounded-xl border border-white/10 bg-white/5 p-5">
                                    <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                                    <p className="text-sm text-gray-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
