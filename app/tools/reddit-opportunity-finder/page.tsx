import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OpportunityFinder from '@/components/tools/OpportunityFinder';
import MaterialIcon from '@/components/ui/MaterialIcon';
import ToolFAQ from '@/components/tools/ToolFAQ';
import RelatedArticles from '@/components/tools/RelatedArticles';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Free Reddit Opportunity Finder (2026) | Find Leads Instantly | RedLeads',
    description: 'Free Reddit opportunity finder. Enter your website URL and instantly find high-intent leads on Reddit. See who needs your solution right now. No login required.',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Reddit Opportunity Finder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Enter your website URL and instantly find high-intent Reddit conversations. Free, no login required.',
};

const faqs = [
    {
        question: 'How does the Reddit Opportunity Finder work?',
        answer: 'The tool analyzes your website URL to understand your product offering. It then scans Reddit for conversations where users are actively seeking solutions that match your product, ranking them by purchase intent.',
    },
    {
        question: 'Is this tool really free?',
        answer: 'Yes, you can run a free scan with no login required. The free version shows a preview of discovered leads. Sign up for RedLeads Pro to unlock all leads and get continuous 24/7 monitoring.',
    },
    {
        question: 'What types of opportunities does it find?',
        answer: 'The tool finds competitor complaints, solution-seeking questions, feature requests, and buying discussions. These are conversations where someone is likely to convert when presented with the right solution.',
    },
    {
        question: 'How often should I scan for opportunities?',
        answer: 'For best results, scan daily. Reddit conversations move fast, and the first helpful responder captures 80% of thread visibility. RedLeads Pro automates this with real-time alerts.',
    },
    {
        question: 'Can I use this for any product or niche?',
        answer: 'Yes. The AI analyzes your specific URL and adapts its search to your product category, whether SaaS, e-commerce, services, or content. It works across all Reddit niches.',
    },
];

const relatedArticles = [
    {
        title: 'How to Find Your First Customers on Reddit (2026 Guide)',
        description: 'Learn proven strategies to find customers on Reddit with the Complaint Search method.',
        href: '/blog/how-to-find-customers-on-reddit',
        category: 'Growth',
    },
    {
        title: 'Reddit Lead Generation: The Complete Guide (2026)',
        description: 'Master the 3-phase strategy for identifying and converting Reddit leads.',
        href: '/blog/reddit-lead-generation-guide',
        category: 'Lead Generation',
    },
    {
        title: 'The Ultimate Reddit Marketing Strategy for 2026',
        description: 'Build a sustainable Reddit strategy with the 90/10 value rule.',
        href: '/blog/reddit-marketing-strategy-2026',
        category: 'Strategy',
    },
];

export default function OpportunityFinderPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a]">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            
            <section className="container mx-auto px-4 pt-20 sm:pt-25 pb-16 sm:pb-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
                        <MaterialIcon name="search" size={16} className="text-orange-500" />
                        <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Free Tool</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-green-400">
                            No Login Required
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Find Reddit Leads <br />
                        <span className="text-orange-500 font-serif-italic">In Seconds</span>
                        <span className="text-slate-500 text-2xl sm:text-3xl font-normal ml-2">(2026)</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Don&apos;t guess where your customers are. Our AI scans millions of Reddit conversations to find people actively looking for your solution right now.
                    </p>
                </div>

                <OpportunityFinder />
            </section>

            {/* How it works */}
            <section className="container mx-auto px-4 py-20 border-b border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-white mb-2 text-center">How It Works</h2>
                    <p className="text-sm text-slate-500 text-center mb-12">Find your first leads in under 60 seconds</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Scan', desc: 'We analyze your product URL to understand what you sell and who your ideal customer is.', icon: 'document_scanner' },
                            { step: '2', title: 'Search', desc: 'Our AI identifies high-intent keywords and finds live conversations where people need your solution.', icon: 'manage_search' },
                            { step: '3', title: 'Reveal', desc: 'See a preview of leads instantly. Sign up to unlock them all and get real-time alerts.', icon: 'visibility' },
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

            <ToolFAQ faqs={faqs} toolName="Reddit Opportunity Finder" />

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
