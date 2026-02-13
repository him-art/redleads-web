'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Testimonial {
  name: string;
  handle: string;
  content: string;
  highlights: string[];
  image?: string;
  url: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Vivek ps",
    handle: "@vivekps143",
    image: "/vivek.png",
    url: "https://x.com/vivekps143/status/2020137623403077861",
    content: "Smart approach to Reddit lead gen! Finding relevant conversations where people are actively looking for solutions is way more effective than cold outreach. How are you handling the notification system?",
    highlights: ["Smart approach to Reddit lead gen!", "way more effective than cold outreach"],
  },
  {
    name: "Umair Shaikh",
    handle: "@1Umairshaikh",
    image: "/umair.png",
    url: "https://x.com/1Umairshaikh/status/2019638482986283216",
    content: "I like this, this will make life easier for sure",
    highlights: ["make life easier for sure"],
  },
  {
    name: "Konny",
    handle: "@konnydev",
    image: "/konny.png",
    url: "https://x.com/konnydev/status/2020141367507275965",
    content: "Thats useful I guess👀",
    highlights: ["useful I guess"],
  },
  {
    name: "Martin B",
    handle: "@MartinB293887",
    image: "/martin.png",
    url: "https://x.com/MartinB293887/status/2020161251280654610",
    content: "Seems very helpful",
    highlights: ["very helpful"],
  },
  {
    name: "sachanh.farcaster.eth",
    handle: "@DefiHimanshu",
    image: "/sachanh.png",
    url: "https://x.com/DefiHimanshu/status/2019656252553675000",
    content: "Wow this is nice, love to explore.",
    highlights: ["this is nice", "love to explore"],
  },
  {
    name: "Henry Labs",
    handle: "@Henrylabss",
    image: "/henry.png",
    url: "https://x.com/Henrylabss/status/2015720468632727655",
    content: "This is a good tool reddit monitoring for leads",
    highlights: ["good tool", "monitoring for leads"],
  },
  {
    name: "Pranav Alone",
    handle: "@MaDAxe__",
    image: "/pranav.png",
    url: "https://x.com/MaDAxe__/status/2020689774043095365",
    content: "This is great man! Just signed up on the site and search the url of my app and i got tons of reddit posts related to it which would have taken me hours to search manually.",
    highlights: ["Just signed up", "tons of reddit posts", "taken me hours to search manually"],
  },
  {
    name: "Marc Hanson",
    handle: "@bubbling_sort",
    image: "/marc.png",
    url: "https://x.com/bubbling_sort/status/2019875214805635222",
    content: "Interesting. Bookmarking this to check out. Connected!",
    highlights: ["Bookmarking this", "Connected!"],
  },
  {
    name: "Bishopi.io",
    handle: "@Bishopi_io",
    image: "/bishopi.png",
    url: "https://x.com/Bishopi_io/status/2019828568281546848",
    content: "That looks super useful",
    highlights: ["super useful"],
  },
  {
    name: "Naivaidya",
    handle: "@NaivaidyaY66600",
    image: "/navi.png",
    url: "https://x.com/NaivaidyaY66600/status/2020386987744850381",
    content: "I am telling you it's a game changer 🔥",
    highlights: ["game changer"],
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const getHighlightedText = (text: string, highlights: string[]) => {
    if (!highlights || highlights.length === 0) return text;
    
    let parts = [text];
    highlights.forEach(highlight => {
      const newParts: any[] = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }
        const split = part.split(new RegExp(`(${highlight})`, 'gi'));
        newParts.push(...split);
      });
      parts = newParts;
    });

    return parts.map((part, i) => 
      highlights.some(h => typeof part === 'string' && h.toLowerCase() === part.toLowerCase()) ? (
        <span key={i} className="text-orange-500 font-bold">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <a 
      href={testimonial.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="break-inside-avoid mb-6 block group"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative transition-all duration-300 group-hover:shadow-md group-hover:border-gray-200 group-hover:-translate-y-1">
        {/* X Icon */}
        <div className="absolute top-6 right-6 text-gray-900 overflow-hidden">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>

        {/* Header - User Info */}
        <div className="flex items-center gap-4 mb-4">
          {testimonial.image ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-50 shadow-sm">
              <Image 
                src={testimonial.image} 
                alt={testimonial.name} 
                fill 
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-sm uppercase shrink-0">
              {testimonial.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-base leading-tight">
              {testimonial.name}
            </span>
            <span className="text-gray-500 text-sm">
              {testimonial.handle}
            </span>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-800 text-[15px] leading-relaxed font-normal">
          {getHighlightedText(testimonial.content, testimonial.highlights)}
        </p>
      </div>
    </a>
  );
};

export default function FounderNote() {
  return (
    <section className="py-24 bg-[#1a1a1a] overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        {/* Split Founder Note Layout */}
        <div className="max-w-4xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 md:gap-20 items-start"
          >
            {/* Profile Column */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src="/founder.png" 
                  alt="Tim Jayas" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2 opacity-60">
                  <span className="font-handwriting text-gray-400 text-xs italic -rotate-3">This is me</span>
                  <span className="text-xl">👋</span>
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 text-left">
              <div className="mb-6">
                  <span className="text-orange-500 font-bold tracking-[0.05em] text-[10px] uppercase">FROM THE FOUNDER</span>
              </div>
              
              <h2 className="text-3xl md:text-[2.75rem] font-bold text-white leading-tight tracking-tight mb-8">
                Built by a founder tired of missing <span className="text-orange-500">Reddit opportunities</span>
              </h2>
              
              <div className="space-y-6 text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-2xl">
                <p>
                  I've launched multiple SaaS products and know how valuable Reddit can be for finding early customers. But manually searching through subreddits every day? That's exhausting.
                </p>
                <p>
                  I wanted a tool that would monitor Reddit for me, score posts with AI, and deliver the best opportunities to my inbox each morning. So I built RedLeads.
                </p>
                <p className="text-white font-bold">
                  Now I wake up to a curated list of Reddit opportunities, instead of spending hours searching. I hope it helps you too.
                </p>
                <p className="text-gray-400">
                  <span className="text-orange-500 font-bold">Important:</span> I built this to be a discovery engine, not a spam bot. Please follow our <Link href="/protocol" className="text-white underline hover:text-orange-500 transition-colors">Reddit Success Protocol</Link> to ensure you engage authentically and safely.
                </p>
              </div>

              {/* Separator Line */}
              <div className="w-full h-[1px] bg-white/10 mt-10 mb-6" />

              <div>
                <p className="text-white font-serif-italic italic text-xl opacity-90">- Tim Jayas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Early Impressions Part of Story */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-24">
            
            <h3 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">Feedback from the community</h3>
            <p className="text-gray-500 text-sm md:text-base font-medium opacity-60">Reactions from the early RedLeads community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              {[testimonials[6]!, testimonials[9]!, testimonials[2]!, testimonials[3]!].map((testimonial, idx) => (
                <TestimonialCard key={`col1-${idx}`} testimonial={testimonial} />
              ))}
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              {[testimonials[4]!, testimonials[1]!, testimonials[0]!].map((testimonial, idx) => (
                <TestimonialCard key={`col2-${idx}`} testimonial={testimonial} />
              ))}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              {[testimonials[7]!, testimonials[8]!, testimonials[5]!].map((testimonial, idx) => (
                <TestimonialCard key={`col3-${idx}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
