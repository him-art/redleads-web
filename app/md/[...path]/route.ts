import { createDualmarkRouteHandler } from '@dualmark/nextjs';
import { getBlogEntries, getCompareEntries } from '@/lib/dualmark';

const handler = createDualmarkRouteHandler({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.redleads.app',
  collections: {
    blog: { 
      converter: 'blog', 
      getEntries: getBlogEntries 
    },
    compare: { 
      converter: 'compare', 
      getEntries: getCompareEntries 
    },
  },
  // Static pages — this is what makes /index.md work (the failing AEO check)
  staticPages: [
    {
      pattern: '/',
      render: () => [
        '# RedLeads — AI-Powered Reddit Lead Generation',
        '',
        '> Find customers on Reddit with AI-powered intent detection and lead scoring.',
        '',
        '## What is RedLeads?',
        '',
        'RedLeads monitors Reddit in real-time to find people actively looking for solutions like yours.',
        'Our AI scores every post for buyer intent so you only see high-quality leads — not noise.',
        '',
        '## Key Features',
        '',
        '- **AI Intent Detection** — Automatically identifies high-intent posts from potential customers',
        '- **Real-Time Monitoring** — Get alerts the moment someone mentions your niche',
        '- **Lead Scoring** — AI-powered scoring ranks leads by conversion probability',
        '- **Custom Subreddit Tracking** — Monitor any subreddit relevant to your business',
        '- **Daily Intel Reports** — AI-curated daily briefings delivered to your inbox',
        '- **Power Search** — Search across Reddit with intent filters',
        '',
        '## Pricing',
        '',
        '- **Refund Guarantee**: 7-day money-back guarantee',
        '- **Starter**: $29/mo — For solo founders',
        '- **Growth**: $39/mo — For growing teams',
        '- **Lifetime Deal**: One-time payment, forever access',
        '',
        '## Links',
        '',
        '- [Blog](/blog)',
        '- [Compare RedLeads vs Alternatives](/compare)',
        '- [Login](https://www.redleads.app/login)',
        '- [Pricing](https://www.redleads.app/#pricing)',
      ].join('\n'),
    },
  ],
});

export const dynamic = 'force-static';
export const GET = handler.GET;
export const generateStaticParams = handler.generateStaticParams;
