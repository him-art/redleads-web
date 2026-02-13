'use client';

import { useState } from 'react';
import { Loader2, Zap, Lock, ArrowRight, Search, Globe, Bot, Mail } from 'lucide-react';

interface PaywallModalProps {
    onCheckout: (plan: 'scout' | 'pro') => Promise<void>;
}

export default function PaywallModal({ onCheckout }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleClick = async (plan: 'scout' | 'pro') => {
        setIsLoading(plan);
        try {
            await onCheckout(plan);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-[#141414] border border-white/5 rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <div className="relative z-10">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                        <Lock className="w-8 h-8 text-orange-500" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                        Your trial has ended
                    </h2>
                    
                    <p className="text-gray-500 text-sm font-medium mb-10 max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
                        Upgrade to keep finding high-intent leads 24/7.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Starter Option */}
                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Starter</h3>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-black text-white">$15</span>
                                <span className="text-sm font-bold text-gray-700 line-through decoration-orange-500/50 decoration-1 tracking-tight">$19</span>
                                <span className="text-xs text-gray-600 font-bold uppercase ml-1">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                <li className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                    <Globe size={12} className="text-orange-500/50" /> 2 website power scan per day
                                </li>
                                <li className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                    <Search size={12} className="text-orange-500/50" /> 5 Tracked Keywords
                                </li>
                                <li className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                    <Bot size={12} className="text-orange-500/50" /> 100 AI Replies /mo
                                </li>
                                <li className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                    <Mail size={12} className="text-gray-700" /> 30 daily auto DMs <span className="text-[7px] bg-[#1a1a1a] px-1 rounded border border-white/5">Soon</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => handleClick('scout')}
                                disabled={!!isLoading}
                                className="w-full py-5 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50"
                            >
                                {isLoading === 'scout' ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Unlock Starter'}
                            </button>
                        </div>

                        {/* Growth Option */}
                        <div className="p-8 rounded-[2rem] bg-orange-500/[0.03] border border-orange-500/20 flex flex-col ring-1 ring-orange-500/10 relative overflow-hidden">
                            <div className="absolute top-4 right-6 text-[8px] font-black uppercase text-orange-500 tracking-[0.3em]">Popular</div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">Growth</h3>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-black text-white">$29</span>
                                <span className="text-sm font-bold text-orange-500/30 line-through decoration-orange-500 decoration-1 tracking-tight">$39</span>
                                <span className="text-xs text-gray-600 font-bold uppercase ml-1">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-grow">
                                <li className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <Globe size={12} className="text-orange-500" /> 5 website power scan per day
                                </li>
                                <li className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <Search size={12} className="text-orange-500" /> 15 Tracked Keywords
                                </li>
                                <li className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <Bot size={12} className="text-orange-500" /> 500 AI Replies /mo
                                </li>
                                <li className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <Mail size={12} className="text-orange-500/50" /> 100 daily auto DMs <span className="text-[7px] bg-[#1a1a1a] px-1 rounded border border-orange-500/20">Soon</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => handleClick('pro')}
                                disabled={!!isLoading}
                                className="w-full py-5 rounded-2xl bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#ff4d29] transition-all disabled:opacity-50 shadow-2xl shadow-orange-950/20"
                            >
                                {isLoading === 'pro' ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Unlock Growth'}
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-[9px] font-bold text-gray-700 uppercase tracking-[0.2em]">
                        7-Day Guarantee • Cancel Anytime • Secure Dodo Checkout
                    </p>
                </div>
            </div>
        </div>
    );
}
