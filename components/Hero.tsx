'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, CheckCircle2, Lock, Search, ChevronRight, Activity, Clock, PenLine, Bookmark, ExternalLink, Navigation, Map, Archive, SlidersHorizontal, Shield, Plus } from 'lucide-react';
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
         <FloatingBubble className="top-[18%] left-[5%] xl:left-[8%]" delay={0} duration={3.2} floatDelay={0} />
         <FloatingBubble className="top-[28%] left-[2%] xl:left-[4%]" delay={1.5} scale={1.1} duration={3.8} floatDelay={1.2} />
         <FloatingBubble className="top-[38%] left-[8%] xl:left-[10%]" delay={0.8} duration={3.5} floatDelay={0.5} />

         {/* Right Side */}
         <FloatingBubble className="top-[20%] right-[5%] xl:right-[8%]" delay={0.5} scale={1.05} duration={3.4} floatDelay={0.8} />
         <FloatingBubble className="top-[30%] right-[2%] xl:right-[4%]" delay={2} duration={3.9} floatDelay={1.5} />
         <FloatingBubble className="top-[40%] right-[7%] xl:right-[10%]" delay={1.2} scale={0.95} duration={3.3} floatDelay={0.2} />
         </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-0 md:pt-27 md:pb-0 flex flex-col items-center text-center">
      

        {/* Main Headline - Serif & Minimal */}
        <h1 
          className="max-w-[100vw] xl:max-w-none mx-auto text-[1.75rem] sm:text-[2.75rem] md:text-[5rem] lg:text-[7rem] font-medium text-[#f5f5f5] mb-8 leading-[1.05] px-4 font-serif"
        >
          {/* Forced three lines for branding presence */}
        
          <span className="flex flex-wrap items-center font-medium justify-center gap-x-3 sm:gap-x-6 sm:whitespace-nowrap">
            <span>Get Your</span>
            <span className="text-orange-500 font-serif-italic">First 100 Users</span>
          </span>
          <span className="block font-medium sm:whitespace-nowrap">
            <span>From Reddit</span>
          </span>
        </h1>

        {/* Subheadline - Clean Sans */}
        <p 
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-medium"
        >
          Save hours of manual searching. RedLeads uses AI intent scoring to monitor millions of discussions 24/7, delivering warm buyers straight to your inbox.
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
              <div className="pl-4 pr-3 text-slate-500 flex items-center">
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
                <CheckCircle2 size={12} /> No Card Required
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 size={12} /> 3-Day Free Trial
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 size={12} /> For SaaS Founders
             </div>
          </div>
        </motion.div>

        {/* Sneak Peek Dashboard Demo */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          className="relative w-full max-w-6xl mx-auto mt-6 -translate-y-4 cursor-pointer select-none perspective-2000 group/demo"
          style={{ perspective: "2000px" }}
        >
          <motion.div 
            initial={{ rotateX: 12, scale: 0.95 }}
            whileInView={{ rotateX: 0, scale: 1 }}
            viewport={{ margin: "0px 0px -200px 0px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl border border-white/5 bg-white/5 p-2 text-left flex max-h-[620px] origin-top"
          >
            <div className="flex w-full rounded-xl overflow-hidden bg-[#080808] border border-white/5">

            {/* ── SIDEBAR ── */}
            <div className="hidden md:flex flex-col w-[200px] flex-shrink-0 bg-[#0e0e0e] border-r border-white/5 p-5">
              {/* Brand */}
              <div className="mb-6">
                <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-4">Command Center</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 flex items-center justify-center relative">
                    <Image
                      src="/redleads-logo-white.png" 
                      alt="RedLeads Logo" 
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white font-black text-[12px] leading-none tracking-tight">RedLeads</p>
                    <p className="text-primary text-[8px] font-medium uppercase tracking-[0.2em] mt-0.5 opacity-90">Intelligence</p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <p className="text-[9px] font-black tracking-[0.15em] text-[#444] uppercase mb-3">Menu</p>
              <nav className="flex flex-col gap-0.5">
                <SidebarItem icon="navigation" label="Command Center" active />
                <SidebarItem icon="map" label="Guide" />
                <SidebarItem icon="archive" label="Leads Archive" />
                <SidebarItem icon="sliders" label="Tracking Setup" />
                <SidebarItem icon="shield" label="Billing &amp; Plan" />
              </nav>

            </div>

            {/* ── MAIN PANEL ── */}
            <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6 bg-[#080808]">

              {/* Power Search Container */}
              <div className="bg-[#0c0c0c] border border-white/5 rounded-[1.5rem] p-6 space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                {/* Power Search */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ff3d00] shadow-[0_0_10px_rgba(255,61,0,0.8)] animate-pulse" />
                    <span className="text-[9px] font-black tracking-[0.25em] text-[#555] uppercase">Power Search</span>
                  </div>

                  {/* Search bar */}
                  <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-xl px-5 h-12 group focus-within:border-primary/20 transition-all shadow-inner">
                    <Lock size={14} className="text-[#333] group-focus-within:text-primary transition-colors" />
                    <span className="flex-1 text-xs font-medium text-[#777] tracking-tight">RedLeads.app</span>
                    <button suppressHydrationWarning className="bg-[#ff5836] hover:bg-[#ff6900] text-[9px] font-black uppercase tracking-[0.15em] px-6 py-2 rounded-lg shadow-[0_6px_16px_rgba(255,88,54,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 leading-none text-white whitespace-nowrap">
                      Power Search
                    </button>
                  </div>
                </section>
              </div>

              {/* Live Intelligence */}
              <section className="px-2 mt-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#ff3d00]/10 border border-[#ff3d00]/20">
                      <Activity size={16} className="text-[#ff3d00]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#444]">Automated</p>
                      <p className="text-lg font-black text-white tracking-tighter">Live Intelligence</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#22c55e]/5 border border-[#22c55e]/10 rounded-full">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                    <span className="text-[9px] font-black text-[#22c55e]/80 uppercase tracking-[0.2em]">System Online</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-4">
                  <LiveCard
                    subreddit="R/SAAS"
                    time="21:20"
                    matchLevel="HIGH MATCH"
                    title="Does anyone has a solution for x problem?"
                  />
                  <LiveCard
                    subreddit="R/buildinpublic"
                    time="21:20"
                    matchLevel="MEDIUM MATCH"
                    title="Does someone know a better alternative to Y?"
                  />
                </div>
              </section>

            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  const IconComponent = {
    "navigation": Navigation,
    "map": Map,
    "archive": Archive,
    "sliders": SlidersHorizontal,
    "shield": Shield,
  }[icon];

  return (
    <div className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all group ${
      active 
        ? 'bg-white/[0.08] text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/5' 
        : 'text-[#666] hover:text-[#aaa] hover:bg-white/[0.02]'
    }`}>
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full shadow-[0_0_8px_rgba(255,88,54,0.5)]" />
      )}
      {IconComponent && <IconComponent size={14} className={active ? 'text-primary' : 'text-[#444] group-hover:text-[#666]'} />}
      <span className={active ? 'tracking-wide' : ''}>{label}</span>
    </div>
  );
}

function LiveCard({ subreddit, time, matchLevel, title }: { subreddit: string; time: string; matchLevel: string; title: string }) {
  const isHigh = matchLevel === "HIGH MATCH";
  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[1rem] flex overflow-hidden hover:bg-white/[0.03] transition-all group shadow-xl relative">
      {/* Left Column - Match Label */}
      <div className="w-20 flex-shrink-0 flex items-center justify-center bg-black/40 border-r border-white/5">
        <span className={`text-[7px] font-black uppercase tracking-[0.15em] px-1 text-center leading-tight ${
          isHigh ? 'text-primary' : 'text-[#444]'
        }`}>
          {matchLevel.split(' ')[0]}<br/>{matchLevel.split(' ')[1]}
        </span>
      </div>
      
      {/* Right Column - Content */}
      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.15em]">{subreddit}</span>
          </div>
          <div className="flex items-center gap-2 text-[8px] font-black text-text-secondary opacity-30 uppercase tracking-widest leading-none">
            <Clock size={10} className="mt-[-1px]" />
            {time}
          </div>
        </div>
        
        <p className="text-[13px] font-black text-white tracking-tight leading-[1.4] opacity-90">
          {title}
        </p>
        
        <div className="flex items-center gap-3 pt-0.5">
          <button suppressHydrationWarning className="flex items-center gap-2 bg-[#ff5836] hover:bg-[#ff6900] text-white text-[8px] font-black uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-lg shadow-[0_4px_12px_rgba(255,88,54,0.3)] transition-all transform hover:translate-y-[-1px] active:translate-y-[1px]">
            <Plus size={10} className="text-white" />
            Draft Reply
          </button>
          <button suppressHydrationWarning className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/5 bg-white/[0.03] text-[#444] hover:text-text-primary hover:border-white/10 transition-all">
            <Bookmark size={12} />
          </button>
          <button suppressHydrationWarning className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/5 bg-white/[0.03] text-[#444] hover:text-text-primary hover:border-white/10 transition-all">
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
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
      className={`absolute hidden xl:flex items-center gap-2 p-2 bg-white/7 border border-white/5 rounded-full w-[140px] shadow-xl shadow-black/5 ${className}`}
      style={{ scale }}
    >
      <div className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center flex-shrink-0 overflow-hidden">
           <Image 
             src="/reddit-new-logo.png" 
             alt="Reddit" 
             width={24} 
             height={24} 
             priority
             className="w-full h-full object-contain"
           />
      </div>
      <div className="flex-1 space-y-1">
         <div className="h-1 bg-slate-200 rounded-full w-3/4" />
         <div className="h-1 bg-slate-100 rounded-full w-1/2" />
      </div>
    </motion.div>
  );
}
