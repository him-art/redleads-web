'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    answer: "RedLeads uses AI to monitor relevant subreddits for conversations about your product and competitors which are publicly available. We then analyze these posts for purchase intent and organize high-potential leads in your dashboard."
  },
  {
    question: "What is RedLeads?",
    answer: "RedLeads is an AI-powered Reddit lead generation tool that helps SaaS founders and app developers find their first customers. It monitors Reddit 24/7 and alerts you when potential users are asking for solutions you provide."
  },
  {
    question: "What makes RedLeads different from other lead generation tools?",
    answer: "Unlike generic lead generation tools that focus on email lists or LinkedIn, RedLeads specializes in Reddit where users actively discuss problems and seek recommendations. Our AI understands context, not just keywords."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. There are no contracts or lock-in periods. You can cancel your subscription at any time within 7 days.."
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
                <span className="text-lg font-black text-white tracking-tight">{faq.question}</span>
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
