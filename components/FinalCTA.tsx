"use client";

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WaitlistCTA = () => {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#1a1a1a] py-24 border-t border-white/5">
      {/* Abstract Background Patterns */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 p-32 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full bg-orange-500/10 p-32 blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-[2.5rem] sm:text-[3.5rem] font-black text-white leading-tight">
          Stop Wasting Hours on Reddit.<br /><span className="text-orange-500 italic font-serif font-light">Start Finding Customers Today.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Join 100+ founders using RedLeads to turn social conversations into growth. Start your 3-day full access trial now.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-4 font-semibold text-white shadow-xl shadow-amber-900/20 transition-all hover:bg-amber-700 hover:scale-105 sm:w-auto"
          >
            Get started for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WaitlistCTA;