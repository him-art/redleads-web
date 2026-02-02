'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error('Navbar session check error:', err);
      } finally {
        setLoading(false);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Force a full page reload to clear any server-side state/cookies ensuring a clean logout
    window.location.href = '/';
  };

  return (
    <>
      <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-12 pointer-events-none">
        {/* Left: RedLeads Brand */}
        <Link 
          href="/"
          className="px-5 sm:px-6 py-2 sm:py-2.5 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-xl shadow-black/5 hover:scale-[1.02] transition-all duration-300 pointer-events-auto flex items-center"
        >
          <span className="text-lg sm:text-xl font-extrabold tracking-tighter text-slate-900">
            RedLeads.
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 px-8 py-3 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-2xl shadow-black/5 pointer-events-auto">
          <div className="flex gap-8 text-sm font-bold text-slate-600">
            <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</Link>
            {user && (
              <Link href="/dashboard" className="text-[#f25e36] hover:text-[#d94a24] transition-colors">Dashboard</Link>
            )}
            <Link href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
          </div>
          
          {loading ? (
            <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-lg shadow-black/5">
              <span className="text-xs font-bold text-slate-700">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}</span>
              <div className="w-px h-3 bg-slate-200 mx-1" />
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#f25e36] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#d94a24] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2.5 sm:p-3 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-lg shadow-black/5 hover:bg-white/90 transition-all duration-300 pointer-events-auto"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-20 sm:top-24 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-white/95 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl shadow-black/20 p-6 sm:p-8 space-y-6">
                
                <div className="space-y-4">
                  <Link 
                    href="#how-it-works" 
                    className="block text-lg font-bold text-slate-800 hover:text-[#f25e36] transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How it Works
                  </Link>
                  
                  {user && (
                    <Link 
                      href="/dashboard" 
                      className="block text-lg font-bold text-[#f25e36] hover:text-[#d94a24] transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    href="#pricing" 
                    className="block text-lg font-bold text-slate-800 hover:text-[#f25e36] transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  
                  <Link 
                    href="#faq" 
                    className="block text-lg font-bold text-slate-800 hover:text-[#f25e36] transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  {loading ? (
                    <div className="w-full h-14 bg-slate-50 animate-pulse rounded-full" />
                  ) : user ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1 px-1">
                        <p className="text-sm text-slate-400 font-medium">Signed in as</p>
                        <p className="text-base font-bold text-slate-900 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full bg-slate-100 text-slate-700 text-base font-bold px-6 py-4 rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut size={18} />
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/login"
                      className="block w-full text-center bg-[#f25e36] text-white text-lg font-bold px-6 py-4 rounded-full hover:bg-[#d94a24] active:scale-95 transition-all shadow-xl shadow-orange-500/30"
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
    </>
  );
};

export default Navbar;