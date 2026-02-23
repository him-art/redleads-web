import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { solutions } from '../data';
import masterSubreddits from '@/data/master-subreddits.json';

export const metadata: Metadata = {
  title: 'Reddit Growth Strategy Directory | RedLeads Index',
  description: 'A complete directory of Reddit growth strategies for every industry and community.',
};

export default function PseoDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      <section className="container mx-auto px-4 pt-40 pb-24">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4 block">
            The Knowledge Graph
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            Growth <br /> <span className="text-orange-500 font-serif-italic">Directory</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Browse our comprehensive guides on how to find leads and grow your business across the most influential subreddits.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-32">
          {solutions.map((solution) => (
            <div key={solution.slug} id={solution.slug} className="scroll-mt-32">
              <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
                <div className="w-16 h-16 rounded-[2rem] bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                  <MaterialIcon name={solution.hero.badgeIcon} size={32} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 leading-none uppercase tracking-tighter">
                     {solution.hero.title} <span className="text-orange-500">&middot;</span>
                  </h2>
                  <p className="text-slate-500 font-medium">Actionable guides for {solution.hero.badgeText} across niche communities.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {masterSubreddits.map((subreddit) => {
                  const subSlug = subreddit.toLowerCase().replace(/r\//, '').replace(/\//g, '');
                  const subTitle = subreddit.startsWith('r/') ? subreddit : `r/${subreddit}`;
                  return (
                    <Link 
                      key={subSlug}
                      href={`/solutions/${solution.slug}/${subSlug}`}
                      className="group p-5 bg-[#141414] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all hover:-translate-y-1"
                    >
                      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 group-hover:text-orange-500/50">{solution.slug} Strategy</div>
                      <div className="text-sm font-black text-white group-hover:text-orange-500">{subTitle}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
