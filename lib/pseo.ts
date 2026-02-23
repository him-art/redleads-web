import { solutions, SolutionData } from '@/app/solutions/data';
import masterSubreddits from '@/data/master-subreddits.json';

export interface PseoCombination {
  solution: SolutionData;
  subreddit: string;
  slug: string; // e.g. "saas-r-SaaS"
  title: string;
  description: string;
  insights: {
    vibe: string;
    strategy: string;
    topHacks: string[];
  };
}

export function getAllCombinations() {
  const combinations: { solution: string; subreddit: string }[] = [];
  
  solutions.forEach((solution) => {
    masterSubreddits.forEach((subreddit) => {
      combinations.push({
        solution: solution.slug,
        subreddit: subreddit.toLowerCase().replace(/r\//, '').replace(/\//g, ''),
      });
    });
  });
  
  return combinations;
}

export function getCombinationData(solutionSlug: string, subredditName: string): PseoCombination | null {
  const solution = solutions.find((s) => s.slug === solutionSlug);
  if (!solution) return null;

  // Find the actual subreddit name case-sensitively if needed, but here we assume the URL slug matches
  const subreddit = masterSubreddits.find(
    (s) => s.toLowerCase().replace(/r\//, '').replace(/\//g, '') === subredditName.toLowerCase()
  ) || subredditName;

  const formattedSub = subreddit.startsWith('r/') ? subreddit : `r/${subreddit}`;
  const insights = getSubredditInsights(subreddit);

  return {
    solution,
    subreddit: formattedSub,
    slug: `${solutionSlug}-${subredditName}`,
    title: `${solution.hero.title} on ${formattedSub} (2026 Guide)`,
    description: `Learn how to scale your ${solution.hero.titleHighlight} using RedLeads AI intent scoring on ${formattedSub}. Find leads and grow your business today.`,
    insights,
  };
}

function getSubredditInsights(subreddit: string) {
  const sub = subreddit.toLowerCase();
  
  if (sub.includes('dev') || sub.includes('code') || sub.includes('programming') || sub.includes('javascript') || sub.includes('python')) {
    return {
      vibe: 'Technical & No-BS',
      strategy: 'Focus on solving bugs, architectural advice, and technical documentation.',
      topHacks: [
        'Answer a specific technical hurdle first.',
        'Link to your API documentation.',
        'Offer a free developer tier.'
      ]
    };
  }

  if (sub.includes('marketing') || sub.includes('seo') || sub.includes('sales') || sub.includes('advertising')) {
    return {
      vibe: 'Growth & Metrics Focused',
      strategy: 'Focus on ROI, CAC reduction, and case studies with real numbers.',
      topHacks: [
        'Share a transparent case study.',
        'Focus on "Time to First Value".',
        'Compare your conversion rates vs cold email.'
      ]
    };
  }

  // Default for general Startup/Founder subreddits
  return {
    vibe: 'Validation & Feedback Oriented',
    strategy: 'Focus on 0-to-1 growth, finding early adopters, and product-market fit.',
    topHacks: [
      'Offer a "Founder Pass" for early adopters.',
      'Ask for genuine feedback on your UI.',
      'Identify people describing a specific manual struggle.'
    ]
  };
}

export function getRelatedSubreddits(currentSub: string, limit: number = 6) {
  const current = currentSub.toLowerCase().replace(/r\//, '').replace(/\//g, '');
  return masterSubreddits
    .filter((s) => s.toLowerCase().replace(/r\//, '').replace(/\//g, '') !== current)
    .sort(() => 0.5 - Math.random())
    .slice(0, limit)
    .map((s) => ({
      name: s.startsWith('r/') ? s : `r/${s}`,
      slug: s.toLowerCase().replace(/r\//, '').replace(/\//g, ''),
    }));
}
