import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSubredditHubs, getSubredditHubBySlug } from '../data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Clock, Zap, Target, CheckCircle2, Search } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const hub = getSubredditHubBySlug(params.slug);
  if (!hub) return {};

  return {
    title: hub.title,
    description: hub.description,
    keywords: hub.keywords,
    openGraph: {
      title: hub.title,
      description: hub.description,
    }
  };
}

export async function generateStaticParams() {
  const hubs = getAllSubredditHubs();
  return hubs.map((hub) => ({
    slug: hub.slug,
  }));
}

export default function SubredditHubPage({ params }: { params: { slug: string } }) {
  const hub = getSubredditHubBySlug(params.slug);
  if (!hub) notFound();

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": hub.title,
            "description": hub.description,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.redleads.app/" },
                { "@type": "ListItem", "position": 2, "name": "Resources", "item": "https://www.redleads.app/subreddits" },
                { "@type": "ListItem", "position": 3, "name": hub.subreddit, "item": `https://www.redleads.app/subreddits/${hub.slug}` }
              ]
            }
          })
        }}
      />

      <section className="container mx-auto px-4 pt-32 pb-24">
        {/* Back Link */}
        <Link 
          href="/subreddits"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          View All Community Guides
        </Link>

        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-500 rounded-full mb-6">
            Community Guide: {hub.subreddit}
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tighter">
            {hub.title}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-12">
            {hub.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Clock size={16} className="text-orange-500" />
              <span>Best Posting Time: <strong>{hub.bestTime}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Target size={16} className="text-orange-500" />
              <span>Target: <strong>Founder Growth</strong></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* The Strategy Section */}
            <div className="bg-[#141414] rounded-[2rem] p-8 md:p-12 border border-white/5">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                <Zap className="text-orange-500" />
                The Expert Strategy
              </h2>
              <ul className="space-y-8">
                {hub.tips.map((tip, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-sm">
                      {i + 1}
                    </div>
                    <p className="text-lg text-slate-300 leading-relaxed pt-1">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subreddit Ecosystem */}
            <div>
              <h2 className="text-2xl font-black text-white mb-6">Related Subreddits to Monitor</h2>
              <div className="flex flex-wrap gap-3">
                {hub.relevantSubreddits.map((sub) => (
                  <div key={sub} className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-slate-300 font-medium">
                    {sub}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-orange-500 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20" />
               <h3 className="text-3xl font-black text-black mb-4 relative z-10">
                 Ready to find your first 100 users on {hub.subreddit}?
               </h3>
               <p className="text-black/80 font-medium mb-8 max-w-lg mx-auto relative z-10">
                 Stop manual searching and start using AI to identify warm buyers automatically.
               </p>
               <Link 
                href="/login"
                className="inline-block px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform relative z-10"
               >
                 Start Your Growth Engine
               </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-black text-white mb-4">Why use RedLeads?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-400">
                  <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" />
                  <span>AI intent scoring identifies buyers</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                  <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" />
                  <span>24/7 subreddit monitoring</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                  <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" />
                  <span>Real-time desktop alerts</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                  <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" />
                  <span>Ban-prevention safety filters</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#141414] rounded-2xl p-8 border border-white/5">
              <Search className="text-orange-500 mb-4" />
              <h3 className="text-xl font-black text-white mb-2">Market Research</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Discover the pain points of {hub.subreddit} users before you build.
              </p>
              <Link href="/blog/finding-first-100-users-ai-intent-data" className="text-orange-500 text-sm font-black uppercase tracking-widest hover:underline">
                Read the guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
