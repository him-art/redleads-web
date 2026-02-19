'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import Link from 'next/link';
import InboundVisual from './InboundVisual';
import OutboundVisual from './OutboundVisual';


export default function StoryFlow() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    // Parallax effect - adjust values to control intensity
    const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <section ref={containerRef} className="py-32 bg-[#1a1a1a] relative overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 space-y-6 relative z-10">
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] font-black text-white leading-tight">
                        Two Ways to <span className="text-orange-500 font-serif italic font-bold">Win Reddit</span>
                    </h2>
                    <p className="text-lg text-gray-400 font-medium leading-relaxed">
                        Public replies build your authority and rank on Google and ChatGPT. 
                        Comments convert that authority into actual conversations with buyers. 
                        RedLeads handles both.
                    </p>
                </div>

                {/* Orange Split Arrow Line */}
                <div className="hidden md:flex justify-center mb-6 pointer-events-none">
                    <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                        {/* Center stem */}
                        <path d="M200 0V30" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
                        {/* Horizontal bracket with rounded corners - shortened and adjusted */}
                        <path d="M200 30C200 40 190 40 180 40H30C20 40 20 50 20 60V85" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <path d="M200 30C200 40 210 40 220 40H370C380 40 380 50 380 60V85" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        {/* Arrowheads */}
                        <path d="M15 80L20 85L25 80" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M375 80L380 85L385 80" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Center nub */}
                        <circle cx="200" cy="30" r="3.5" fill="#f97316" />
                    </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
                    {/* Inbound Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#ff9154] rounded-[2.5rem] p-4 sm:p-6 border border-white/5 flex flex-col items-center text-center shadow-xl shadow-black/20 overflow-hidden relative"
                    >
                        {/* Wave Pattern */}
                        <div className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-0">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#ffffff" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96V320H0Z"></path>
                                <path fill="#ffffff" fillOpacity="0.15" d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160V320H0Z"></path>
                                <path fill="#ffffff" fillOpacity="0.2" d="M0,224L48,234.7C96,245,192,267,288,266.7C384,267,480,245,576,234.7C672,224,768,224,864,234.7C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224V320H0Z"></path>
                            </svg>
                        </div>

                        <motion.div style={{ y }} className="w-full relative z-10">
                            <InboundVisual />
                        </motion.div>
                    </motion.div>

                    {/* Outbound Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#ff9154] rounded-[2.5rem] p-4 sm:p-6 border border-white/5 flex flex-col items-center text-center shadow-xl shadow-black/20 overflow-hidden relative"
                    >
                         {/* Wave Pattern */}
                         <div className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-0">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#ffffff" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96V320H0Z"></path>
                                <path fill="#ffffff" fillOpacity="0.15" d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160V320H0Z"></path>
                                <path fill="#ffffff" fillOpacity="0.2" d="M0,224L48,234.7C96,245,192,267,288,266.7C384,267,480,245,576,234.7C672,224,768,224,864,234.7C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224V320H0Z"></path>
                            </svg>
                        </div>

                        <motion.div style={{ y }} className="w-full relative z-10">
                            <OutboundVisual />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
