import { User, Terminal, Users, Briefcase } from 'lucide-react';

const TargetAudience = () => {
  const personas = [
    {
      title: "Solopreneurs",
      description: "Build and iterate faster with fewer resources.",
      icon: <User className="h-6 w-6 text-orange-400" />,
      avatarParams: "bg-orange-500/10 border-orange-500/20"
    },
    {
      title: "Vibe Coders",
      description: "Once you start vibe coding, you need to start vibe marketing.",
      icon: <Terminal className="h-6 w-6 text-pink-400" />,
      avatarParams: "bg-pink-500/10 border-pink-500/20"
    },
    {
      title: "SaaS Teams",
      description: "Do marketing that actually works for SaaS, not just e-commerce.",
      icon: <Users className="h-6 w-6 text-blue-400" />,
      avatarParams: "bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Agencies",
      description: "Double your efficiency and impress your clients.",
      icon: <Briefcase className="h-6 w-6 text-green-400" />,
      avatarParams: "bg-green-500/10 border-green-500/20"
    }
  ];

  return (
    <section className="bg-[#1a1a1a] py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white mb-6">
            Who's it for?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Built just for you
          </h2>
          <p className="max-w-3xl text-lg text-gray-400 leading-relaxed">
            RedLeads helps you stay lean, consistent, and visible every single day. No agencies, no complex tools, no wasted time - for the teams doing more, with less.
          </p>
        </div>

        <div className="divide-y divide-white/10 border-t border-white/10">
          {personas.map((persona, index) => (
            <div key={index} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group hover:bg-white/[0.02] transition-colors rounded-xl px-4 -mx-4">
              {/* Avatar/Icon & Title */}
              <div className="md:col-span-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full border flex items-center justify-center shrink-0 ${persona.avatarParams}`}>
                  {persona.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{persona.title}</h3>
              </div>

              {/* Description */}
              <div className="md:col-span-8">
                <p className="text-xl text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                  {persona.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
