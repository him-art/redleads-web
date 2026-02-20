import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { getComparisonBySlug, getAllComparisons } from '../data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const comparisons = getAllComparisons();
  return comparisons.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  
  if (!comparison) {
    return {
      title: 'Comparison Not Found | RedLeads',
    };
  }

  return {
    title: comparison.title,
    description: comparison.description,
    keywords: comparison.keywords,
    alternates: {
      canonical: `/compare/${comparison.slug}`,
    },
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      url: `https://www.redleads.app/compare/${comparison.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: comparison.title,
      description: comparison.description,
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }
  
  const mainToolName = comparison.mainToolName || 'RedLeads';

  const allComparisons = getAllComparisons();
  const otherComparisons = allComparisons.filter(c => c.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": comparison.title,
            "description": comparison.description,
            "image": "https://www.redleads.app/og-image.png",
            "author": {
              "@type": "Organization",
              "name": "RedLeads"
            },
            "publisher": {
              "@type": "Organization",
              "name": "RedLeads",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.redleads.app/icon.png"
              }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString()
          })
        }}
      />
      <Navbar />
      
      <article className="container mx-auto px-4 pt-32 pb-24">
        {/* Back Link */}
        <Link 
          href="/compare"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <MaterialIcon name="arrow_left" size={16} />
          All Comparisons
        </Link>

        {/* Header */}
        <header className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-3xl md:text-4xl font-black text-orange-500">{mainToolName}</span>
            <span className="text-2xl text-slate-500">vs</span>
            <span className="text-3xl md:text-4xl font-black text-slate-400">{comparison.competitor}</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {comparison.title}
          </h1>
          
          <p className="text-lg text-slate-400">
            {comparison.description}
          </p>
        </header>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Feature Comparison</h2>
          <div className="bg-[#222] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  <th className="p-4 text-center text-orange-500 font-bold">{mainToolName}</th>
                  <th className="p-4 text-center text-slate-400 font-bold">{comparison.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.features.map((feature, index) => (
                  <tr key={feature.name} className={index !== comparison.features.length - 1 ? 'border-b border-white/5' : ''}>
                    <td className="p-4 text-white">{feature.name}</td>
                    <td className="p-4 text-center">
                      {typeof feature.redleads === 'boolean' ? (
                        feature.redleads ? (
                          <MaterialIcon name="check_circle" size={18} className="inline text-green-500" />
                        ) : (
                          <MaterialIcon name="cancel" size={18} className="inline text-red-500" />
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">{feature.redleads}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof feature.competitor === 'boolean' ? (
                        feature.competitor ? (
                          <MaterialIcon name="check_circle" size={18} className="inline text-green-500" />
                        ) : (
                          <MaterialIcon name="cancel" size={18} className="inline text-red-500" />
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">{feature.competitor}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#222] border border-orange-500/30 rounded-2xl">
              <h3 className="text-lg font-bold text-orange-500 mb-2">{mainToolName}</h3>
              <p className="text-white text-xl font-bold">{comparison.pricing.redleads}</p>
            </div>
            <div className="p-6 bg-[#222] border border-white/5 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-400 mb-2">{comparison.competitor}</h3>
              <p className="text-white text-xl font-bold">{comparison.pricing.competitor}</p>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* RedLeads */}
            <div>
              <h3 className="text-lg font-bold text-orange-500 mb-4">{mainToolName}</h3>
              <div className="space-y-6">
                <div className="p-4 bg-[#222] border border-white/5 rounded-xl">
                  <h4 className="text-sm font-bold text-green-500 mb-3 flex items-center gap-2">
                    <MaterialIcon name="thumb_up" size={14} /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {comparison.pros.redleads.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <MaterialIcon name="check_circle" size={14} className="text-green-500 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-[#222] border border-white/5 rounded-xl">
                  <h4 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
                    <MaterialIcon name="thumb_down" size={14} /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {comparison.cons.redleads.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <MaterialIcon name="cancel" size={14} className="text-red-500 shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Competitor */}
            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-4">{comparison.competitor}</h3>
              <div className="space-y-6">
                <div className="p-4 bg-[#222] border border-white/5 rounded-xl">
                  <h4 className="text-sm font-bold text-green-500 mb-3 flex items-center gap-2">
                    <MaterialIcon name="thumb_up" size={14} /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {comparison.pros.competitor.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <MaterialIcon name="check_circle" size={14} className="text-green-500 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-[#222] border border-white/5 rounded-xl">
                  <h4 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
                    <MaterialIcon name="thumb_down" size={14} /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {comparison.cons.competitor.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <MaterialIcon name="cancel" size={14} className="text-red-500 shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">The Verdict</h2>
          <div className="p-8 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl">
            <p 
              className="text-lg text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: comparison.verdict.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to try RedLeads?
          </h3>
          <p className="text-slate-400 mb-6">
            Find customers on Reddit with AI-powered lead generation.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors"
          >
            Start Free Trial <MaterialIcon name="arrow_right" size={14} />
          </Link>
        </div>

        {/* Other Comparisons */}
        {otherComparisons.length > 0 && (
          <div className="max-w-6xl mx-auto mt-24">
            <h2 className="text-2xl font-bold text-white mb-8">Other Comparisons</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherComparisons.map((other) => (
                <Link 
                  key={other.slug}
                  href={`/compare/${other.slug}`}
                  className="group p-6 bg-[#222] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-500 font-bold">{other.mainToolName || 'RedLeads'}</span>
                    <span className="text-slate-500 text-sm">vs</span>
                    <span className="text-slate-400 font-bold">{other.competitor}</span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {other.competitorDescription}
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
