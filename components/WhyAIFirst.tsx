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

const comparisonData = [
  { label: "Filtering", legacy: "Keyword Based", ai: "Intent Based" },
  { label: "Drafting", legacy: "Templates", ai: "Dynamic Context" },
  { label: "Speed", legacy: "Batch/Delayed", ai: "Real-time Intel" },
  { label: "Account Safety", legacy: "None", ai: "Humanized Simulation" }
];

export default function WhyAIFirst() {
  return (
    <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div
              key={i}
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
            </div>
          ))}
        </div>
        
        {/* Comparison Section (Responsive: Table on Desktop, Cards on Mobile) */}
        <div className="mt-20 max-w-4xl mx-auto p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem]">
          <div className="bg-[#0f0f13] rounded-[2.4rem] border border-white/5 overflow-hidden">
            
            {/* Desktop Table - Hidden on Mobile */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Feature</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Legacy Tools</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/5 italic">RedLeads AI (AI Scan)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {comparisonData.map((row) => (
                    <tr key={row.label} className="border-b border-white/5 group last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 text-slate-300 font-medium">{row.label}</td>
                      <td className="p-6 text-slate-500">{row.legacy}</td>
                      <td className="p-6 text-white font-bold bg-orange-500/5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,88,54,0.8)]" />
                          {row.ai}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards - Hidden on Desktop */}
            <div className="md:hidden divide-y divide-white/5">
              {comparisonData.map((row) => (
                <div key={row.label} className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Feature</span>
                    <span className="text-sm font-bold text-white">{row.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block italic">Legacy</span>
                      <span className="text-xs font-medium text-slate-400 block">{row.legacy}</span>
                    </div>
                    <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/70 block italic">RedLeads AI</span>
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-orange-500" />
                        {row.ai}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
