'use client';

import { useState, useEffect } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { createClient } from '@/lib/supabase/client';

interface PaywallModalProps {
    onCheckout: (plan: 'starter' | 'growth' | 'lifetime') => Promise<void>;
}

export default function PaywallModal({ onCheckout }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [slots, setSlots] = useState<{ sold: number; total: number } | null>(null);

    useEffect(() => {
        const fetchSlots = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('lifetime_slots')
                .select('sold_slots, total_slots')
                .single();
            if (data) setSlots({ sold: data.sold_slots, total: data.total_slots });
        };
        fetchSlots();
    }, []);

    const handleClick = async (plan: 'starter' | 'growth' | 'lifetime') => {
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
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 overflow-y-auto pt-20 pb-20">
            <div className="max-w-4xl w-full bg-[#141414] border border-white/5 rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <div className="relative z-10">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                        <MaterialIcon name="lock" size={32} className="text-orange-500" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                        Your trial has ended
                    </h2>
                    
                    <p className="text-gray-500 text-sm font-medium mb-10 max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
                        Upgrade to keep finding high-intent leads 24/7.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                        {/* Starter Option */}
                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Starter</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-2xl font-black text-white">$7</span>
                                <span className="text-xs text-gray-600 font-bold uppercase ml-1">/mo</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                <li className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <MaterialIcon name="search" size={10} className="text-orange-500/50" /> 5 Key-words
                                </li>
                                <li className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <MaterialIcon name="smart_toy" size={10} className="text-orange-500/50" /> 100 Replies
                                </li>
                            </ul>
                            <button
                                onClick={() => handleClick('starter')}
                                disabled={!!isLoading}
                                suppressHydrationWarning
                                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50"
                            >
                                {isLoading === 'starter' ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Select'}
                            </button>
                        </div>

                        {/* Growth Option */}
                        <div className="p-6 rounded-[2rem] bg-orange-500/[0.03] border border-orange-500/20 flex flex-col ring-1 ring-orange-500/10 relative overflow-hidden">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">Growth</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-2xl font-black text-white">$14</span>
                                <span className="text-xs text-gray-600 font-bold uppercase ml-1">/mo</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                <li className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <MaterialIcon name="search" size={10} className="text-orange-500" /> 15 Key-words
                                </li>
                                <li className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <MaterialIcon name="smart_toy" size={10} className="text-orange-500" /> 500 Replies
                                </li>
                            </ul>
                            <button
                                onClick={() => handleClick('growth')}
                                disabled={!!isLoading}
                                suppressHydrationWarning
                                className="w-full py-4 rounded-xl bg-[#ff914d] text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#ff914d]/90 transition-all disabled:opacity-50 shadow-lg"
                            >
                                {isLoading === 'growth' ? <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto" /> : 'Go Pro'}
                            </button>
                        </div>

                        {/* Lifetime Option */}
                        <div className="p-6 rounded-[2rem] bg-white text-black flex flex-col relative overflow-hidden border border-white shadow-2xl">
                                <MaterialIcon name="workspace_premium" size={8} /> {slots ? `${slots.total - slots.sold}/${slots.total}` : '...'} Seats Left
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-2">Life Time</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-2xl font-black text-black">$20</span>
                                <span className="text-[8px] text-gray-600 font-black uppercase ml-1 tracking-tighter">Founding</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                <li className="text-[9px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                                    <MaterialIcon name="bolt" size={10} className="text-orange-600" /> Unlimited Discovery
                                </li>
                                <li className="text-[9px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                                    <MaterialIcon name="auto_awesome" size={10} className="text-orange-600" /> Future Pro updates
                                </li>
                            </ul>
                            <button
                                onClick={() => handleClick('lifetime')}
                                disabled={!!isLoading || (slots ? slots.sold >= slots.total : false)}
                                suppressHydrationWarning
                                className="w-full py-4 rounded-xl bg-black text-white font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50"
                            >
                                {isLoading === 'lifetime' ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Claim Seat'}
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-[9px] font-bold text-gray-700 uppercase tracking-[0.2em]">
                        7-Day Guarantee • CANCEL ANYTIME • Secure Dodo Checkout
                    </p>
                </div>
            </div>
        </div>
    );
}
