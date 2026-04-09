import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import RedditAdCostCalculator from '@/components/tools/RedditAdCostCalculator';
import ToolFAQ from '@/components/tools/ToolFAQ';
import BenchmarkTable from '@/components/tools/BenchmarkTable';
import RelatedArticles from '@/components/tools/RelatedArticles';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Reddit Ad Cost Calculator (2026) | ROI vs Organic | RedLeads',
    description: 'Free Reddit ad cost calculator. Compare CPA of paid Reddit ads vs organic marketing. See how much you could save. No login required.',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Reddit Ad Cost Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Calculate Reddit ad spend ROI vs organic marketing. Free, no login required.',
};

const faqs = [
    {
        question: 'How much do Reddit ads cost in 2026?',
        answer: 'Reddit ads typically cost $1-$5 per click (CPC), with a minimum daily budget of $5. Cost per acquisition (CPA) for SaaS products typically ranges from $50-$200 depending on niche and targeting.',
    },
    {
        question: 'Is organic Reddit marketing cheaper than paid ads?',
        answer: 'Yes, significantly. Organic Reddit marketing through helpful engagement costs $0 per click. The only cost is your time or a monitoring tool like RedLeads ($19/mo), resulting in CPA under $5 for most SaaS products.',
    },
    {
        question: 'What is the average conversion rate for Reddit ads?',
        answer: 'Reddit ads typically convert at 0.5-2% for SaaS products. In comparison, organic engagement in high-intent threads converts at 5-15% because you are entering conversations where people are already seeking solutions.',
    },
    {
        question: 'Should I use Reddit ads or organic marketing?',
        answer: 'For early-stage startups, organic marketing delivers better ROI. Reddit ads become more effective once you have brand recognition and want to scale beyond what organic engagement can provide.',
    },
    {
        question: 'How does this calculator work?',
        answer: 'Enter your monthly Reddit ad spend, CPC, and conversion rate. The calculator compares your paid CPA against the typical organic CPA achieved through intent-based engagement, showing your potential savings.',
    },
];

const benchmarks = [
    { label: 'Reddit Ads CPC', value: '$1 - $5 per click' },
    { label: 'Reddit Ads CPA (SaaS)', value: '$50 - $200' },
    { label: 'Organic CPA (with RedLeads)', value: 'Under $5' },
    { label: 'Reddit Ads CTR', value: '0.3% - 1.5%' },
    { label: 'Organic Thread Conversion', value: '5% - 15%' },
];

const relatedArticles = [
    {
        title: 'Reddit vs LinkedIn: Which is Better for SaaS Lead Gen?',
        description: 'A deep dive comparison between Reddit and LinkedIn for lead generation ROI.',
        href: '/blog/reddit-vs-linkedin-lead-generation',
        category: 'Lead Generation',
    },
    {
        title: 'Best Social Media Lead Generation Tools for 2026',
        description: 'Compare tools across Reddit, Twitter, and LinkedIn to find the right toolkit.',
        href: '/blog/social-media-lead-generation-tools',
        category: 'Tools',
    },
    {
        title: 'Reddit Lead Generation: The Complete Guide (2026)',
        description: 'Master Reddit lead generation with intent-based monitoring and engagement.',
        href: '/blog/reddit-lead-generation-guide',
        category: 'Lead Generation',
    },
];

export default function RedditAdCostCalculatorPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="container mx-auto px-4 pt-20 sm:pt-25 pb-16 sm:pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
                        <MaterialIcon name="savings" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free ROI Tool</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-green-400">
                            No Login Required
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Reddit Ad Cost <br />
                        <span className="text-orange-500 font-serif-italic">Calculator</span>
                        <span className="text-slate-500 text-2xl sm:text-3xl font-normal ml-2">(2026)</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Are you burning money on Reddit ads? See exactly how much you could save by switching to organic Reddit marketing with RedLeads.
                    </p>
                </div>
                <RedditAdCostCalculator />
            </section>

            {/* Paid vs Organic comparison */}
            <section className="container mx-auto px-4 py-20 border-b border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-8 text-center">Paid Ads vs Organic Reddit Marketing</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <h3 className="text-red-500 font-bold mb-4">Paid Reddit Ads</h3>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>Average CPC of $1-$5</li>
                                <li>Users ignore/block sponsored content</li>
                                <li>Low trust factor from the community</li>
                                <li>Money stops, traffic stops</li>
                                <li>CPA typically $50-$200 for SaaS</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl">
                            <h3 className="text-green-500 font-bold mb-4">Organic with RedLeads</h3>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>$0 per click forever</li>
                                <li>Authentic engagement builds trust</li>
                                <li>Community sees you as a member</li>
                                <li>Content compounds over time</li>
                                <li>CPA under $5 for most SaaS products</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Use */}
            <section className="container mx-auto px-4 py-20 border-b border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-2 text-center">How to Use This Tool</h2>
                    <p className="text-sm text-slate-500 text-center mb-12">Calculate your Reddit ad ROI in 3 steps</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Enter Ad Spend', desc: 'Input your monthly Reddit advertising budget, CPC, and current conversion rate.', icon: 'payments' },
                            { title: 'Compare', desc: 'Our calculator compares your paid CPA against typical organic engagement CPA.', icon: 'compare_arrows' },
                            { title: 'Save Money', desc: 'See exactly how much you could save by shifting to organic intent-based marketing.', icon: 'savings' },
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

            <BenchmarkTable
                title="Reddit Advertising Benchmarks (2026)"
                subtitle="Industry-average costs and conversion rates for Reddit marketing"
                rows={benchmarks}
            />

            <ToolFAQ faqs={faqs} toolName="Reddit Ad Cost Calculator" />

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
