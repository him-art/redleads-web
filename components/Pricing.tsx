import Link from 'next/link';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="bg-[#1a1a1a] py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Early Access Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            First 10 get lifetime beta pricing. After that, full price.
          </p>
        </div>

        {/* Simple Beta Pricing Info */}
        <div className="mt-12 mb-16 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm text-gray-400">
              Beta testers save <span className="text-orange-400 font-bold">$120/year</span> and get lifetime founder access.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          {/* Scout Tier */}
          <div className="rounded-3xl border border-white/5 bg-[#222] p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-white">Scout Plan</h3>
            
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-500/50 line-through">$19</span>
                <div className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                  BETA OFFER
                </div>
              </div>
              
              <div className="flex items-baseline text-6xl font-bold tracking-tight text-white mt-2">
                $9
                <span className="text-xl font-normal text-gray-500 ml-1">/mo</span>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">Perfect for solopreneurs testing Reddit as a channel.</p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Daily 'High-Pain' Lead Report",
                "Ban-Proof Monitoring",
                "Monitor 5 subreddits",
                "Keyword search"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="https://tally.so/r/7RK9g0" id="cta-scout-apply" className="mt-8 block w-full rounded-full border border-white/10 bg-white/5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20">
              Apply for Beta Access
            </Link>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Growth Tier */}
          <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-8 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-transparent w-32 h-32 opacity-20 blur-2xl -mr-16 -mt-16"></div>
            
            <div className="absolute top-4 right-4">
              <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-bold text-white">
                BEST VALUE
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white">Growth Plan</h3>
            
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-500/50 line-through">$29</span>
                <div className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  BETA OFFER
                </div>
              </div>
              
              <div className="flex items-baseline text-6xl font-bold tracking-tight text-white mt-2">
                $19
                <span className="text-xl font-normal text-gray-400 ml-1">/mo</span>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-400">For founders serious about Reddit marketing.</p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Everything in Scout",
                "AI Reply Drafter",
                "Monitor 10 subreddits",
                "Unlimited Keywords",
                "Direct Founder Access"               
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white">
                  <Check className="h-5 w-5 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="https://tally.so/r/7RK9g0" id="cta-growth-apply" className="mt-8 block w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-center text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-lg shadow-blue-500/25">
              Apply for Beta Access
            </Link>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Simple footer note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Beta pricing locks in forever. Choose your plan in the application.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
