'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { FOUNDER_COUNT } from '@/data/stats';
import dynamic from 'next/dynamic';

const DashboardDemo = dynamic(() => import('@/components/DashboardDemo'), {
  ssr: true,
  loading: () => (
    <div className="w-full max-w-6xl mx-auto mt-6 h-[400px] md:h-[620px] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-[#0f0f13] animate-pulse" />
  ),
});

export default function Hero({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
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
    
    
    setIsScanning(true);
    
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

      {/* Floating Elements - Hidden on mobile, visible on large screens */}
      <div className="absolute inset-0 max-w-[1800px] mx-auto pointer-events-none overflow-hidden z-0">
         {/* Left Side */}
         <FloatingBubble className="top-[18%] left-[5%] xl:left-[8%]" delay={0} scale={0.8} duration={3.2} floatDelay={0} />
         <FloatingBubble className="top-[28%] left-[2%] xl:left-[4%]" delay={1.5} scale={0.9} duration={3.8} floatDelay={1.2} />
         <FloatingBubble className="top-[38%] left-[8%] xl:left-[10%]" delay={0.8} scale={0.85} duration={3.5} floatDelay={0.5} />

         {/* Right Side */}
         <FloatingBubble className="top-[20%] right-[5%] xl:right-[8%]" delay={0.5} scale={0.85} duration={3.4} floatDelay={0.8} />
         <FloatingBubble className="top-[30%] right-[2%] xl:right-[4%]" delay={2} scale={0.8} duration={3.9} floatDelay={1.5} />
         <FloatingBubble className="top-[40%] right-[7%] xl:right-[10%]" delay={1.2} scale={0.75} duration={3.3} floatDelay={0.2} />
         </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-0 md:pt-27 md:pb-0 flex flex-col items-center text-center">
      

        <h1 
          className="max-w-[100vw] xl:max-w-none mx-auto text-[1.5rem] sm:text-[2.25rem] md:text-[4.5rem] lg:text-[6rem] font-black text-[#f5f5f5] mb-8 leading-[1.1] px-4 font-sans tracking-tight"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5">
            <span>Turn</span>
            <span className="inline-flex items-center gap-2 px-3 md:px-6 py-0.5 md:py-1.5 bg-orange-500/5 border border-orange-500/20 rounded-[1.25rem] md:rounded-[2rem]">
              <div className="relative w-7 h-7 md:w-14 md:h-14 flex-shrink-0">
                <Image 
                  src="/reddit-new-logo.webp" 
                  alt="Reddit" 
                  fill
                  priority
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <span className="text-orange-500">Reddit</span>
            </span>
            <span>users</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-5">
            <span>into</span>
            <span className="text-orange-500">customers</span>
          </div>
        </h1>

        {/* Subheadline - Clean Sans */}
        <p 
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-8 leading-relaxed font-medium"
        >
          Every day, thousands of people ask Reddit for tools like yours. RedLeads finds them automatically and sends the best ones to your inbox.
        </p>

        {/* Social Proof Widget */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-6 px-5 py-2 bg-black/40 border border-white/10 rounded-full">
            {/* Overlapping Avatars */}
            <div className="flex items-center -space-x-2.5">
              {['/alex.webp', '/umair.webp', '/konny.webp', '/marc.webp', '/alber_new.webp', '/sachanh.webp'].map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden relative flex-shrink-0">
                  <Image src={src} alt="User" fill sizes="32px" priority={i < 3} className="object-cover" />
                </div>
              ))}
            </div>
            {/* Text */}
            <span className="text-white text-[10px] font-black tracking-[0.1em] uppercase leading-tight whitespace-nowrap">
              <span className="text-orange-500">Join {FOUNDER_COUNT}</span> founders
            </span>
          </div>
        </div>

        {/* Search/CTA Component - Card Style */}
        <div className="w-full max-w-xl mx-auto mb-12">
          <div className="p-2 bg-white/5 border border-[#ff914d]/10 rounded-2xl">
            <form 
              onSubmit={handleSearch}
              className="relative flex items-center bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-[#ff914d]/30"
            >
              <div className="pl-4 pr-3 text-slate-500 flex items-center">
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
                disabled={isScanning}
                className={`m-1 px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-80 ${
                  isScanning 
                    ? 'bg-[#ff914d] text-white' 
                    : 'bg-white text-black hover:bg-slate-200'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    Start Free <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 size={12} /> No Card Required
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 size={12} /> 7-Day Full Access Trial
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
                <CheckCircle2 size={12} /> For Indie Hackers & Solo Founders
             </div>
          </div>
        </div>

        {/* Sneak Peek Dashboard Demo */}
        <DashboardDemo />
      </div>
    </div>
  );
}

function FloatingBubble({ className, delay = 0, scale = 1, duration = 3, floatDelay = 0 }: { className?: string, delay?: number, scale?: number, duration?: number, floatDelay?: number }) {
  return (
    <div 
      className={`absolute hidden xl:flex items-center gap-1.5 p-1.5 bg-white/7 border border-white/5 rounded-full w-[110px] shadow-xl shadow-black/5 animate-float ${className}`}
      style={{ 
        scale,
        animationDuration: `${duration}s`,
        animationDelay: `${floatDelay}s`,
      }}
    >
      <div className="w-5 h-5 rounded-full bg-transparent flex items-center justify-center flex-shrink-0 overflow-hidden">
           <Image 
             src="/reddit-new-logo.webp" 
             alt="Reddit" 
             width={18} 
             height={18} 
             loading="lazy"
             className="w-full h-full object-contain"
           />
      </div>
      <div className="flex-1 space-y-1">
         <div className="h-1 bg-slate-200 rounded-full w-3/4" />
         <div className="h-1 bg-slate-100 rounded-full w-1/2" />
      </div>
    </div>
  );
}
