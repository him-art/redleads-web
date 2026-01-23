'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function FounderNote() {
  return (
    <section className="py-24 bg-[#1a1a1a] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-12 items-start"
        >
          {/* Profile Picture */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
              <Image 
                src="/founder-avatar.jpg" 
                alt="Axel Schapmann" 
                fill 
                className="object-cover grayscale"
                unoptimized={true}
              />
            </div>
            {/* Handwriting annotation */}
            <div className="absolute -bottom-10 -right-12 hidden md:block">
               <div className="flex items-start gap-2">
                   <span className="font-handwriting text-gray-400 text-sm -rotate-6 mt-2">This is me</span>
                   <span className="text-2xl">👋</span>
                   <svg className="w-6 h-6 text-gray-500 -ml-1 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                       <path d="M10 20C10 20 15 5 20 0" />
                   </svg>
               </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-4">
                <span className="text-red-500 font-bold tracking-widest text-xs uppercase">FROM THE FOUNDER</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              I built this because I was tired of <span className="text-red-500">manually searching for customers.</span>
            </h2>
            
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                As a serial builder, I know Reddit is a goldmine for early user acquisition. But trying to catch every relevant conversation manually? It's a full-time job. I was spending hours scrolling and still missing the best moments to jump in.
              </p>
              <p>
                I needed a tool that would do the heavy lifting scanning 24/7, filtering out the noise, and only pinging me when a lead was actually worth my time. That tool didn't exist, so I coded RedLeads.
              </p>
              <p className="text-white font-medium">
                Today, I spend my mornings replying to high-intent leads instead of searching for them. It completely changed my workflow, and I think it will change yours too.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-white font-serif italic text-lg opacity-80">- Tim Jayas</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
