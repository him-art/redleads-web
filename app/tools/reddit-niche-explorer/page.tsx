import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NicheExplorer from '@/components/tools/NicheExplorer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import ToolFAQ from '@/components/tools/ToolFAQ';
import RelatedArticles from '@/components/tools/RelatedArticles';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Reddit Niche Explorer (2026) | GummySearch Alternative | RedLeads',
    description: 'Free Reddit niche explorer. Find the best subreddits for your niche and extract real user pain points with AI. GummySearch alternative. No login required.',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Reddit Niche Explorer',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Find the best subreddits for your niche and extract common pain points. Free GummySearch alternative.',
};

const faqs = [
    {
        question: 'What is a Reddit Niche Explorer?',
        answer: 'A Reddit Niche Explorer analyzes any keyword or niche to discover the most relevant subreddits, common user pain points, and community engagement patterns. It helps you understand where your audience lives before you start marketing.',
    },
    {
        question: 'Is this a GummySearch replacement?',
        answer: 'Yes. Since GummySearch discontinued, we built this free tool to fill the gap. It provides subreddit discovery, pain point extraction, and niche-speak analysis, all powered by AI.',
    },
    {
        question: 'How do I find the right subreddits for my product?',
        answer: 'Enter your niche keyword (e.g., "email marketing" or "project management"). The explorer will surface the most relevant subreddits ranked by engagement and audience fit, including hidden communities you might miss.',
    },
    {
        question: 'Can I use this for market research?',
        answer: 'Absolutely. The pain point extraction feature reveals what real users are frustrated about in your niche, giving you product development insights and marketing messaging angles straight from your target audience.',
    },
    {
        question: 'Do I need to create an account?',
        answer: 'No. The Niche Explorer is completely free with no login required. For continuous monitoring and automated alerts, you can upgrade to RedLeads Pro.',
    },
];

const relatedArticles = [
    {
        title: 'Reddit Keyword Research: Finding High-Intent Buyer Keywords',
        description: 'Learn how to find buyer intent keywords on Reddit using the hierarchy of intent framework.',
        href: '/blog/reddit-keyword-research',
        category: 'Strategy',
    },
    {
        title: 'Top 10 Subreddits for SaaS Marketing & Growth in 2026',
        description: 'The definitive list of subreddits where SaaS founders can find customers and grow.',
        href: '/blog/best-subreddits-for-saas-marketing',
        category: 'Growth',
    },
    {
        title: 'How to Use Reddit for SaaS Growth: A Founder\'s Playbook',
        description: 'The winning playbook for growing your SaaS through strategic Reddit engagement.',
        href: '/blog/reddit-for-saas-growth',
        category: 'Growth',
    },
];

export default function NicheExplorerPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <section className="container mx-auto px-4 pt-20 sm:pt-25 pb-16 sm:pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
                        <MaterialIcon name="ads_click" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free Discovery Tool</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-green-400">
                            No Login Required
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Reddit Niche <br />
                        <span className="text-orange-500 font-serif-italic">Explorer</span>
                        <span className="text-slate-500 text-2xl sm:text-3xl font-normal ml-2">(2026)</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Find exactly where your audience is hiding and what problems they are paying to solve. No credit card required.
                    </p>
                </div>

                <NicheExplorer />
            </section>

            {/* GummySearch replacement section */}
            <section className="container mx-auto px-4 py-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-6">The only <span className="text-orange-500">GummySearch</span> replacement you need.</h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Since GummySearch discontinued, founders have struggled to find a simple way to map out Reddit niches. We&apos;ve built this tool to bridge that gap. 
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

            {/* How to Use */}
            <section className="container mx-auto px-4 py-20 border-b border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-2 text-center">How to Use This Tool</h2>
                    <p className="text-sm text-slate-500 text-center mb-12">Discover your niche in 3 steps</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Enter Niche', desc: 'Type any keyword, product category, or problem statement to explore.', icon: 'search' },
                            { title: 'Discover', desc: 'Our AI surfaces the most relevant subreddits, ranked by engagement and audience fit.', icon: 'explore' },
                            { title: 'Understand', desc: 'See real pain points, common language patterns, and community dynamics.', icon: 'psychology' },
                        ].map((s) => (
                            <div key={s.title} className="text-center space-y-4">
                                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto">
                                    <MaterialIcon name={s.icon} size={24} className="text-orange-500" />
                                </div>
                                <h3 className="text-white font-bold">{s.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ToolFAQ faqs={faqs} toolName="Reddit Niche Explorer" />

            <RelatedArticles articles={relatedArticles} />

            {/* CTA */}
            <section className="container mx-auto px-4 py-24 text-center border-t border-white/5">
                <MaterialIcon name="auto_awesome" size={48} className="text-orange-500 mb-6 mx-auto opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-4">Want 24/7 Automated Monitoring?</h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm max-w-lg mx-auto">
                    Our free tools provide a snapshot. RedLeads Pro monitors your keywords around the clock and alerts you the second a high-intent conversation starts.
                </p>
                <Link 
                    href="/login"
                    className="inline-block px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:scale-105 transition-transform"
                >
                    Try Professional Tier Free
                </Link>
            </section>

            <Footer />
        </main>
    );
}
