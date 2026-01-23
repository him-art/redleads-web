'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface SectionCTAProps {
  title?: string;
  buttonText?: string;
  href?: string;
}

export default function SectionCTA({ 
  title = "Ready to turn Reddit into your best growth channel?", 
  buttonText = "Join now", 
  href = "/join" 
}: SectionCTAProps) {
  return (
    <section className="pt-16 pb-24 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 max-w-3xl leading-[1.1] tracking-tight">
            {title}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href={href}
              className="px-10 py-5 bg-[#f25e36] text-white rounded-3xl text-lg font-bold shadow-2xl shadow-orange-500/40 hover:bg-[#d94a24] hover:scale-105 active:scale-95 transition-all text-center min-w-[200px]"
            >
              {buttonText}
            </Link>
            <Link 
              href="/scanner"
              className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-3xl text-lg font-bold shadow-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group text-center min-w-[200px]"
            >
              Try Free Scanner
              <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-full border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">Beta</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
