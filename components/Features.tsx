'use client';

import { useState } from 'react';
import Image from 'next/image';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    id: 'scoring',
    icon: 'target',
    title: "AI-Powered Scoring",
    description: "Every post is scored 0-100 based on relevance to your product.",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    id: 'inbox',
    icon: 'inbox',
    title: "Daily Inbox",
    description: "Wake up to fresh opportunities delivered every morning.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: 'monitoring',
    icon: 'zap',
    title: "Real-time Monitoring",
    description: "Catch new Reddit posts within minutes of being published.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    id: 'seo',
    icon: 'search',
    title: "SEO Opportunities",
    description: "Find posts already ranking on Google for long-term visibility.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    id: 'replies',
    icon: 'sparkles',
    title: "AI Reply Suggestions",
    description: "Get helpful reply drafts tailored to each conversation.",
    color: "text-orange-400",
    bg: "bg-orange-400/10"
  },
  {
    id: 'save',
    icon: 'bookmark',
    title: "Save & Organize",
    description: "Bookmark posts and track your best opportunities.",
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
];

const LeadPreview = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="relative z-10 bg-[#161616] border border-white/10 rounded-2xl p-8  transition-transform duration-500 group-hover:scale-[1.02] w-full h-full flex flex-col justify-center"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shrink-0">
        
        <span className="text-[8px] font-black uppercase tracking-wider">Medium</span>
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <Image src="/reddit-logo.png" alt="Reddit" width={24} height={24} />
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

    <div className="">
     
     
    </div>

    <div className="flex items-center gap-3">
      <button 
        suppressHydrationWarning
        className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10 active:scale-95"
      >
        <MaterialIcon name="add_comment" size={16} />
        DRAFT REPLY
      </button>
      <button 
        suppressHydrationWarning
        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10 active:scale-95"
      >
        <MaterialIcon name="bookmark" size={18} />
      </button>
      <button 
        suppressHydrationWarning
        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10 active:scale-95"
      >
        <MaterialIcon name="open_in_new" size={18} />
      </button>
    </div>
  </motion.div>
);

const InboxPreview = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="relative z-10 w-full h-full flex flex-col justify-center space-y-4"
  >
    {[1, 10, 4, 10, 6].map((count, i) => (
      <div 
        key={i} 
        className="flex items-center justify-between p-4 rounded-xl bg-[#161616] border border-white/5 hover:border-white/10 transition-colors group/item"
      >
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-wider">
            Delivered
          </div>
          <span className="text-sm font-bold text-white/90">
            Daily Intelligence: {count} Top Opportunities
          </span>
        </div>
        <MaterialIcon name="target" size={16} className="text-orange-500 opacity-60 group-hover/item:opacity-100 transition-opacity" />
      </div>
    ))}
  </motion.div>
);

const MonitoringPreview = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="relative z-10 w-full h-full flex flex-col"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          <MaterialIcon name="bolt" size={20} />
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
        <div key={i} className="p-5 rounded-2xl bg-[#161616] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">MEDIUM MATCH</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/80">R/{item.sub}</span>
               <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600">
                 <MaterialIcon name="schedule" size={10} />
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
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10"
            >
              <MaterialIcon name="add_comment" size={16} />
              DRAFT REPLY
            </button>
            <button 
              suppressHydrationWarning
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10"
            >
              <MaterialIcon name="bookmark" size={18} />
            </button>
            <button 
              suppressHydrationWarning
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10"
            >
              <MaterialIcon name="open_in_new" size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const AIRepliesPreview = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative z-10 w-full h-full flex flex-col"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <MaterialIcon name="sparkles" size={20} />
          </div>
          <div>
            <h4 className="text-lg font-black text-white leading-none mb-1 tracking-tight">AI INTELLIGENCE</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">DRAFTING RESPONSE</p>
          </div>
        </div>
        <MaterialIcon name="close" size={20} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Post Context */}
      <div className="mb-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="sparkles" size={14} className="text-orange-500" />
            <h5 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">INTELLIGENCE</h5>
          </div>
          <div className="flex items-center gap-4">
            <MaterialIcon name="open_in_new" size={14} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
            <MaterialIcon name="close" size={14} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
        
        
        <div className="pt-4 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">POST CONTEXT</p>
          <p className="text-sm font-bold text-white/90 leading-snug">
            Who has worked with python and playwright for automating lead generation for red dit
          </p>
        </div>
      </div>

      {/* Options with Staggered Animation */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2"
      >
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
          <motion.div 
            key={i} 
            variants={item}
            className="p-5 rounded-2xl bg-[#161616] border border-white/5 relative group/reply hover:border-orange-500/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/reply:text-orange-500 transition-colors">
                {option.label}
              </span>
              <button 
                suppressHydrationWarning
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <MaterialIcon name="content_copy" size={12} />
                COPY
              </button>
            </div>
            <p className="text-sm font-medium text-white/80 leading-relaxed italic">
              "{option.text}"
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">473 CREDITS LEFT</p>
        </div>
        <button 
          suppressHydrationWarning
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors group/regen"
        >
          <MaterialIcon name="refresh" size={12} className="group-hover/regen:rotate-180 transition-transform duration-500" />
          REGENERATE
        </button>
      </div>
    </motion.div>
  );
};

const SEOPreview = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4"
  >
    <div className="mx-auto flex-1 w-full max-w-sm">
      <div className="w-full bg-[#161616] border border-white/10 rounded-2xl overflow-hidden ">
      {/* Search Bar */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
        <MaterialIcon name="public" size={16} className="text-gray-600" />
        <div className="flex-1 h-8 rounded-full bg-white/5 border border-white/5 flex items-center px-4">
          <span className="text-xs text-gray-400">google.com/search?q=best+reddit+marketing+tool</span>
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
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 relative"
        >
          <div className="absolute -left-2 top-6 w-1 h-12 bg-purple-500 rounded-full " />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <Image src="/reddit-logo.png" alt="Reddit" width={20} height={20} />
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
        </motion.div>

        <div className="space-y-2 opacity-30">
          <div className="h-3 w-1/3 bg-blue-500/20 rounded-full" />
          <div className="h-4 w-2/3 bg-blue-500/10 rounded-full" />
        </div>
      </div>
    </div>
    
    
    </div>
  </motion.div>
);

const SavePreview = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="relative z-10 w-full h-full flex flex-col"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">LEAD HISTORY</h4>
      <div className="flex items-center p-1 rounded-xl bg-[#0a0a0a] border border-white/5">
        <button suppressHydrationWarning className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500">ALL</button>
        <button suppressHydrationWarning className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/20">
          <MaterialIcon name="bookmark" size={12} fill={true} />
          SAVED
        </button>
      </div>
    </div>

    {/* Monitoring Status */}
    <div className="mb-6 p-6 rounded-2xl bg-[#161616] border border-white/5 flex items-center gap-6">
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
        <div key={i} className="p-6 rounded-2xl bg-[#161616] border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/10">
              <MaterialIcon name="calendar_today" size={18} />
            </div>
            <div className="flex items-center gap-4">
              <h5 className="text-[11px] font-black text-white/90 uppercase tracking-widest">{item.date}</h5>
              <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black text-blue-400 border border-white/5">{item.count}</span>
            </div>
          </div>
          <MaterialIcon name="chevron_right" size={16} className="text-gray-600 group-hover:text-white transition-colors" />
        </div>
      ))}
    </div>
  </motion.div>
);

const Features = () => {
  const [activeTab, setActiveTab] = useState('scoring');

  return (
    <section id="features" className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center mb-20">
          
          <h2 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-6">
            Your complete <span className="text-orange-500">Reddit marketing</span> <br className="hidden md:block"/> toolkit
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-medium leading-relaxed opacity-80">
            RedLeads gives you all the tools to discover and engage with potential customers on Reddit effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <motion.button 
                key={feature.id}
                suppressHydrationWarning
                onClick={() => setActiveTab(feature.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-6 rounded-[2rem] border transition-all duration-300 ${
                  activeTab === feature.id 
                    ? 'bg-[#1a1a1a] border-orange-500/30 ring-1 ring-orange-500/20' 
                    : 'bg-[#111] border-white/5 hover:border-white/10'
                }`}
              >
                <div className={`${feature.bg} ${feature.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-white/5`}>
                  <MaterialIcon name={feature.icon} size={20} />
                </div>
                <h3 className="text-white font-bold text-base mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-[12px] leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-6">
            <div className="relative w-full h-[580px] rounded-3xl bg-[#111] border border-white/5 p-6 md:p-10 flex flex-col justify-center overflow-hidden">
              
              <AnimatePresence mode="wait">
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
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {features.map((f) => (
            <div 
              key={f.id}
              className={`transition-all duration-500 rounded-full h-1.5 ${
                activeTab === f.id ? 'w-10 bg-orange-500' : 'w-1.5 bg-white/10'
              }`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
