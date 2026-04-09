import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { getPostBySlug, getAllPosts } from '../posts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TableOfContents from '@/components/blog/TableOfContents';
import ToolCallout from '@/components/blog/ToolCallout';
import ProTipBox from '@/components/blog/ProTipBox';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

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
    alternates: {
      canonical: `/blog/${slug}`,
    },
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
      
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `https://www.redleads.app/blog/${slug}#article`,
                "isPartOf": { "@id": `https://www.redleads.app/blog/${slug}` },
                "author": { "@id": "https://www.redleads.app/#founder" },
                "headline": post.title,
                "datePublished": post.date,
                "dateModified": post.lastModified || post.date,
                "mainEntityOfPage": { "@id": `https://www.redleads.app/blog/${slug}` },
                "publisher": { "@id": "https://www.redleads.app/#organization" },
                "description": post.description,
                "keywords": post.keywords.join(", "),
                "image": "https://www.redleads.app/og-image.webp",
                "abstract": post.tldr,
                "about": [
                   {
                      "@type": "Thing",
                      "name": post.category
                   }
                ]
              },
              {
                "@type": "FAQPage",
                "@id": `https://www.redleads.app/blog/${slug}#faq`,
                "mainEntity": post.faqs.map(faq => ({
                   "@type": "Question",
                   "name": faq.question,
                   "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.answer
                   }
                }))
              },
              {
                "@type": "BreadcrumbList",
                "@id": `https://www.redleads.app/blog/${slug}#breadcrumb`,
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                      "@id": "https://www.redleads.app/",
                      "name": "Home"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                      "@id": "https://www.redleads.app/blog",
                      "name": "Blog"
                    }
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                      "@id": `https://www.redleads.app/blog/${slug}`,
                      "name": post.title
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
      
      <article className="container mx-auto px-4 pt-32 pb-24">
        {/* Back Link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <MaterialIcon name="arrow_left" size={16} />
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
              <MaterialIcon name="calendar_today" size={14} />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <MaterialIcon name="schedule" size={14} />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          {/* TL;DR Summary Block */}
          <div className="mb-12 p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MaterialIcon name="bolt" size={80} className="text-orange-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest mb-4">
                <MaterialIcon name="summarize" size={14} />
                TL;DR Summary
              </div>
              <p className="text-white text-lg font-medium leading-relaxed italic">
                &quot;{post.tldr}&quot;
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <TableOfContents content={post.content} />

          {/* Context Insight (Mirroring pSEO) */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-8 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-6">
                <MaterialIcon name="insights" size={16} className="text-orange-500" />
                AI Strategy Snapshot
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Community Vibe</h4>
                  <p className="text-white font-medium text-lg">{post.insights.vibe}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">The Strategy</h4>
                  <p className="text-slate-300 leading-relaxed">{post.insights.strategy}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/10 rounded-3xl">
              <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MaterialIcon name="tips_and_updates" size={14} />
                Expert Hacks
              </div>
              <ul className="space-y-4">
                {post.insights.topHacks.map((hack, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-snug">
                    <span className="text-orange-500 font-black shrink-0">0{idx + 1}</span>
                    {hack}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Tips */}
          {post.proTips && post.proTips.length > 0 && (
            <div className="mb-12">
              {post.proTips.map((tip, idx) => (
                <ProTipBox key={idx} tip={tip} />
              ))}
            </div>
          )}

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

          {/* Tool Callout — PostPlanify-style mid-article embed */}
          {post.relatedTool && (
            <ToolCallout
              toolName={post.relatedTool.name}
              toolDescription={post.relatedTool.description}
              toolHref={post.relatedTool.href}
              toolIcon={post.relatedTool.icon}
            />
          )}
        </div>

        {/* Internal Linking Bridge to pSEO Hubs */}
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-black/40 border border-white/5 rounded-3xl">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-6">
            <MaterialIcon name="lan" size={16} className="text-orange-500" />
            Related Growth Strategies
          </div>
          <p className="text-sm text-slate-500 mb-6">Explore actionable, data-driven playbooks for top-tier communities:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/solutions/b2b-saas/saas" className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group">
               <span className="text-orange-500 font-black group-hover:scale-110 transition-transform">r/</span>
               <span className="text-slate-300 font-bold text-sm">SaaS</span>
            </Link>
            <Link href="/solutions/agencies/marketing" className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group">
               <span className="text-orange-500 font-black group-hover:scale-110 transition-transform">r/</span>
               <span className="text-slate-300 font-bold text-sm">Marketing</span>
            </Link>
            <Link href="/solutions/ai-wrappers/localllama" className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group">
               <span className="text-orange-500 font-black group-hover:scale-110 transition-transform">r/</span>
               <span className="text-slate-300 font-bold text-sm">LocalLlama</span>
            </Link>
            <Link href="/solutions/business/entrepreneur" className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group">
               <span className="text-orange-500 font-black group-hover:scale-110 transition-transform">r/</span>
               <span className="text-slate-300 font-bold text-sm">Entrepreneur</span>
            </Link>
            <Link href="/solutions/b2b-saas/startups" className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group">
               <span className="text-orange-500 font-black group-hover:scale-110 transition-transform">r/</span>
               <span className="text-slate-300 font-bold text-sm">Startups</span>
            </Link>
            <Link href="/solutions/directory" className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all group text-orange-500 font-black text-sm uppercase tracking-widest">
               View All
            </Link>
          </div>
        </div>

        {/* Keywords */}
        <div className="max-w-3xl mx-auto mt-12 py-8 border-t border-white/10">
          <div className="flex items-center gap-2 flex-wrap mb-16">
            <MaterialIcon name="sell" size={14} className="text-slate-500" />
            {post.keywords.map((keyword) => (
              <span 
                key={keyword}
                className="px-3 py-1 text-xs bg-white/5 text-slate-400 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* FAQ Section (AEO optimized) */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <MaterialIcon name="help_outline" size={24} className="text-orange-500" />
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <h3 className="text-white font-bold mb-3 flex items-start gap-3">
                    <span className="text-orange-500 font-black">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Solution Recommendation (Internal Linking) */}
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-black border border-white/10 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <MaterialIcon name="explore" size={100} className="text-white" />
           </div>
           <div className="relative z-10">
              <h3 className="text-white font-black text-xl mb-4 tracking-tight">Applied Growth Strategy</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-lg">
                 Learn how to apply the principles in this article specifically for <span className="text-white font-bold">{post.category}</span> acquisition on Reddit.
              </p>
              <div className="flex flex-wrap gap-2">
                 {post.category === 'Growth' && (
                    <Link href="/solutions/saas" className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-300 hover:border-orange-500/50 hover:text-white transition-all">SaaS Growth Strategy</Link>
                 )}
                 {post.category === 'Lead Generation' && (
                    <Link href="/solutions/agencies" className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-300 hover:border-orange-500/50 hover:text-white transition-all">Agency Lead Gen</Link>
                 )}
                 <Link href="/solutions/directory" className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-300 hover:border-orange-500/50 hover:text-white transition-all">All Strategies</Link>
              </div>
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
              Start Free Trial <MaterialIcon name="arrow_right" size={14} />
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
}function formatContent(content: string): string {
  const lines = content.split('\n');
  let html = '';
  let inList = false;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle horizontal rules
    if (line.trim() === '---') {
      if (inList) { html += '</ul>'; inList = false; }
      if (inTable) { html += '</table></div>'; inTable = false; }
      html += '<hr class="my-10 border-white/10" />';
      continue;
    }

    // Handle headers
    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      if (inTable) { html += '</table></div>'; inTable = false; }
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      html += `<h3 id="${id}" class="text-xl font-bold text-white mt-10 mb-4">${text}</h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      if (inTable) { html += '</table></div>'; inTable = false; }
      const text = line.slice(3).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      html += `<h2 id="${id}" class="text-2xl font-black text-white mt-12 mb-6 tracking-tight">${text}</h2>`;
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      if (inTable) { html += '</table></div>'; inTable = false; }
      html += `<h1 class="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">${line.slice(2)}</h1>`;
      continue;
    }

    // Handle Tables
    if (line.startsWith('|')) {
      if (line.includes('---')) continue; // Skip separator line
      if (!inTable) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<div class="overflow-x-auto my-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"><table class="w-full text-left border-collapse">';
        inTable = true;
      }
      
      const cells = line.split('|').filter((_, index, array) => index > 0 && index < array.length - 1);
      const isHeader = line.includes('Grade') || line.includes('Keyword') || line.includes('Tool') || i === 0 || (i > 0 && lines[i-1].trim() === '');
      const tag = isHeader ? 'th' : 'td';
      const cellClass = isHeader 
        ? 'p-4 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/10' 
        : 'p-4 text-sm text-slate-300 border-b border-white/[0.05]';
      
      html += `<tr>${cells.map(c => `<${tag} class="${cellClass}">${c.trim()}</${tag}>`).join('')}</tr>`;
      continue;
    } else if (inTable) {
      html += '</table></div>';
      inTable = false;
    }

    // Handle Lists
    const listMatch = line.match(/^[-*] (.*)/) || line.match(/^\d+\. (.*)/);
    if (listMatch) {
      if (!inList) {
        if (inTable) { html += '</table></div>'; inTable = false; }
        html += '<ul class="space-y-3 my-6 text-slate-400 leading-relaxed">';
        inList = true;
      }
      let itemContent = listMatch[1];
      // Basic formatting inside list item
      itemContent = itemContent.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      itemContent = itemContent.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-500 hover:underline">$1</a>');
      html += `<li class="flex gap-3"><span class="text-orange-500 mt-1.5">•</span><span>${itemContent}</span></li>`;
      continue;
    } else if (inList) {
      html += '</ul>';
      inList = false;
    }

    // Basic line formatting (Bold, Italic, Code, Links)
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
    line = line.replace(/\*(.*?)\*/g, '<em class="text-slate-300 font-serif-italic">$1</em>');
    line = line.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-white/10 rounded-md text-orange-400 text-xs font-mono">$1</code>');
    line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-500 hover:underline font-bold">$1</a>');

    // Paragraphs
    if (line.trim()) {
      html += `<p class="my-6 text-slate-400 leading-relaxed">${line}</p>`;
    }
  }

  // Cleanup
  if (inList) html += '</ul>';
  if (inTable) html += '</table></div>';

  return html;
}
