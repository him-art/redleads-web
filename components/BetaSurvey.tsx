'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Zap, Target, BarChart3, Users } from 'lucide-react';

interface BetaSurveyProps {
    onComplete: (responses: any) => void;
    onClose: () => void;
}

const steps = [
    {
        id: 'goal',
        question: "What is your primary goal with RedLeads?",
        options: [
            { label: "Finding SaaS Customers", value: 'saas', icon: Zap },
            { label: "Agency Prospecting", value: 'agency', icon: Target },
            { label: "Freelance Discovery", value: 'freelance', icon: Users },
            { label: "Market Research", value: 'research', icon: BarChart3 }
        ]
    },
    {
        id: 'redditors',
        question: "How many subreddits do you plan to track?",
        options: [
            { label: "1-3 (Testing)", value: '1-3' },
            { label: "4-7 (Growing)", value: '4-7' },
            { label: "8-10 (Maximum)", value: '8-10' }
        ]
    },
    {
        id: 'commitment',
        question: "Will you share feedback for a case study?",
        options: [
            { label: "Yes, I'd love to!", value: 'yes' },
            { label: "Maybe later", value: 'maybe' },
            { label: "Keep me anonymous", value: 'no' }
        ]
    },
    {
        id: 'source',
        question: "Where did you hear about us?",
        options: [
            { label: "Twitter / X", value: 'twitter' },
            { label: "Reddit", value: 'reddit' },
            { label: "LinkedIn / PH", value: 'professional' },
            { label: "Word of Mouth", value: 'referral' }
        ]
    }
];

export default function BetaSurvey({ onComplete, onClose }: BetaSurveyProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<any>({});

    const handleSelect = (value: string) => {
        const updatedResponses = { ...responses, [steps[currentStep].id]: value };
        setResponses(updatedResponses);

        if (currentStep < steps.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            onComplete(updatedResponses);
        }
    };

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-xl bg-[#111] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 overflow-hidden shadow-2xl"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        className="h-full bg-orange-500"
                    />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                            Founder Survey • {currentStep + 1}/{steps.length}
                        </span>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 tracking-tight leading-tight">
                                {step.question}
                            </h2>

                            <div className="grid gap-4">
                                {step.options.map((option) => {
                                    const Icon = (option as any).icon;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSelect(option.value)}
                                            className="group relative flex items-center gap-4 w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/[0.02] transition-all text-left"
                                        >
                                            {Icon && (
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                                                    <Icon size={20} />
                                                </div>
                                            )}
                                            <span className="text-base font-bold text-gray-300 group-hover:text-white transition-colors">
                                                {option.label}
                                            </span>
                                            <div className="ml-auto w-6 h-6 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight size={14} className="text-orange-500" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Background Glow */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none" />
            </motion.div>
        </div>
    );
}

function X({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
    );
}
