'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, MessageSquare, ArrowBigUp, ArrowBigDown, Share2, MoreHorizontal, Bot, Globe } from 'lucide-react';

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">{label}</div>
  </div>
);

const Card = ({ title, description, children, delay }: { title: string, description: string, children: React.ReactNode, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-[#2a2a2a] rounded-3xl p-8 border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors group"
  >
    <div className="flex-grow flex items-center justify-center w-full aspect-video mb-8 relative rounded-2xl bg-[#141414] overflow-hidden border border-white/5">
        {children}
    </div>
    
    <div className="mt-auto">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);



export default function RedditOpportunity() {
  return (
    <section className="py-24 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[2.5rem] sm:text-[3.5rem] font-black text-white leading-tight mb-4">
                How <span className="text-orange-500 font-serif italic font-bold">Reddit Marketing</span> Helps You Get Customers
            </h2>
        </div>

        {/* Stats Banner */}
        <div className="bg-[#2a1a1a] rounded-3xl p-8 mb-20 border border-orange-500/10 shadow-[0_0_50px_rgba(234,88,12,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 gap-8 md:gap-0">
                <div className="flex items-center justify-center gap-4 md:border-r border-white/10">
                    <div className="w-14 h-14 relative">
                         <img src="/reddit-logo.png" alt="Reddit Logo" className="w-full h-full object-contain" />
                    </div>
                    <StatItem value="2B+" label="Monthly Visits" />
                </div>
                <div className="flex justify-center md:border-r border-white/10">
                    <StatItem value="100K+" label="Active Communities" />
                </div>
                <div className="flex justify-center ">
                    <StatItem value="52M+" label="Daily Active Users" />
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
                    className="object-cover"
                    unoptimized={true}
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
                    className="object-cover"
                    unoptimized={true}
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
                    className="object-cover"
                    unoptimized={true}
                />
            </Card>

        </div>

      </div>
    </section>
  );
}
