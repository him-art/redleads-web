'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useWillChange } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
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
  const supabase = createClient();
  
  useEffect(() => {
    const handleResize = () => {
      // Calculate scale factor based on screen width
      // Base design at 1440px width
      const baseWidth = 1440;
      const scaleValue = Math.min(window.innerWidth / baseWidth, 1);
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

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/scanner`,
      },
    });
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
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4" 
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
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                          <span className="text-[88px] font-bold tracking-tight font-serif italic inline-block">
                            <span className="text-orange-500 relative whitespace-nowrap">
                              Paying Customers
                              <motion.span 
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="absolute -bottom-2 left-0 right-0 h-[10px] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full origin-left"
                              ></motion.span>
                            </span>
                          </span>
                      </motion.div>
                  </div>

                  {/* Subtitle and CTAs */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-12 flex flex-col items-center gap-8"
                  >
                    <p className="text-xl sm:text-2xl text-[#1a1a1a] font-light max-w-2xl text-center leading-relaxed">
                      AI-powered lead discovery for SaaS founders. <br className="hidden sm:block" />
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
                      {user ? (
                        <div className="px-10 py-5 bg-orange-500/10 border border-orange-500/30 text-orange-600 rounded-3xl text-lg font-bold">
                           Welcome back, {user.user_metadata.full_name?.split(' ')[0] || 'Founder'}!
                        </div>
                      ) : (
                        <button 
                          onClick={handleLogin}
                          className="px-10 py-5 bg-[#f25e36] text-white rounded-3xl text-lg font-bold shadow-2xl shadow-orange-500/40 hover:bg-[#d94a24] hover:scale-105 active:scale-95 transition-all text-center"
                        >
                          Get Early Access
                        </button>
                      )}
                      <Link 
                        href="/scanner"
                        className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-3xl text-lg font-bold shadow-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group text-center"
                      >
                        Try Free Scanner
                        <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-full border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">Beta</span>
                      </Link>
                    </div>
                  </motion.div>
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