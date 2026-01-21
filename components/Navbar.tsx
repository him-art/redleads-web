'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
          </div>
          
          <Link 
            href="https://tally.so/r/7RK9g0"
            className="bg-[#f25e36] text-white text-sm font-bold px-6 py-2.5 rounded-2xl hover:bg-[#d94a24] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
          >
            Get Started
          </Link>
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
              href="#faq" 
              className="block text-base font-semibold text-slate-800 hover:text-amber-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            
            <div className="pt-4 border-t border-slate-200">
              <Link 
                href="https://tally.so/r/7RK9g0"
                className="block w-full text-center bg-[#f25e36] text-white text-base font-bold px-6 py-3 rounded-full hover:bg-[#d94a24] active:scale-95 transition-all shadow-md shadow-orange-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
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