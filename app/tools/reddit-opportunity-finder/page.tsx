import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OpportunityFinder from '@/components/tools/OpportunityFinder';
import MaterialIcon from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
    title: 'Free Reddit Opportunity Finder | RedLeads',
    description: 'Enter your website URL and instantly find high-intent leads on Reddit. See who is talking about your competitors or problems you solve.',
};

export default function OpportunityFinderPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            
            <section className="container mx-auto px-4 pt-40 pb-20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
                        <MaterialIcon name="search" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free Tool</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Find Reddit Leads <br />
                        <span className="text-orange-500 font-serif-italic">In Seconds</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Don't guess where your customers are. Our AI scans millions of Reddit conversations to find people actively looking for your solution right now.
                    </p>
                </div>

                <OpportunityFinder />
            </section>

            <section className="container mx-auto px-4 py-24 text-center border-t border-white/5">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8">How it works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-xl font-black text-white border border-white/10">1</div>
                            <h3 className="text-white font-bold">Scan</h3>
                            <p className="text-sm text-slate-400">We analyze your product URL to understand what you sell.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-xl font-black text-white border border-white/10">2</div>
                            <h3 className="text-white font-bold">Search</h3>
                            <p className="text-sm text-slate-400">Our AI identifies high-intent keywords and finds live conversations.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-xl font-black text-white border border-white/10">3</div>
                            <h3 className="text-white font-bold">Reveal</h3>
                            <p className="text-sm text-slate-400">See a preview of leads instantly. Sign up to unlock them all.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
