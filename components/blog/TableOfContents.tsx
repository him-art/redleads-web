'use client';

import { useEffect, useState, useRef } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  content: string;
}

export default function TableOfContents({ content }: Props) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Extract headings from markdown content
    const lines = content.split('\n');
    const items: TOCItem[] = [];
    
    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)/);
      const h3Match = line.match(/^### (.+)/);
      
      if (h2Match) {
        const text = h2Match[1].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, text, level: 3 });
      }
    });
    
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="mb-12 p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
        <span className="material-symbols-outlined text-orange-500" style={{ fontSize: 14 }}>list</span>
        In This Article
      </div>
      <ol className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(heading.id);
                }
              }}
              className={`
                block py-1.5 text-sm transition-all duration-200 hover:text-orange-500
                ${heading.level === 3 ? 'pl-5 text-xs' : 'pl-0 font-medium'}
                ${activeId === heading.id 
                  ? 'text-orange-500 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
