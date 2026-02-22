import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NicheExplorer from '@/components/tools/NicheExplorer';
import MaterialIcon from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
    title: 'Free Reddit Niche Explorer | GummySearch Alternative | RedLeads',
    description: 'Find the best subreddits for your niche and extract common pain points. The ultimate audience research tool for Reddit marketers, startups, and agencies.',
};

export default function NicheExplorerPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            
            <section className="container mx-auto px-4 pt-25 pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
                        <MaterialIcon name="ads_click" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free Discovery Tool</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Reddit Niche <br />
                        <span className="text-orange-500 font-serif-italic">Explorer</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Find exactly where your audience is hiding and what problems they are paying to solve. No credit card required.
                    </p>
                </div>

                <NicheExplorer />
            </section>

            <section className="container mx-auto px-4 py-24 border-t border-white/5">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-6">The only <span className="text-orange-500">GummySearch</span> replacement you need.</h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Since GummySearch discontinued, founders have struggled to find a simple way to map out Reddit niches. We've built this tool to bridge that gap. 
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Discover hidden subreddits with high engagement",
                                "Identify common user frustrations using AI",
                                "Learn the 'niche-speak' before you post",
                                "Zero-cost audience research in seconds"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                    <MaterialIcon name="check_circle" size={18} className="text-orange-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MaterialIcon name="auto_awesome" size={120} />
                        </div>
                        <h3 className="text-white font-bold mb-4">Why use this?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Reddit marketing fails when you post the wrong thing in the wrong place. Our Niche Explorer helps you understand the culture and needs of a subreddit before you even draft your first post.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
