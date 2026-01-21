'use client';

import { Search, Settings, MessageCircle, ArrowRight, Sparkles, X, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';



const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#1a1a1a] py-12 sm:py-16 md:py-20 lg:py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Your 3-step ticket to <br/>
            <span className="text-orange-500 italic font-serif">Red-Hot Leads.</span>
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
                <h3 className="text-xl font-bold text-white mb-3">Upload your Website</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Type in your website and RedLeads will instantly learn your brand, tone of voice and key offering.
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
                <h3 className="text-xl font-bold text-white mb-3">We Prepare Content</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  RedLeads finds the best leads , pain points and opportunities for your SaaS.
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
                <h3 className="text-xl font-bold text-white mb-3">Reply with Value</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  RedLeads writes "Mini-Playbooks" helpful comments that solve problems first and convert second. Bringing trafic to your website.
                </p>
              </div>
            </div>

        </motion.div>


      </div>
    </section>
  );
};

export default HowItWorks;
