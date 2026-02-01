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
            <div className="max-w-lg w-full bg-[#141414] border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
                <div className="relative z-10">
                    {/* Lock Icon */}
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 ">
                        <Lock className="w-10 h-10 text-orange-500" />
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        Your trial has ended
                    </h2>
                    
                    <p className="text-gray-400 text-base font-medium mb-8 max-w-xs mx-auto leading-relaxed">
                        Upgrade to Pro to continue finding high-intent leads on Reddit 24/7.
                    </p>

                    {/* Features reminder */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8 text-[10px]">
                        {['24/7 Leads Monitoring', '5 Daily Reddit Scans', 'Monitor Top 100+ Communities', '10 Tracking Keywords'].map((feature) => (
                            <span 
                                key={feature}
                                className="px-3 py-2 bg-white/5 border border-white/5 rounded-xl font-black text-gray-500 uppercase tracking-widest"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleClick}
                        disabled={isLoading}
                        className="w-full py-5 rounded-2xl bg-orange-500 text-black font-black text-xs uppercase tracking-widest hover:bg-orange-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <Zap size={16} fill="currentColor" />
                                Unlock Pro — $25/month
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>

                    <p className="mt-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        Cancel anytime. Secure payment via Dodo.
                    </p>
                </div>
            </div>
        </div>
    );
}
