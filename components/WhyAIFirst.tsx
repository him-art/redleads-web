'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Target, MousePointer2, Clock } from 'lucide-react';

const reasons = [
  {
    title: "Intent vs. Keywords",
    description: "Legacy tools ping you for every keyword mention. RedLeads AI understands the *intent* behind the post, filtering out the noise and only surfacing ready-to-buy prospects.",
    icon: Brain,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Context-Aware Agent Hooks",
    description: "Stop sending copy-paste messages. Our AI drafts personalized replies that match the specific context of the Reddit thread, ensuring your outreach feels authentic and helpful.",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Account Health First",
    description: "Avoid 'shadowbans' and flags. RedLeads simulates human-like behavior and suggests engagement patterns that keep your Reddit account safe while you scale.",
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
];

export default function WhyAIFirst() {
  return (
    <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Why <span className="text-orange-500">AI-First</span> Marketing?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Standard Reddit tools haven't changed since 2018. RedLeads is built from the ground up with proprietary LLMs designed specifically for social selling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]"
            >
              <div className="bg-[#0c0c0c] rounded-[2rem] p-8 border border-white/5 flex flex-col h-full relative overflow-hidden group hover:border-orange-500/20 transition-all">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-orange-500/30 transition-all duration-500" />
                
                <div className={`w-12 h-12 rounded-2xl ${reason.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <reason.icon className={`w-6 h-6 ${reason.color}`} />
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-snug group-hover:text-orange-500 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed tracking-wide">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Comparison Table Mini */}
        <div className="mt-20 max-w-4xl mx-auto p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem]">
          <div className="bg-[#0f0f13] rounded-[2.4rem] overflow-x-auto border border-white/5 custom-scrollbar">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Feature</th>
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Legacy Tools</th>
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/5">RedLeads AI (Power Search)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <ComparisonRow label="Filtering" legacy="Keyword Based" ai="Intent Based" />
                <ComparisonRow label="Drafting" legacy="Templates" ai="Dynamic Context" />
                <ComparisonRow label="Speed" legacy="Batch/Delayed" ai="Real-time Intel" />
                <ComparisonRow label="Account Safety" legacy="None" ai="Humanized Simulation" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonRow({ label, legacy, ai }: { label: string; legacy: string; ai: string }) {
  return (
    <tr className="border-b border-white/5 group">
      <td className="p-4 md:p-6 text-slate-300 font-medium whitespace-nowrap">{label}</td>
      <td className="p-4 md:p-6 text-slate-500 whitespace-nowrap">{legacy}</td>
      <td className="p-4 md:p-6 text-white font-bold bg-orange-500/5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,88,54,0.8)]" />
          {ai}
        </div>
      </td>
    </tr>
  );
}
