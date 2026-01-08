'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function NextSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ position: 'relative' }} className="w-full min-h-[80vh] bg-[#1a1a1a] text-white flex items-center justify-center py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              Reddit is a <br/>
              <span className="text-gray-500">goldmine</span> 
              <br/>buried in noise.
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              There are millions of high-intent discussions happening right now. 
              But finding them manually is like looking for a needle in a haystack while blindfolded.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white">57M+</div>
                    <div className="text-sm text-gray-500">Daily Active Users</div>
                </div>
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                     <div className="text-3xl font-bold text-white">100k+</div>
                     <div className="text-sm text-gray-500">Active Communities</div>
                </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('waitlist')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'center'
                });
              }}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full font-semibold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
            >
              Join the Waitlist
            </motion.button>
          </motion.div>
          
          {/* Right Side - Visual Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 shadow-2xl"
          >
             <div className="absolute inset-0 opacity-20" style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
               backgroundRepeat: 'repeat'
             }}></div>
             
             <div className="relative z-10 w-full h-full flex flex-col gap-4">
                {/* Mock Reddit Threads */}
                {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                      className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5 shadow-lg transform transition-transform hover:scale-[1.02]"
                    >
                        <div className="w-1/3 h-2 bg-white/10 rounded-full mb-3"></div>
                        <div className="w-full h-2 bg-white/5 rounded-full mb-2"></div>
                        <div className="w-2/3 h-2 bg-white/5 rounded-full"></div>
                    </motion.div>
                ))}
                
                {/* The "Found" Lead */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1.05 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                  className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/30 shadow-lg shadow-orange-900/20 transform translate-x-4"
                >
                    <div className="flex justify-between items-center mb-2">
                        <div className="w-1/4 h-2 bg-orange-200/20 rounded-full"></div>
                        <div className="text-xs text-orange-400 font-mono">HIGH INTENT</div>
                    </div>
                    <div className="w-full h-2 bg-orange-500/20 rounded-full mb-2"></div>
                    <div className="w-3/4 h-2 bg-orange-500/20 rounded-full"></div>
                </motion.div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}