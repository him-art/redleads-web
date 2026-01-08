'use client';

import { Search, Settings, MessageCircle, ArrowRight, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';

// 4 fixed lanes for incoming posts
const LANES = [20, 35, 50, 65]; // Percentage positions for 4 lanes

interface PostProps {
  delay: number;
  lane: number;
  isGood?: boolean;
}

// Posts flowing in from left to center in specific lanes
const IncomingPost = ({ delay, lane, isGood }: PostProps) => {
  const laneY = LANES[lane];
  
  return (
    <motion.div
      initial={{ x: 0, opacity: 1, scale: 1 }}
      animate={{
        x: [0, 120, 180, 220],
        y: [0, (50 - laneY) * 2, (50 - laneY) * 2.5, (50 - laneY) * 3],
        opacity: [1, 1, isGood ? 0.7 : 0.3, isGood ? 0.7 : 0.3],
        scale: [1, 0.9, isGood ? 0.6 : 0.3, isGood ? 0.6 : 0.3]
      }}
      transition={{
        duration: 3.5,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 8,
        ease: "easeInOut"
      }}
      className="absolute left-2 sm:left-4 md:left-6 lg:left-8"
      style={{ top: `${laneY}%` }}
    >
      <div className="relative w-12 sm:w-16 md:w-20 lg:w-24 h-10 sm:h-12 md:h-14 lg:h-16 rounded-md sm:rounded-lg border bg-[#2a2a2a] border-white/10 p-1 sm:p-1.5 md:p-2 shadow-lg">
        <div className="w-3/4 h-0.5 sm:h-0.5 md:h-1 bg-white/20 rounded-full mb-0.5 sm:mb-1 md:mb-1.5"></div>
        <div className="w-full h-0.5 bg-white/10 rounded-full mb-0.5 sm:mb-0.5 md:mb-1"></div>
        <div className="w-1/2 h-0.5 bg-white/10 rounded-full"></div>
      </div>
    </motion.div>
  );
};

// Good leads shooting out from center to right in lanes
const OutgoingLead = ({ delay, lane }: PostProps) => {
  const laneY = LANES[lane];
  
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
      animate={{
        x: [0, 280, 350, 420],
        y: [(50 - laneY) * 3.5, (50 - laneY) * 3, (50 - laneY) * 2, 0],
        opacity: [0, 0.8, 1, 1],
        scale: [0.3, 0.7, 0.9, 1]
      }}
      transition={{
        duration: 3.5,
        delay: delay + 3.5,
        repeat: Infinity,
        repeatDelay: 8,
        ease: "easeInOut"
      }}
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: `${laneY}%` }}
    >
      <div className="relative w-16 sm:w-20 md:w-24 lg:w-28 h-12 sm:h-14 md:h-16 lg:h-18 rounded-lg sm:rounded-xl border bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30 p-1.5 sm:p-2 md:p-3 shadow-xl">
        <div className="flex items-center justify-between mb-1 sm:mb-1.5 md:mb-2">
          <div className="w-2/3 h-0.5 sm:h-0.5 md:h-1 bg-green-400/30 rounded-full"></div>
          <Sparkles className="h-2 w-2 sm:h-2 sm:w-2 md:h-3 md:w-3 text-green-400" />
        </div>
        <div className="w-full h-0.5 bg-green-400/20 rounded-full mb-0.5 sm:mb-0.5 md:mb-1"></div>
        <div className="w-3/4 h-0.5 bg-green-400/20 rounded-full"></div>
        <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 bg-green-500 text-white text-[8px] sm:text-[8px] md:text-[10px] font-bold px-1 sm:px-1 md:px-1.5 py-0.5 rounded-full">
          9/10
        </div>
      </div>
    </motion.div>
  );
};

// Rejected posts that fade at center
const RejectedPost = ({ delay, lane }: PostProps) => {
  const laneY = LANES[lane];
  
  return (
    <motion.div
      initial={{ x: 0, opacity: 1, scale: 1 }}
      animate={{
        x: [0, 100, 150, 200],
        y: [0, (50 - laneY) * 2, (50 - laneY) * 2.5, (50 - laneY) * 3],
        opacity: [1, 0.6, 0.3, 0],
        scale: [1, 0.7, 0.4, 0.2],
        rotate: [0, 15, 30, 45]
      }}
      transition={{
        duration: 3.5,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 8,
        ease: "easeInOut"
      }}
      className="absolute left-2 sm:left-4 md:left-6 lg:left-8"
      style={{ top: `${laneY}%` }}
    >
      <div className="relative w-10 sm:w-14 md:w-18 lg:w-20 h-8 sm:h-10 md:h-12 lg:h-14 rounded-md sm:rounded-lg border bg-[#2a2a2a] border-red-500/20 p-1 sm:p-1.5 md:p-2 shadow-lg">
        <div className="w-3/4 h-0.5 sm:h-0.5 md:h-1 bg-white/10 rounded-full mb-0.5 sm:mb-0.5 md:mb-1"></div>
        <div className="w-full h-0.5 bg-white/5 rounded-full"></div>
        <div className="absolute -top-0.5 sm:-top-0.5 md:-top-1 -right-0.5 sm:-right-0.5 md:-right-1 bg-red-500 rounded-full p-0.5">
          <X className="h-1.5 w-1.5 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[#1a1a1a] py-12 sm:py-16 md:py-20 lg:py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            How RedLeads Works
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg text-gray-400 px-4">
            A simple 3-step process to turn Reddit conversations into paying customers.
          </p>
        </div>

        {/* Visual Flow Animation */}
        <div className="mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-12 md:mb-16 relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#1a1a1a] border border-white/5">
          {/* Subtle gradient overlays */}
          <div className=""></div>
          
          {/* Left side label */}
          <div className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-center">
            <motion.div 
              
              
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/40 flex items-center justify-center mb-2 sm:mb-3 shadow-lg shadow-blue-500/20"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-blue-400" />
            </motion.div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">All Posts</span>
          </div>

          
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
            
            
            
            
            
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 rounded-full from-amber-500/30 to-orange-500/20 border-2 border-amber-500/50 flex items-center justify-center mb-2 sm:mb-3"
            >
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 text-amber-400" />
            </motion.div>
            <span className="text-xs sm:text-sm text-gray-300 font-semibold">AI Filter</span>
          </div>

          {/* Right side label */}
          <div className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 text-center">
            <motion.div 
              
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-15 lg:h-15 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/40 flex items-center justify-center mb-2 sm:mb-3 shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-green-400" />
            </motion.div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Hot Leads</span>
          </div>

          {/* Flow lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            
            
            
          </svg>

          {/* Lane indicators */}
          {LANES.map((lane, i) => (
            <div 
              key={`lane-${i}`}
              className="absolute left-0 right-2 h-px bg-white/5"
              style={{ top: `${lane}%` }}
            />
          ))}

          {/* Incoming posts in 4 lanes - mix of good and rejected */}
          {[
            { lane: 0, delay: 0, isGood: true },
            { lane: 2, delay: 1.5, isGood: true },
            { lane: 1, delay: 3, isGood: false },
            { lane: 3, delay: 4.5, isGood: false },
          ].map((config, i) => (
            <IncomingPost key={`in-${i}`} {...config} />
          ))}

          {/* Rejected posts */}
          {[
            { lane: 1, delay: 3 },
            { lane: 3, delay: 4.5 },
          ].map((config, i) => (
            <RejectedPost key={`reject-${i}`} {...config} />
          ))}

          {/* Outgoing good leads in lanes */}
          {[
            { lane: 0, delay: 0 },
            { lane: 2, delay: 1.5 },
          ].map((config, i) => (
            <OutgoingLead key={`out-${i}`} {...config} />
          ))}

          {/* Stats counter */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-6 md:gap-8">
            <div className="text-center px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-base sm:text-lg md:text-xl font-bold text-white">500+</div>
              <div className="text-[8px] sm:text-[10px] text-gray-500">Scanned</div>
            </div>
            <div className="text-center px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-green-500/10 border border-green-500/30 backdrop-blur-sm">
              <div className="text-base sm:text-lg md:text-xl font-bold text-green-400">50+</div>
              <div className="text-[8px] sm:text-[10px] text-green-500">Qualified</div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default HowItWorks;