'use client';

import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, label }: { value: number, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(0, { mass: 1, stiffness: 50, damping: 15 });
  const displayValue = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-baseline gap-1">
        <motion.span className="text-3xl font-bold text-white">
          {displayValue}
        </motion.span>
        <span className="text-3xl font-bold text-white">
            {value >= 1000000 ? 'M+' : 'k+'}
        </span>
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
