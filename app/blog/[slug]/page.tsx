import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { getPostBySlug, getAllPosts } from '../posts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | RedLeads Blog',
    };
  }

  return {
    title: `${post.title} | RedLeads Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['RedLeads'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const relatedPosts = allPosts.filter((_, i) => i !== currentIndex).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      <article className="container mx-auto px-4 pt-32 pb-24">
        {/* Back Link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-500 rounded-full mb-6">
            {post.category}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-lg text-slate-400 mb-8">
            {post.description}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-invert prose-lg max-w-none font-[family-name:var(--font-merriweather)]
              prose-headings:font-sans prose-headings:font-black prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:text-white prose-h1:mb-6
              prose-h2:text-2xl prose-h2:text-white prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:text-white prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-200 prose-p:leading-relaxed prose-p:text-lg md:prose-p:text-xl
              prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-ul:text-gray-200 prose-ol:text-gray-200
              prose-li:marker:text-orange-500
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-white/5 prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:text-white prose-th:border prose-th:border-white/10
              prose-td:p-3 prose-td:border prose-td:border-white/10 prose-td:text-gray-200
              prose-hr:border-white/10 prose-hr:my-8
            "
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </div>

        {/* Keywords */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={14} className="text-slate-500" />
            {post.keywords.map((keyword) => (
              <span 
                key={keyword}
                className="px-3 py-1 text-xs bg-white/5 text-slate-400 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="p-8 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to find customers on Reddit?
            </h3>
            <p className="text-slate-400 mb-6">
              RedLeads monitors Reddit 24/7 and alerts you when potential customers appear.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors"
            >
              Start Free Trial <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-24">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group p-6 bg-[#222] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                    {relatedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}

// Simple markdown-like formatting
function formatContent(content: string): string {
  return content
    .split('\n')
    .map(line => {
      // Headers
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
      
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Links
      line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
      
      // Lists
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
      if (line.match(/^\d+\. /)) return `<li>${line.replace(/^\d+\. /, '')}</li>`;
      
      // Tables (basic)
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim());
        if (line.includes('---')) return '';
        const isHeader = line.includes('Keyword') || line.includes('Tool') || line.includes('Intent');
        const tag = isHeader ? 'th' : 'td';
        return `<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('')}</tr>`;
      }
      
      // Horizontal rule
      if (line.trim() === '---') return '<hr />';
      
      // Paragraphs
      if (line.trim()) return `<p>${line}</p>`;
      return '';
    })
    .join('\n');
}
