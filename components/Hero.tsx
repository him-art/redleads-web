'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Globe, CheckCircle2, Zap, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

export default function Hero({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    let domain = urlInput.trim().toLowerCase();
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    
    setIsScanning(true);
    
    if (user) {
      router.push(`/dashboard?search=${encodeURIComponent(domain)}`);
    } else {
      router.push(`/login?next=/dashboard&search=${encodeURIComponent(domain)}`);
    }
  };

  return (
    <div className="relative min-h-[100vh] overflow-hidden bg-[#1a1a1a] selection:bg-orange-500/30">
      {/* Flattened Background - No Gradients */}
      <div className="absolute inset-0 bg-[#1a1a1a]" />

      {/* Floating Elements - Hidden on mobile, visible on large screens */}
      <div className="absolute inset-0 max-w-[1800px] mx-auto pointer-events-none overflow-hidden z-0">
         {/* Left Side */}
         <FloatingBubble className="top-[15%] left-[5%] xl:left-[8%]" delay={0} duration={3.2} floatDelay={0} />
         <FloatingBubble className="top-[32%] left-[2%] xl:left-[4%]" delay={1.5} scale={1.1} duration={3.8} floatDelay={1.2} />
         <FloatingBubble className="top-[50%] left-[8%] xl:left-[10%]" delay={0.8} duration={3.5} floatDelay={0.5} />

         {/* Right Side */}
         <FloatingBubble className="top-[18%] right-[5%] xl:right-[8%]" delay={0.5} scale={1.05} duration={3.4} floatDelay={0.8} />
         <FloatingBubble className="top-[35%] right-[2%] xl:right-[4%]" delay={2} duration={3.9} floatDelay={1.5} />
         <FloatingBubble className="top-[55%] right-[7%] xl:right-[10%]" delay={1.2} scale={0.95} duration={3.3} floatDelay={0.2} />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-0 md:pt-40 md:pb-0 flex flex-col items-center text-center">
      

        {/* Main Headline - Serif & Minimal */}
        <h1 
          className="max-w-[100vw] xl:max-w-none mx-auto text-[1.75rem] sm:text-[2.75rem] md:text-[5rem] lg:text-[7rem] font-medium text-[#f5f5f5] mb-8 leading-[1.05] px-4 font-serif"
        >
          {/* Forced three lines for branding presence */}
          <span className="block text-[#ff914d] text-lg md:text-0.1xl font-black uppercase tracking-[0.4em] mb-4 font-sans">
            RedLeads
          </span>
          <span className="flex flex-wrap items-center font-medium justify-center gap-x-3 sm:gap-x-6 sm:whitespace-nowrap">
            <span>Find your</span>
            <span className="text-[#ff6900] font-bold font-medium">first 100 users</span>
          </span>
          <span className="block font-medium sm:whitespace-nowrap">
            <span>on Reddit</span>
          </span>
        </h1>

        {/* Subheadline - Clean Sans */}
        <p 
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-medium"
        >
          Stop manual searching. RedLeads uses AI intent scoring to monitor millions of discussions 24/7, delivering warm buyers straight to your inbox.
        </p>

        {/* Search/CTA Component - Card Style */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="w-full max-w-xl mx-auto mb-12"
        >
          <div className="p-2 bg-white/5 border border-[#ff914d]/10 rounded-2xl">
            <form 
              onSubmit={handleSearch}
              className="relative flex items-center bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-[#ff914d]/30"
            >
              <div className="pl-4 pr-3 text-slate-500">
                <Globe size={20} />
              </div>
              
              <input 
                name="website-url"
                type="text" 
                placeholder="yourwebsite.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                suppressHydrationWarning
                className="flex-1 bg-transparent border-none text-lg text-white placeholder:text-slate-600 focus:ring-0 focus:outline-none h-12 w-full font-light"
              />
              
              <button 
                suppressHydrationWarning
                type="submit"
                disabled={isScanning}
                className={`m-1 px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-80 ${
                  isScanning 
                    ? 'bg-[#ff914d] text-white' 
                    : 'bg-white text-black hover:bg-slate-200'
                }`}
              >
                {isScanning ? (
                  <>
                    Scanning...
                  </>
                ) : (
                  <>
                    Start Free <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 className="w-3 h-3" /> No Card Required
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 className="w-3 h-3" /> 3-Day Free Trial
             </div>
          </div>
        </motion.div>

        {/* Product Visual - Static Demo */}
        <div
           className="relative w-full max-w-5xl mx-auto mt-0 md:mt-0 pointer-events-none select-none"
        >
            <div className="relative rounded-t-[2rem] border-x-2 border-t-2 border-b-0 border-[#ff914d]/20 bg-[#050505] overflow-hidden shadow-2xl p-6 md:p-10 text-left">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff914d]/5 rounded-full blur-[100px] pointer-events-none" />



                {/* Header: Power Scan */}
                <div className="relative flex items-center gap-3 mb-8 md:mb-12">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff914d] shadow-[0_0_10px_rgba(255,145,77,0.5)]"></span>
                    </div>
                    <span className="text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase">Power Scan</span>
                </div>

                {/* Search Bar */}
                <div className="relative w-full bg-[#F0F4FF] rounded-2xl h-16 md:h-20 flex items-center justify-between pl-6 pr-2 mb-12 md:mb-16 shadow-[0_0_60px_-15px_rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-4">
                        <Globe className="text-[#ff914d]" size={24} strokeWidth={2} />
                        <span className="text-xl md:text-2xl font-bold text-black tracking-tight">RedLeads.app</span>
                    </div>
                    <button 
                        suppressHydrationWarning
                        className="bg-[#ff914d] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-6 md:px-8 py-3 md:py-4 rounded-xl"
                    >
                        Scan
                    </button>
                </div>

                {/* Results Header */}
                <div className="relative mb-8">
                   <div className="flex items-center gap-3 mb-2">
                       <Search className="text-[#ff914d]" size={22} strokeWidth={3} />
                       <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                           Intel Report: <span className="text-white">18 Matches</span>
                       </h3>
                   </div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] pl-0.5">
                       High-Intent Conversations Identified
                   </p>
                </div>

                {/* Relevancy Section */}
                <div className="relative mb-5 flex items-center gap-2 text-gray-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#444]">High Relevancy • 8</span>
                </div>

                {/* Grid */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DemoCard 
                        subreddit="b2bmarketing" 
                        title="Reddit > LinkedIn for high-intent B2B leads in 2026 (if you know where to look)"
                        matchScore="High Match"
                    />
                    <DemoCard 
                        subreddit="webmarketing" 
                        title="5 Best Reddit Tools for Lead Generation in 2026"
                         matchScore="High Match"
                    />
                    <DemoCard 
                        subreddit="SaaS" 
                        title="The 10 Best Reddit Marketing Tools for SaaS Growth in 2026"
                         matchScore="High Match"
                    />
                     <DemoCard 
                        subreddit="Entrepreneur" 
                        title="I am trying to find leads for AI lead qualifying, but standard tools aren't working."
                         matchScore="High Match"
                    />
                     <DemoCard 
                        subreddit="AI_Sales" 
                        title="How AI is Transforming Lead Generation, What Actually Works?"
                         matchScore="High Match"
                    />
                     <DemoCard 
                        subreddit="SaaS" 
                        title="Best Reddit marketing tools in 2025 - what's actually legit?"
                         matchScore="High Match"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function DemoCard({ subreddit, title, matchScore }: { subreddit: string, title: string, matchScore: string }) {
  return (
    <div className="relative bg-[#111] border border-white/5 rounded-2xl p-5">
       <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#33180b] text-[#ff7826] border border-[#52250d] px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider">
             r/{subreddit}
          </span>
          <span className="bg-[#0b2413] text-[#2ebd59] border border-[#0f3b1e] px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider">
             {matchScore}
          </span>
       </div>
       
       <h4 className="text-sm font-bold text-gray-200 leading-snug pr-6">
          {title}
       </h4>
    </div>
  );
}

function FloatingBubble({ className, delay = 0, scale = 1, duration = 3, floatDelay = 0 }: { className?: string, delay?: number, scale?: number, duration?: number, floatDelay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -15, 0] }}
      transition={{ 
        opacity: { duration: 1, delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay: floatDelay } 
      }}
      className={`absolute hidden xl:flex items-center gap-3 p-3 bg-white/7 border border-white/5 rounded-full w-[180px] shadow-xl shadow-black/5 ${className}`}
      style={{ scale }}
    >
      <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center flex-shrink-0 overflow-hidden">
           <Image 
             src="/reddit-new-logo.png" 
             alt="Reddit" 
             width={32} 
             height={32} 
             priority
             className="w-full h-full object-contain"
           />
      </div>
      <div className="flex-1 space-y-2">
         <div className="h-1.5 bg-slate-200 rounded-full w-3/4" />
         <div className="h-1.5 bg-slate-100 rounded-full w-1/2" />
      </div>
    </motion.div>
  );
}
