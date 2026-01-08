import { Shield, Target, Bot, Kanban, Zap, User } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Privacy-First",
    description: "Your data never leaves your device unencrypted. We use local AES-256 encryption to keep your Reddit credentials safe.",
  },
  {
    icon: Target,
    title: "Intent Scoring",
    description: "Stop guessing. Every lead is scored on a 1-10 scale based on purchase intent, so you can prioritize your outreach.",
  },
  {
    icon: Bot,
    title: "AI Analysis",
    description: "Powered by Gemini AI to understand context, sarcasm, and genuine buying signals better than keyword matching.",
  },
  {
    icon: Kanban,
    title: "Visual Pipeline",
    description: "Manage your leads in a clean, drag-and-drop CRM designed specifically for social selling workflows.",
  },
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description: "Be the first to reply. We monitor subreddits 24/7 and alert you the moment a relevant conversation starts.",
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
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need to Scale
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Powerful features built to help you find and convert customers without compromising on security.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="group rounded-2xl border border-white/5 bg-[#222] p-8 transition-colors hover:border-blue-900/50 hover:shadow-lg">
              <div className="mb-6 inline-block rounded-xl bg-blue-900/20 p-3 text-blue-400">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-4 text-gray-400">
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
