import { Metadata } from 'next';
import Link from 'next/link';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { getAllPosts } from './posts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Reddit Marketing Blog | Growth Strategies, Lead Gen & Tools | RedLeads',
  description: 'Expert guides on Reddit marketing, lead generation, and growth hacking. Tactical strategies, benchmarks, and free tools for SaaS founders.',
  keywords: ['reddit marketing blog', 'reddit lead generation tips', 'saas growth strategies', 'reddit marketing guide 2026'],
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0]; // Most recent = featured
  const remainingPosts = posts.slice(1);
  
  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      <section className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
              <MaterialIcon name="auto_stories" size={14} className="text-orange-500" />
              <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Blog</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              Reddit Marketing <br />
              <span className="text-orange-500 font-serif-italic">Playbook</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Tactical strategies, benchmarks, and free tools for SaaS founders who want to turn Reddit into their #1 growth channel.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border cursor-pointer transition-all ${
                  cat === 'All'
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:border-white/10 hover:text-slate-300'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <Link 
              href={`/blog/${featuredPost.slug}`}
              className="group block mb-16 p-8 md:p-12 bg-gradient-to-br from-orange-500/[0.06] via-orange-500/[0.02] to-transparent border border-orange-500/10 rounded-3xl hover:border-orange-500/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase tracking-widest rounded-full">
                      Featured
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-orange-500 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-400 mb-6 leading-relaxed line-clamp-2">
                    {featuredPost.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MaterialIcon name="schedule" size={14} />
                      {featuredPost.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MaterialIcon name="calendar_today" size={14} />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex w-48 h-48 bg-orange-500/5 border border-orange-500/10 rounded-3xl items-center justify-center shrink-0">
                  <MaterialIcon name="article" size={64} className="text-orange-500/30" />
                </div>
              </div>
            </Link>
          )}

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-6 bg-[#222] border border-white/5 rounded-2xl hover:border-orange-500/20 transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/70">
                    {post.category}
                  </span>
                  <span className="text-[9px] text-slate-600">•</span>
                  <span className="text-[9px] text-slate-600">{post.readTime}</span>
                </div>
                
                <h2 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors mb-3 line-clamp-2 leading-snug flex-1">
                  {post.title}
                </h2>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {post.description}
                </p>

                {/* Tool badge if linked */}
                {post.relatedTool && (
                  <div className="mt-auto pt-4 border-t border-white/[0.04]">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-green-400/80">
                      <MaterialIcon name="build" size={10} />
                      Includes Free Tool
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto p-10 bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/10 rounded-3xl text-center">
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Try Our Free Reddit Tools</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-lg mx-auto">
            Every strategy in our blog is backed by a free tool. Calculate engagement rates, estimate ad costs, explore niches, and find leads.
          </p>
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
          >
            Explore All Tools
            <MaterialIcon name="arrow_forward" size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
