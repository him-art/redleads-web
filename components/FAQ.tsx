'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Will I get banned from Reddit using this?",
    answer: "Absolutely not. RedLeads is a monitor, not a spammer. We scan public discussions to find opportunities for you to provide value. You control the outreach. We recommend being helpful, not salesy, which Reddit actually loves."
  },
  {
    question: "Is this just another AI spam bot?",
    answer: "No. Our AI doesn't just blast replies. It finds high-intent conversations and helps you draft thoughtful, context-aware responses. The goal is to build relationships, not to clutter subreddits with low-quality noise."
  },
  {
    question: "How accurate is the AI lead scoring?",
    answer: "Very. We use advanced LLMs trained to distinguish between someone just 'venting' and someone 'actively looking for a solution.' You'll only spend time on the leads that actually have a high chance of converting."
  },
  {
    question: "What happens after the 3-day free trial?",
    answer: "You'll have full access to all features for 3 days. Use it to find your first few customers. If it doesn't pay for itself by day three, you can cancel with one click in your settings and you won't be charged a cent."
  },
  {
    question: "Can I really cancel with one click?",
    answer: "Yes. We hate 'subscription traps' as much as you do. You can cancel directly from your billing dashboard at any time. No emails to send, no phone calls to make, and no questions asked."
  },
  {
    question: "Can I monitor multiple products or competitors?",
    answer: "Yes. Our Growth plan is designed exactly for that—allowing you to track up to 15 different keywords or competitor names across all of Reddit simultaneously."
  },
  {
    question: "What is Power Search?",
    answer: "Power Search is designed to find up to 50 top ranking, SEO optimized Reddit posts for your project. While our live feed tracks new conversations, Power Search scans historical high-traffic threads where your brand can gain the most visibility."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#1a1a1a] py-24 border-t border-white/5">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl sm:text-[4.5rem] font-black text-white leading-[1.1] tracking-tighter">
          <span className="block sm:whitespace-nowrap">Frequently Asked</span>
          <span className="block text-orange-500 font-serif-italic sm:whitespace-nowrap">Questions</span>
        </h2>
        
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-white/5 bg-[#222]">
              <button
                suppressHydrationWarning
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left hover:bg-[#282828] transition-colors"
              >
                <h3 className="text-lg font-black text-white tracking-tight">{faq.question}</h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openIndex === index ? 'rotate-180 text-orange-500' : ''}`} />
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-[13px] font-medium leading-relaxed tracking-wide text-gray-500">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
