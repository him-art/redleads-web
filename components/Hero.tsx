'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Globe, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

export default function Hero({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const router = useRouter();
  const supabase = createClient();
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    let domain = urlInput.trim().toLowerCase();
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    if (user) {
      router.push(`/dashboard?search=${encodeURIComponent(domain)}`);
    } else {
      router.push(`/login?next=/dashboard&search=${encodeURIComponent(domain)}`);
    }
  };

  return (
    <div className="relative min-h-[100vh] overflow-hidden bg-[#1a1a1a] selection:bg-orange-500/30">
      {/* Flattened Background - No Gradients */}
      <div className="absolute inset-0 bg-[#1a1a1a]" />

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col items-center text-center">
        
        

        {/* Main Headline - Serif & Minimal */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="max-w-7xl mx-auto text-4xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-[#f5f5f5] mb-8 leading-[1.1]"
        >
          Turn Reddit Conversations <br />
          <span>Into</span> <span className="text-slate-400 italic">Paying Customers</span>
        </motion.h1>

        {/* Subheadline - Clean Sans */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-light"
        >
          Stop checking Reddit manually. We monitor millions of discussions to find people explicitly asking for your solution.
        </motion.p>

        {/* Search/CTA Component - Card Style */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="w-full max-w-xl mx-auto mb-20"
        >
          <div className="p-2 bg-white/5 border border-white/10 rounded-2xl">
            <form 
              onSubmit={handleSearch}
              className="relative flex items-center bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5"
            >
              <div className="pl-4 pr-3 text-slate-500">
                <Globe size={20} />
              </div>
              
              <input 
                name="website-url"
                type="text" 
                placeholder="yourwebsite.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                suppressHydrationWarning
                className="flex-1 bg-transparent border-none text-lg text-white placeholder:text-slate-600 focus:ring-0 focus:outline-none h-12 w-full font-light"
              />
              
              <button 
                suppressHydrationWarning
                type="submit"
                className="m-1 px-6 py-2.5 bg-white text-black hover:bg-slate-200 rounded-lg font-medium text-sm transition-all flex items-center gap-2"
              >
                Start Free <ArrowRight size={14} />
              </button>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 className="w-3 h-3" /> No Card Required
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 className="w-3 h-3" /> 3-Day Free Trial
             </div>
          </div>
        </motion.div>

        {/* Abstract "Product" Visual or Placeholder for scroll transition */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="relative w-full max-w-5xl mx-auto"
        >
            <div className="relative rounded-t-xl md:rounded-t-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl overflow-hidden shadow-2xl mx-4 md:mx-0">
               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
               
               {/* Browser Header */}
               <div className="h-8 md:h-10 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                  </div>
               </div>

               {/* Mock Dashboard Content */}
               <div className="p-4 md:p-8 grid grid-cols-12 gap-4 md:gap-6 h-[300px] md:h-[400px] overflow-hidden opacity-50">
                  {/* Sidebar */}
                  <div className="hidden md:block col-span-2 space-y-3">
                     <div className="h-2 w-20 bg-white/10 rounded-full mb-6" />
                     <div className="h-8 w-full bg-white/5 rounded-lg" />
                     <div className="h-4 w-16 bg-white/5 rounded-lg" />
                     <div className="h-4 w-20 bg-white/5 rounded-lg" />
                     <div className="h-4 w-14 bg-white/5 rounded-lg" />
                  </div>
                  
                  {/* Main Content */}
                  <div className="col-span-12 md:col-span-10 space-y-4">
                     {/* Header */}
                     <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-32 bg-white/10 rounded-lg" />
                        <div className="h-8 w-24 bg-orange-500/20 rounded-lg" />
                     </div>
                     
                     {/* Cards */}
                     <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                        <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                        <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                     </div>

                     {/* List */}
                     <div className="space-y-3 mt-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-14 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 justify-between">
                             <div className="h-2 w-24 bg-white/10 rounded-full" />
                             <div className="h-2 w-12 bg-white/10 rounded-full" />
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
               
               {children && <div className="absolute inset-0 z-10">{children}</div>}
            </div>
            
            {/* Fade out at bottom to blend with next section if needed */}
            <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}