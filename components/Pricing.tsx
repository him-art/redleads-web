import Link from 'next/link';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="bg-[#1a1a1a] py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          {/* Starter Tier */}
          <div className="rounded-3xl border border-white/5 bg-[#222] p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-white">Starter</h3>
            <div className="mt-4 flex items-baseline text-5xl font-bold tracking-tight text-white">
              $14
              <span className="text-lg font-normal text-gray-400">/mo</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Perfect for trying out RedLeads.</p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Unlimited local encryption",
                "Monitor 5 subreddits",
                "50 leads/month",
                "Basic intent scoring"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/signup" className="mt-8 block w-full rounded-full border border-gray-700 bg-gray-800 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-700">
              Get Started Starter
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-3xl border border-blue-900 bg-blue-900/10 p-8 shadow-xl">
            <div className="absolute -top-4 right-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              Best Deal
            </div>
            <h3 className="text-lg font-semibold text-white">Pro</h3>
            <div className="mt-4 flex items-baseline text-5xl font-bold tracking-tight text-white">
              $29
              <span className="text-lg font-normal text-gray-400">/mo</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">For serious founders scaling their outreach.</p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Everything in Starter",
                "Monitor 20 subreddits",
                "Unlimited leads",
                "AI reply drafting",
                "Priority support"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white">
                  <Check className="h-5 w-5 text-blue-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/signup" className="mt-8 block w-full rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-lg shadow-blue-500/25">
              Get Pro Access
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
