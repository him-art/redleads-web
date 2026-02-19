import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reddit Marketing for SaaS Founders | RedLeads',
  description: 'Scale your SaaS growth with automated Reddit lead generation. Find your first 100 users and beyond with AI intent scoring.',
};

export default function SaaSPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
            <MaterialIcon name="rocket_launch" size={16} className="text-orange-500" />
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">SaaS Growth Engine</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            Scale Your SaaS <br />
            <span className="text-orange-500 font-serif-italic">On Reddit</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            The best customers are the ones already searching for a solution. Use RedLeads to identify high-intent founders, developers, and product managers at the exact moment they need you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="px-10 py-5 bg-orange-500 text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform w-full sm:w-auto"
            >
              Start automated
            </Link>
            <Link 
              href="/protocol"
              className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto flex items-center gap-2 justify-center"
            >
              <MaterialIcon name="verified_user" size={18} />
              Safe Engagement
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-[#141414] rounded-3xl border border-white/5">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
              <MaterialIcon name="group" size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-4">High CAC</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ads are becoming unaffordable for bootstrapped founders. Reddit allows you to reach your niche for $0 in ad spend.
            </p>
          </div>
          <div className="p-8 bg-[#141414] rounded-3xl border border-white/5">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
              <MaterialIcon name="bar_chart" size={24} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-4">Low Conversion</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cold outreach conversion rates are dropping. Reddit conversations provide the context needed for a 5x higher reply rate.
            </p>
          </div>
          <div className="p-8 bg-[#141414] rounded-3xl border border-white/5">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <MaterialIcon name="target" size={24} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-4">Feature Blindness</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Don't guess what features to build. Monitor subreddits to see exactly what pain points your competitors' users are complaining about.
            </p>
          </div>
        </div>
      </section>

      {/* SaaS Specific Use Cases */}
      <section className="container mx-auto px-4 py-32 bg-white rounded-[4rem] text-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter text-center">4 Ways SaaS Founders <br /><span className="text-orange-500 italic font-serif">Use RedLeads</span></h2>
          
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black">01</div>
              <div>
                <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">Competitor Churn Exploitation</h4>
                <p className="text-black/60 font-medium">Monitor keywords like "alternative to [Competitor]" or "[Competitor] down". Reach out instantly when a user is frustrated and looking for an exit.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black">02</div>
              <div>
                <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">Zero-to-One Validation</h4>
                <p className="text-black/60 font-medium">Find people describing a problem your MVP solves. Offer a free account in exchange for a demo. This is the fastest way to hit your first 10 paying users.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black">03</div>
              <div>
                <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">Programmatic SEO Research</h4>
                <p className="text-black/60 font-medium">See which questions are asked most frequently in /r/SaaS or /r/Entrepreneur. Use these questions as titles for your blog posts to dominate search results.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black">04</div>
              <div>
                <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">Brand Sentiment Tracking</h4>
                <p className="text-black/60 font-medium">Get an instant alert the second someone mentions your product on Reddit. Join the conversation to provide support or correct misconceptions before they spread.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-6">Build a growth engine that never sleeps.</h2>
          <Link 
            href="/login"
            className="inline-flex items-center gap-3 text-orange-500 font-bold hover:gap-5 transition-all"
          >
            START YOUR FREE TRIAL <MaterialIcon name="arrow_right" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
