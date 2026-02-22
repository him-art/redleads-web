'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import MaterialIcon from '@/components/ui/MaterialIcon';
import AnimatedCounter from './AnimatedCounter';

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="text-3xl md:text-5xl font-black text-white mb-1 tracking-tighter">{value}</div>
    <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{label}</div>
  </div>
);

const Card = ({ title, description, children, delay }: { title: string, description: string, children: React.ReactNode, delay: number }) => (
  <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-[#0c0c0c] rounded-[2rem] p-8 border border-white/5 flex flex-col h-full relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="flex-grow flex items-center justify-center w-full aspect-video mb-8 relative rounded-2xl bg-[#080808] overflow-hidden border border-white/5 shadow-none">
          {children}
      </div>
      
      <div className="mt-auto">
          <h3 className="text-xl font-black text-white mb-4 tracking-tighter uppercase uppercase">{title}</h3>
          <p className="text-gray-500 text-[13px] font-medium leading-relaxed tracking-wide">{description}</p>
      </div>
    </motion.div>
  </div>
);



export default function RedditOpportunity() {
  return (
    <section className="py-24 bg-[#1a1a1a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-[90vw] mx-auto mb-16 px-4">
            <h2 className="text-4xl md:text-[5rem] font-black text-white leading-[1.05] tracking-tighter mb-4">
                <span className="block whitespace-nowrap">How <span className="text-orange-500 font-serif-italic">Reddit Marketing</span></span>
                <span className="block whitespace-nowrap">Helps You Get Customers</span>
            </h2>
        </div>

        {/* Stats Banner */}
        <div className="p-2 bg-white/5 border border-orange-500/10 rounded-[2.5rem] mb-20">
            <div className="bg-[#0c0c0c] rounded-[2rem] p-8 border border-orange-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 gap-8 md:gap-0">
                <div className="flex items-center justify-center gap-4 md:border-r border-white/10">
                    <div className="w-14 h-14 relative">
                         <Image 
                            src="/reddit-logo.png" 
                            alt="Reddit Logo" 
                            fill
                            sizes="56px"
                            priority
                            className="object-contain" 
                         />
                    </div>
                    <AnimatedCounter value={2} suffix="B+" label="Monthly Visits" />
                </div>
                <div className="flex justify-center md:border-r border-white/10">
                    <AnimatedCounter value={100} suffix="K+" label="Active Communities" />
                </div>
                <div className="flex justify-center ">
                    <AnimatedCounter value={52} suffix="M+" label="Daily Active Users" />
                </div>
            </div>
        </div>
    </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Active Discussions */}
            <Card 
                title="People are already talking about your problems"
                description="Reddit has millions of users actively discussing pain points, asking for solutions, and seeking recommendations."
                delay={0}
            >
                <Image 
                    src="/reddit-opportunity-step1.png" 
                    alt="Reddit discussions example" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                />
            </Card>

            {/* Card 2: AI Training Funnel */}
            <Card 
                title="It's training the next generation of AI"
                description="Reddit content is used to train LLMs like ChatGPT. Being present on Reddit means being part of the conversation that shapes AI recommendations."
                delay={0.1}
            >
                <Image 
                    src="/reddit-opportunity-step2.png" 
                    alt="AI Training Funnel" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                />
            </Card>

            <Card 
                title="Authentic conversations drive conversions"
                description="People trust Reddit recommendations. A helpful comment at the right time can drive more conversions than any paid ad."
                delay={0.2}
            >
                 <Image 
                    src="/reddit-opportunity-step3.png" 
                    alt="Authentic Reddit Conversations" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                />
            </Card>

        </div>

        {/* CTA Section */}
        <div className="mt-20 flex flex-col items-center">
            <a 
                href="/login?next=/#pricing" 
                className="bg-[#ff6900] hover:bg-[#ff814d] text-white text-lg md:text-xl font-bold py-4 px-10 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-t border-white/20"
            >
                Get Customers From Reddit <MaterialIcon name="arrow_right" size={20} />
            </a>
            
            <div className="mt-6 flex flex-row justify-center items-center gap-6 md:gap-12 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em]">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                        <MaterialIcon name="check" size={10} className="text-gray-400" />
                    </div>
                    <span>No card required</span>
                </div>
                <div className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                        <MaterialIcon name="check" size={10} className="text-gray-400" />
                    </div>
                    <span>3-day free trial</span>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
