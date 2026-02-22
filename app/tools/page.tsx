import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Reddit Marketing Toolkit | RedLeads.app',
    description: 'Explore our collection of free tools for Reddit lead generation, audience research, and niche analysis. No account required to start.',
};

const tools = [
    {
        title: "Reddit Opportunity Finder",
        description: "Enter your product URL and find high-intent Reddit threads where users are looking for a solution like yours.",
        href: "/tools/reddit-opportunity-finder",
        icon: "travel_explore",
        badge: "Most Popular",
        color: "orange"
    },
    {
        title: "Reddit Niche Explorer",
        description: "Analyze any niche or keyword to find the best subreddits and extract real user pain points using AI.",
        href: "/tools/reddit-niche-explorer",
        icon: "explore",
        badge: "New",
        color: "blue"
    }
];

export default function ToolsHubPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            
            <section className="container mx-auto px-4 pt-40 pb-32">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                        Reddit <span className="text-orange-500 font-serif-italic">Toolkit</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Free AI-powered tools to help you find your first 100 users on Reddit.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {tools.map((tool, i) => (
                        <div key={i} className="p-2 bg-white/5 border border-orange-500/10 rounded-[2.5rem]">
                            <Link 
                                href={tool.href}
                                className="group relative block bg-[#0c0c0c] border border-orange-500/20 rounded-[2rem] p-8 md:p-10 hover:border-orange-500/40 transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                                        <MaterialIcon name={tool.icon} size={28} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-500 group-hover:text-orange-500 group-hover:border-orange-500/20 transition-all italic">
                                        {tool.badge}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-orange-500 transition-colors tracking-tight">
                                    {tool.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed mb-8 flex-1">
                                    {tool.description}
                                </p>

                                <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest">
                                    Start Analysis
                                    <MaterialIcon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Section */}
            <section className="container mx-auto px-4 py-24 border-t border-white/5 bg-black/20">
                <div className="max-w-3xl mx-auto text-center">
                    <MaterialIcon name="auto_awesome" size={48} className="text-orange-500 mb-6 mx-auto opacity-50" />
                    <h2 className="text-2xl font-bold text-white mb-4">Want 24/7 Automated Monitoring?</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                        Our free tools provide a snapshot. RedLeads Pro monitors your keywords around the clock and alerts you the second a high-intent conversation starts.
                    </p>
                    <Link 
                        href="/login"
                        className="inline-block px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:scale-105 transition-transform"
                    >
                        Try Professional Tier Free
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
