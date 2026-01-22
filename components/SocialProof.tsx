"use client";

const SocialProof = () => {
  // Add testimonials manually - extract comments from X posts
  const testimonials = [
    {
      quote: "Sounds like a solid idea!",
      author: "Daniel Rachlin",
      handle: "@danielrachlin1",
      initial: "D",
      date: "7 Jan 2026",
      url: "https://x.com/danielrachlin1/status/2008658629189398817?s=20"
    },
    {
      quote: "You need testers? I see the potential in this ngl", 
      author: "sdotdev",
      handle: "@sdotdev",
      initial: "S",
      date: "7 Jan 2026",
      url: "https://x.com/sdotdev/status/2008546879249019098?s=20"
    },
   {
      quote: "Why dont you build it?", 
      author: "Konny | Vibe Coder",
      handle: "@konnydev",
      initial: "K",
      date: "6 Jan 2026",
      url: "https://x.com/konnydev/status/2008500662146130027?s=20"
    }
  ];

  return (
    <section className="py-20 bg-[#1a1a1a] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by Solo Founders
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Join the growing community of indie hackers and founders who are finding their first customers from Reddit on autopilot.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i} 
              className="rounded-2xl border border-white/10 bg-black p-4 transition-colors hover:bg-[#0a0a0a] cursor-pointer"
              onClick={() => testimonial.url && window.open(testimonial.url, '_blank', 'noopener,noreferrer')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 font-bold text-gray-400">
                    {testimonial.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-[15px]">{testimonial.author}</span>
                      <svg className="w-[18px] h-[18px] text-blue-400 fill-current" viewBox="0 0 24 24">
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6 11.66l1.4-1.46 3.14 3.14 6.46-6.44L18.4 8.34"></path>
                      </svg>
                    </div>
                    <div className="text-gray-500 text-[15px]">{testimonial.handle}</div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="12" cy="19" r="2"></circle>
                  </svg>
                </button>
              </div>
              
              <p className="text-white text-[15px] leading-relaxed mb-3">{testimonial.quote}</p>
              
              <div className="text-gray-500 text-[15px]">
                {testimonial.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;