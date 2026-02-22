import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KarmaCalculator from '@/components/tools/KarmaCalculator';
import MaterialIcon from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
    title: 'Free Reddit Karma Calculator | RedLeads Toolset',
    description: 'Check any Reddit user\'s karma breakdown instantly. A free tool to analyze Reddit profile influence for marketing and outreach.',
};

export default function KarmaCalculatorPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            
            <section className="container mx-auto px-4 pt-25 pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
                        <MaterialIcon name="analytics" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free SEO Tool</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Reddit Karma <br />
                        <span className="text-orange-500 font-serif-italic">Calculator</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Analyze any user's influence. Perfect for identifying trust levels before you start Reddit outreach.
                    </p>
                </div>

                <KarmaCalculator />
            </section>

            <section className="container mx-auto px-4 py-24 text-center border-t border-white/5">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8">Why check Karma?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-sm">Targeting</h3>
                            <p className="text-xs text-slate-400">High karma users are often moderators or power users. Connecting with them is 10x more valuable.</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-sm">Trust Score</h3>
                            <p className="text-xs text-slate-400">Avoid "burnout" accounts with low karma. Focus on leads that are active and established.</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-sm">Lead Qual</h3>
                            <p className="text-xs text-slate-400">People who contribute a lot (high comment karma) are more likely to engage with your product responses.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
