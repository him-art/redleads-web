'use client';

import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}

export default function AnimatedCounter({ value, suffix = '', label, className = '' }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(0, { 
    mass: 1, 
    stiffness: 70, 
    damping: 20,
    restDelta: 0.001
  });
  
  const displayValue = useTransform(spring, (current) => {
    // Round to 1 decimal place if it's a small number, otherwise round to whole
    return Math.round(current);
  });
  
  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="flex items-baseline gap-0.5">
        <motion.span className="text-3xl md:text-5xl font-black text-white tracking-tighter">
          {displayValue}
        </motion.span>
        {suffix && (
          <span className="text-2xl md:text-3xl font-black text-orange-500 tracking-tighter">
            {suffix}
          </span>
        )}
      </div>
      <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">{label}</div>
    </div>
  );
}
