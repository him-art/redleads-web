import { solutions, SolutionData } from '@/app/solutions/data';
import masterSubreddits from '@/data/pseo-subreddits.json';

import { getArchetypeForSubreddit, getUniqueTitles } from './pseo-archetypes';

export interface PseoCombination {
  solution: SolutionData;
  subreddit: string;
  slug: string; // e.g. "saas-r-SaaS"
  title: string;
  description: string;
  heroCopy: {
    title: string;
    highlight: string;
    desc: string;
  };
  insights: {
    vibe: string;
    strategy: string;
    topHacks: string[];
    communityRules: string[];
    archetypeName: string;
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
  const archetype = getArchetypeForSubreddit(subreddit);
  const { title, highlight, desc } = getUniqueTitles(solution.hero.titleHighlight, formattedSub, archetype.id);

  return {
    solution,
    subreddit: formattedSub,
    slug: `${solutionSlug}-${subredditName}`,
    title: `${title} ${highlight} (2026 Strategy Guide)`,
    description: desc,
    heroCopy: {
      title,
      highlight,
      desc
    },
    insights: {
      vibe: archetype.vibe,
      strategy: archetype.strategy,
      topHacks: archetype.topHacks,
      communityRules: archetype.communityRules,
      archetypeName: archetype.name
    },
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
