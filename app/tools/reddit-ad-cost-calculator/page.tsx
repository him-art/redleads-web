import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import RedditAdCostCalculator from '@/components/tools/RedditAdCostCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Reddit Ad Cost Calculator | ROI vs Organic Marketing | RedLeads',
    description: 'Calculate how much you\'re wasting on Reddit ads vs organic lead generation. See the exact cost per acquisition and compare to organic reach. Free tool.',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Reddit Ad Cost Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Calculate Reddit ad spend ROI vs organic marketing.',
};

export default function RedditAdCostCalculatorPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="container mx-auto px-4 pt-20 sm:pt-25 pb-16 sm:pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
                        <MaterialIcon name="savings" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free ROI Tool</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Reddit Ad Cost <br />
                        <span className="text-orange-500 font-serif-italic">Calculator</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Are you burning money on Reddit ads? See exactly how much you could save by switching to organic Reddit marketing with RedLeads.
                    </p>
                </div>
                <RedditAdCostCalculator />
            </section>

            <section className="container mx-auto px-4 py-24 border-b border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-8 text-center">Paid Ads vs Organic Reddit Marketing</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <h3 className="text-red-500 font-bold mb-4">❌ Paid Reddit Ads</h3>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>• Average CPC of $1-$5</li>
                                <li>• Users ignore/block sponsored content</li>
                                <li>• Low trust factor from the community</li>
                                <li>• Money stops → traffic stops</li>
                                <li>• CPA typically $50-$200 for SaaS</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl">
                            <h3 className="text-green-500 font-bold mb-4">✅ Organic with RedLeads</h3>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>• $0 per click forever</li>
                                <li>• Authentic engagement builds trust</li>
                                <li>• Community sees you as a member</li>
                                <li>• Content compounds over time</li>
                                <li>• CPA under $5 for most SaaS products</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-bold text-white mb-8">Related Tools</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { name: 'Engagement Calculator', href: '/tools/reddit-engagement-calculator' },
                        { name: 'Opportunity Finder', href: '/tools/reddit-opportunity-finder' },
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
