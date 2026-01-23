'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

// TIP: Adjust this value to change the width of the image container
const CONTAINER_MAX_WIDTH = "500px"; 

export default function NextSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="w-full min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side - Sales Copy */}
          <div 
            className="space-y-10 z-10"
          >
            {/* ... (left side content remains same) ... */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest">
                    <span className="w-8 h-[1px] bg-orange-500"></span>
                    AI-Powered Precision
                </div>
                <h2 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                    Qualified leads, <br/>
                    <span className="text-orange-500 italic font-serif">delivered on tap.</span>
                </h2>
            </div>

            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-xl">
              RedLeads autonomously scans 100+ communities to find the needles in the haystack. We filter out the noise so you can focus on one thing: growth.
            </p>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-medium">High-Intent Niche Audiences</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-medium">Authentic Feedback That Shapes Your Product</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-medium">Traffic That Converts Into Customers</span>
                </div>
            </div>
            
            <Link
              href="/join"
              className="group relative px-10 py-5 bg-orange-500 text-white hover:bg-orange-600 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center gap-3 overflow-hidden shadow-2xl shadow-orange-500/20"
            >
              Join now
              <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
          
          {/* Right Side - Static Image */}
          <div 
            className="relative h-[600px] w-full flex items-center justify-center"
          >
            <div 
                className="relative w-full h-full overflow-hidden rounded-[30px]"
                style={{ maxWidth: CONTAINER_MAX_WIDTH }}
            >
              <img 
                src="/next-section-visual-v2.png" 
                alt="RedLeads Visual" 
                className="w-full h-full object-cover"
              />
              
              {/* Levitating Overlay - Scroll Reactive */}
              <motion.div
                style={{ y }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                  <img 
                    src="/next-section-floating.png?v=2" 
                    alt="RedLeads Dashboard" 
                    className="w-[88%]  rounded-xl border border-white/10 " 
                  />
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}