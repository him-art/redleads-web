'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);
  return (
    <section className="pt-16 pb-24 bg-[#1a1a1a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-[5rem] font-black text-white mb-8 tracking-tighter leading-[1.05]">
          <span className="block sm:whitespace-nowrap">Ready to find your</span>
          <span className="block text-orange-500 font-serif-italic sm:whitespace-nowrap">paying customers?</span>
        </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <Link 
              href={user ? "/dashboard" : "/login?next=/dashboard"}
              className="px-10 py-5 bg-orange-500 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest border border-orange-500/20 hover:bg-[#ff4d29] active:scale-95 transition-all flex items-center justify-center gap-2 group text-center min-w-[220px]"
            >
              Start Free Trial
              <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white rounded-full border border-white/20 group-hover:bg-white/20 transition-colors">PRO</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
