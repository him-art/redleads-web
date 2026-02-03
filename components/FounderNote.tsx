'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function FounderNote() {
  return (
    <section className="py-24 bg-[#1a1a1a] overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-12 md:gap-20 items-start"
        >
          {/* Profile Column */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="/founder.png" 
                alt="Tim Jayas" 
                fill 
                className="object-cover"
                unoptimized={true}
              />
            </div>
            {/* Handwriting annotation below photo */}
            <div className="flex items-center gap-2 opacity-60">
                <span className="font-handwriting text-gray-400 text-xs italic -rotate-3">This is me</span>
                <span className="text-xl">👋</span>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 text-left">
            <div className="mb-6">
                <span className="text-orange-500 font-bold tracking-[0.05em] text-[10px] uppercase">FROM THE FOUNDER</span>
            </div>
            
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-white leading-tight tracking-tight mb-8">
              Built by a founder tired of missing <span className="text-orange-500">Reddit opportunities</span>
            </h2>
            
            <div className="space-y-6 text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-2xl">
              <p>
                I've launched multiple SaaS products and know how valuable Reddit can be for finding early customers. But manually searching through subreddits every day? That's exhausting.
              </p>
              <p>
                I wanted a tool that would monitor Reddit for me, score posts with AI, and deliver the best opportunities to my inbox each morning. So I built RedLeads.
              </p>
              <p className="text-white font-bold">
                Now I wake up to a curated list of Reddit opportunities, instead of spending hours searching. I hope it helps you too.
              </p>
            </div>

            {/* Separator Line */}
            <div className="w-full h-[1px] bg-white/10 mt-10 mb-6" />

            <div>
              <p className="text-white font-serif-italic italic text-xl opacity-90">- Tim Jayas</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
