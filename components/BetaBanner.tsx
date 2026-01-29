'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MessageCircle, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BETA_SEAT_LIMIT } from '@/lib/constants';

export default function BetaBanner() {
    const [seatsLeft, setSeatsLeft] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchSeats = async () => {
            const { data: count, error } = await supabase.rpc('get_beta_user_count');
            
            if (!error && count !== null) {
                setSeatsLeft(Math.max(0, BETA_SEAT_LIMIT - Number(count)));
            }
        };

        fetchSeats();
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
                className="mb-8 overflow-hidden px-4 sm:px-0"
            >
                <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 rounded-full bg-white/[0.03] border border-white/20 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center gap-3">
                        <Zap size={14} className="text-orange-500 fill-orange-500" />
                        <p className="text-sm font-medium text-slate-400">
                            <span className="text-white font-bold">Public Beta is Live.</span> Shape the future of autonomous lead generation.
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-green-500" />
                            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                                {seatsLeft !== null ? `${seatsLeft} seats left` : 'Checking...'}
                            </span>
                        </div>
                        
                        <a 
                            href="https://tally.so/r/npxuec"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-white hover:text-orange-500 transition-colors flex items-center gap-1.5 py-1"
                        >
                            Give Feedback <MessageCircle size={14} />
                        </a>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-1 text-slate-600 hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
