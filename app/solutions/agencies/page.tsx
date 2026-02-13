import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Briefcase, Target, Zap, CheckCircle2, ArrowRight, MessageSquare, BarChart3, ShieldCheck, Layers, BadgePercent } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reddit Lead Generation for Agencies | RedLeads',
  description: 'Scale your agency by finding high-intent clients on Reddit. Discover businesses and founders actively looking for your services.',
};

export default function AgenciesPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
            <Briefcase size={16} className="text-orange-500" />
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Agency Growth Vertical</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            Scale Your Agency <br />
            <span className="text-orange-500 font-serif-italic">Lead Gen</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Stop waiting for referrals. RedLeads identifies potential clients on Reddit the moment they express a need for your services—from Web Design to B2B Sales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="px-10 py-5 bg-orange-500 text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform w-full sm:w-auto"
            >
              Start Finding Clients
            </Link>
          </div>
        </div>
      </section>

      {/* Why Agencies Love RedLeads */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-[#141414] rounded-3xl border border-white/5 group hover:border-orange-500/20 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Layers size={24} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-4">White-Label Insights</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Use RedLeads data to provide your clients with "Market Intelligence Reports" showing exactly where their customers are talking.
            </p>
          </div>
          <div className="p-8 bg-[#141414] rounded-3xl border border-white/5 group hover:border-orange-500/20 transition-all">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Target size={24} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-4">Intent over Keywords</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our AI scores leads so your account managers only spend time on prospects with high closing probability.
            </p>
          </div>
          <div className="p-8 bg-[#141414] rounded-3xl border border-white/5 group hover:border-orange-500/20 transition-all">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
              <BadgePercent size={24} className="text-green-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-4">Low Lead Cost</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              While your competitors fight over Google Ads prices, you're finding clients organically for a fraction of the cost.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies / Tactical Section */}
      <section className="container mx-auto px-4 py-32 bg-[#222] rounded-[4rem] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter text-center">Lead Sources for <br /><span className="text-orange-500 italic font-serif">Every Agency Type</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
              <h4 className="text-2xl font-black mb-4 uppercase text-orange-500">Dev Agencies</h4>
              <p className="text-slate-400 mb-6 text-sm">Monitor: "Looking for a dev partner", "Bubble freelancer help", "[Tech] stack recommendation".</p>
              <div className="text-xs font-mono p-4 bg-black/40 rounded-xl text-slate-500 italic">
                Targeting: r/startups, r/business, r/lowcode
              </div>
            </div>

            <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
              <h4 className="text-2xl font-black mb-4 uppercase text-blue-500">Marketing Agencies</h4>
              <p className="text-slate-400 mb-6 text-sm">Monitor: "Meta Ads not working", "SEO agency review", "Need a growth marketer".</p>
              <div className="text-xs font-mono p-4 bg-black/40 rounded-xl text-slate-500 italic">
                Targeting: r/SaaS, r/marketing, r/entrepreneur
              </div>
            </div>

            <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
              <h4 className="text-2xl font-black mb-4 uppercase text-purple-500">Design Agencies</h4>
              <p className="text-slate-400 mb-6 text-sm">Monitor: "UI/UX feedback", "Need a logo for my startup", "Landing page critique".</p>
              <div className="text-xs font-mono p-4 bg-black/40 rounded-xl text-slate-500 italic">
                Targeting: r/design, r/SideProject, r/SaaS
              </div>
            </div>

            <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
              <h4 className="text-2xl font-black mb-4 uppercase text-green-500">B2B Sales Agencies</h4>
              <p className="text-slate-400 mb-6 text-sm">Monitor: "How to find B2B leads", "Cold email is dead", "Help with outreach".</p>
              <div className="text-xs font-mono p-4 bg-black/40 rounded-xl text-slate-500 italic">
                Targeting: r/sales, r/agencies, r/B2B
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-32 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
            <ShieldCheck size={14} className="text-orange-500" />
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Protocol Verified</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tighter">Your agency's next flagship client is on Reddit.</h2>
          <Link 
            href="/login"
            className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
          >
            Start Ethical Lead Gen
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
