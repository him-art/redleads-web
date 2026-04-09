'use client';

import React from 'react';
import Link from 'next/link';

export const TOP_SUBREDDITS = [
  { name: 'r/SaaS', slug: '/solutions/b2b-saas/saas' },
  { name: 'r/LocalLlama', slug: '/solutions/ai-wrappers/localllama' },
  { name: 'r/Entrepreneur', slug: '/solutions/business/entrepreneur' },
  { name: 'r/Marketing', slug: '/solutions/agencies/marketing' },
  { name: 'r/SideProject', slug: '/solutions/indie-hackers/sideproject' },
  { name: 'r/WebDev', slug: '/solutions/b2b-saas/webdev' },
  { name: 'r/MachineLearning', slug: '/solutions/ai-wrappers/machinelearning' },
  { name: 'r/Startups', slug: '/solutions/b2b-saas/startups' },
  { name: 'r/Sales', slug: '/solutions/agencies/sales' },
  { name: 'r/iOSProgramming', slug: '/solutions/mobile-apps/iosprogramming' },
  { name: 'r/SEO', slug: '/solutions/agencies/seo' },
];

const NichePills = () => {
  return (
    <section className="py-24 border-y border-white/5 bg-black/40 overflow-hidden relative">
      {/* Gradient fades for the edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-10 text-center">
        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">
          Target precise high-intent communities
        </h3>
      </div>
      
      <div className="flex w-[200%] md:w-[150%] animate-ticker-left">
        <div className="flex shrink-0 gap-4 px-4 w-1/2 justify-around">
          {TOP_SUBREDDITS.map((sub, i) => (
            <Link 
              key={`first-${i}`}
              href={sub.slug}
              className="px-6 py-3 rounded-full bg-[#1a1a1a] border border-white/5 hover:border-orange-500/50 hover:bg-orange-500/5 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap block"
            >
              {sub.name}
            </Link>
          ))}
        </div>
        <div className="flex shrink-0 gap-4 px-4 w-1/2 justify-around">
          {TOP_SUBREDDITS.map((sub, i) => (
            <Link 
              key={`second-${i}`}
              href={sub.slug}
              className="px-6 py-3 rounded-full bg-[#1a1a1a] border border-white/5 hover:border-orange-500/50 hover:bg-orange-500/5 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap block"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NichePills;
