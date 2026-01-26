'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does RedLeads work?",
    answer: "RedLeads uses AI to monitor relevant subreddits for conversations about your product or competitors. It then analyzes these posts for purchase intent and organizes high-potential leads in your dashboard."
  },
  {
    question: "What is RedLeads?",
    answer: "RedLeads is an AI platform that helps you get seen by generating organic marketing content and community engagement automatically."
  },
  {
    question: "What makes RedLeads different?",
    answer: "Unlike other tools that just do keyword matching, RedLeads uses advanced AI to understand context and intent. Plus, our privacy-first approach ensures you maintain full control of your data."
  },
  
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. There are no contracts or lock-in periods. You can downgrade to the Starter plan or cancel your subscription at any time."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#1a1a1a] py-24 border-t border-white/5">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[2.5rem] sm:text-[3.5rem] font-black text-white leading-tight">
          Frequently Asked <span className="text-orange-500 italic font-serif font-light">Questions</span>
        </h2>
        
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-white/5 bg-[#222]">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-400">
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
