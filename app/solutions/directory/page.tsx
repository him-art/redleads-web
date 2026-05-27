import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { solutions } from '../data';

export const metadata: Metadata = {
  title: 'Reddit Growth Strategy Directory | RedLeads Index',
  description: 'A complete directory of Reddit growth strategies for every industry and community. Expert guides for SaaS, agencies, sales teams, and more.',
  alternates: {
    canonical: '/solutions/directory',
  },
  openGraph: {
    title: 'Reddit Growth Strategy Directory | RedLeads Index',
    description: 'A complete directory of Reddit growth strategies for every industry and community.',
    url: 'https://www.redleads.app/solutions/directory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reddit Growth Strategy Directory | RedLeads Index',
    description: 'A complete directory of Reddit growth strategies for every industry and community.',
  },
};

export default function PseoDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      {/* JSON-LD Schema: BreadcrumbList + CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "@id": "https://www.redleads.app/solutions/directory/#webpage",
              "url": "https://www.redleads.app/solutions/directory",
              "name": "Reddit Growth Strategy Directory | RedLeads Index",
              "description": "A complete directory of Reddit growth strategies for every industry and community.",
              "isPartOf": {
                "@id": "https://www.redleads.app/#website"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://www.redleads.app/solutions/directory/#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.redleads.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Growth Strategy Directory",
                  "item": "https://www.redleads.app/solutions/directory"
                }
              ]
            }
          ])
        }}
      />
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
            Browse our comprehensive guides on how to find leads and grow your business across every industry vertical.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
             {solutions.map((solution) => (
                <a 
                  key={solution.slug}
                  href={`#${solution.slug}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all"
                >
                  {solution.hero.badgeText}
                </a>
             ))}
          </div>
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
                  <p className="text-slate-500 font-medium">Expert growth strategies for {solution.hero.badgeText}.</p>
                </div>
              </div>
              
              {/* Link to the dedicated solution page */}
              <div className="p-8 bg-[#141414] border border-white/5 rounded-3xl hover:border-orange-500/30 transition-all">
                <Link 
                  href={`/solutions/${solution.slug}`}
                  className="flex items-center justify-between group"
                >
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-500 transition-colors">
                      {solution.hero.title} <span className="text-orange-500 font-serif-italic">{solution.hero.titleHighlight}</span>
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xl">{solution.metaDescription}</p>
                  </div>
                  <div className="shrink-0 ml-6">
                    <MaterialIcon name="arrow_forward" size={24} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
