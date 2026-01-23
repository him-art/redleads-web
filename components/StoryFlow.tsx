'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Ear, Filter, Zap, PenTool, TrendingUp, User, MessageCircle, BarChart3, ShieldCheck } from 'lucide-react';

const StoryStep = ({ 
  icon: Icon, 
  title, 
  description, 
  align = 'left',
  visual,
  index
}: { 
  icon: any, 
  title: string, 
  description: string, 
  align?: 'left' | 'right',
  visual?: ReactNode,
  index: number
}) => {
  return (
    <div className={`flex items-center justify-center w-full mb-48 sm:mb-72 last:mb-0 relative z-10 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      {/* Text Content */}
      <motion.div 
        initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`w-5/12 ${align === 'left' ? 'text-right pr-12 sm:pr-20' : 'text-left pl-12 sm:pl-20'}`}
      >
        <span className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-4 block">Stage 0{index + 1}</span>
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">{title}</h3>
        <p className="text-gray-400 text-lg leading-relaxed max-w-md ml-auto mr-auto sm:ml-0 sm:mr-0">
            {description}
        </p>
      </motion.div>

      {/* Center Marker */}
      <div className="w-2/12 flex justify-center relative">
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="w-16 h-16 rounded-full bg-[#2a2a2a] border-4 border-[#1a1a1a] flex items-center justify-center z-20"
        >
          <Icon className="w-6 h-6 text-orange-500" />
        </motion.div>
      </div>

      {/* Visual Proof Side */}
      <motion.div 
        initial={{ opacity: 0, x: align === 'left' ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-5/12 flex justify-center"
      >
        <div className="w-full max-w-sm">
            {visual}
        </div>
      </motion.div>
    </div>
  );
};

// --- Mini Visual Components for Steps ---

const NoiseVisual = () => (
    <div className="relative h-40 w-full overflow-hidden rounded-2xl flex flex-col gap-2 p-4 bg-white/5 border border-white/5 opacity-50">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-4 bg-white/5 rounded-full w-full blur-[2px]" />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-500 text-xs font-mono uppercase tracking-widest bg-[#1a1a1a] px-3 py-1 rounded-full border border-white/10">57,000,000 Threads Daily</span>
        </div>
    </div>
);

const WatchtowerVisual = () => (
    <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 border-b border-white/5 pb-2 mb-2">
            <span>RADAR_SCANNER</span>
            <span className="text-green-500 animate-pulse">LIVE</span>
        </div>
        {['r/SaaS', 'r/Startup', 'r/Marketing'].map((sub, i) => (
            <div key={sub} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-xs font-bold text-white">{sub}</span>
                </div>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        className="w-full h-full bg-orange-500"
                    />
                </div>
            </div>
        ))}
    </div>
);

const SignalVisual = () => (
    <div className="bg-orange-500/10 border-2 border-orange-500/30 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-black px-2 py-1 rounded-bl-xl">
            MATCH DETECTED
        </div>
        <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-orange-500" />
            <span className="text-xs text-orange-500/80 font-bold">r/Entrepreneur</span>
        </div>
        <h4 className="text-sm font-bold text-white leading-tight">
            "Searching for a better way to reach Reddit customers without being ban-blocked. Any tips?"
        </h4>
        <div className="mt-4 flex gap-4 text-[10px] text-orange-500 font-black">
            <span>INTENT: 98%</span>
            <span>TOPIC: LEAD GEN</span>
        </div>
    </div>
);

const ApproachVisual = () => (
    <div className="bg-[#2a2a2a] p-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <PenTool size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-white uppercase tracking-tighter">AI Draft Engine</span>
        </div>
        <div className="space-y-2">
            <div className="h-2 bg-orange-500/20 rounded-full w-3/4" />
            <div className="h-2 bg-white/5 rounded-full w-full" />
            <div className="h-2 bg-white/5 rounded-full w-5/6" />
            <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '90%' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 bg-orange-500 rounded-full"
            />
        </div>
        <div className="mt-6 flex justify-end">
            <span className="px-3 py-1 bg-white text-black text-[10px] font-black rounded uppercase">Helpful Reply Ready</span>
        </div>
    </div>
);

const ResultVisual = () => (
    <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
            <TrendingUp size={20} className="text-green-500 mb-2" />
            <span className="text-2xl font-black text-white">+12%</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Conversion</span>
        </div>
        <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
            <ShieldCheck size={20} className="text-orange-500 mb-2" />
            <span className="text-2xl font-black text-white">100%</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Ban-Safe</span>
        </div>
    </div>
);

export default function StoryFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={containerRef} className="py-32 bg-[#1a1a1a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        
        {/* Header Section */}
        <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
                The Journey from <br/>
                <span className="text-orange-500 italic font-serif">Noise to Numbers.</span>
            </h2>
        </div>

        {/* Journey Feed */}
        <div className="relative">
          {/* Horizontal Divider - START POINT */}
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full mb-20 relative z-10"></div>

          {/* The Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-white/5 z-0">
            <motion.div 
              style={{ scaleY: scrollYProgress }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-orange-500 via-orange-400 to-amber-500 origin-top w-full h-full"
            />
          </div>

          {/* Steps */}
          <div className="relative z-10 pt-20">
            
            <StoryStep 
              index={0}
              align="left"
              icon={Ear}
              title="Sifting the Noise"
              description="Billions of words are typed every day. Your ideal customer is in there somewhere, asking for help."
              visual={<NoiseVisual />}
            />

            <StoryStep 
              index={1}
              align="right"
              icon={Filter}
              title="Targeting Radar"
              description="We monitor your target subreddits 24/7. When someone exhibits purchase intent, we tag it instantly."
              visual={<WatchtowerVisual />}
            />

            <StoryStep 
              index={2}
              align="left"
              icon={Zap}
              title="A Perfect Match"
              description="Our AI identifies high-intent leads with 98% accuracy. We find the pain points you were born to solve."
              visual={<SignalVisual />}
            />

            <StoryStep 
              index={3}
              align="right"
              icon={PenTool}
              title="The Helpful Reply"
              description="Forget cold DMs. Our AI drafts context-aware, helpful replies that solve problems and build your brand naturally."
              visual={<ApproachVisual />}
            />

            <StoryStep 
              index={4}
              align="left"
              icon={TrendingUp}
              title="Predictable Growth"
              description="Automate your Reddit presence while maintaining total safety. Turn daily threads into a consistent lead pipeline."
              visual={<ResultVisual />}
            />

          </div>
        </div>
      </div>
    </section>
  );
}
