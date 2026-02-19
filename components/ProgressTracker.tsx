'use client';

import { motion } from 'framer-motion';
import MaterialIcon from '@/components/ui/MaterialIcon';

interface ProgressTrackerProps {
    contactedCount: number;
    dailyCount: number;
    goal?: number;
    dailyLimit?: number;
}

export default function ProgressTracker({ contactedCount, dailyCount, goal = 100, dailyLimit = 10 }: ProgressTrackerProps) {
    const totalPercentage = Math.min(100, (contactedCount / goal) * 100);
    const dailyPercentage = Math.min(100, (dailyCount / dailyLimit) * 100);
    
    // Level Logic
    const level = contactedCount < 15 ? 1 : contactedCount < 50 ? 2 : 3;
    const levelTitles = ["Helpful Ghost", "Subtle Solver", "Growth Specialist"];
    const levelColors = ["text-gray-400", "text-blue-400", "text-purple-400"];
    const levelBg = ["bg-gray-500/10", "bg-blue-500/10", "bg-purple-500/10"];

    // Safety logic
    const safetyStatus = dailyCount >= dailyLimit ? "STOP" : dailyCount >= dailyLimit * 0.7 ? "CAUTION" : "SAFE";
    const safetyColor = safetyStatus === "STOP" ? "text-red-500" : safetyStatus === "CAUTION" ? "text-yellow-500" : "text-green-500";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 1. THE MAIN PROGRESS BAR (To 100) */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-[#0A0A0A] border border-white/5 p-6 md:p-8 group shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="flex-shrink-0 text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                            <div className={`${levelBg[level-1]} p-2.5 rounded-2xl ${levelColors[level-1]}`}>
                                <MaterialIcon name="military_tech" size={24} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Expert Level {level}</h4>
                                <p className={`text-xs font-bold ${levelColors[level-1]} uppercase tracking-widest`}>{levelTitles[level-1]}</p>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 justify-center md:justify-start">
                            <span className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">
                                {contactedCount}
                            </span>
                            <span className="text-xl font-bold text-gray-600 uppercase tracking-widest italic">
                                / {goal}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <MaterialIcon name="target" size={14} className="text-orange-500" />
                                    The First 100 Users
                                </span>
                            </div>
                            <span className="text-xs font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                                {Math.round(totalPercentage)}%
                            </span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${totalPercentage}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                        <div className="flex justify-between text-[8px] font-black tracking-widest text-gray-700">
                             <span>PHASE 1 (TRUST)</span>
                             <span>PHASE 2 (SOLVE)</span>
                             <span>PHASE 3 (SCALE)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. THE ANTI-BAN SAFETY METER */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0A0A] border border-white/5 p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-xl border ${safetyStatus === 'SAFE' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        <MaterialIcon name="shield" size={20} />
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Safety Radar</span>
                        <p className={`text-xs font-black ${safetyColor}`}>{safetyStatus}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Velocity</span>
                        <span className="text-lg font-black text-white">{dailyCount}/{dailyLimit}</span>
                    </div>
                    
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            className={`h-full ${safetyStatus === 'SAFE' ? 'bg-green-500' : safetyStatus === 'CAUTION' ? 'bg-yellow-500' : 'bg-red-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${dailyPercentage}%` }}
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <MaterialIcon name="schedule" size={12} className="text-gray-600" />
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">
                            {safetyStatus === 'STOP' 
                                ? "Critical! Take a 2-hour break." 
                                : safetyStatus === 'CAUTION' 
                                    ? "Approach with caution. Spread out replies." 
                                    : "Normal activity. Looking human."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
