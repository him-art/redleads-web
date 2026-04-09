'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
  toolName: string;
}

export default function ToolFAQ({ faqs, toolName }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-white mb-2 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500 text-center mb-10">
          Everything you need to know about the {toolName}
        </p>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === idx
                  ? 'border-orange-500/20 bg-orange-500/[0.03]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className={`font-bold text-sm pr-4 transition-colors ${
                  openIndex === idx ? 'text-orange-500' : 'text-white'
                }`}>
                  {faq.question}
                </span>
                <span
                  className={`material-symbols-outlined text-slate-500 shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                  style={{ fontSize: 20 }}
                >
                  expand_more
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
