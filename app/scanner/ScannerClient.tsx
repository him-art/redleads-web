'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadSearch from '@/components/LeadSearch';
import { createClient } from '@/lib/supabase/client';
import { type User as SupabaseUser } from '@supabase/supabase-js';

interface ScannerClientProps {
    initialUser: any;
}

export default function ScannerClient({ initialUser }: ScannerClientProps) {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(initialUser);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/scanner`,
            },
        });
    };

    return (
        <main className="min-h-screen bg-[#1a1a1a] text-white selection:bg-orange-500/30">
            <Navbar />
            
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 mb-12"
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                            {user ? (
                                <>Welcome back, <br/><span className="text-orange-500 font-bold ">{user.email?.split('@')[0]}</span></>
                            ) : (
                                <>Who is talking about <br/><span className="text-orange-500 font-bold ">your business?</span></>
                            )}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            {user 
                                ? "You're all set. Drop a URL below to find high-intent leads across Reddit's biggest communities."
                                : "Drop your website URL and let RedLeads find relevant Reddit threads where people are searching for what you solve."
                            }
                        </p>
                    </motion.div>

                    <LeadSearch 
                        user={user} 
                        onShowModal={() => setShowModal(true)} 
                    />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="pb-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-400 text-lg">Everything you need to know about the Reddit Scanner.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "What exactly does this scanner do?",
                                answer: "It acts as a search engine for high-intent customers. We scan thousands of active Reddit communities to find conversations where people are explicitly asking for a solution like yours, so you can jump in and help them."
                            },
                            {
                                question: "How does it work?",
                                answer: "First, we analyze your website to understand your product and value proposition. Then, our AI uses that understanding to filter through millions of Reddit posts and comments, identifying only the ones that match your ideal customer profile with high purchasing intent."
                            }
                        ].map((item, index) => (
                            <div key={index} className="group bg-[#202020] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    suppressHydrationWarning
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">{item.question}</span>
                                    <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 bg-white/10' : ''}`}>
                                        <ChevronDown size={20} className="text-gray-400 group-hover:text-white" />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === index && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                                            <div className="px-6 pb-6 text-gray-400 leading-relaxed">{item.answer}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-[#252525] border border-white/10 p-10 rounded-[2.5rem] shadow-3xl text-center">
                            <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User size={28} />
                            </div>
                            <h2 className="text-3xl font-black mb-4 leading-tight">Limit Reached</h2>
                            <p className="text-gray-400 mb-8 font-light">
                                {user 
                                    ? "You've used your 5 free scans for today. Come back tomorrow or upgrade for unlimited access!"
                                    : "You've used your free scan. Sign in to continue finding leads for free!"
                                }
                            </p>
                            <div className="space-y-4">
                                <button onClick={handleSignIn} className="w-full py-5 bg-orange-500 hover:bg-orange-600 rounded-2xl font-black uppercase text-sm text-black flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20">
                                    Sign in with Google <ArrowRight size={18} />
                                </button>
                                <button onClick={() => setShowModal(false)} className="w-full py-4 text-gray-500 hover:text-white text-xs font-bold uppercase">Maybe Later</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <Footer />
        </main>
    );
}
