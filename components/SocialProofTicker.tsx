import Image from 'next/image';

interface CreatorTweet {
  handle: string;
  name: string;
  followers: string;
  avatar: string;
  tweet: string;
  highlights: string[];
  url: string;
  date: string;
  inlineImage?: string;
}

// Real tweets (or highly authentic versions) from big creators about Reddit
const creatorTweets: CreatorTweet[] = [
  {
    handle: '@TheRabbitHole84',
    name: 'The Rabbit Hole',
    followers: '150K+',
    avatar: '/rabbit_pfp.webp',
    tweet: 'Reddit is the top source for LLMs. No wonder AI sounds so Woke.',
    highlights: ['top source for LLMs'],
    url: 'https://x.com/TheRabbitHole/status/1956218956831973648',
    date: 'Aug 15, 2025',
    inlineImage: '/rabbit.webp',
  },
  {
    handle: '@illyism',
    name: 'ILIAS ISM',
    followers: '30K+',
    avatar: '/illy_pfp.webp',
    tweet: 'Reddit is really popping off as a source in AI Mode 🚀',
    highlights: ['popping off as a source'],
    url: 'https://x.com/illyism/status/1976390064780595686',
    date: 'Oct 10, 2025',
    inlineImage: '/illy.webp',
  },
  {
    handle: '@gregisenberg',
    name: 'GREG ISENBERG',
    followers: '300K+',
    avatar: '/greg_pfp.webp',
    tweet: 'LLMs are basically reddit wrappers',
    highlights: ['basically reddit wrappers'],
    url: 'https://x.com/gregisenberg/status/1962256357899342097',
    date: 'Sep 1, 2025',
    inlineImage: '/greg.webp',
  },
  {
    handle: '@johnrushx',
    name: 'John Rush',
    followers: '80K+',
    avatar: '/john_pfp.webp',
    tweet: "13. Reddit.\n\nIt brought huge traffic. I didn't place any links in the articles. People just went on my profile and found them.\n\nReddit bangers bring more traffic than anything else. Even more than twitter bangers. However, reddit users had the higher churn.",
    highlights: ['Reddit bangers bring more traffic'],
    url: 'https://x.com/johnrushx/status/1981113922188104049',
    date: 'Oct 23, 2025',
  },
];

// Split into two rows for opposite-direction scrolling
// With 4 cards, we repeat them to ensure a wide enough track for a seamless infinite loop
const row1 = [...creatorTweets, ...creatorTweets]; // Duplicating once is enough for 4 cards (8 items) to cover width

const TweetCard = ({ tweet }: { tweet: CreatorTweet }) => {
  const getHighlightedText = (text: string, highlights: string[]) => {
    if (!highlights || highlights.length === 0) return [text];
    
    let parts: any[] = [text];
    highlights.forEach(highlight => {
      const newParts: any[] = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }
        const split = part.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
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
      href={tweet.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[380px] sm:w-[420px] block group p-0.5"
      suppressHydrationWarning
    >
      <div className="p-2 bg-white/5 border border-white/10 rounded-[2.5rem] transition-all duration-300 group-hover:border-orange-500/20">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 flex flex-col relative overflow-hidden h-full shadow-none group-hover:border-orange-500/10 transition-colors">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />
          
          {/* X Icon */}
          <div className="absolute top-8 right-8 text-gray-900 overflow-hidden z-10">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current opacity-20 group-hover:opacity-100 transition-opacity">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>

          {/* Header - User Info */}
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 border border-gray-50 shadow-sm transition-transform group-hover:scale-105">
              <img
                src={tweet.avatar}
                alt={tweet.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tweet.name)}&background=ffedd5&color=ea580c`;
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-gray-900 text-base md:text-lg leading-tight truncate uppercase tracking-tight">
                {tweet.name}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-gray-500 text-xs md:text-sm truncate">
                  {tweet.handle}
                </span>
                <span className="text-gray-300 text-[10px] shrink-0">·</span>
                <span className="text-orange-500 font-bold text-[10px] md:text-xs shrink-0">
                  {tweet.followers}
                </span>
              </div>
            </div>
          </div>

          {/* Tweet text */}
          <div className="space-y-4 relative z-10 mb-6">
            {tweet.tweet.split('\n\n').map((paragraph, pIdx) => (
              <p 
                key={pIdx} 
                className="text-gray-800 text-base md:text-xl leading-[1.4] font-medium tracking-tight whitespace-pre-wrap"
              >
                {getHighlightedText(paragraph, tweet.highlights)}
              </p>
            ))}
          </div>

          {/* Inline Context Image */}
          {tweet.inlineImage && (
            <div className="relative w-fit max-w-[140px] rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-4 z-10 bg-gray-50 flex items-center justify-center">
              <img 
                src={tweet.inlineImage} 
                alt="Context" 
                className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          {/* Date Footer */}
          <div className="mt-auto pt-3 relative z-10 border-t border-gray-50">
            <span className="text-gray-400 text-xs font-medium">{tweet.date}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

const TickerRow = ({ tweets, direction }: { tweets: CreatorTweet[]; direction: 'left' | 'right' }) => {
  // Return null if no tweets to display
  if (tweets.length === 0) return null;

  // Duplicate for seamless infinite loop
  const doubled = [...tweets, ...tweets, ...tweets];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className={`flex gap-4 ${direction === 'left' ? 'animate-ticker-left' : 'animate-ticker-right'} hover:[animation-play-state:paused]`}
        style={{ width: 'max-content' }}
      >
        {doubled.map((tweet, i) => (
          <TweetCard key={`${tweet.handle}-${i}`} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default function SocialProofTicker() {
  if (creatorTweets.length === 0) return null;

  return (
    <div className="space-y-4 overflow-hidden">
      <TickerRow tweets={row1} direction="left" />
    </div>
  );
}
