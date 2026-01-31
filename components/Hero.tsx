'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useWillChange } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

export default function Hero({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const willChange = useWillChange();

  // Responsive donut positioning - scales with screen size and text
  const [scale, setScale] = useState(1);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const router = useRouter();
  const supabase = createClient();
  
  useEffect(() => {
    const handleResize = () => {
      // Calculate scale factor based on screen width
      // Base design at 1440px width
      const baseWidth = 1440;
      const currentScale = window.innerWidth / baseWidth;
      const scaleValue = Math.max(0.5, Math.min(currentScale, 1));
      setScale(scaleValue);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    // Simple normalization
    let domain = urlInput.trim().toLowerCase();
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    if (user) {
      router.push(`/dashboard?search=${encodeURIComponent(domain)}`);
    } else {
      router.push(`/login?next=/dashboard&search=${encodeURIComponent(domain)}`);
    }
  };

  // "The Giant Donut" Logic:
  // We use a div with a massive border to act as the "Light Overlay".
  // The "Hole" is the inner content box of this div.
  // We scale this div up. 
  // - Because the border scales with the div, it maintains coverage ratio.
  // - Transform is cheap (GPU).
  
  // Scale range:
  // Start: 1 (Hole size = ~47px to cover just the "o")
  // End: 50 (Hole size = ~2500px, clearing the screen)
  const scaleTransform = useTransform(scrollYProgress, [0, 0.4, 0.9], [1, 5, 50]);
  
  // Opacity for the mask to fade it completely at the end
  const maskOpacity = useTransform(scrollYProgress, [0.85, 0.9], [1, 0]);
  
  // Keep hero text fully visible and static (no opacity fade, no movement)
  const heroOpacity = 1; // Always visible
  const yText = useTransform(scrollYProgress, [0, 1], [0, 0]); // No movement

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#1a1a1a]">
        
        {/* The Content to Reveal (Next Section) */}
        {/* We place the children here. They sit behind the mask. */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
           {children}
        </div>


        {/* Hero Content (Floating on top) */}
        <motion.div 
            style={{ opacity: heroOpacity, y: yText, scale }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 pt-10" 
        >
             <div className="relative pointer-events-auto">

                  {/* Main headline - Fixed layout that scales */}
                  <div className="flex flex-col items-center justify-center text-center leading-tight gap-2">
                       <div>
                           <span className="text-[72px] font-bold tracking-tight text-[#1a1a1a] flex items-center justify-center gap-6 whitespace-nowrap">
                             <span>Turn</span>
                             <span className="font-serif italic font-light">Reddit</span>
                             <span>Conversations</span>
                           </span>
                       </div>

                      {/* Line 2: Into (centered with the donut acting as the 'o') */}
                      <div className="flex justify-center relative items-center">
                          <span 
                            style={{ marginRight: '56px' }}
                            className="text-[72px] font-bold tracking-tight text-[#1a1a1a]"
                          >
                            Int
                          </span>
                          
                          {/* The Giant Donut (The Mask) - Positioned relative to "Int" */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <motion.div
                                style={{ 
                                  scale: scaleTransform, 
                                  opacity: maskOpacity, 
                                  willChange, 
                                  x: 38, // Precise offset to align with "Int"
                                  y: 8, // Micro-adjustment for baseline
                                  width: 38, // Unscaled base size
                                  height: 38
                                }}
                                className="rounded-full shadow-[0_0_0_5000px_#f5f5f5] z-[-1]"
                              />
                          </div>
                      </div>

                      {/* Line 3: Paying Customers */}
                      <div>
                          <span className="text-[88px] font-bold tracking-tight font-serif italic inline-block">
                            <span className="text-orange-500 relative whitespace-nowrap">
                              Paying Customers
                              <span 
                                className="absolute -bottom-2 left-0 right-0 h-[10px] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                              ></span>
                            </span>
                          </span>
                      </div>
                  </div>

                  {/* Subtitle and CTAs */}
                  <div className="mt-8 flex flex-col items-center gap-8 px-4 w-full">
                    <p className="text-xl sm:text-2xl text-[#1a1a1a] italic max-w-2xl text-center leading-relaxed">
                      Watch who is seeking your solution across 100+ communities
                    </p>
                    
                    <form 
                      onSubmit={handleSearch}
                      className="w-full max-w-4xl relative group pointer-events-auto"
                    >
                      <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                        <Globe className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={24} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="yourwebsite.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full bg-white border-2 border-orange-500 rounded-full py-6 pl-20 pr-48 text-2xl text-slate-900 focus:outline-none focus:ring-8 focus:ring-orange-500/5 transition-all shadow-2xl shadow-black/5 placeholder:text-slate-300"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 px-10 bg-[#f25e36] text-white rounded-full text-xl font-bold hover:bg-[#d94a24] transition-all flex items-center gap-3 hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20"
                      >
                        <Search size={22} />
                        <span className="hidden sm:inline">Start For Free</span>
                      </button>
                    </form>

                     <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                            3-Day Full Trial Access
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> No Card Required</span>
                     </div>
                  </div>
             </div>
        </motion.div>

        {/* Fixed Icon in the center (The Target) */}
        {/* This icon sits INSIDE the hole initially and fades out */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
           <motion.div 
             style={{ opacity: heroOpacity }}
             className="text-6xl"
           >
             
           </motion.div>
        </div>

      </div>
    </div>
  );
}