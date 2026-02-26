'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, Globe, Check, X, Crown, Shield, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import LoadingIcon from '@/components/ui/LoadingIcon';



interface OnboardingWizardProps {
    onComplete: (data: any, url?: string) => void;
    userEmail?: string;
    keywordLimit?: number;
}

const TOTAL_STEPS = 4; // 0-3


export default function OnboardingWizard({ onComplete, userEmail, keywordLimit = 15 }: OnboardingWizardProps) {
    const [step, setStep] = useState(0);
    const [url, setUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [error, setError] = useState('');


    // const [scanLeads, setScanLeads] = useState<any[]>([]); // Removed
    // const [isScanComplete, setIsScanComplete] = useState(false); // Removed
    const [isCompletingSetup, setIsCompletingSetup] = useState(false);

    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

    // Profile save status ref
    const saveResolvedRef = useRef(false);

    // Auto-focus input refs
    const urlInputRef = useRef<HTMLInputElement>(null);

    // Social proof ticker
    const socialProof = [
        "50+ founders automated on Reddit",
        "42 leads found in the last hour",
        "Average user finds 10+ leads per day",
        "Trusted by founders worldwide"
    ];
    const [proofIndex, setProofIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setProofIndex(i => (i + 1) % socialProof.length), 4000);
        return () => clearInterval(timer);
    }, []);

    // ──────────────────────────────
    // Step 1: Generate description + keywords from URL
    // ──────────────────────────────
    const handleGenerate = async () => {
        setError('');
        let normalizedUrl = url.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }
        try {
            const parsed = new URL(normalizedUrl);
            if (!parsed.hostname.includes('.')) throw new Error();
        } catch {
            setError('Please enter a valid URL like yoursite.com');
            return;
        }

        setIsGenerating(true);
        try {
            const { data } = await axios.post('/api/onboarding/generate', { url: normalizedUrl });
            setDescription(data.description || '');
            setKeywords((data.keywords || []).slice(0, keywordLimit));
            setUrl(normalizedUrl);
            setStep(1); // Jump to description step
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to analyze your site. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // ──────────────────────────────
    // Step 3 → 4: Save profile when leaving keywords step
    // ──────────────────────────────
    const saveProfile = useCallback(async () => {
        setIsCompletingSetup(true);
        try {
            await axios.post('/api/onboarding/complete', {
                url,
                description,
                keywords
            });
            saveResolvedRef.current = true;
            return true;
        } catch (err: any) {
            console.error('[Onboarding] Profile save error:', err);
            setError('Failed to save your profile. Please try again.');
            return false;
        } finally {
            setIsCompletingSetup(false);
        }
    }, [url, description, keywords]);

    // ──────────────────────────────
    // Step 5: Wait for scan if needed
    // ──────────────────────────────



    // ──────────────────────────────
    // Step 6: Handle plan selection (checkout)
    // ──────────────────────────────
    const handleSelectPlan = async (plan: 'starter' | 'growth') => {
        setCheckoutLoading(plan);
        try {
            // Ensure latest profile data is saved before redirected
            const saved = await saveProfile();
            if (!saved) {
                setCheckoutLoading(null);
                return;
            }

            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            });
            const data = await res.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || 'Failed to create checkout');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setCheckoutLoading(null);
        }
    };

    const handleSkipToTrial = async () => {
        setIsCompletingSetup(true);
        try {
            const saved = await saveProfile();
            if (saved) {
                onComplete({ description, keywords }, url);
            }
        } catch (err) {
            console.error('Skip to trial error:', err);
        } finally {
            setIsCompletingSetup(false);
        }
    };

    // ──────────────────────────────
    // Keyword management
    // ──────────────────────────────
    const addKeyword = () => {
        const trimmed = newKeyword.trim().toLowerCase();
        if (trimmed && keywords.length < keywordLimit && !keywords.includes(trimmed)) {
            setKeywords([...keywords, trimmed]);
            setNewKeyword('');
        }
    };

    const removeKeyword = (kw: string) => {
        setKeywords(keywords.filter(k => k !== kw));
    };

    // ──────────────────────────────
    // Navigation
    // ──────────────────────────────
    const canProceed = () => {
        switch (step) {
            case 0: return url.trim().length >= 3;
            case 1: return description.trim().length >= 20;
            case 2: return keywords.length >= 1;
            case 3: return true;
            default: return true;
        }
    };

    const goNext = () => {
        if (step === 0) {
            handleGenerate();
            return;
        }
        if (step === 2) {
            saveProfile();
        }
        if (step < TOTAL_STEPS - 1) {
            setStep(s => s + 1);
        }
    };

    const goBack = () => {
        if (step > 0) setStep(s => s - 1);
    };

    // ──────────────────────────────
    // Progress bar
    // ──────────────────────────────
    const progressPercent = ((step + 1) / TOTAL_STEPS) * 100;



    // ──────────────────────────────
    // Slide animation variants
    // ──────────────────────────────
    const slideVariants = {
        enter: { opacity: 0, x: 40, filter: 'blur(4px)' },
        center: { opacity: 1, x: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, x: -40, filter: 'blur(4px)' },
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center overflow-hidden p-4 sm:p-6">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/[0.1] via-transparent to-orange-900/[0.05] pointer-events-none" />
            
            <div className="w-full max-w-3xl bg-[#141414] rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col relative overflow-hidden h-full max-h-[600px] sm:max-h-[700px]">
                
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-50">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                {/* Step Indicator */}
                <div className="absolute top-8 right-8 flex items-center gap-2 z-50">
                    <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest mr-2">
                        Step {step + 1} of {TOTAL_STEPS}
                    </span>
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i === step ? 'bg-orange-500 scale-125' : 
                            i < step ? 'bg-orange-500/40' : 'bg-white/10'
                        }`} />
                    ))}
                </div>

                {/* Main Content Scrollable Area */}
                <div className="flex-1 overflow-hidden p-6 sm:p-10 flex flex-col items-center justify-center relative">
                    {/* Global Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-4 left-0 right-0 z-[60] flex justify-center"
                            >
                                <div className="bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg backdrop-blur-md">
                                    <Shield size={12} className="text-red-400" />
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{error}</span>
                                    <button onClick={() => setError('')} className="ml-1 text-red-400/50 hover:text-red-400">
                                        <X size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        
                        {/* ═══════════════════════════════ */}
                        {/*  STEP 0: WELCOME                */}
                        {/* ═══════════════════════════════ */}


                    {/* ═══════════════════════════════ */}
                    {/*  STEP 1: URL INPUT              */}
                    {/* ═══════════════════════════════ */}
                    {step === 0 && (
                        <motion.div key="step0" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="w-full space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                                    What&apos;s your product?
                                </h2>
                                <p className="text-text-secondary text-sm">
                                    Enter your website URL and our AI will analyze it instantly.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-primary transition-colors flex items-center justify-center">
                                        <Globe size={18} />
                                    </div>
                                    <input
                                        ref={urlInputRef}
                                        type="text"
                                        placeholder="yourproduct.com"
                                        value={url}
                                        onChange={(e) => { setUrl(e.target.value); setError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && canProceed() && goNext()}
                                        autoFocus
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all placeholder:text-text-secondary/40 font-medium tracking-tight"
                                    />
                                </div>
                                <p className="text-center text-[10px] text-text-secondary/40 font-bold uppercase tracking-widest">
                                    We&apos;ll scan your landing page to understand your product
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════════════════════════════ */}
                    {/*  STEP 1: PRODUCT DESCRIPTION    */}
                    {/* ═══════════════════════════════ */}
                    {step === 1 && (
                        <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="w-full space-y-6">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">
                                    <Check size={10} /> AI Analysis Complete
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                                    Your product pitch
                                </h2>
                                <p className="text-text-secondary text-sm">
                                    Review and refine how we describe your product. This helps us find the most relevant leads.
                                </p>
                            </div>

                            <div className="relative">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm leading-relaxed focus:outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all resize-none text-text-secondary"
                                />
                                <div className="absolute bottom-3 right-4 text-[9px] font-bold text-text-secondary/40 uppercase tracking-widest">
                                    {description.length} chars
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════════════════════════════ */}
                    {/*  STEP 2: KEYWORDS               */}
                    {/* ═══════════════════════════════ */}
                    {step === 2 && (
                        <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="w-full space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                                    Target keywords
                                </h2>
                                <p className="text-text-secondary text-sm">
                                    These keywords help us find Reddit conversations about your product. Add or remove as needed.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center min-h-[60px] p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                {keywords.map((kw) => (
                                    <motion.span 
                                        key={kw} 
                                        initial={{ scale: 0.8, opacity: 0 }} 
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs font-bold text-orange-400 group"
                                    >
                                        {kw}
                                        <button onClick={() => removeKeyword(kw)} className="opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <X size={12} />
                                        </button>
                                    </motion.span>
                                ))}
                                {keywords.length === 0 && (
                                    <p className="text-text-secondary/40 text-xs font-bold uppercase tracking-widest">
                                        No keywords yet — add some below
                                    </p>
                                )}
                            </div>

                            {keywords.length < keywordLimit && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a keyword..."
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/30 transition-all placeholder:text-text-secondary/40"
                                    />
                                    <button onClick={addKeyword} className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all">
                                        Add
                                    </button>
                                </div>
                            )}

                            <p className="text-center text-[10px] text-text-secondary/40 font-bold uppercase tracking-widest">
                                {keywords.length} / {keywordLimit} keywords
                            </p>
                        </motion.div>
                    )}

                    {/* ═══════════════════════════════ */}
                    {/*  STEP 3: SMART PRICING          */}
                    {/* ═══════════════════════════════ */}
                    {step === 3 && (
                        <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="w-full space-y-6">
                            <div className="text-center space-y-2">

                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                                    Your 3-day free trial is active
                                </h2>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Starter Plan */}
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary mb-3">Starter</h3>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-sm font-bold text-text-secondary/40 line-through">$15</span>
                                        <span className="text-3xl font-black text-text-primary">$7</span>
                                        <span className="text-xs text-text-secondary/50 font-bold uppercase">/mo</span>
                                    </div>
                                    <ul className="space-y-2.5 my-5 flex-grow">
                                        {['5 tracked keywords', '2 daily power searches', '100 AI reply drafts /mo', 'Daily email alerts'].map(f => (
                                            <li key={f} className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                                <Check size={10} className="text-text-secondary/50" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleSelectPlan('starter')}
                                        disabled={!!checkoutLoading}
                                        className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {checkoutLoading === 'starter' ? <LoadingIcon className="w-4 h-4" /> : 'Select Starter'}
                                    </button>
                                </div>

                                {/* Growth Plan */}
                                <div className="p-6 rounded-2xl bg-orange-500/[0.03] border border-orange-500/20 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-3 right-4 flex items-center gap-1 text-[8px] font-black uppercase text-orange-500 tracking-[0.3em]">
                                        <Crown size={10} /> Popular
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">Growth</h3>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-sm font-bold text-orange-500/30 line-through">$29</span>
                                        <span className="text-3xl font-black text-text-primary">$14</span>
                                        <span className="text-xs text-text-secondary/50 font-bold uppercase">/mo</span>
                                    </div>
                                    <ul className="space-y-2.5 my-5 flex-grow">
                                        {['15 tracked keywords', '5 daily power searches', '500 AI reply drafts /mo', 'Priority email alerts'].map(f => (
                                            <li key={f} className="text-[10px] font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                                                <Check size={10} className="text-orange-500" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleSelectPlan('growth')}
                                        disabled={!!checkoutLoading}
                                        className="w-full py-4 rounded-xl bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-orange-400 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(249,115,22,0.2)] flex items-center justify-center"
                                    >
                                        {checkoutLoading === 'growth' ? <LoadingIcon className="w-4 h-4" /> : 'Select Growth'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-4">
                                <button
                                    onClick={handleSkipToTrial}
                                    disabled={isCompletingSetup}
                                    className="group px-10 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-lg transition-all active:scale-[0.98] w-full sm:w-auto flex items-center justify-center mx-auto disabled:opacity-50"
                                >
                                    {isCompletingSetup ? (
                                        <div className="flex items-center gap-2">
                                            <LoadingIcon className="w-4 h-4" /> Setting Up...
                                        </div>
                                    ) : (
                                        <>
                                            Start free 3 day trial <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] font-bold text-text-secondary/40 uppercase tracking-[0.2em] flex items-center justify-center gap-1">
                                    <Shield size={10} />
                                    Cancel Anytime • Secure Dodo Checkout
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>



            {/* Bottom Navigation */}
            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between min-h-[40px]">
                    {step !== 3 ? (
                        <>
                            <button 
                                onClick={goBack}
                                disabled={step === 0}
                                className={`flex items-center gap-2 text-xs font-bold transition-colors uppercase tracking-widest ${
                                    step === 0 ? 'text-text-secondary/20 cursor-not-allowed' : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <ArrowRight size={14} className="rotate-180" /> Back
                            </button>

                            <button
                                onClick={goNext}
                                disabled={!canProceed() || isGenerating}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                    canProceed() && !isGenerating
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                                        : 'bg-white/5 text-text-secondary/50 cursor-not-allowed'
                                }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <LoadingIcon className="w-4 h-4" /> Analyzing...
                                    </>
                                ) : step === 0 ? (
                                    <>
                                        <Sparkles size={14} /> Analyze
                                    </>
                                ) : (
                                    <>
                                        Next <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                         /* Static footer text for Step 0, 5, 6 */
                         <div className="w-full text-center">
                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
                                <Users size={12} />
                                70+ founders using RedLeads.app
                            </div>
                         </div>
                    )}
                </div>
            </div>

            </div>
        </div>
    );
}
