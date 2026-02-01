'use client';

import { useState } from 'react';
import { Loader2, Zap, Lock, ArrowRight } from 'lucide-react';

interface PaywallModalProps {
    onCheckout: () => Promise<void>;
}

export default function PaywallModal({ onCheckout }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await onCheckout();
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 blur-[150px] pointer-events-none" />
                
                <div className="relative z-10">
                    {/* Lock Icon */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8">
                        <Lock className="w-10 h-10 text-orange-500" />
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Your trial has ended
                    </h2>
                    
                    <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
                        Upgrade to Pro to continue finding high-intent leads on Reddit every day.
                    </p>

                    {/* Features reminder */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {['24/7 Monitoring', 'Daily Reports', 'Unlimited Keywords'].map((feature) => (
                            <span 
                                key={feature}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 uppercase tracking-wider"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleClick}
                        disabled={isLoading}
                        className="w-full py-5 rounded-xl bg-orange-500 text-black font-black text-lg hover:bg-orange-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-orange-500/20"
                    >
                        {isLoading ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <Zap size={22} fill="currentColor" />
                                Unlock Pro — $25/month
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <p className="mt-6 text-sm text-gray-600">
                        Cancel anytime. Secure payment via Dodo.
                    </p>
                </div>
            </div>
        </div>
    );
}
