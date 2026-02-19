import Link from 'next/link';
import { Metadata } from 'next';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { getAllPosts } from './posts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog | RedLeads - Reddit Lead Generation Insights',
  description: 'Learn how to find customers on Reddit master Reddit marketing, and generate leads for your SaaS. Expert guides, strategies, and tips.',
  keywords: ['Reddit marketing blog', 'lead generation tips', 'SaaS growth', 'find customers Reddit'],
  openGraph: {
    title: 'Blog | RedLeads - Reddit Lead Generation Insights',
    description: 'Expert guides on Reddit marketing, lead generation, and SaaS growth strategies.',
    url: 'https://redleads.app/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            RedLeads <span className="text-orange-500 font-serif italic">Blog</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Expert guides on how to find customers on Reddit master Reddit marketing, and grow your SaaS through lead generation.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-[#222] border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 h-full flex flex-col">
                {/* Category Badge */}
                <div className="p-6 pb-0">
                  <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-500 rounded-full">
                    {post.category}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-1">
                    {post.description}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MaterialIcon name="calendar_today" size={12} />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MaterialIcon name="schedule" size={12} />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Read More */}
                <div className="px-6 pb-6">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 group-hover:gap-3 transition-all">
                    Read Article <MaterialIcon name="arrow_right" size={14} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="inline-block p-8 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to find customers on Reddit?
            </h3>
            <p className="text-slate-400 mb-6">
              Stop reading, start generating leads with AI-powered Reddit monitoring.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors"
            >
              Start Free Trial <MaterialIcon name="arrow_right" size={14} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
