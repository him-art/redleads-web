import { MetadataRoute } from 'next';
import { getAllPosts } from './blog/posts';
import { getAllComparisons } from './compare/data';
import { getAllSubredditHubs } from './subreddits/data';
import { getAllSolutions } from './solutions/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.redleads.app';

  // Static pages with real last-modified dates.
  // Using new Date() for every page tells Google ALL pages changed on every crawl,
  // wasting crawl budget and destroying freshness signal trust.
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date('2026-06-10'), // Last landing page refactor
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-06-22'),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/protocol`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tools/reddit-opportunity-finder`,
      lastModified: new Date('2026-05-15'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tools/reddit-niche-explorer`,
      lastModified: new Date('2026-05-15'),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date('2026-05-15'),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/reddit-engagement-calculator`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/reddit-ad-cost-calculator`,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Blog posts
  const blogPosts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Comparison pages
  const comparisonPages = getAllComparisons().map((comparison) => ({
    url: `${baseUrl}/compare/${comparison.slug}`,
    lastModified: new Date('2026-05-27'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Subreddit hub pages
  const subredditPages = getAllSubredditHubs().map((hub) => ({
    url: `${baseUrl}/subreddits/${hub.slug}`,
    lastModified: new Date('2026-05-15'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Solution pages (static verticals only)
  const solutionPages = getAllSolutions().map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date('2026-05-15'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages, 
    {
      url: `${baseUrl}/solutions/directory`,
      lastModified: new Date('2026-05-15'),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...blogPosts, 
    ...comparisonPages, 
    ...subredditPages, 
    ...solutionPages,
  ];
}

