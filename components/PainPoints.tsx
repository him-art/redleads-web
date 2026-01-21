'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Clock, ShieldAlert } from 'lucide-react';

export default function PainPoints() {
  const pains = [
    {
      icon: <Clock className="h-6 w-6 text-red-400" />,
      title: "Manual Search is Exhausting",
      description: "Scrolling through 2.8M subreddits to find leads takes 10+ hours a week. It's not scalable."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-orange-400" />,
      title: "The 'Spam' Tightrope",
      description: "One wrong comment and your account is banned. Marketing on Reddit requires precision, not volume."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-blue-400" />,
      title: "Missed Opportunities",
      description: "80% of purchase-intent conversations happen while you're asleep. By morning, the lead is gone."
    }
  ];

  return (
    <section className="py-24 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            But... Reddit Marketing is <span className="text-red-500 italic font-serif">Hard</span>.
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Most founders quit because they can't keep up with the noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pains.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors"
            >
              <div className="p-3 rounded-2xl bg-[#1a1a1a] w-fit mb-6">
                {pain.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{pain.title}</h3>
              <p className="text-gray-400 leading-relaxed">{pain.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
