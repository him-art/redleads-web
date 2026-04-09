import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import RedditEngagementCalculator from '@/components/tools/RedditEngagementCalculator';
import ToolFAQ from '@/components/tools/ToolFAQ';
import BenchmarkTable from '@/components/tools/BenchmarkTable';
import RelatedArticles from '@/components/tools/RelatedArticles';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Reddit Engagement Rate Calculator (2026) | Post Performance | RedLeads',
    description: 'Free Reddit engagement rate calculator. Calculate ER% from upvotes, comments & subreddit size. Compare to industry benchmarks. No login required.',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Reddit Engagement Rate Calculator',
    applicationCategory: 'AnalyticsApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Calculate Reddit post engagement rates with letter grading and benchmark comparison. Free, no login required.',
};

const faqs = [
    {
        question: 'What is a good engagement rate on Reddit?',
        answer: 'A good engagement rate on Reddit varies by subreddit size. Posts scoring 5-10% are considered exceptional (Grade A), while 10%+ is legendary (Grade S). Most posts average 1-3% engagement (Grade C).',
    },
    {
        question: 'How is Reddit engagement rate calculated?',
        answer: 'Reddit engagement rate is calculated as: ((Upvotes + Comments) / Subreddit Subscribers) x 100. This measures how effectively a post resonated relative to the community size.',
    },
    {
        question: 'Why is my Reddit engagement rate low?',
        answer: 'Low engagement often results from posting at the wrong time, using generic headlines, or posting in subreddits that are too large for your content to gain traction. Try smaller, niche subreddits for higher engagement.',
    },
    {
        question: 'Does this tool require a Reddit account?',
        answer: 'No. This calculator is completely free and requires no login or Reddit account. Simply enter your post metrics and get instant results.',
    },
    {
        question: 'How can I improve my Reddit engagement rate?',
        answer: 'Focus on case-study headlines, post during peak hours (early morning EST on weekdays), and reply to every comment in the first 2 hours. Our blog has detailed guides on Reddit content strategy.',
    },
];

const benchmarks = [
    { label: 'Legendary (Grade S)', value: '10%+ engagement', grade: 'S', color: 'orange' },
    { label: 'Exceptional (Grade A)', value: '5% - 10%', grade: 'A', color: 'green' },
    { label: 'Good (Grade B)', value: '3% - 5%', grade: 'B', color: 'blue' },
    { label: 'Average (Grade C)', value: '1% - 3%', grade: 'C', color: 'yellow' },
    { label: 'Low (Grade D)', value: 'Below 1%', grade: 'D', color: 'red' },
];

const relatedArticles = [
    {
        title: 'Reddit Content Marketing: How to Write Posts That Go Viral',
        description: 'Master the art of Reddit content marketing with headline formulas and engagement strategies.',
        href: '/blog/reddit-content-marketing-guide',
        category: 'Strategy',
    },
    {
        title: 'Best Reddit Marketing Tools for SaaS Founders (2026)',
        description: 'Compare the best tools for monitoring, engagement, and lead generation on Reddit.',
        href: '/blog/best-reddit-marketing-tools',
        category: 'Tools',
    },
    {
        title: 'How Engaging in Niche Reddit Posts Helped Me Get More Traffic',
        description: 'How micro-engagement in niche subreddits resulted in exponential traffic growth.',
        href: '/blog/growing-website-traffic-engaging-niche-reddit-posts',
        category: 'Growth',
    },
];

export default function RedditEngagementCalculatorPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="container mx-auto px-4 pt-20 sm:pt-25 pb-16 sm:pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
                        <MaterialIcon name="leaderboard" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free Analytics Tool</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-green-400">
                            No Login Required
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Engagement Rate <br />
                        <span className="text-orange-500 font-serif-italic">Calculator</span>
                        <span className="text-slate-500 text-2xl sm:text-3xl font-normal ml-2">(2026)</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Measure how well your Reddit posts actually perform relative to the community size. Get a grade and a plan to improve.
                    </p>
                </div>
                <RedditEngagementCalculator />
            </section>

            {/* How to Use Section */}
            <section className="container mx-auto px-4 py-20 border-b border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-2 text-center">How to Use This Tool</h2>
                    <p className="text-sm text-slate-500 text-center mb-12">Get your engagement grade in 3 simple steps</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Enter Metrics', desc: 'Input the upvotes, comments, and subreddit subscriber count for any Reddit post.', icon: 'edit_note' },
                            { step: '2', title: 'Calculate', desc: 'Our algorithm computes the engagement rate and compares it against industry benchmarks.', icon: 'calculate' },
                            { step: '3', title: 'Optimize', desc: 'Get a letter grade (S to D) and actionable tips to improve your next Reddit post.', icon: 'trending_up' },
                        ].map((s) => (
                            <div key={s.step} className="text-center space-y-4">
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

            {/* Benchmark Table */}
            <BenchmarkTable
                title="What is a Good Reddit Engagement Rate?"
                subtitle="Benchmarks based on analysis of 50,000+ Reddit posts across SaaS, marketing, and tech subreddits"
                rows={benchmarks}
            />

            {/* FAQ */}
            <ToolFAQ faqs={faqs} toolName="Reddit Engagement Rate Calculator" />

            {/* Related Articles */}
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
