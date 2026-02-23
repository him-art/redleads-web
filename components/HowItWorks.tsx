'use client';


import { motion } from 'framer-motion';
import Image from 'next/image';



const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#1a1a1a] py-12 sm:py-16 md:py-20 lg:py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl sm:text-[4.5rem] font-black text-white leading-[1.1] tracking-tighter">
            <span className="block">Your 3-step ticket</span>
            <span className="block text-orange-500 font-serif-italic">to Red-Hot Leads.</span>
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
            <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
              <div className="bg-[#0c0c0c] rounded-[2rem] p-8 border border-white/5 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="mb-8">
                  <span className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">STEP 1</span>
                </div>
                
                {/* Illustration: Search Bar PNG */}
                <div className="w-full aspect-video rounded-2xl mb-8 relative overflow-hidden">
                    <Image 
                      src="/how-it-works-step1.png" 
                      alt="Scan your website" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain"
                    />
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-snug">Define Your Target</h3>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed tracking-wide">
                    Enter your website and target audience. RedLeads automatically maps out highly relevant subreddits and potential customer keywords.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
              <div className="bg-[#0c0c0c] rounded-[2rem] p-8 border border-white/5 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="mb-8">
                  <span className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">STEP 2</span>
                </div>
                
                {/* Illustration: Reddit Threads PNG */}
                <div className="w-full aspect-video rounded-2xl mb-8 relative overflow-hidden">
                    <Image 
                      src="/how-it-works-step2.png" 
                      alt="Research threads" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain"
                    />
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-snug">AI Identifies Leads</h3>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed tracking-wide">
                    Our advanced AI monitors 24/7 to find high-intent conversations, surface pain points, and score every lead based on buying signals.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
              <div className="bg-[#0c0c0c] rounded-[2rem] p-8 border border-white/5 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="mb-8">
                  <span className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">STEP 3</span>
                </div>
                
                {/* Illustration: Engage PNG */}
                <div className="w-full aspect-video rounded-2xl mb-8 relative overflow-hidden">
                    <Image 
                      src="/how-it-works-step3.png" 
                      alt="Engage via comments and DMs" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain"
                    />
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-snug">Join the Conversation</h3>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed tracking-wide">
                    Engage with potential customers by providing value first. Build authority by solving problems and naturally introducing your product.
                  </p>
                </div>
              </div>
            </div>

        </motion.div>


      </div>
    </section>
  );
};

export default HowItWorks;
