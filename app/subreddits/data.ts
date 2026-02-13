export interface SubredditHubData {
  slug: string;
  subreddit: string;
  title: string;
  description: string;
  keywords: string[];
  tips: string[];
  bestTime: string;
  relevantSubreddits: string[];
}

export const subredditHubs: SubredditHubData[] = [
  {
    slug: 'saas-marketing-reddit',
    subreddit: 'r/SaaS',
    title: 'The Ultimate Guide to SaaS Marketing on r/SaaS (2026)',
    description: 'Learn how to find your first 100 users for your SaaS on Reddit. Discover the best subreddits and strategies for SaaS growth.',
    keywords: ['SaaS marketing reddit', 'r/saas growth guide', 'find saas customers reddit'],
    tips: [
      'Stop pitching, start helping. Redditors hate advertisements.',
      'Comment on "Seeking recommendation" posts within 30 minutes for 80% more visibility.',
      'Use RedLeads AI intent scoring to filter out noisy "how-to" posts and focus on "ready-to-buy" signals.',
      'Always disclose your affiliation when mentioning your product.'
    ],
    bestTime: '9 AM - 12 PM EST (Tuesdays & Wednesdays)',
    relevantSubreddits: ['r/SaaS', 'r/MicroSaaS', 'r/SaaSMarketing', 'r/SaaSSales', 'r/ShowMeYourSaaS']
  },
  {
    slug: 'entrepreneurship-growth-reddit',
    subreddit: 'r/Entrepreneur',
    title: 'How to Growth Hack r/Entrepreneur & Scale Your Startup (2026)',
    description: 'A masterclass in using r/Entrepreneur to find early adopters and validate your startup idea using AI intent data.',
    keywords: ['entrepreneur reddit marketing', 'startup growth reddit', 'find founders reddit'],
    tips: [
      'Share "lessons learned" posts instead of direct links.',
      'Identify founders complaining about specific problems (e.g., "marketing is hard") using RedLeads alerts.',
      'Bridge the gap between their problem and your solution in a helpful comment.',
      'Focus on high-engagement threads with 50+ comments where intent is high.'
    ],
    bestTime: '10 AM - 1 PM EST (Mondays & Thursdays)',
    relevantSubreddits: ['r/Entrepreneur', 'r/startups', 'r/business', 'r/smallbusiness', 'r/EntrepreneurRideAlong']
  },
  {
    slug: 'agency-lead-generation-reddit',
    subreddit: 'r/Agencies',
    title: 'Lead Gen for Agencies: Finding High-Ticket Clients on Reddit (2026)',
    description: 'How agencies can use Reddit to find B2B clients and high-ticket leads without spending thousands on LinkedIn ads.',
    keywords: ['agency lead gen reddit', 'find agency clients reddit', 'b2b marketing reddit'],
    tips: [
      'Monitor subreddits like r/Marketing and r/SEO for people asking for agency recommendations.',
      'RedLeads AI intent scoring helps you find clients with budget signals.',
      'Always check the subreddit Sidebar/Rules for "Self-Promotion Days".',
      'RedLeads Discovery is 100% Reddit API compliant & safe.',
      'DM only after a public interaction has established trust.',
      'Case study snippets perform exceptionally well in r/Agencies.'
    ],
    bestTime: '8 AM - 11 AM EST (Wednesdays)',
    relevantSubreddits: ['r/Agencies', 'r/Marketing', 'r/SEO', 'r/digital_marketing', 'r/SocialMediaMarketing']
  },
  {
    slug: 'indie-hackers-marketing-reddit',
    subreddit: 'r/indiehackers',
    title: 'Indie Hackers Guide: Promoting Your Product on Reddit (2026)',
    description: 'The definitive guide for Indie Hackers to find their first users and build a "build in public" brand on Reddit.',
    keywords: ['indie hacker reddit', 'build in public reddit', 'side project promotion reddit'],
    tips: [
      'The "r/SideProject" first-post-perfect-pitch is your best friend.',
      'RedLeads helps you track your keyword alerts so you are never late to a thread.',
      'Be ultra-transparent about your journey. Vulnerability = Trust.',
      'Use Reddit to get product feedback, not just sales.'
    ],
    bestTime: '12 PM - 3 PM EST (Weekends are surprisingly good for Indie Hackers)',
    relevantSubreddits: ['r/indiehackers', 'r/SideProject', 'r/buildinpublic', 'r/Solopreneur', 'r/micro_saas']
  },
  {
    slug: 'side-project-promotion-reddit',
    subreddit: 'r/SideProject',
    title: 'Get Your First 100 Users: Promoting Your Side Project on Reddit',
    description: 'Stop shouting into the void. Use AI-driven subreddit monitoring to find users who actually need your side project.',
    keywords: ['promote side project reddit', 'get first users reddit', 'side project success reddit'],
    tips: [
      'Visuals matter. Use images or short videos in your posts if permitted.',
      'Reddit is the best place to find early adopters who value "raw" and "new" products.',
      'Monitor "Show Me Your Project" threads and engage with everyone who comments on others.',
      'RedLeads helps you stay on top of daily opportunities across 10+ niche subreddits.'
    ],
    bestTime: '9 AM EST (Sundays & Mondays)',
    relevantSubreddits: ['r/SideProject', 'r/AppIdeas', 'r/Business_Ideas', 'r/juststart', 'r/thesidehustle']
  }
];

export function getSubredditHubBySlug(slug: string): SubredditHubData | undefined {
  return subredditHubs.find(h => h.slug === slug);
}

export function getAllSubredditHubs(): SubredditHubData[] {
  return subredditHubs;
}
