'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialIcon from '@/components/ui/MaterialIcon';

export default function StickyLeadMagnet() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const dismissed = localStorage.getItem('redleads-sticky-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Logic: Show only on content pages (compare, solutions, blog)
    // Don't show on dashboard, login, or the tool page itself
    const isContentPage = 
      pathname.includes('/compare') || 
      pathname.includes('/solutions') || 
      pathname.includes('/blog') ||
      pathname.includes('/subreddits');
    
    const isExcluded = 
      pathname.includes('/dashboard') || 
      pathname.includes('/login') || 
      pathname.includes('/tools/reddit-opportunity-finder');

    if (isContentPage && !isExcluded && !isDismissed) {
      // Small delay to be polite
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [pathname, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('redleads-sticky-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 max-w-md w-full"
      >
        <div className="bg-[#1a1a1a] border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.15)] rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-4 relative overflow-hidden group">
          
          {/* Close Button */}
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-slate-600 hover:text-white transition-colors p-1"
          >
            <MaterialIcon name="close" size={14} className="md:w-4 md:h-4" />
          </button>

          {/* Icon */}
          <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors text-[20px] md:text-[24px]">
             <MaterialIcon name="travel_explore" size="inherit" className="text-orange-500" />
          </div>

          <div className="flex-1">
            <h4 className="text-white font-bold text-[13px] md:text-sm leading-tight mb-1">
              Who is talking about you?
            </h4>
            <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed mb-2 md:mb-3">
              Scan Reddit for high-intent leads mentioning your product or competitors.
            </p>
            <Link 
              href="/tools"
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-orange-500 hover:bg-orange-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-orange-500/20"
            >
              Try Free Tools <MaterialIcon name="arrow_right" size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
