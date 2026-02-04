import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, CheckCircle, XCircle, Scale } from 'lucide-react';
import { getAllComparisons } from './data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Compare RedLeads | Reddit Marketing Tool Comparisons',
  description: 'Compare RedLeads with GummySearch, F5Bot, Syften, BillyBuzz, and ReplyGuy. See which Reddit marketing tool is best for lead generation.',
  keywords: ['GummySearch alternative', 'F5Bot alternative', 'Syften alternative', 'Reddit tool comparison'],
  openGraph: {
    title: 'Compare RedLeads | Reddit Marketing Tool Comparisons',
    description: 'See how RedLeads compares to other Reddit marketing tools.',
    url: 'https://redleads.app/compare',
  },
};

export default function ComparePage() {
  const comparisons = getAllComparisons();

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            RedLeads <span className="text-orange-500 font-serif italic">vs</span> Competitors
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            See how RedLeads compares to other Reddit marketing tools. Find the best solution for finding customers on Reddit.
          </p>
        </div>

        {/* Why Choose RedLeads */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="p-8 bg-[#222] border border-white/5 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Scale className="text-orange-500" size={24} />
              Why Choose RedLeads?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-bold text-white">AI Lead Scoring</p>
                  <p className="text-sm text-slate-400">Automatically identifies high-intent leads</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-bold text-white">Buyer Intent Detection</p>
                  <p className="text-sm text-slate-400">Understands context, not just keywords</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-bold text-white">No Ban Risk</p>
                  <p className="text-sm text-slate-400">Human-in-the-loop for authentic engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {comparisons.map((comparison) => (
            <Link 
              key={comparison.slug} 
              href={`/compare/${comparison.slug}`}
              className="group"
            >
              <article className="bg-[#222] border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-white">RedLeads</span>
                    <span className="text-slate-500 text-sm">vs</span>
                    <span className="text-xl font-bold text-slate-400">{comparison.competitor}</span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {comparison.competitorDescription}
                  </p>
                </div>
                
                {/* Quick Comparison */}
                <div className="p-6 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">AI Lead Scoring</span>
                      <div className="flex items-center gap-4">
                        <CheckCircle className="text-green-500" size={16} />
                        {comparison.features.find(f => f.name === 'AI-Powered Lead Scoring')?.competitor ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <XCircle className="text-red-500" size={16} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Buyer Intent</span>
                      <div className="flex items-center gap-4">
                        <CheckCircle className="text-green-500" size={16} />
                        <XCircle className="text-red-500" size={16} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Free Trial</span>
                      <div className="flex items-center gap-4">
                        <CheckCircle className="text-green-500" size={16} />
                        {comparison.pricing.competitor.toLowerCase().includes('free') ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <XCircle className="text-red-500" size={16} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Read More */}
                <div className="px-6 pb-6">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 group-hover:gap-3 transition-all">
                    Full Comparison <ArrowRight size={14} />
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
              Ready to try RedLeads?
            </h3>
            <p className="text-slate-400 mb-6">
              See why SaaS founders choose RedLeads for Reddit lead generation.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors"
            >
              Start Free Trial <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
