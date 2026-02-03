import { Shield, Target, Bot, Kanban, Zap, User } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "100% Ban-Safe",
    description: "We use distributed residential proxies and intelligent staggering to ensure your account acts human and stays safe.",
  },
  {
    icon: Target,
    title: "Intent Scoring",
    description: "Every lead is analyzed and scored on a 1-10 scale based on actual purchase intent and buying signals, not just keywords.",
  },
  {
    icon: Bot,
    title: "Context-Aware AI",
    description: "Powered by advanced LLMs to understand context, sarcasm, and genuine buying signals better than keyword matching.",
  },
  {
    icon: Kanban,
    title: "Visual Pipeline",
    description: "Manage your leads in a clean, drag-and-drop CRM designed specifically for social selling workflows.",
  },
  {
    icon: Zap,
    title: "24/7 Monitoring",
    description: "Be the first to reply. We monitor subreddits around the clock and alert you the second a relevant conversation starts.",
  },
  {
    icon: User,
    title: "Built for Founders",
    description: "Designed for solo founders and indie hackers who need to validate ideas and find early customers quickly.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-[#1a1a1a] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-6 font-mono">CAPABILITIES</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
            Everything You Need to Scale
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[13px] font-medium uppercase tracking-widest text-gray-500 leading-relaxed">
            Powerful features built to help you find and convert customers without compromising on security.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="group rounded-[2rem] border border-white/5 bg-[#222] p-8 transition-all hover:bg-[#282828] hover:border-white/10">
              <div className="mb-6 inline-block rounded-xl bg-orange-500/10 p-3 text-orange-500 border border-orange-500/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">{feature.title}</h3>
              <p className="mt-4 text-[13px] font-medium leading-relaxed tracking-wide text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
