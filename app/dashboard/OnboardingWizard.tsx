'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Loader2, Check, Sparkles, Target, Type } from 'lucide-react';
import axios from 'axios';

interface OnboardingWizardProps {
    onComplete: (data: any, url?: string) => void;
    userEmail?: string;
    keywordLimit?: number;
}

export default function OnboardingWizard({ onComplete, userEmail, keywordLimit = 15 }: OnboardingWizardProps) {
    const [step, setStep] = useState(0);
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);

    const getSanitizedUrl = (input: string) => {
        let trimmed = input.trim();
        if (!trimmed) return '';
        if (!/^https?:\/\//i.test(trimmed)) {
            trimmed = `https://${trimmed}`;
        }
        return trimmed;
    };
    
    // Step 1: Input URL & Generate Profile
    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        
        setIsLoading(true);
        try {
            const sanitizedUrl = getSanitizedUrl(url);
            setUrl(sanitizedUrl); // Update local state with sanitized version
            const res = await axios.post('/api/onboarding/generate', { url: sanitizedUrl });
            setDescription(res.data.description);
            setKeywords(res.data.keywords);
            setStep(1); // Move to Review
        } catch (error) {
            console.error(error);
            // Fallback: Let user manually enter if AI fails
            setStep(1);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2 & 3: Review & Complete
    const handleComplete = async () => {
        setIsLoading(true);
        try {
            const sanitizedUrl = getSanitizedUrl(url);
            console.log('[Onboarding] Completing setup for:', sanitizedUrl);
            const res = await axios.post('/api/onboarding/complete', {
                url: sanitizedUrl,
                description,
                keywords
            }, {
                timeout: 60000 // 60s timeout for initial scan
            });
            
            if (res.data.success) {
                onComplete(res.data, sanitizedUrl);
            } else {
                throw new Error(res.data.error || 'Setup failed');
            }
        } catch (error: any) {
            console.error('[Onboarding Error]', error);
            
            let message = error.response?.data?.error || error.message || 'Something went wrong finishing setup.';
            
            // Extract Zod detailed error if available
            if (error.response?.data?.details) {
                const details = error.response.data.details;
                const firstError = Object.values(details)[0] as any;
                if (firstError?._errors?.[0]) {
                    message = firstError._errors[0];
                }
            }

            alert(`${message}\n\nPlease check your input and try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeywordChange = (index: number, val: string) => {
        const newKeywords = [...keywords];
        newKeywords[index] = val;
        setKeywords(newKeywords);
    };

    const addKeyword = () => setKeywords([...keywords, '']);

    return (
        <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
                <AnimatePresence mode="wait">
                    {/* STEP 0: WELCOME & URL */}
                    {step === 0 && (
                        <motion.div 
                            key="step0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8 text-center"
                        >
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                                    <Globe className="text-black" size={32} />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                    Let's find your first users.
                                </h1>
                                <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-md mx-auto">
                                    Enter your product URL. We'll analyze it to find high-intent leads on Reddit.
                                </p>
                            </div>

                            <form onSubmit={handleAnalyze} className="relative max-w-md mx-auto group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Globe className="text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="yourwebsite.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 focus:bg-[#151515] transition-all font-medium"
                                    autoFocus
                                />
                                <button 
                                    type="submit"
                                    disabled={isLoading || !url}
                                    className="absolute right-2 top-2 bottom-2 bg-orange-500 text-black font-bold px-4 rounded-lg hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 1: REVIEW & CUSTOMIZE */}
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black text-white">Refine your Targeting</h2>
                                <p className="text-sm text-gray-500">Is this accurate? Fine-tune it for better results.</p>
                            </div>

                            <div className="space-y-6">
                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-between gap-2 w-full">
                                        <div className="flex items-center gap-2">
                                            <Type size={12} /> Product Pitch
                                        </div>
                                        <span className={`transition-colors ${description.length < 20 ? 'text-orange-500' : 'text-green-500'}`}>
                                            {description.length}/20 chars
                                        </span>
                                    </label>
                                    <textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:border-orange-500/50 focus:outline-none transition-all resize-none"
                                        placeholder="e.g. An AI tool that helps SaaS founders find leads..."
                                    />
                                </div>

                                {/* Keywords */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                            <Target size={12} /> Target Keywords
                                        </label>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                                            {keywords.length}/{keywordLimit} Limit
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                        {keywords.map((kw, i) => (
                                            <div key={i} className="flex items-center gap-2 group">
                                                <input 
                                                    value={kw}
                                                    onChange={(e) => handleKeywordChange(i, e.target.value)}
                                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {keywords.length < keywordLimit && (
                                        <button onClick={addKeyword} className="text-xs text-orange-500 font-bold hover:underline">
                                            + Add another keyword
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={handleComplete}
                                disabled={isLoading}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} /> Initializing Power Scan...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} /> Launch Dashboard
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
