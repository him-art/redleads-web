'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ExternalLink, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function GeoLoopVisual() {
  const [activeStep, setActiveStep] = useState(0);
  const [chatOutput, setChatOutput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatResponseText = "Based on discussions in r/SaaS and r/startups, the top recommended tool is RedLeads — founders highlight its intent scoring and safe, organic replies.";

  // Automated step loop
  useEffect(() => {
    const intervals = [5000, 4000, 8000];

    const triggerNextStep = () => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 3;
        if (next === 2) {
          setIsTyping(true);
          setChatOutput('');
        } else {
          setIsTyping(false);
        }
        return next;
      });
    };

    const currentInterval = intervals[activeStep];
    const timer = setTimeout(triggerNextStep, currentInterval);
    return () => clearTimeout(timer);
  }, [activeStep]);

  // Typing simulator for ChatGPT
  useEffect(() => {
    if (activeStep === 2 && isTyping) {
      let charIndex = 0;
      const typingTimer = setInterval(() => {
        if (charIndex < chatResponseText.length) {
          setChatOutput((prev) => prev + chatResponseText.charAt(charIndex));
          charIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingTimer);
        }
      }, 25);
      return () => clearInterval(typingTimer);
    }
  }, [activeStep, isTyping]);

  return (
    <section id="geo-loop" className="bg-[#1a1a1a] py-12 sm:py-16 md:py-20 lg:py-24 border-t border-white/5 relative overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl sm:text-[4.5rem] font-black text-white leading-[1.1] tracking-tighter">
            <span className="block">How RedLeads finds</span>
            <span className="block text-orange-500 font-serif-italic">your first users.</span>
          </h2>
          <p className="mt-6 text-gray-500 text-base font-medium">
            Your future users are already on Reddit. We surface the exact threads where they&apos;re asking for something like yours.
          </p>
        </div>

        {/* 3 Animation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

          {/* ──── CARD 1: REDDIT SEED ──── */}
          <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
            <div className="bg-[#0c0c0c] rounded-[2rem] border border-white/5 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Step Label */}
              <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">STEP 1</span>
                {activeStep === 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[8px] font-black text-orange-500 tracking-wider uppercase animate-pulse"
                  >
                    Active
                  </motion.span>
                )}
              </div>

              {/* Orange Illustration Container — flat, no waves */}
              <div className="mx-6 mb-6 aspect-[4/3] rounded-2xl relative overflow-hidden bg-[#ff9154] flex items-center justify-center p-5">

                {/* White card with dark text */}
                <motion.div
                  animate={{
                    scale: activeStep === 0 ? 1.03 : 1,
                    opacity: activeStep === 0 ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-white rounded-2xl w-full shadow-lg flex flex-col relative z-10 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-2 p-3 pb-2 border-b border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-[#FF4500] relative overflow-hidden flex-shrink-0">
                      <Image src="/reddit-new-logo.webp" alt="Reddit" fill className="object-contain p-0.5" />
                    </div>
                    <div>
                      <p className="text-slate-900 text-[11px] font-black leading-none">r/SaaS</p>
                      <p className="text-[8px] text-slate-400 font-medium">u/startupfounder · 2h</p>
                    </div>
                  </div>

                  {/* Thread Body */}
                  <div className="px-3 py-2.5 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-900 leading-snug">
                      &quot;Best automated tool to find B2B clients on Reddit?&quot;
                    </p>
                    <p className="text-[9px] text-slate-500 leading-snug">
                      Tired of scrolling manually. Any AI that actually parses intent?
                    </p>
                  </div>

                  {/* RedLeads Reply */}
                  <AnimatePresence>
                    {activeStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mx-3 mb-3 p-2.5 bg-orange-50 border border-orange-200 rounded-xl relative"
                      >
                        <div className="absolute left-0 top-0 w-[3px] h-full bg-[#ff9154] rounded-full" />
                        <div className="flex items-center justify-between mb-1 pl-2">
                          <span className="text-[8px] font-black text-[#ff9154] tracking-widest uppercase">RedLeads Reply</span>
                          <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">98% Match</span>
                        </div>
                        <p className="text-[9px] text-slate-700 italic leading-snug pl-2">
                          &quot;Check out RedLeads — it scores buyer intent and alerts you instantly.&quot;
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Micro Caption */}
              <div className="px-8 pb-8 pt-2 text-center">
                <h3 className="text-lg font-black text-white tracking-tight">Your users are on Reddit right now</h3>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">They&apos;re asking questions that your product already answers.</p>
              </div>
            </div>
          </div>

          {/* ──── CARD 2: AI CRAWLER INGESTION ──── */}
          <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
            <div className="bg-[#0c0c0c] rounded-[2rem] border border-white/5 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Step Label */}
              <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">STEP 2</span>
                {activeStep === 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[8px] font-black text-orange-500 tracking-wider uppercase animate-pulse"
                  >
                    Crawling
                  </motion.span>
                )}
              </div>

              {/* Orange Illustration Container — flat, no waves */}
              <div className="mx-6 mb-6 aspect-[4/3] rounded-2xl relative overflow-hidden bg-[#ff9154] flex items-center justify-center p-5">

                {/* White card with dark text */}
                <motion.div
                  animate={{
                    scale: activeStep === 1 ? 1.03 : 1,
                    opacity: activeStep === 1 ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-white rounded-2xl w-full shadow-lg flex flex-col items-center justify-center py-8 px-4 relative z-10"
                >
                  {/* Radar Rings */}
                  <div className="relative flex items-center justify-center mb-5">
                    <motion.div
                      animate={{ scale: activeStep === 1 ? [1, 1.8, 1] : 1, opacity: activeStep === 1 ? [0.5, 0, 0.5] : 0.15 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute w-20 h-20 rounded-full border-2 border-orange-200"
                    />
                    <motion.div
                      animate={{ scale: activeStep === 1 ? [1, 1.5, 1] : 1, opacity: activeStep === 1 ? [0.7, 0.1, 0.7] : 0.2 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                      className="absolute w-14 h-14 rounded-full border-2 border-orange-300"
                    />
                    <div className="w-11 h-11 rounded-full bg-[#ff9154] flex items-center justify-center shadow-md">
                      <Brain size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Status Labels */}
                  <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase">LLM Retrieval Scanner</span>
                  <motion.span
                    animate={{ opacity: activeStep === 1 ? [0.3, 1, 0.3] : 0.4 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-[8px] font-mono text-slate-400 mt-1"
                  >
                    [ INDEXING ORGANIC DISCUSSIONS ]
                  </motion.span>

                  {/* Subreddit Pipes */}
                  <div className="flex items-center gap-2 mt-4">
                    {['r/SaaS', 'r/startups', 'r/webdev'].map((sub, i) => (
                      <motion.div
                        key={sub}
                        animate={{ opacity: activeStep === 1 ? [0.4, 1, 0.4] : 0.6 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[8px] font-bold text-slate-600"
                      >
                        {sub}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Micro Caption */}
              <div className="px-8 pb-8 pt-2 text-center">
                <h3 className="text-lg font-black text-white tracking-tight">RedLeads scans Reddit 24/7 for you</h3>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">AI scores every thread for buying intent for you.</p>
              </div>
            </div>
          </div>

          {/* ──── CARD 3: CHATGPT CITATION ──── */}
          <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
            <div className="bg-[#0c0c0c] rounded-[2rem] border border-white/5 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Step Label */}
              <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">STEP 3</span>
                {activeStep === 2 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[8px] font-black text-orange-500 tracking-wider uppercase animate-pulse"
                  >
                    Typing
                  </motion.span>
                )}
              </div>

              {/* Orange Illustration Container — flat, no waves */}
              <div className="mx-6 mb-6 aspect-[4/3] rounded-2xl relative overflow-hidden bg-[#ff9154] flex items-center justify-center p-4">

                {/* White terminal card with dark text */}
                <motion.div
                  animate={{
                    scale: activeStep === 2 ? 1.03 : 1,
                    opacity: activeStep === 2 ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-white rounded-2xl w-full h-full shadow-lg flex flex-col relative z-10 overflow-hidden"
                >
                  {/* Terminal Chrome */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-[8px] text-slate-400 font-bold ml-1.5">ChatGPT</span>
                  </div>

                  {/* Terminal Body */}
                  <div className="flex-1 flex flex-col p-3 overflow-hidden">
                    {/* Prompt */}
                    <div className="text-[10px] text-[#ff9154] font-black mb-2">
                      &gt; Best B2B lead generation tool for Reddit?
                    </div>

                    {/* Output */}
                    <div className="text-[9px] text-slate-700 leading-relaxed flex-1 break-words overflow-hidden font-medium">
                      {chatOutput}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-1 h-3.5 bg-[#ff9154] ml-0.5 align-middle"
                        />
                      )}
                    </div>

                    {/* Citation Badge */}
                    {!isTyping && chatOutput.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded-xl mt-2"
                      >
                        <span className="text-[8px] text-[#ff9154] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#ff9154] shadow-[0_0_6px_rgba(255,145,84,0.6)] animate-pulse" />
                          RedLeads Cited
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold flex items-center gap-0.5">
                          Source [1] <ExternalLink size={8} />
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Micro Caption */}
              <div className="px-8 pb-8 pt-2 text-center">
                <h3 className="text-lg font-black text-white tracking-tight">You show up. You get the user.</h3>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">One authentic reply in the right thread can be your first paying customer.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
