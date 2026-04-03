'use client';

import { motion } from 'framer-motion';
import { Lock, Activity, Clock, Bookmark, ExternalLink, Navigation, Map, Archive, SlidersHorizontal, Shield, Plus } from 'lucide-react';
import Image from 'next/image';

export default function DashboardDemo() {
  return (
    <div 
      onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      className="relative w-full max-w-6xl mx-auto mt-6 -translate-y-4 cursor-pointer select-none perspective-2000 group/demo"
      style={{ perspective: "2000px" }}
    >
      <motion.div 
        initial={{ rotateX: 12, scale: 0.95 }}
        whileInView={{ rotateX: 0, scale: 1 }}
        viewport={{ margin: "0px 0px -200px 0px" }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[2rem] md:rounded-[2.5rem] border border-white/10 p-1.5 md:p-2 text-left flex md:max-h-[620px] origin-top"
      >
        <div className="flex w-full rounded-[2rem] overflow-hidden bg-[#0f0f13] border border-white/10 relative">

        {/* ── SIDEBAR ── */}
        <div className="hidden md:flex flex-col w-[200px] flex-shrink-0 bg-transparent border-r border-white/5 p-5">
          {/* Brand */}
          <div className="mb-6">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#71717a] uppercase mb-4">Command Center</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center relative">
                <Image
                  src="/redleads-logo-white.webp" 
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
          <p className="text-[9px] font-black tracking-[0.15em] text-[#71717a] uppercase mb-3">Menu</p>
          <nav className="flex flex-col gap-0.5">
            <SidebarItem icon="navigation" label="Command Center" active />
            <SidebarItem icon="map" label="Guide" />
            <SidebarItem icon="archive" label="Leads Archive" />
            <SidebarItem icon="sliders" label="Tracking Setup" />
            <SidebarItem icon="shield" label="Billing &amp; Plan" />
          </nav>

        </div>

        {/* ── MAIN PANEL ── */}
        <div className="flex-1 min-w-0 overflow-hidden p-3 md:p-6 flex flex-col gap-4 md:gap-6 bg-transparent">

          {/* Power Search Container */}
          <motion.div 
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="bg-void border border-white/5 rounded-[1.25rem] md:rounded-[1.5rem] p-4 md:p-6 space-y-4 shadow-xl shadow-black/40 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            {/* Power Search */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ff3d00] shadow-[0_0_10px_rgba(255,61,0,0.8)] animate-pulse" />
                <span className="text-[9px] font-black tracking-[0.25em] text-[#a1a1aa] uppercase">Power Search</span>
              </div>

              {/* Search bar */}
              <motion.div 
                initial={{ borderColor: "rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0,0,0,0.4)" }}
                whileInView={{ 
                  borderColor: ["rgba(255, 255, 255, 0.1)", "rgba(255, 88, 54, 0.3)", "rgba(255, 255, 255, 0.1)"],
                  backgroundColor: ["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.4)"]
                }}
                transition={{ duration: 2.5, delay: 1.5, repeat: Infinity, repeatDelay: 1 }}
                className="flex items-center gap-4 border rounded-xl px-5 h-12 shadow-inner group transition-all"
              >
                <Lock size={14} className="text-[#52525b] group-focus-within:text-primary transition-colors" />
                <span className="flex-1 text-xs font-medium text-[#a1a1aa] tracking-tight">RedLeads.app</span>
                <button suppressHydrationWarning className="bg-[#ff5836] hover:bg-[#ff6900] text-[9px] font-black uppercase tracking-[0.15em] px-6 py-2 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 leading-none text-white whitespace-nowrap">
                  Power Search
                </button>
              </motion.div>
            </section>
          </motion.div>

          {/* Live Intelligence */}
          <section className="px-1 md:px-2 mt-2">
            <motion.div 
              initial={{ y: 15 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="flex items-start sm:items-center justify-between mb-4 md:mb-6 gap-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#ff3d00]/10 border border-[#ff3d00]/20">
                  <Activity size={14} className="text-[#ff3d00]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#71717a]">Automated</p>
                  <p className="text-base md:text-lg font-black text-[#f5f5f5] tracking-tighter">Live Intelligence</p>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#22c55e]/5 border border-[#22c55e]/10 rounded-full">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                <span className="text-[8px] md:text-[9px] font-black text-[#22c55e]/80 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">System Online</span>
              </div>
            </motion.div>

              {/* Cards */}
            <div className="flex flex-col gap-4 relative">
              <LiveCard
                subreddit="R/SAAS"
                time="21:20"
                matchLevel="HIGH MATCH"
                title="Does anyone has a solution for x problem?"
                delay={1.2}
              />
              <LiveCard
                subreddit="R/buildinpublic"
                time="21:20"
                matchLevel="MEDIUM MATCH"
                title="Does someone know a better alternative to Y?"
                delay={1.6}
              />
            </div>
          </section>

        </div>
      </div>
      </motion.div>
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
        : 'text-[#71717a] hover:text-[#e4e4e7] hover:bg-white/[0.04]'
    }`}>
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full shadow-[0_0_8px_rgba(255,88,54,0.5)]" />
      )}
      {IconComponent && <IconComponent size={14} className={active ? 'text-primary' : 'text-[#52525b] group-hover:text-[#a1a1aa]'} />}
      <span className={active ? 'tracking-wide' : ''}>{label}</span>
    </div>
  );
}

function LiveCard({ subreddit, time, matchLevel, title, delay = 0 }: { subreddit: string; time: string; matchLevel: string; title: string; delay?: number }) {
  const isHigh = matchLevel === "HIGH MATCH";
  return (
    <motion.div 
      initial={{ x: 20 }}
      whileInView={{ x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 150, damping: 20 }}
      whileHover={{ y: -2, transition: { duration: 0.2, delay: 0 } }}
      className="bg-void border border-white/5 rounded-[1rem] flex overflow-hidden hover:bg-white/[0.06] hover:border-white/10 transition-colors group shadow-lg relative"
    >
      {/* Left Column - Match Label */}
      <div className="w-20 flex-shrink-0 flex items-center justify-center bg-black/40 border-r border-white/5">
        <span className={`text-[7px] font-black uppercase tracking-[0.15em] px-1 text-center leading-tight ${
          isHigh ? 'text-primary' : 'text-[#71717a]'
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
          <button suppressHydrationWarning className="flex items-center gap-2 bg-[#ff5836] hover:bg-[#ff6900] text-white text-[8px] font-black uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-lg transition-all transform hover:translate-y-[-1px] active:translate-y-[1px]">
            <Plus size={10} className="text-white" />
            Draft Reply
          </button>
          <button suppressHydrationWarning className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/5 bg-white/[0.03] text-[#71717a] hover:text-white hover:border-white/20 transition-all hover:bg-white/[0.08]">
            <Bookmark size={12} />
          </button>
          <button suppressHydrationWarning className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/5 bg-white/[0.03] text-[#71717a] hover:text-white hover:border-white/20 transition-all hover:bg-white/[0.08]">
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
