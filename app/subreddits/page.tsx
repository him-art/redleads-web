import { Metadata } from 'next';
import { getAllSubredditHubs } from './data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Globe, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reddit Intelligence Hubs - Community Growth Guides',
  description: 'Master Reddit marketing with our community-specific guides. Learn how to grow on r/SaaS, r/Entrepreneur, r/indiehackers and more with AI.',
};

export default function SubredditsPage() {
  const hubs = getAllSubredditHubs();

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      <section className="container mx-auto px-4 pt-40 pb-24">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4 block">
            Reddit Intelligence Engine
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            Community <br /> <span className="text-orange-500 font-serif-italic">Growth Hubs</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Start growing. Master the unique rules and growth signals of Reddit's most powerful communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hubs.map((hub) => (
            <Link 
              key={hub.slug} 
              href={`/subreddits/${hub.slug}`}
              className="group bg-[#141414] rounded-[2.5rem] p-8 border border-white/5 hover:border-orange-500/50 transition-all hover:-translate-y-2"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Globe size={24} />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-500 border border-white/5">
                  {hub.subreddit}
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-orange-500 transition-colors">
                {hub.title}
              </h2>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8 h-20 overflow-hidden line-clamp-3">
                {hub.description}
              </p>
              
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400 group-hover:text-white transition-colors">Learn Strategy</span>
                <ArrowRight size={16} className="text-orange-500 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
