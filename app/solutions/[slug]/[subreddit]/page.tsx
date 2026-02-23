import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { getCombinationData, getAllCombinations, getRelatedSubreddits } from '@/lib/pseo';

interface Props {
  params: Promise<{ slug: string; subreddit: string }>;
}

// We generate a subset of pages at build time to keep build fast, others will be ISR
export async function generateStaticParams() {
  const allCombinations = getAllCombinations();
  // Only generate the first 50 combinations statically for now to avoid build timeouts
  return allCombinations.slice(0, 50).map((comb) => ({
    slug: comb.solution,
    subreddit: comb.subreddit,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subreddit } = await params;
  const data = getCombinationData(slug, subreddit);
  
  if (!data) {
    return {
      title: 'Guide Not Found | RedLeads',
    };
  }

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `/solutions/${slug}/${subreddit}`,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://www.redleads.app/solutions/${slug}/${subreddit}`,
      type: 'website',
    },
  };
}

export default async function PseoCombinationPage({ params }: Props) {
  const { slug, subreddit } = await params;
  const data = getCombinationData(slug, subreddit);

  if (!data) {
    notFound();
  }

  const { solution, subreddit: subredditName } = data;
  const related = getRelatedSubreddits(subredditName);

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      {/* Google SEO Schema: TechArticle + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "TechArticle",
              "headline": data.title,
              "description": data.description,
              "author": {
                "@type": "Organization",
                "name": "RedLeads AI"
              },
              "publisher": {
                "@type": "Organization",
                "name": "RedLeads",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.redleads.app/icon.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.redleads.app/solutions/${slug}/${subreddit}`
              },
              "areaServed": {
                "@type": "Country",
                "name": "United States"
              },
              "inLanguage": "en-US"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Expert Solutions", "item": "https://www.redleads.app/solutions" },
                { "@type": "ListItem", "position": 2, "name": solution.hero.title, "item": `https://www.redleads.app/solutions/${slug}` },
                { "@type": "ListItem", "position": 3, "name": `${subredditName} Strategy`, "item": `https://www.redleads.app/solutions/${slug}/${subreddit}` }
              ]
            }
          ])
        }}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Chips */}
          <div className="flex items-center justify-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link>
             <MaterialIcon name="chevron_right" size={12} />
             <Link href={`/solutions/${slug}`} className="hover:text-white transition-colors">{solution.hero.title}</Link>
             <MaterialIcon name="chevron_right" size={12} />
             <span className="text-orange-500">{subredditName}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
            <MaterialIcon name={solution.hero.badgeIcon} size={16} className="text-orange-500" />
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">{subredditName} Growth Strategy</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            Scale {solution.hero.title} <br />
            <span className="text-orange-500 font-serif-italic">On {subredditName}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            The best {solution.hero.titleHighlight} leads are in {subredditName}. Use RedLeads AI to identify them the moment they express a need for your solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="px-10 py-5 bg-orange-500 text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform w-full sm:w-auto"
            >
              Start Finding Leads in {subredditName}
            </Link>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#141414] p-10 rounded-[2.5rem] border border-white/5">
            <h2 className="text-3xl font-black text-white mb-8">Community Vibe: <span className="text-orange-500">{data.insights.vibe}</span></h2>
            <p className="text-slate-400 leading-relaxed mb-6 italic">
              " {data.insights.strategy} "
            </p>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Expert Community Hacks</h4>
            <ul className="space-y-4">
              {data.insights.topHacks.map((hack, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300 font-medium">
                  <MaterialIcon name="bolt" size={18} className="text-orange-500" />
                  {hack}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#141414] p-10 rounded-[2.5rem] border border-white/5">
            <h2 className="text-3xl font-black text-white mb-8">RedLeads AI for {subredditName}</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Stop manual scrolling. Our AI intent engine monitors {subredditName} 24/7 and alerts you only when a "Ready-to-Buy" signal is detected.
            </p>
            <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
              <h4 className="text-orange-500 font-black text-xs uppercase tracking-widest mb-2">Example Trigger</h4>
              <p className="text-white font-mono text-sm italic">"Anyone know a good {solution.slug} for [Problem]?"</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-black uppercase">RedLeads Score: 98/100</span>
                <span className="text-green-500 text-[10px] font-black uppercase">High Intent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Strategies (Internal Linking Improvement) */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">Related Community Strategies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map((item) => (
              <Link 
                key={item.slug}
                href={`/solutions/${slug}/${item.slug}`}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-orange-500/50 transition-colors group text-center"
              >
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-orange-500">{solution.hero.title}</div>
                <div className="text-sm font-black text-white">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-32 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tighter">Your first {subredditName} users are waiting.</h2>
          <Link 
            href="/login"
            className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            Start Growing in {subredditName} <MaterialIcon name="arrow_right" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
