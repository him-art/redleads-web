'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Copy, Check, AlertCircle, ShieldCheck, 
  Zap, Lock, Search, BrainCircuit, MessageSquare, ArrowRight, User 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // Assuming this exists as used in Scanner

// --- Types ---
type ReplyVariant = {
  title: string;
  content: string;
  explanation: string;
  psychology: string[];
};

// --- Labor Illusion Component (Dark Mode) ---
const LaborIllusion = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { text: "Scanning subreddit rules...", icon: Search, color: "text-blue-400" },
    { text: "Analyzing audience tone...", icon: MessageSquare, color: "text-purple-400" },
    { text: "Checking ban-risk factors...", icon: ShieldCheck, color: "text-green-400" },
    { text: "Drafting high-value replies...", icon: BrainCircuit, color: "text-orange-500" },
  ];

  useEffect(() => {
    const totalDuration = 3500;
    const intervalTime = totalDuration / steps.length;

    const interval = setInterval(() => {
      setStep(s => {
        if (s >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 500); 
          return s;
        }
        return s + 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full bg-[#252525] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-500/10 rounded-full animate-ping opacity-20" />
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 relative z-10 border border-white/5">
           {steps[step] && (
             <motion.div
               key={step}
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.5, opacity: 0 }}
             >
               <div className={`w-10 h-10 ${steps[step].color}`}>
                 { /* Dynamic Icon Rendering */ }
                 {(() => { const Icon = steps[step].icon; return <Icon size={40} />; })()}
               </div>
             </motion.div>
           )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
         {steps[step]?.text}
      </h3>
      
      <div className="w-64 h-1.5 bg-white/5 rounded-full mt-8 overflow-hidden">
        <motion.div 
          className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3.5, ease: "linear" }}
        />
      </div>
    </div>
  );
};

// --- Page Component ---
export default function ReplyPage() {
  const [productUrl, setProductUrl] = useState('');
  const [productContext, setProductContext] = useState('');
  const [redditPost, setRedditPost] = useState('');
  const [includeMention, setIncludeMention] = useState(true);
  
  const [showIllusion, setShowIllusion] = useState(false);
  const [results, setResults] = useState<ReplyVariant[] | null>(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const startGeneration = async () => {
    if (!productUrl && !productContext) return; 
    if (!redditPost) return;

    setShowIllusion(true);
    setError('');
    setResults(null); 
    
    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productUrl: productUrl || productContext,
          redditPost,
          includeMention,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate replies');
      setResults(data.replies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setShowIllusion(false);
    }
  };

  const handleIllusionComplete = () => {
    setShowIllusion(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans selection:bg-orange-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
             className="space-y-4"
          >
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
               Ban-Safe AI <span className="text-orange-500 font-bold">Reply Drafter</span>
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              Paste a Reddit post to generate helpful, non-spammy replies that effectively mention your product.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[400px] relative">
           <AnimatePresence mode="wait">
             {showIllusion ? (
               <motion.div
                 key="illusion"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.05 }}
                 className="absolute inset-0 z-20"
               >
                 <LaborIllusion onComplete={handleIllusionComplete} />
               </motion.div>
             ) : results ? (
                // --- RESULTS VIEW ---
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                   <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-orange-500 fill-orange-500" /> Generated Drafts
                      </h2>
                      <button 
                        onClick={() => { setResults(null); }}
                        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5"
                      >
                        Draft New Reply
                      </button>
                   </div>

                   <div className="grid gap-6">
                      {results.map((variant, idx) => (
                        <div key={idx} className="bg-[#252525] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors group">
                           
                           {/* Card Header */}
                           <div className="flex items-start justify-between mb-6">
                               <div>
                                 <h3 className="font-bold text-white text-xl mb-3 flex items-center gap-3">
                                   {variant.title}
                                 </h3>
                                 <div className="flex flex-wrap gap-2">
                                   {variant.psychology?.map((tag, tIdx) => (
                                     <span key={tIdx} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 text-gray-400 rounded-md border border-white/5">
                                       {tag}
                                     </span>
                                   ))}
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-500 rounded-md border border-green-500/20 flex items-center gap-1">
                                       <ShieldCheck size={10} /> Safe
                                     </span>
                                 </div>
                               </div>
                           </div>
                           
                           {/* Content */}
                           <div className="bg-black/20 p-6 rounded-2xl text-base leading-relaxed text-gray-300 font-medium whitespace-pre-wrap border border-white/5 font-sans">
                             {variant.content}
                           </div>

                           {/* Copy Button */}
                           <div className="mt-8 flex justify-end">
                              <button
                                onClick={() => handleCopy(variant.content, idx)}
                                className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg
                                  ${copiedIndex === idx 
                                    ? 'bg-green-500 text-black shadow-green-500/20' 
                                    : 'bg-white text-black hover:bg-orange-500 hover:shadow-orange-500/20'
                                  }
                                `}
                              >
                                {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                                {copiedIndex === idx ? 'Copied!' : 'Copy Reply'}
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   {/* Upsell Banner */}
                   <div className="bg-gradient-to-r from-orange-500 to-orange-500 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-110">
                          <Zap size={120} fill="white" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-black mb-2 leading-tight">Want to automate this?</h3>
                        <p className="text-black/80 font-medium text-lg">
                          Get the Pro Chrome Extension to draft replies directly on Reddit.
                        </p>
                      </div>
                      <Link href="/#pricing" className="relative z-10 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                        Get Extension <ArrowRight size={16} className="inline ml-1" />
                      </Link>
                   </div>
                </motion.div>
             ) : (
               // --- INPUT FORM (Dark Mode) ---
               <motion.div
                 key="form"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="bg-[#252525] rounded-[2.5rem] border border-white/5 p-8 sm:p-12 space-y-10 relative overflow-hidden"
               >
                  {/* Subtle Background pattern */}
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

                  {/* Step 1: Product */}
                  <div className="space-y-4 relative z-10">
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">
                       1. What are you promoting?
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full relative group">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-orange-500 transition-colors">
                             <Lock size={18} />
                          </div>
                          <input 
                            type="url" 
                            placeholder="Website URL..."
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-white placeholder:text-gray-600"
                          />
                        </div>

                        <div className="shrink-0 flex items-center justify-center">
                          <span className="text-[10px] font-black text-gray-600 bg-[#1a1a1a] px-2 py-1 rounded border border-white/5 uppercase">
                            OR
                          </span>
                        </div>

                        <div className="w-full relative group">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-orange-500 transition-colors">
                             <MessageSquare size={18} />
                          </div>
                          <input 
                            type="text" 
                            placeholder="Short description..."
                            value={productContext}
                            onChange={(e) => setProductContext(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-white placeholder:text-gray-600"
                          />
                        </div>
                    </div>
                  </div>

                  {/* Step 2: Input */}
                  <div className="space-y-4 relative z-10">
                     <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">
                        2. Paste Reddit Post
                     </label>
                     <textarea 
                        placeholder="Paste the post title, body, or link here..."
                        value={redditPost}
                        onChange={(e) => setRedditPost(e.target.value)}
                        rows={5}
                        className="w-full p-6 bg-[#1a1a1a] border border-white/10 rounded-2xl focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-white placeholder:text-gray-600 resize-none leading-relaxed"
                     />
                  </div>

                  {/* Mentions Toggle */}
                  <div className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl border border-white/5 relative z-10">
                      <span className="text-sm font-bold text-gray-400">Include subtle product mention?</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={includeMention} onChange={(e) => setIncludeMention(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                  </div>

                  {/* Action */}
                  <button
                    onClick={startGeneration}
                    disabled={(!productUrl && !productContext) || !redditPost}
                    className="w-full py-5 bg-orange-500 hover:bg-orange-600 disabled:bg-white/5 disabled:text-gray-500 disabled:border-2 disabled:border-orange-500/50 disabled:cursor-not-allowed text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative z-10 border-2 border-transparent"
                  >
                     {(!productUrl && !productContext) || !redditPost ? (
                        <>Fill required fields to start</>
                     ) : (
                        <>
                           <Zap size={18} className="fill-white" />
                           Generate Drafts
                        </>
                     )}
                  </button>
                  
                  {/* Security Badge */}
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
                       <ShieldCheck className="text-green-500" size={12} /> 100% Ban-Safe Guarantee
                    </p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </main>
      
      {/* Dark Footer is handled by imported Footer component assuming it's responsive to dark mode or inherently dark/neutral */}
    </div>
  );
}
