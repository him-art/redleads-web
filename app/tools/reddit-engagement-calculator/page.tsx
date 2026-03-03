import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import RedditEngagementCalculator from '@/components/tools/RedditEngagementCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Reddit Engagement Rate Calculator | Post Performance | RedLeads',
    description: 'Calculate the engagement rate of any Reddit post. Get a letter grade (S to D) and actionable tips to improve your Reddit marketing performance. Free tool.',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Reddit Engagement Rate Calculator',
    applicationCategory: 'AnalyticsApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Calculate Reddit post engagement rates with letter grading.',
};

export default function RedditEngagementCalculatorPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="container mx-auto px-4 pt-25 pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
                        <MaterialIcon name="leaderboard" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free Analytics Tool</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Engagement Rate <br />
                        <span className="text-orange-500 font-serif-italic">Calculator</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Measure how well your Reddit posts actually perform relative to the community size. Get a grade and a plan to improve.
                    </p>
                </div>
                <RedditEngagementCalculator />
            </section>

            <section className="container mx-auto px-4 py-24 border-b border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-8 text-center">Understanding Engagement Grades</h2>
                    <div className="grid md:grid-cols-5 gap-4 text-center">
                        {[
                            { grade: 'S', range: '10%+', color: 'text-orange-500 border-orange-500/20 bg-orange-500/5', label: 'Legendary' },
                            { grade: 'A', range: '5-10%', color: 'text-green-500 border-green-500/20 bg-green-500/5', label: 'Exceptional' },
                            { grade: 'B', range: '3-5%', color: 'text-blue-500 border-blue-500/20 bg-blue-500/5', label: 'Good' },
                            { grade: 'C', range: '1-3%', color: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5', label: 'Average' },
                            { grade: 'D', range: '<1%', color: 'text-red-500 border-red-500/20 bg-red-500/5', label: 'Low' },
                        ].map((g) => (
                            <div key={g.grade} className={`p-4 rounded-2xl border ${g.color}`}>
                                <div className={`text-3xl font-black ${g.color.split(' ')[0]}`}>{g.grade}</div>
                                <div className="text-xs text-white font-bold mt-1">{g.label}</div>
                                <div className="text-[10px] text-gray-500 mt-1">{g.range}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-bold text-white mb-8">Related Tools</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { name: 'Headline Generator', href: '/tools/reddit-headline-generator' },
                        { name: 'Best Posting Time', href: '/tools/best-posting-time-analyzer' },
                        { name: 'Karma Calculator', href: '/tools/reddit-karma-calculator' },
                        { name: 'All Tools →', href: '/tools' },
                    ].map((t) => (
                        <Link key={t.href} href={t.href} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 hover:text-orange-500 hover:border-orange-500/20 transition-all">
                            {t.name}
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
