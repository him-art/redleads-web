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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 max-w-3xl leading-[1.1] tracking-tight">
            {title}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <Link 
              href={user ? "/dashboard" : "/login?next=/dashboard"}
              className="px-10 py-5 bg-[#f25e36] text-white rounded-3xl text-lg font-bold shadow-2xl shadow-orange-500/40 hover:bg-[#d94a24] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group text-center min-w-[220px]"
            >
              Start Free Trial
              <span className="text-xs px-2 py-0.5 bg-white/10 text-white rounded-full border border-white/20 group-hover:bg-white/20 transition-colors">PRO</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
