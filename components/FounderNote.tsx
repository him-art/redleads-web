'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Twitter } from 'lucide-react';

export default function FounderNote() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#1a1a1a] to-[#1a1a1a] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-8 sm:p-12 rounded-[1rem] border border-blue-500/20 bg-blue-900/5"
        >
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-blue-500/20 shadow-2xl">
                <Image 
                  src="/founder-avatar.jpg" 
                  alt="RedLeads Founder" 
                  fill 
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-6">A Note from the Founder</h2>
              
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  "I got tired of refreshing Reddit at 2am hoping to catch conversations where my product could actually help someone. By the time I'd find the right thread, it was already buried and my chance to add real value was gone."
                </p>
                <p>
                  "So I built RedLeads for myself. It watches subreddits I care about and tells me exactly when there's a conversation where I can genuinely contribute before it's too late."
                </p>
                
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-2">
                
                
                <a 
                  href="https://x.com/timjayas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  @TimJayas
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
