'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Users, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BETA_SEAT_LIMIT } from '@/lib/constants';

export default function BetaBanner() {
    const [seatsLeft, setSeatsLeft] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchSeats = async () => {
            const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('is_beta_user', true);
            
            if (count !== null) {
                setSeatsLeft(Math.max(0, BETA_SEAT_LIMIT - count));
            }
        };

        fetchSeats();
        
        // Polling for seat updates every 30 seconds
        const interval = setInterval(fetchSeats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 overflow-hidden"
            >
                <div className="relative p-6 rounded-[2rem] bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 group">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Sparkles size={24} className="text-black" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg flex items-center gap-2">
                                    Public Beta is Live
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full border border-orange-500/20">
                                        Limited
                                    </span>
                                </h3>
                                <p className="text-gray-400 text-sm">Join the inner circle. Shape the future of autonomous lead generation.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                                <Users size={16} className="text-orange-500" />
                                <span className="text-sm font-bold text-white">
                                    {seatsLeft !== null ? `${seatsLeft} seats left` : 'Loading seats...'}
                                </span>
                            </div>
                            
                            <a 
                                href="https://tally.so/r/npxuec" // Use a placeholder link if user hasn't provided one
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-black text-sm rounded-xl hover:bg-orange-400 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                            >
                                <MessageCircle size={18} fill="currentColor" />
                                Give Feedback
                            </a>

                            <button 
                                onClick={() => setIsVisible(false)}
                                className="p-2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Subtle grain overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
