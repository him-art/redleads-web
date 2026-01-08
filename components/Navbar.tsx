'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 sm:top-8 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8">
        {/* Left: RedLeads Brand */}
        <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/50 backdrop-blur-xl border border-white/40 rounded-full shadow-lg shadow-black/5 hover:bg-white/70 transition-all duration-300">
          <span className="text-base sm:text-lg font-extrabold tracking-tighter text-slate-800">
            RedLeads.
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 px-6 py-3 bg-white/50 backdrop-blur-xl border border-white/40 rounded-full shadow-lg shadow-black/5 hover:bg-white/70 transition-all duration-300">
          <div className="flex gap-6 text-sm font-semibold text-slate-800">
            <Link href="#features" className="hover:text-amber-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-amber-600 transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-amber-600 transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-amber-600 transition-colors">FAQ</Link>
          </div>
          
          <Link 
            href="#waitlist" 
            className="bg-[#f25e36] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#d94a24] hover:scale-105 active:scale-95 transition-all shadow-md shadow-orange-500/20"
          >
            Get Leads
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
              href="#features" 
              className="block text-base font-semibold text-slate-800 hover:text-amber-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="block text-base font-semibold text-slate-800 hover:text-amber-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="#pricing" 
              className="block text-base font-semibold text-slate-800 hover:text-amber-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
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
                href="#waitlist" 
                className="block w-full text-center bg-[#f25e36] text-white text-base font-bold px-6 py-3 rounded-full hover:bg-[#d94a24] active:scale-95 transition-all shadow-md shadow-orange-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Leads
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