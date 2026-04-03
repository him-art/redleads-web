'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhyAIFirst from "@/components/WhyAIFirst";
import Hero from "@/components/Hero";
import { Check, X, ArrowRight, Brain, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

export default function F5BotComparison() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      {/* Comparison Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-8">
            RedLeads vs F5Bot
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
            The Intelligent Alternative to <span className="text-slate-500 line-through">F5Bot</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Why manually filter through thousands of keyword alerts when AI can find your ready-to-buy customers for you?
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
              Start Your AI Scan
            </Link>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* The "Why Switch" Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white tracking-tight">
                F5Bot is great for alerts.<br/>
                <span className="text-orange-500">RedLeads is for Revenue.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                F5Bot was built years ago for simple keyword tracking. In the age of AI, that's not enough. RedLeads uses proprietary LLMs to understand the difference between a "rant" and a "request for a solution."
              </p>
              
              <ul className="space-y-6">
                <FeatureItem 
                  title="Intent Scoring" 
                  desc="We don't just alert you; we score every post from 0-100 based on how likely they are to buy your product." 
                />
                <FeatureItem 
                  title="Contextual Intel" 
                  desc="Get a summary of the user's problem before you even open Reddit." 
                />
                <FeatureItem 
                  title="AI Reply Assistant" 
                  desc="Draft perfect, non-spammy replies in seconds that actually get upvoted." 
                />
              </ul>
            </div>
            
            {/* Visual Comparison Card */}
            <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-[3rem] shadow-2xl">
              <div className="space-y-12">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">The F5Bot Way (Old School)</div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl border-l-4 border-l-red-500/50">
                    <div className="text-xs text-slate-500 mb-2">Subject: F5Bot Alert: "SAAS"</div>
                    <div className="text-sm text-slate-300">"I hate my current SAAS provider..."</div>
                    <div className="mt-4 text-[9px] text-slate-600 italic">Result: 90% spam/noise. Hours of manual filtering.</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                    <ArrowRight className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4">The RedLeads Way (AI-First)</div>
                  <div className="p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl border-l-4 border-l-orange-500">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-0.5 bg-orange-500 text-white text-[8px] font-black rounded">HIGH INTENT</span>
                       <span className="text-[10px] text-orange-200">r/SaaS • 2m ago</span>
                    </div>
                    <div className="text-sm text-white font-bold mb-2">"Does anyone have a tool for X? My current provider is too expensive."</div>
                    <div className="text-[10px] text-orange-200/60 leading-relaxed italic">
                      AI Intel: User is actively looking for a cheaper alternative to your competitor. Suggests 'Starter' plan.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyAIFirst />

      {/* CTA Bottom */}
      <section className="py-32 bg-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">
            Ready to upgrade your Reddit growth?
          </h2>
          <Link href="/dashboard" className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-100 transition-all shadow-2xl">
            Claim Your 7-Day Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
        <Check className="w-4 h-4 text-orange-500" />
      </div>
      <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}
