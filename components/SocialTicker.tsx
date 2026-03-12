'use client';

import React from 'react';
import Image from 'next/image';

export interface SocialCardData {
  handle: string;
  name: string;
  avatar: string;
  content: string;
  highlights: string[];
  url: string;
  followers?: string; // Optional for creators
  inlineImage?: string;
}

interface SocialTickerProps {
  items: SocialCardData[];
  direction?: 'left' | 'right';
  className?: string;
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current opacity-20 group-hover:opacity-100 transition-opacity">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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

export const SocialCard = ({ data }: { data: SocialCardData }) => {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[420px] sm:w-[500px] block group p-0.5"
      suppressHydrationWarning
    >
      <div className="p-2 bg-white/5 border border-white/10 rounded-[2.5rem] transition-all duration-300 group-hover:border-orange-500/20">
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-gray-100 flex flex-col relative overflow-hidden h-full shadow-none group-hover:border-orange-500/10 transition-colors">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />
          
          {/* X Icon */}
          <div className="absolute top-7 md:top-8 right-7 md:right-8 text-gray-900 overflow-hidden z-10">
            <XIcon />
          </div>

          {/* Header - User Info */}
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 border border-gray-50 shadow-sm">
              <img
                src={data.avatar}
                alt={data.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=ffedd5&color=ea580c`;
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-gray-900 text-base md:text-lg leading-tight truncate">
                {data.name}
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-gray-500 text-sm truncate">
                  {data.handle}
                </span>
                {data.followers && (
                  <>
                    <span className="text-gray-300 text-[10px] shrink-0">·</span>
                    <span className="text-orange-500 font-bold text-xs shrink-0">
                      {data.followers}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-800 text-[15px] md:text-[17px] leading-relaxed font-normal relative z-10 mb-4">
            &ldquo;{getHighlightedText(data.content, data.highlights)}&rdquo;
          </p>

          {/* Inline Context Image */}
          {data.inlineImage && (
            <div className="relative w-full aspect-[1.3/1] rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-2 z-10">
              <img 
                src={data.inlineImage} 
                alt="Context" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default function SocialTicker({ items, direction = 'left', className = '' }: SocialTickerProps) {
  // Duplicate for seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent z-10 pointer-events-none" />

      <div
        className={`flex gap-4 ${direction === 'left' ? 'animate-ticker-left' : 'animate-ticker-right'} hover:[animation-play-state:paused]`}
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <SocialCard key={`${item.handle}-${i}`} data={item} />
        ))}
      </div>
    </div>
  );
}
