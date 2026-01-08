import { Check, X } from 'lucide-react';

const Comparison = () => {
  return (
    <section className="bg-[#1a1a1a] py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Founders Choose RedLeads
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            See how we stack up against traditional social listening tools.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-white/5 bg-[#222] shadow-xl">
          <div className="grid grid-cols-3 border-b border-white/5 p-6 text-sm font-semibold text-gray-400">
            <div className="text-center">Feature</div>
            <div className="text-center text-blue-400">RedLeads</div>
            <div className="text-center">Others</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {[
              { feature: "Local Encryption", redleads: true, others: false },
              { feature: "Intent Scoring", redleads: "1-10 Scale", others: "Generic" },
              { feature: "Pricing", redleads: "Starter to Start", others: "$$$$" },
              { feature: "Data Privacy", redleads: "You own it", others: "They see it" },
              { feature: "AI Analysis", redleads: "Gemini Pro", others: "Basic Keyword" },
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-3 items-center p-6 text-sm">
                <div className="font-medium text-center text-white">{row.feature}</div>
                <div className="flex justify-center text-center font-bold text-white">
                  {row.redleads === true ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900/30 text-blue-400">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <span>{row.redleads}</span>
                  )}
                </div>
                <div className="flex justify-center text-center text-gray-500">
                  {row.others === false ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-gray-500">
                      <X className="h-4 w-4" />
                    </div>
                  ) : (
                    <span>{row.others}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
