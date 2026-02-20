import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { getAllSolutions, getSolutionBySlug } from '../data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const solutions = getAllSolutions();
  return solutions.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  
  if (!solution) {
    return {
      title: 'Solution Not Found | RedLeads',
    };
  }

  return {
    title: solution.metaTitle,
    description: solution.metaDescription,
    alternates: {
      canonical: `/solutions/${solution.slug}`,
    },
    openGraph: {
      title: solution.metaTitle,
      description: solution.metaDescription,
      url: `https://www.redleads.app/solutions/${solution.slug}`,
      type: 'website',
    },
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": solution.hero.title,
            "description": solution.hero.description,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
            <MaterialIcon name={solution.hero.badgeIcon} size={16} className="text-orange-500" />
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">{solution.hero.badgeText}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            {solution.hero.title} <br />
            <span className="text-orange-500 font-serif-italic">{solution.hero.titleHighlight}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            {solution.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="px-10 py-5 bg-orange-500 text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform w-full sm:w-auto"
            >
              {solution.hero.primaryCta}
            </Link>
            {solution.hero.secondaryCta && (
              <Link 
                href="/protocol"
                className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto flex items-center gap-2 justify-center"
              >
                <MaterialIcon name="verified_user" size={18} />
                {solution.hero.secondaryCta}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solution.painPoints.map((point, idx) => (
            <div key={idx} className="p-8 bg-[#141414] rounded-3xl border border-white/5 group hover:border-orange-500/20 transition-all">
              <div className={`w-12 h-12 ${point.bgClass} rounded-2xl flex items-center justify-center mb-6`}>
                <MaterialIcon name={point.icon} size={24} className={point.colorClass} />
              </div>
              <h3 className="text-xl font-black text-white mb-4">{point.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases / Tactical Section */}
      <section className="container mx-auto px-4 py-32 bg-[#222] rounded-[4rem] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl md:text-6xl font-black mb-16 tracking-tighter text-center"
            dangerouslySetInnerHTML={{ __html: solution.useCases.title.replace('text-black', 'text-white') }}
          />
          
          {/* SaaS Layout (Numbered List) */}
          {slug === 'saas' && (
            <div className="space-y-16">
              {solution.useCases.items.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black border border-white/20">{(idx + 1).toString().padStart(2, '0')}</div>
                  <div>
                    <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-white/60 font-medium">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agency Layout (Grid Cards) */}
          {slug !== 'saas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {solution.useCases.items.map((item, idx) => (
                <div key={idx} className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
                  <h4 className={`text-2xl font-black mb-4 uppercase ${item.colorClass || 'text-white'}`}>{item.title}</h4>
                  <p className="text-slate-400 mb-6 text-sm">{item.description}</p>
                  {item.targeting && (
                    <div className="text-xs font-mono p-4 bg-black/40 rounded-xl text-slate-500 italic">
                      Targeting: {item.targeting}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-32 text-center text-white">
        <div className="max-w-2xl mx-auto">
          {slug === 'agencies' && (
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
               <MaterialIcon name="verified_user" size={14} className="text-orange-500" />
               <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Protocol Verified</span>
             </div>
          )}
          <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tighter">{solution.footerCta.title}</h2>
          <Link 
            href="/login"
            className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            {solution.footerCta.buttonText} <MaterialIcon name="arrow_right" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
