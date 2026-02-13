'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Vivek ps",
    handle: "@vivekps143",
    content: "Smart approach to Reddit lead gen! Finding relevant conversations where people are actively looking for solutions is way more effective than cold outreach. ",
    highlights: ["Smart approach to Reddit lead gen!", "way more effective than cold outreach"],
  },
  {
    name: "Umair Shaikh",
    handle: "@1Umairshaikh",
    content: "I like this, this will make life easier for sure",
    highlights: ["make life easier for sure"],
  },
  {
    name: "Konny",
    handle: "@konnydev",
    content: "Thats useful I guess👀",
    highlights: ["useful I guess"],
  },
  {
    name: "Martin B",
    handle: "@MartinB293887",
    content: "Seems very helpful",
    highlights: ["very helpful"],
  },
  {
    name: "sachanh.farcaster.eth",
    handle: "@DefiHimanshu",
    content: "Wow this is nice, love to explore.",
    highlights: ["this is nice", "love to explore"],
  },
  {
    name: "Henry Labs",
    handle: "@Henrylabss",
    content: "This is a good tool reddit monitoring for leads",
    highlights: ["good tool", "monitoring for leads"],
  },
  {
    name: "Pranav Alone",
    handle: "@MaDAxe__",
    content: "This is great man! Just signed up on the site and search the url of my app and i got tons of reddit posts related to it which would have taken me hours to search manually.",
    highlights: ["Just signed up", "tons of reddit posts", "taken me hours to search manually"],
  },
  {
    name: "Marc Hanson",
    handle: "@bubbling_sort",
    content: "Interesting. Bookmarking this to check out. Connected!",
    highlights: ["Bookmarking this", "Connected!"],
  },
  {
    name: "Bishopi.io",
    handle: "@Bishopi_io",
    content: "That looks super useful",
    highlights: ["super useful"],
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  // Function to highlight parts of the text
  const getHighlightedText = (text: string, highlights: string[]) => {
    if (!highlights || highlights.length === 0) return text;
    
    let parts = [text];
    highlights.forEach(highlight => {
      const newParts: any[] = [];
      parts.forEach(part => {
        if (typeof part === 'string' && part.includes(highlight)) {
          const splitPart = part.split(highlight);
          splitPart.forEach((subPart, i) => {
            newParts.push(subPart);
            if (i < splitPart.length - 1) {
              newParts.push(
                <span key={highlight + i} className="bg-orange-500/10 text-orange-600 px-0.5 rounded-sm">
                  {highlight}
                </span>
              );
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
    return parts;
  };

  return (
    <div className="break-inside-avoid mb-8">
      <div className="bg-white rounded-[1.5rem] p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col">
        {/* Stars */}
        <div className="flex gap-1 mb-5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
          ))}
        </div>

        {/* Content */}
        <p className="text-gray-900 text-[15px] font-medium leading-[1.6] mb-6">
          {getHighlightedText(testimonial.content, testimonial.highlights)}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-orange-600 text-sm uppercase shrink-0">
            {testimonial.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-[14px] leading-tight">{testimonial.name}</span>
            <span className="text-gray-400 text-[12px] font-medium">{testimonial.handle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SocialProof() {
  return (
    <section className="py-24 bg-[#141414] relative overflow-hidden border-t border-white/5">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">Wall of Love</span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Trusted by founders and <br className="hidden md:block"/> 
            <span className="text-orange-500">indie hackers</span>
          </h2>
        </div>

        {/* Testimonials Masonry */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.handle} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
