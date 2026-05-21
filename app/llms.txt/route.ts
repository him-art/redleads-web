import { createLlmsTxtHandler } from '@dualmark/nextjs';
import { getBlogEntries, getCompareEntries } from '@/lib/dualmark';

const handler = createLlmsTxtHandler({
  brandName: 'RedLeads',
  description: 'Find customers on Reddit with AI-powered intent detection and lead scoring.',
  sections: [
    {
      title: 'Blog',
      links: getBlogEntries().map(e => ({
        title: e.data.title,
        href: `/blog/${e.id}`,
        description: e.data.description
      }))
    },
    {
      title: 'Comparisons',
      links: getCompareEntries().map(e => ({
        title: e.data.title,
        href: `/compare/${e.id}`,
        description: e.data.description
      }))
    }
  ]
});

export const dynamic = 'force-static';
export const GET = handler.GET;
