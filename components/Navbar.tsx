'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { type User as SupabaseUser } from '@supabase/supabase-js';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 pointer-events-none">
        {/* Left: RedLeads Brand */}
        <Link 
          href="/"
          className="px-6 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-black/5 hover:scale-[1.02] transition-all duration-300 pointer-events-auto flex items-center"
        >
          <span className="text-xl font-extrabold tracking-tighter text-slate-900">
            RedLeads.
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 px-8 py-3 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-2xl shadow-black/5 pointer-events-auto">
          <div className="flex gap-8 text-sm font-bold text-slate-600">
            <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</Link>
            <Link href="/scanner" className="hover:text-[#f25e36] transition-colors flex items-center gap-1.5">
              Free Scanner
              <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/10 text-[#f25e36] rounded-md border border-orange-500/20 uppercase tracking-tighter">Beta</span>
            </Link>
            <Link href="#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {user.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-6 h-6 rounded-full" />
                ) : (
                  <User size={16} className="text-slate-600" />
                )}
                <span className="text-xs font-bold text-slate-700">{user.user_metadata.full_name || user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-[#f25e36] text-white text-sm font-bold px-6 py-2.5 rounded-2xl hover:bg-[#d94a24] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 sm:p-3 bg-white/50 backdrop-blur-xl border border-white/40 rounded-full shadow-lg shadow-black/5 hover:bg-white/70 transition-all duration-300"
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
      {isMenuOpen && (
        <div className="fixed top-20 sm:top-24 left-4 right-4 z-40 lg:hidden">
          <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-black/10 p-6 space-y-4">
            
            <Link 
              href="#how-it-works" 
              className="block text-base font-semibold text-slate-800 hover:text-amber-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            
            <Link 
              href="/scanner" 
              className="flex items-center gap-2 text-base font-semibold text-slate-800 hover:text-amber-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Free Scanner
              <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/10 text-[#f25e36] rounded-md border border-orange-500/20 uppercase tracking-tighter">Beta</span>
            </Link>
            
            <Link 
              href="#faq" 
              className="block text-base font-semibold text-slate-800 hover:text-amber-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            
            <div className="pt-4 border-t border-slate-200">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.user_metadata.full_name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-center bg-slate-100 text-slate-700 text-base font-bold px-6 py-3 rounded-full hover:bg-slate-200 transition-all"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="block w-full text-center bg-[#f25e36] text-white text-base font-bold px-6 py-3 rounded-full hover:bg-[#d94a24] active:scale-95 transition-all shadow-md shadow-orange-500/20"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;