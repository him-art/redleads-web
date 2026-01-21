'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Zap, User, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const SCANNER_DATA = [
    {
        id: 1,
        type: 'noise',
        subreddit: 'funny',
        title: 'Look at this picture of my dog wearing a tiny hat lol',
        reason: 'Low Intent'
    },
    {
        id: 2,
        type: 'signal',
        subreddit: 'SaaS',
        title: 'Is there a tool that actually finds customers on Reddit?',
        reason: 'High Intent Match',
        score: '98%'
    },
    {
        id: 3,
        type: 'noise',
        subreddit: 'AskReddit',
        title: 'What is the worst advice you have ever received from a stranger?',
        reason: 'Irrelevant Topic'
    },
    {
        id: 4,
        type: 'signal',
        subreddit: 'startup',
        title: 'We need a way to automate our outreach without being mark as spam',
        reason: 'Problem Statement Detected',
        score: '95%'
    }
];

const ScannerCard = ({ data, active }: { data: typeof SCANNER_DATA[0], active: boolean }) => {
    return (
        <div className={`relative w-full p-4 rounded-xl border transition-all duration-500 overflow-hidden ${
            active && data.type === 'signal'
                ? 'bg-[#2a2a2a] border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                : 'bg-white/5 border-white/5'
        }`}>
            {/* Lead Status Overlay for Signal */}
            {active && data.type === 'signal' && (
                <div className="absolute top-0 right-0 p-2">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1 bg-orange-500 text-black text-[9px] font-black px-2 py-0.5 rounded"
                    >
                        <Zap size={8} fill="currentColor" /> {data.score} MATCH
                    </motion.div>
                </div>
            )}

            <div className="flex items-center gap-2 mb-2 opacity-60">
                <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center">
                    <User size={8} className="text-gray-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-400">r/{data.subreddit}</span>
            </div>

            <h4 className={`text-xs font-semibold leading-relaxed mb-1 transition-all duration-500 ${
                active && data.type === 'signal' ? 'text-white' : 'text-gray-500'
            } ${data.type === 'noise' ? 'line-through decoration-gray-700' : ''}`}>
                {data.title}
            </h4>

            <div className={`text-[9px] font-bold uppercase tracking-wider transition-all duration-500 ${
                active && data.type === 'signal' ? 'text-orange-500' : 'text-gray-600'
            }`}>
                {active ? data.reason : 'Waiting to scan...'}
            </div>
        </div>
    );
};

export default function NextSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side - Sales Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 z-10"
          >
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest">
                    <span className="w-8 h-[1px] bg-orange-500"></span>
                    AI-Powered Precision
                </div>
                <h2 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                    Qualified leads, <br/>
                    <span className="text-orange-500 italic font-serif">delivered on tap.</span>
                </h2>
            </div>

            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-xl">
              RedLeads autonomously scans 100+ communities to find the needles in the haystack. We filter out the noise so you can focus on **one thing**: closing.
            </p>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-medium">99% Spam-Free Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-medium">Context-Aware Pain Point Detection</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-medium">Instant "Match Score" for every thread</span>
                </div>
            </div>
            
            <Link
              href="https://tally.so/r/7RK9g0"
              className="group relative px-10 py-5 bg-orange-500 text-white hover:bg-orange-600 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center gap-3 overflow-hidden shadow-2xl shadow-orange-500/20"
            >
              Get Early Access
              <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
          
          {/* Right Side - The Scanner Visual */}
          <div className="relative h-[600px] w-full flex items-center justify-center">
             {/* Main Scanner Container */}
             <div className="relative w-full max-w-md bg-[#252525]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-2xl overflow-hidden">
                <div className="text-[10px] font-mono text-gray-600 mb-6 flex justify-between uppercase tracking-widest">
                    <span>Live Reddit Stream</span>
                    <span className="text-green-500 animate-pulse">● Scanning</span>
                </div>

                <div className="space-y-4 relative">
                    {SCANNER_DATA.map((item, idx) => (
                        <ScannerCard key={item.id} data={item} active={isInView} />
                    ))}

                    {/* The Scanning Beam Animation */}
                    <motion.div 
                        initial={{ top: "-10%" }}
                        animate={isInView ? { top: ["0%", "100%", "0%"] } : { top: "-10%" }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent z-10"
                    >
                        <div className="absolute inset-0 bg-orange-500 blur-sm"></div>
                    </motion.div>
                </div>

                {/* Vertical Line Connector */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
             </div>

             {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}