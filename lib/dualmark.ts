import { blogPosts } from '@/app/blog/posts';
import { comparisons } from '@/app/compare/data';

/**
 * Maps blog posts to Dualmark CollectionEntry<BlogEntryData> format.
 * BlogEntryData expects: { title, description?, author?, publishedDate: Date, modifiedDate?: Date, category? }
 * Content goes in `body`, not `data`.
 */
export const getBlogEntries = () => {
  return blogPosts.map((post) => ({
    id: post.slug,
    body: post.content,
    data: {
      title: post.title,
      description: post.description,
      author: 'RedLeads Team',
      publishedDate: new Date(post.date),
      modifiedDate: post.lastModified ? new Date(post.lastModified) : undefined,
      category: post.category,
    }
  }));
};

/**
 * Maps comparisons to Dualmark CollectionEntry<CompareEntryData> format.
 * CompareEntryData expects: { title, description?, competitorName?, comparison?: Array<{feature, ours, competitor}> }
 */
export const getCompareEntries = () => {
  return comparisons.map((comp) => ({
    id: comp.slug,
    data: {
      title: comp.title,
      description: comp.description,
      competitorName: comp.competitor,
      comparison: comp.features.map(f => ({
        feature: f.name,
        ours: String(f.redleads),
        competitor: String(f.competitor),
      })),
    }
  }));
};
