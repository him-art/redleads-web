'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhyAIFirst from "@/components/WhyAIFirst";
import Hero from "@/components/Hero";
import { Check, X, ArrowRight, Brain, Zap, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ReppitComparison() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      {/* Comparison Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-8">
            RedLeads vs Reppit AI
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
            The Context-First Alternative to <span className="text-blue-500">Reppit AI</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Why settle for just a numerical score? RedLeads gives you the contextual intelligence and the drafts to win.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
              Try the Better AI Engine
            </Link>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Zero-friction trial available
            </div>
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6">
                 <Sparkles className="text-orange-500/20 w-12 h-12" />
               </div>
              <div className="space-y-12">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Reppit AI (Score-Focused)</div>
                  <div className="space-y-3">
                     <div className="h-2 bg-blue-500/20 rounded-full w-full" />
                     <div className="h-2 bg-blue-500/20 rounded-full w-3/4" />
                     <div className="flex items-center gap-2 mt-4">
                        <span className="text-[10px] text-blue-500 font-bold uppercase">Intent Score: 85/100</span>
                     </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4">RedLeads AI (Context-Focused)</div>
                  <div className="space-y-4">
                     <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                        <div className="text-[10px] font-black text-orange-500 uppercase mb-2">Intent: Solution Seeker</div>
                        <p className="text-xs text-white leading-relaxed">
                          "User is frustrated with pricing on competitors. They are asking for a tool that handles both X and Y. Position RedLeads as the only integrated solution."
                        </p>
                        <div className="mt-4 flex gap-2">
                           <div className="text-[8px] px-2 py-1 bg-white/10 rounded uppercase font-bold text-slate-400">Draft Reply Ready</div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Don't just score leads.<br/>
                <span className="text-orange-500">Close them with context.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Reppit AI focuses on lead scoring. RedLeads focuses on **closing.** Our AI doesn't just tell you if a lead is good; it tells you **why** and tells you **how** to reply for maximum conversion.
              </p>
              
              <ul className="space-y-6">
                <FeatureItem 
                  title="Contextual Intelligence" 
                  desc="A deep-dive summary of every thread so you know exactly what the user's pain points are." 
                />
                <FeatureItem 
                  title="24/7 Auto-Prospecting" 
                  desc="We scan every subreddit for intent signals even while you sleep." 
                />
                <FeatureItem 
                  title="Premium Founder UI" 
                  desc="A clean, dark interface designed for action, not just observation." 
                />
              </ul>
            </div>
          </div>
        </div>
      </section>

      <WhyAIFirst />

      {/* Comparison Table */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="py-6 pr-4">Intelligence Feature</th>
                <th className="py-6 px-4">Reppit AI</th>
                <th className="py-6 pl-4 text-orange-500">RedLeads AI</th>
              </tr>
            </thead>
            <tbody className="text-sm">
               <TableRow label="Lead Intent Scoring" reppit={true} redleads={true} />
               <TableRow label="Automated Reply Drafts" reppit={false} redleads={true} />
               <TableRow label="Competitor Mention Tracking" reppit={true} redleads={true} />
               <TableRow label="Advanced Subreddit Intel" reppit={false} redleads={true} />
               <TableRow label="Custom Brand Context" reppit={true} redleads={true} />
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 bg-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">
            Stop scoring. Start scaling.
          </h2>
          <Link href="/dashboard" className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-100 transition-all shadow-2xl">
            Get Started Free <ArrowRight className="w-5 h-5" />
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

function TableRow({ label, reppit, redleads }: { label: string, reppit: boolean, redleads: boolean }) {
  return (
     <tr className="border-b border-white/5">
        <td className="py-6 pr-4 text-slate-300">{label}</td>
        <td className="py-6 px-4">{reppit ? <Check className="text-slate-500 w-4 h-4" /> : <X className="text-slate-700 w-4 h-4" />}</td>
        <td className="py-6 pl-4 font-bold text-white">{redleads ? <Check className="text-orange-500 w-5 h-5 shadow-[0_0_10px_rgba(255,88,54,0.3)]" /> : <X className="text-red-500 w-5 h-5" />}</td>
     </tr>
  );
}
