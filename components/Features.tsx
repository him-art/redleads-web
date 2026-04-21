'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Target, Inbox, Zap, Search, Sparkles, Bookmark as BookmarkIcon, MessageSquarePlus, ExternalLink, Clock, Copy, RefreshCw, X, Globe, Calendar, ChevronRight, Check, ArrowRight } from 'lucide-react';

const features = [
  {
    id: 'scoring',
    icon: Target,
    title: "AI-Powered Scoring",
    description: "Know instantly which posts have buyers ready to act, skip the noise, focus on the money.",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    id: 'inbox',
    icon: Inbox,
    title: "Daily Inbox",
    description: "Wake up to a curated list of warm leads, scored and ready to engage, before your competitors see them.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: 'monitoring',
    icon: Zap,
    title: "Real-time Monitoring",
    description: "Be the first to reply to high-intent posts. Speed wins on Reddit — early replies get the most visibility.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    id: 'seo',
    icon: Search,
    title: "SEO Opportunities",
    description: "Find Reddit posts ranked on Google's first page — reply once, get traffic and customers for months.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    id: 'replies',
    icon: Sparkles,
    title: "AI Reply Suggestions",
    description: "Never stare at a blank reply box. Get 3 tailored, non-spammy reply drafts in one click.",
    color: "text-orange-400",
    bg: "bg-orange-400/10"
  },
  {
    id: 'save',
    icon: BookmarkIcon,
    title: "Save & Organize",
    description: "Save hot leads and track your outreach pipeline. Never lose a warm conversation again.",
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
];

const LeadPreview = () => (
  <div className="relative z-10 bg-void border border-white/5 rounded-2xl p-8 transition-transform duration-500 group-hover:scale-[1.02] w-full h-full flex flex-col justify-center">
    <div className="flex items-start gap-4 mb-6">
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shrink-0">
        <span className="text-[8px] font-black uppercase tracking-wider">Medium</span>
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <Image src="/reddit-logo.webp" alt="Reddit" width={24} height={24} />
        </div>
          <span className="text-xs font-bold text-gray-400">r/SaaS</span>
          <span className="text-xs text-gray-600">|</span>
          <span className="text-xs text-gray-600">Dec 9, 2025</span>
        </div>
        <h4 className="text-lg font-bold text-white leading-tight">
          How We Built Backlinks for Our SaaS Business
        </h4>
      </div>
    </div>
    
    <p className="text-[13px] text-gray-500 leading-relaxed mb-6 line-clamp-2">
      Most SaaS founders wait until they have time for marketing or wait another 6-9 months waiting for SEO to kick in. We flipped that...
    </p>

    <div className="flex items-center gap-3">
      <button 
        suppressHydrationWarning
        className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-primary hover:bg-[#ff6900] text-white text-[11px] font-black uppercase tracking-widest transition-all transform hover:-translate-y-[1px] active:scale-95 shadow-[0_0_15px_rgba(255,88,54,0.3)] hover:shadow-[0_0_25px_rgba(255,88,54,0.5)]"
      >
        <MessageSquarePlus size={16} />
        DRAFT REPLY
      </button>
      <button 
        suppressHydrationWarning
        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all hover:bg-white/10 active:scale-95"
      >
        <BookmarkIcon size={18} />
      </button>
      <button 
        suppressHydrationWarning
        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all hover:bg-white/10 active:scale-95"
      >
        <ExternalLink size={18} />
      </button>
    </div>
  </div>
);

const InboxPreview = () => (
  <div className="relative z-10 w-full h-full flex flex-col justify-center space-y-4">
    {[1, 10, 4, 10, 6].map((count, i) => (
      <div 
        key={i} 
        className="flex items-center justify-between p-4 rounded-xl bg-[#0f0f13] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-colors group/item"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-wider flex-shrink-0">
            Delivered
          </div>
          <span className="text-sm font-bold text-white/90 truncate">
            Daily Intelligence: {count} Top Opportunities
          </span>
        </div>
        <Target size={16} className="text-primary opacity-60 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    ))}
  </div>
);

const MonitoringPreview = () => (
  <div className="relative z-10 w-full h-full flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          <Zap size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none mb-1">AUTOMATED</p>
          <h4 className="text-xl font-black text-white leading-none">Live Intelligence</h4>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-tighter text-green-500">SYSTEM ONLINE</span>
      </div>
    </div>

    {/* Feed */}
    <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
      {[
        { sub: "AUTOMATION", time: "00:06", title: "Who has worked with python and playwright for automating lead generation for red dit" },
        { sub: "SIDEPROJECT", time: "00:00", title: "I'm not looking for anything, just your feedback..." },
        { sub: "ENTREPRENEURS", time: "23:21", title: "Looking for the Best Digital Marketing Agency in Hyderabad – Any Recommendations?" },
        { sub: "SOLOPRENEUR", time: "23:21", title: "Hire Me: to Fix Your Lead Generation System and Help You Close More Deals" },
        { sub: "MARKETINGAUTOMATION", time: "23:21", title: "How do you use Ai in insta to grow your agency 10 times more?" }
      ].map((item, i) => (
        <div key={i} className="p-5 rounded-2xl bg-[#0f0f13] border border-white/5 space-y-4 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
               <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">MEDIUM MATCH</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/80">R/{item.sub}</span>
               <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600">
                 <Clock size={10} />
                 {item.time}
               </div>
             </div>
          </div>
          <p className="text-sm font-bold text-white leading-tight">
            {item.title}
          </p>
          <div className="flex items-center gap-3">
            <button 
              suppressHydrationWarning
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-primary hover:bg-[#ff6900] text-white text-[11px] font-black uppercase tracking-widest transition-all transform hover:-translate-y-[1px] active:scale-95 shadow-[0_0_15px_rgba(255,88,54,0.3)] hover:shadow-[0_0_25px_rgba(255,88,54,0.5)]"
            >
              <MessageSquarePlus size={16} />
              DRAFT REPLY
            </button>
            <button 
              suppressHydrationWarning
              className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all hover:bg-white/10 active:scale-95"
            >
              <BookmarkIcon size={18} />
            </button>
            <button 
              suppressHydrationWarning
              className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all hover:bg-white/10 active:scale-95"
            >
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AIRepliesPreview = () => {
  return (
    <div className="relative z-10 w-full h-full flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-lg font-black text-white leading-none mb-1 tracking-tight">AI INTELLIGENCE</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">DRAFTING RESPONSE</p>
          </div>
        </div>
        <X size={20} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Post Context */}
      <div className="mb-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-orange-500" />
            <h5 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">INTELLIGENCE</h5>
          </div>
          <div className="flex items-center gap-4">
            <ExternalLink size={14} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
            <X size={14} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">POST CONTEXT</p>
          <p className="text-sm font-bold text-white/90 leading-snug">
            Who has worked with python and playwright for automating lead generation for red dit
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {[
          { 
            label: "THE FEEDBACK LOOP", 
            text: "i've also worked with python and playwright for automating lead gen, and i know how tricky it can be to find the right leads. i'm actually building a tool to help with that, and i'd love to get some feedback from people who have experience in this space. would you be interested in taking a look and sharing your thoughts?" 
          },
          { 
            label: "THE SIDEKICK", 
            text: "i had a similar problem with lead gen on reddit, so i started building a tool to help monitor subreddits and score leads. it's still a work in progress, but it's been a game changer for me. have you considered using ai to help with lead scoring?" 
          },
          { 
            label: "THE ANTI-TOOL", 
            text: "instead of spending hours writing custom scripts with playwright, i've found that using a dedicated tool can save a ton of time and effort. i've been using a simple lead gen tool that integrates with reddit, and it's been a huge help. would love to chat more about how you're currently handling lead gen and see if i can help." 
          }
        ].map((option, i) => (
          <div 
            key={i} 
            className="p-5 rounded-2xl bg-[#0f0f13] border border-white/5 relative group/reply hover:border-orange-500/30 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(255,88,54,0.1)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/reply:text-orange-500 transition-colors">
                {option.label}
              </span>
              <button 
                suppressHydrationWarning
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <Copy size={12} />
                COPY
              </button>
            </div>
            <p className="text-sm font-medium text-white/80 leading-relaxed italic">
              "{option.text}"
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">473 CREDITS LEFT</p>
        </div>
        <button 
          suppressHydrationWarning
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors group/regen"
        >
          <RefreshCw size={12} className="group-hover/regen:rotate-180 transition-transform duration-500 text-primary" />
          REGENERATE
        </button>
      </div>
    </div>
  );
};

const SEOPreview = () => (
  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
    <div className="mx-auto flex-1 w-full max-w-sm">
      <div className="w-full bg-[#0f0f13] border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl">
      {/* Search Bar */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
        <Globe size={16} className="text-gray-500" />
        <div className="flex-1 h-8 rounded-full bg-black/40 border border-white/5 flex items-center px-4">
          <span className="text-xs text-gray-400 font-medium tracking-tight">google.com</span>
        </div>
      </div>
      
      {/* Search Results */}
      <div className="p-8 space-y-8">
        <div className="space-y-2 opacity-50">
          <div className="h-3 w-1/4 bg-blue-500/20 rounded-full" />
          <div className="h-4 w-3/4 bg-blue-500/10 rounded-full" />
          <div className="h-3 w-1/2 bg-white/5 rounded-full" />
        </div>
        
        {/* Winning Result */}
        <div className="space-y-3 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 relative">
          <div className="absolute -left-2 top-6 w-1 h-12 bg-purple-500 rounded-full " />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <Image src="/reddit-logo.webp" alt="Reddit" width={20} height={20} />
            </div>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Ranking #1 on Google</span>
          </div>
          <h4 className="text-lg font-black text-blue-400 hover:underline cursor-pointer tracking-tight">
            How to market your SaaS on Reddit in 2025
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Reddit is the best place to find early adopters. Here's a 
            complete guide on how we scaled to $10k MRR...
          </p>
        </div>

        <div className="space-y-2 opacity-30">
          <div className="h-3 w-1/3 bg-blue-500/20 rounded-full" />
          <div className="h-4 w-2/3 bg-blue-500/10 rounded-full" />
        </div>
      </div>
    </div>
    </div>
  </div>
);

const SavePreview = () => (
  <div className="relative z-10 w-full h-full flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">LEAD HISTORY</h4>
      <div className="flex items-center p-1 rounded-xl bg-black border border-white/5">
        <button suppressHydrationWarning className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">ALL</button>
        <button suppressHydrationWarning className="px-4 py-1.5 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(255,88,54,0.3)]">
          <BookmarkIcon size={12} fill="currentColor" />
          SAVED
        </button>
      </div>
    </div>

    {/* Monitoring Status */}
    <div className="mb-6 p-6 rounded-[1.5rem] bg-[#0f0f13] border border-white/5 flex items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-bold text-white/90">Monitoring Active</span>
      </div>
      <div className="w-px h-4 bg-white/10" />
      <span className="text-xs font-bold text-gray-500">Focusing on <span className="text-white">6 keywords</span></span>
    </div>

    {/* History List */}
    <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
      {[
        { date: "WEDNESDAY, 18 FEBRUARY 2026", count: "3 LEADS" },
        { date: "MONDAY, 9 FEBRUARY 2026", count: "2 LEADS" },
        { date: "SUNDAY, 8 FEBRUARY 2026", count: "4 LEADS" },
        { date: "FRIDAY, 6 FEBRUARY 2026", count: "5 LEADS" }
      ].map((item, i) => (
        <div key={i} className="p-6 rounded-[1.5rem] bg-[#0f0f13] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-colors flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/10 group-hover:scale-105 transition-transform">
              <Calendar size={18} />
            </div>
            <div className="flex items-center gap-4">
              <h5 className="text-[11px] font-black text-white/90 uppercase tracking-widest">{item.date}</h5>
              <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black text-blue-400 border border-white/5 group-hover:bg-blue-500/10 transition-colors">{item.count}</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors group-hover:translate-x-1" />
        </div>
      ))}
    </div>
  </div>
);

const Features = () => {
  const [activeTab, setActiveTab] = useState('scoring');

  return (
    <section id="features" className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          
          <h2 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-6">
            The only <span className="text-orange-500 font-serif-italic">Reddit Marketing Tool</span> <br className="hidden md:block"/>you'll ever need
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-medium leading-relaxed opacity-80">
            RedLeads gives you all the tools to discover and engage with potential customers on Reddit effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button 
                  key={feature.id}
                  suppressHydrationWarning
                  onClick={() => setActiveTab(feature.id)}
                  className={`text-left p-5 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] border transition-all duration-300 relative group overflow-hidden ${
                    activeTab === feature.id 
                      ? 'bg-[#0f0f13] border-primary/30 shadow-[0_4px_20px_rgba(255,88,54,0.15)] ring-1 ring-primary/20' 
                      : 'bg-[#050505] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                  }`}
                >
                  {activeTab === feature.id && (
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  )}
                  <div className={`${feature.bg} ${feature.color} w-9 h-9 md:w-10 md:h-10 rounded-[0.6rem] flex items-center justify-center mb-4 border border-white/5`}>
                    <Icon size={18} />
                  </div>
                  <h3 className={`font-black text-[13px] md:text-sm mb-2 tracking-tight ${activeTab === feature.id ? 'text-white' : 'text-gray-300 group-hover:text-white transition-colors'}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] md:text-[12px] leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-6">
            <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
              <div className="relative w-full min-h-[400px] sm:h-[580px] rounded-[2rem] bg-[#0f0f13] border border-white/5 p-6 md:p-10 flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                  {activeTab === 'inbox' ? (
                    <InboxPreview key="inbox" />
                  ) : activeTab === 'monitoring' ? (
                    <MonitoringPreview key="monitoring" />
                  ) : activeTab === 'replies' ? (
                    <AIRepliesPreview key="replies" />
                  ) : activeTab === 'seo' ? (
                    <SEOPreview key="seo" />
                  ) : activeTab === 'save' ? (
                    <SavePreview key="save" />
                  ) : (
                    <LeadPreview key="lead" />
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-12 mb-20">
          {features.map((f) => (
            <div 
              key={f.id}
              className={`transition-all duration-500 rounded-full h-1.5 ${
                activeTab === f.id ? 'w-10 bg-orange-500' : 'w-1.5 bg-white/10'
              }`} 
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 flex flex-col items-center">
            <a 
                href="/login?next=/dashboard" 
                className="bg-primary hover:bg-[#ff814d] text-white text-lg md:text-xl font-bold py-4 px-10 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-t border-white/20 shadow-[0_0_20px_rgba(255,88,54,0.3)] hover:shadow-[0_0_30px_rgba(255,88,54,0.5)]"
            >
                Start Finding Customers <ArrowRight size={20} />
            </a>
            
            <div className="mt-6 flex flex-row justify-center items-center gap-6 md:gap-12 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em]">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                        <Check size={10} className="text-gray-400" strokeWidth={3} />
                    </div>
                    <span>No card required</span>
                </div>
                <div className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                        <Check size={10} className="text-gray-400" strokeWidth={3} />
                    </div>
                    <span>7-day free trial</span>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
