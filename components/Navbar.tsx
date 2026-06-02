'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

/* ─── Promo config ─── */
const PROMO_CODE = 'REDSUMM';
const PROMO_DISCOUNT = '35%';
const PROMO_END = new Date('2026-06-17T23:59:59');
const PROMO_STORAGE_KEY = 'redleads_promo_dismissed';

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff / 3_600_000) % 24),
      minutes: Math.floor((diff / 60_000) % 60),
      seconds: Math.floor((diff / 1_000) % 60),
      expired: diff === 0,
    };
  }, [target]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1_000);
    return () => clearInterval(id);
  }, [calc]);

  return time;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false); // Default to false: render CTA immediately
  const [promoDismissed, setPromoDismissed] = useState(true); // hidden by default to avoid flash
   const countdown = useCountdown(PROMO_END);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Check if promo was previously dismissed
    setPromoDismissed(localStorage.getItem(PROMO_STORAGE_KEY) === 'true');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scrolled down and are past a 50px offset, hide the navbar.
      // If scrolling up, show it.
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const dismissPromo = () => {
    setPromoDismissed(true);
    localStorage.setItem(PROMO_STORAGE_KEY, 'true');
  };

  useEffect(() => {
    // Deferred auth check — non-blocking, runs after hydration
    const supabase = createClient();
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        // Silently fail — user just sees "Get Started" CTA
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const showPromo = !countdown.expired;

  const pad = (n: number) => String(n).padStart(2, '0');

  const showNavbar = isVisible || isMenuOpen;

  return (
    <motion.div
      initial={false}
      animate={{ y: showNavbar ? 0 : -120 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-4 sm:top-6 left-0 right-0 mx-auto z-50 w-[calc(100%-2rem)] lg:w-fit max-w-7xl pointer-events-none"
    >
      <div className="w-full lg:w-auto bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl px-4 py-2 sm:px-6 sm:py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] pointer-events-auto">
        {/* ─── Single row: Brand + Promo pill + Nav + Actions ─── */}
        <div className="flex items-center justify-between lg:justify-start gap-4 lg:gap-8">
          {/* Left/Center Group: Brand + Promo pill + Desktop Nav */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 min-w-0">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#f25e36]/10 border border-[#f25e36]/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img 
                  src="/favicon.png" 
                  alt="RedLeads Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                RedLeads<span className="text-orange-500">.</span>
              </span>
            </Link>

            {/* Promo pill — inline next to brand */}
            <AnimatePresence initial={false}>
              {showPromo && (
                <motion.div
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden flex-shrink-0"
                >
                  <div 
                    onClick={handleCopyCode}
                    className="flex items-center gap-2.5 bg-[url('/vintage_clouds.png')] bg-cover bg-center rounded-lg px-4 py-2 relative overflow-hidden cursor-pointer"
                  >
                    {/* Semi-transparent tint to wash out details & guarantee high text readability */}
                    <div className="absolute inset-0 bg-white/75 backdrop-blur-[0.5px]" />
                    
                    {/* Shimmer */}
                    <div
                      className="absolute inset-0 rounded-lg opacity-[0.05] z-10"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(242,94,54,0.5) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'promoShimmer 3s ease-in-out infinite',
                      }}
                    />
                    
                    <span className="relative z-10 text-[11.5px] font-black text-slate-900 tracking-tight whitespace-nowrap transition-all duration-300">
                      {copied ? 'CODE COPIED!' : `${PROMO_DISCOUNT} OFF`}
                    </span>
                    <span className={`relative z-10 font-black tracking-wider text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap transition-all duration-300 ${
                      copied ? 'bg-emerald-600 text-white scale-105' : 'bg-orange-600 text-white'
                    }`}>
                      {PROMO_CODE}
                    </span>
                    <span className="relative z-10 hidden sm:inline w-px h-3.5 bg-slate-900/15" />
                    <span className="relative z-10 hidden sm:inline font-mono text-[10.5px] tabular-nums text-slate-800 font-extrabold whitespace-nowrap">
                      {pad(countdown.days)}d {pad(countdown.hours)}h {pad(countdown.minutes)}m
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-slate-600 flex-shrink-0">
              <Link href="/#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</Link>
              <Link href="/#features" className="hover:text-slate-900 transition-colors">Features</Link>
              {user && (
                <Link href="/dashboard" className="text-[#f25e36] hover:text-[#d94a24] transition-colors">Dashboard</Link>
              )}
              <Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link>
              <Link href="/#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            </div>
          </div>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            {loading ? (
              <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center gap-3 px-4 py-1.5 bg-white border border-slate-200/50 rounded-full">
                <span className="text-xs font-bold text-slate-700">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}</span>
                <div className="w-px h-3 bg-slate-200" />
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login?next=/dashboard"
                className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-lg hover:bg-[#ff4d29] hover:scale-105 active:scale-95 transition-all shadow-[0_2px_10px_rgba(249,115,22,0.15)]"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center font-bold flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <MaterialIcon name="close" size={24} className="text-slate-800" />
            ) : (
              <MaterialIcon name="menu" size={24} className="text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30 lg:hidden pointer-events-auto"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 z-40 lg:hidden pointer-events-auto"
            >
              <div className="bg-white/95 backdrop-blur-md border border-white/50 rounded-2xl p-6 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] mx-1">
                <div className="space-y-4">
                  <Link 
                    href="/#how-it-works" 
                    className="block text-base font-bold text-slate-800 hover:text-[#f25e36] transition-colors py-1.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How it Works
                  </Link>

                  <Link 
                    href="/#features" 
                    className="block text-base font-bold text-slate-800 hover:text-[#f25e36] transition-colors py-1.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  
                  {user && (
                    <Link 
                      href="/dashboard" 
                      className="block text-base font-bold text-[#f25e36] hover:text-[#d94a24] transition-colors py-1.5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    href="/tools" 
                    className="block text-base font-bold text-slate-800 hover:text-[#f25e36] transition-colors py-1.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tools
                  </Link>
                  
                  <Link 
                    href="/#pricing" 
                    className="block text-base font-bold text-slate-800 hover:text-[#f25e36] transition-colors py-1.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </div>
                
                <div className="pt-5 border-t border-slate-100">
                  {loading ? (
                    <div className="w-full h-12 bg-slate-50 animate-pulse rounded-full" />
                  ) : user ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-0.5 px-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full bg-slate-50 text-slate-700 border border-slate-200/50 text-sm font-bold px-6 py-3 rounded-full hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                      >
                        <MaterialIcon name="logout" size={16} />
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/login?next=/dashboard"
                      className="block w-full text-center bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-[#ff4d29] active:scale-95 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Promo animations */}
      <style jsx global>{`
        @keyframes promoShimmer {
          0%, 100% { background-position: -200% 0; }
          50% { background-position: 200% 0; }
        }
        @keyframes promoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </motion.div>
  );
};

export default Navbar;
