'use client';

import { Search, Settings, MessageCircle, ArrowRight, Sparkles, X, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';



const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#1a1a1a] py-12 sm:py-16 md:py-20 lg:py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[2.5rem] sm:text-[3.5rem] font-black text-white leading-tight">
            Your 3-step ticket to <br/>
            <span className="text-orange-500 italic font-serif font-bold">Red-Hot Leads.</span>
          </h2>
        </div>


        {/* 3 Steps Cards */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
            {/* Step 1 */}
            <div className="bg-[#2a2a2a] rounded-3xl p-8 border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
              <div className="mb-8">
                <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Step 1</span>
              </div>
              
              {/* Illustration: Search Bar PNG */}
              <div className="w-full aspect-video rounded-2xl mb-8 relative overflow-hidden">
                  <Image 
                    src="/how-it-works-step1.png" 
                    alt="Scan your website" 
                    fill 
                    className="object-contain"
                    unoptimized={true}
                  />
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white mb-3">Define Your Target</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Enter your website and target audience. RedLeads automatically maps out highly relevant subreddits and potential customer keywords.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#2a2a2a] rounded-3xl p-8 border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
              <div className="mb-8">
                <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Step 2</span>
              </div>
              
              {/* Illustration: Reddit Threads PNG */}
              <div className="w-full aspect-video rounded-2xl mb-8 relative overflow-hidden">
                  <Image 
                    src="/how-it-works-step2.png" 
                    alt="Research threads" 
                    fill 
                    className="object-contain"
                    unoptimized={true}
                  />
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white mb-3">AI Identifies Leads</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Our advanced AI monitors 24/7 to find high-intent conversations, surface pain points, and score every lead based on buying signals.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#2a2a2a] rounded-3xl p-8 border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
              <div className="mb-8">
                <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Step 3</span>
              </div>
              
              {/* Illustration: Engage PNG */}
              <div className="w-full aspect-video rounded-2xl mb-8 relative overflow-hidden">
                  <Image 
                    src="/how-it-works-step3.png" 
                    alt="Engage via comments and DMs" 
                    fill 
                    className="object-contain"
                    unoptimized={true}
                  />
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-white mb-3">Join the Conversation</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Engage with potential customers by providing value first. Build authority by solving problems and naturally introducing your product.
                </p>
              </div>
            </div>

        </motion.div>


      </div>
    </section>
  );
};

export default HowItWorks;
