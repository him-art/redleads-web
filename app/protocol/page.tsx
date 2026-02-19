import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Reddit Success Protocol - Ethical Reddit Marketing | RedLeads',
  description: 'Master the art of authentic Reddit engagement. Learn the protocol for finding customers without getting banned or looking spammy.',
};

export default function ProtocolPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
            <MaterialIcon name="verified_user" size={16} className="text-orange-500" />
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Master Protocol 2.0</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            The Reddit <br />
            <span className="text-orange-500 font-serif-italic">Success Protocol</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Reddit is not just a platform; it's a series of high-trust communities. To win, you must stop "marketing" and start leading. This protocol is your Guide to sustainable growth.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="bg-[#141414] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <MaterialIcon name="shield" size={120} className="text-orange-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <MaterialIcon name="warning" size={24} className="text-orange-500" />
              The Ban Trap
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Most "Reddit bots" focus on volume. They blast keywords, drop links, and get banned within 48 hours. Why? Because Reddit users have a "Spam Radar" that is 10x more sensitive than any other social platform.
            </p>
            <div className="space-y-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" size={16} className="text-red-500/50" />
                <span>Zero-context link dropping</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" size={16} className="text-red-500/50" />
                <span>Automated generic replies</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" size={16} className="text-red-500/50" />
                <span>Multiple dummy accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" size={16} className="text-red-500/50" />
                <span className="text-red-400">Silent "Shadowbanning" (invisible posts)</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-500 p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MaterialIcon name="bolt" size={120} className="text-black" />
            </div>
            <h2 className="text-3xl font-black text-black mb-6 flex items-center gap-3">
              <MaterialIcon name="verified_user" size={24} />
              The RedLeads Way
            </h2>
            <p className="text-black/80 font-medium leading-relaxed mb-8">
              RedLeads uses AI to find the **Intent**, but leaves the **Engagement** to you. By identifying people who are *already* asking for your solution, your intervention becomes a "helpful recommendation" rather than an "ad."
            </p>
            <div className="space-y-4 text-sm text-black/60 font-bold">
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" size={16} />
                <span>Context-first identification</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" size={16} />
                <span>Human-in-the-loop engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="check_circle" size={16} />
                <span>Deep community integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Protocol Steps */}
      <section className="container mx-auto px-4 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-16 text-center">Rules of Engagement</h2>
          
          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-orange-500">
                01
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">The 90/10 Rule</h3>
                <p className="text-lg text-slate-400 leading-relaxed mb-6">
                  90% of your interactions on Reddit should be helpful, brand-neutral comments. Only 10% should involve mentioning your product. If your comment history is just product links, you will be flagged by mods.
                </p>
                <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-2">Pro Tip</p>
                  <p className="text-sm text-slate-300">Use RedLeads to monitor keywords *related* to your industry. Answer general questions to build "Karma" and trust before you go in for a deep lead.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-orange-500">
                02
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Intent Identification</h3>
                <p className="text-lg text-slate-400 leading-relaxed mb-6">
                  Not every keyword mention is a lead. RedLeads scores leads by **Buyer Intent**. A user asking "How do I fix X?" is high intent. A user saying "I hate X" is medium intent. Focus your energy on those who need help *right now*.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-bold">
                    FALSE INTENT: "I love using this tool"
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-[10px] text-green-500 font-bold">
                    TRUE INTENT: "Does anyone know a tool for..."
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-orange-500">
                03
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Transparent Attribution</h3>
                <p className="text-lg text-slate-400 leading-relaxed mb-6">
                  Never pretend to be a random user "finding" your tool. It's called "astroturfing" and it's the fastest way to get your domain banned. Always disclose. 
                </p>
                <div className="bg-white/5 p-6 rounded-2xl italic text-slate-300 text-sm">
                  "Full disclosure: I actually built a tool called RedLeads that solves exactly this (intent detection). It might be overkill for you, but worth checking out if you're scaling!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 py-32 text-center">
        <div className="max-w-3xl mx-auto bg-white rounded-[3rem] p-16 text-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-orange-500/10 pointer-events-none" />
          <h2 className="text-4xl font-black mb-6 tracking-tighter">Ready to join the top 1%?</h2>
          <p className="text-lg font-medium text-black/60 mb-10 max-w-md mx-auto">
            Ethical marketing is the only way to scale on Reddit without losing your soul (or your account). 
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
          >
            Start Ethical Growth
            <MaterialIcon name="arrow_right" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
