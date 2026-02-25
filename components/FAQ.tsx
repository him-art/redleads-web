'use client';
import { useState } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';

const faqs = [
  {
    question: "How do I find customers on Reddit?",
    answer: "RedLeads monitors relevant subreddits and uses AI to identify high-intent conversations where users are actively seeking solutions like yours. When someone asks for recommendations or expresses a need you can solve, you get notified instantly."
  },
  {
    question: "What are the best Reddit marketing tools?",
    answer: "RedLeads is the leading Reddit marketing tool for SaaS and app founders. Unlike basic keyword trackers, it uses AI to understand context and buying intent, helping you find warm leads instead of just mentions."
  },
  {
    question: "How can I find users for my SaaS on Reddit?",
    answer: "Enter your product description and target keywords into RedLeads. Our AI scans thousands of subreddits daily to find people asking for exactly what you offer whether that's project management, analytics, design tools, or any other SaaS category."
  },
  {
    question: "How does RedLeads work?",
    answer: "RedLeads uses AI to monitor relevant subreddits for conversations about your product and description which are publicly available. We then analyze these posts for purchase intent and organize high-potential leads in your dashboard."
  },
  {
    question: "What is RedLeads?",
    answer: "RedLeads is an AI-powered Reddit lead generation tool that helps SaaS founders and app developers find their first customers. It monitors Reddit 24/7 and alerts you when potential users are asking for solutions you provide."
  },
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
    answer: "Yes. We hate 'subscription traps' as much as you do. You can cancel directly from your billing dashboard. No emails to send, no phone calls to make, and no questions asked."
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="bg-[#1a1a1a] py-24 border-t border-white/5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl sm:text-[4.5rem] font-black text-white leading-[1.1] tracking-tighter">
          <span className="block sm:whitespace-nowrap">Frequently Asked</span>
          <span className="block text-orange-500 font-serif-italic sm:whitespace-nowrap">Questions</span>
        </h2>
        
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`p-2 rounded-[2.5rem] border transition-all duration-500 bg-white/5 ${
                openIndex === index ? 'border-orange-500/20' : 'border-white/5'
              }`}
            >
              <div className={`overflow-hidden rounded-[2rem] border transition-all duration-300 relative ${
                openIndex === index ? 'bg-[#0c0c0c] border-orange-500/30 shadow-none' : 'bg-[#0c0c0c] border-white/5 shadow-none'
              }`}>
                {openIndex === index && (
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}
                <button
                  suppressHydrationWarning
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors relative z-10"
                >
                  <h3 className={`text-lg font-black transition-colors tracking-tight ${openIndex === index ? 'text-white' : 'text-gray-300'}`}>
                    {faq.question}
                  </h3>
                  <MaterialIcon 
                    name="expand_more" 
                    size={20} 
                    className={`text-gray-600 transition-transform ${openIndex === index ? 'rotate-180 text-orange-500' : ''}`} 
                  />
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out relative z-10 ${
                    openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-[13px] font-medium leading-relaxed tracking-wide text-gray-500">
                    {faq.answer}
                  </div>
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
