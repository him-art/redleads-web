// Comparison page data for SEO
export interface ComparisonData {
  slug: string;
  competitor: string;
  competitorDescription: string;
  title: string;
  description: string;
  keywords: string[];
  features: {
    name: string;
    redleads: string | boolean;
    competitor: string | boolean;
  }[];
  pricing: {
    redleads: string;
    competitor: string;
  };
  pros: {
    redleads: string[];
    competitor: string[];
  };
  cons: {
    redleads: string[];
    competitor: string[];
  };
  verdict: string;
}

export const comparisons: ComparisonData[] = [
  {
    slug: 'redleads-vs-gummysearch',
    competitor: 'GummySearch',
    competitorDescription: 'A Reddit audience research tool focused on discovering pain points and content ideas.',
    title: 'RedLeads vs GummySearch: Which Reddit Tool is Better? (2025)',
    description: 'Compare RedLeads and GummySearch for Reddit marketing. See features, pricing, and which tool is best for lead generation vs market research.',
    keywords: ['GummySearch alternative', 'RedLeads vs GummySearch', 'Reddit marketing tools comparison'],
    features: [
      { name: 'AI-Powered Lead Scoring', redleads: true, competitor: false },
      { name: 'Real-Time Alerts', redleads: true, competitor: true },
      { name: 'Subreddit Monitoring', redleads: true, competitor: true },
      { name: 'Buyer Intent Detection', redleads: true, competitor: false },
      { name: 'Audience Research', redleads: 'Basic', competitor: 'Advanced' },
      { name: 'Pain Point Discovery', redleads: 'Basic', competitor: 'Advanced' },
      { name: 'Lead Dashboard', redleads: true, competitor: false },
      { name: 'Content Ideas', redleads: false, competitor: true },
      { name: 'Free Trial', redleads: true, competitor: false },
    ],
    pricing: {
      redleads: 'Free trial, then $29/month',
      competitor: 'Starts at $29/month (no free tier)',
    },
    pros: {
      redleads: [
        'AI identifies high-intent leads automatically',
        'Real-time alerts for buying signals',
        'Clean lead management dashboard',
        'Free trial available',
      ],
      competitor: [
        'Excellent for audience research',
        'Deep pain point analysis',
        'Content ideation features',
        'Good for market validation',
      ],
    },
    cons: {
      redleads: [
        'Less focus on market research',
        'Newer tool with smaller community',
      ],
      competitor: [
        'No AI lead scoring',
        'Research-focused, not lead generation',
        'No free trial',
      ],
    },
    verdict: 'Choose **RedLeads** if you want to find and convert leads from Reddit. Choose **GummySearch** if your primary goal is audience research and content ideation. For SaaS founders focused on customer acquisition, RedLeads is the better choice.',
  },
  {
    slug: 'redleads-vs-f5bot',
    competitor: 'F5Bot',
    competitorDescription: 'A free keyword monitoring tool for Reddit and Hacker News.',
    title: 'RedLeads vs F5Bot: Full Comparison (2025)',
    description: 'Compare RedLeads and F5Bot for Reddit monitoring. See why RedLeads\' AI outperforms basic keyword alerts for finding customers.',
    keywords: ['F5Bot alternative', 'RedLeads vs F5Bot', 'Reddit monitoring tools'],
    features: [
      { name: 'AI-Powered Lead Scoring', redleads: true, competitor: false },
      { name: 'Keyword Monitoring', redleads: true, competitor: true },
      { name: 'Real-Time Alerts', redleads: true, competitor: true },
      { name: 'Email Notifications', redleads: true, competitor: true },
      { name: 'Buyer Intent Detection', redleads: true, competitor: false },
      { name: 'Lead Dashboard', redleads: true, competitor: false },
      { name: 'Subreddit Filtering', redleads: true, competitor: false },
      { name: 'Hacker News Support', redleads: false, competitor: true },
      { name: 'Free Tier', redleads: 'Trial', competitor: 'Forever Free' },
    ],
    pricing: {
      redleads: 'Free trial, then $29/month',
      competitor: 'Free forever',
    },
    pros: {
      redleads: [
        'AI understands context, not just keywords',
        'Filters out noise automatically',
        'Lead scoring prioritizes best opportunities',
        'Professional dashboard for tracking',
      ],
      competitor: [
        'Completely free',
        'Simple to set up',
        'Monitors Hacker News too',
        'Reliable for basic alerts',
      ],
    },
    cons: {
      redleads: [
        'Paid after trial',
        'Does not monitor Hacker News',
      ],
      competitor: [
        'No intelligence - just keyword matching',
        'Lots of noise in results',
        'No lead management features',
        'Manual filtering required',
      ],
    },
    verdict: 'F5Bot is great if you want free, basic alerts. But if you\'re serious about finding customers, **RedLeads** saves hours of manual filtering with AI-powered lead scoring. The time saved easily justifies the cost.',
  },
  {
    slug: 'redleads-vs-syften',
    competitor: 'Syften',
    competitorDescription: 'A multi-platform social media monitoring tool that includes Reddit.',
    title: 'RedLeads vs Syften: Reddit Monitoring Comparison (2025)',
    description: 'Compare RedLeads and Syften for Reddit lead generation. See which tool is better for finding customers on Reddit.',
    keywords: ['Syften alternative', 'RedLeads vs Syften', 'social media monitoring'],
    features: [
      { name: 'AI-Powered Lead Scoring', redleads: true, competitor: false },
      { name: 'Reddit Monitoring', redleads: true, competitor: true },
      { name: 'Multi-Platform', redleads: 'Reddit Only', competitor: 'Yes (10+ platforms)' },
      { name: 'Real-Time Alerts', redleads: true, competitor: true },
      { name: 'Buyer Intent Detection', redleads: true, competitor: false },
      { name: 'Lead Dashboard', redleads: true, competitor: false },
      { name: 'Slack Integration', redleads: 'Coming Soon', competitor: true },
      { name: 'Team Features', redleads: false, competitor: true },
    ],
    pricing: {
      redleads: 'Free trial, then $29/month',
      competitor: 'Starts at $19/month',
    },
    pros: {
      redleads: [
        'Reddit-specialized with deep integration',
        'AI understands buying intent',
        'Purpose-built for lead generation',
        'Clean, focused interface',
      ],
      competitor: [
        'Monitors many platforms',
        'Good for brand monitoring',
        'Slack notifications',
        'Team collaboration features',
      ],
    },
    cons: {
      redleads: [
        'Reddit-only (for now)',
        'No team features yet',
      ],
      competitor: [
        'Jack of all trades, master of none',
        'No lead scoring or intent detection',
        'Generic monitoring, not lead focused',
      ],
    },
    verdict: 'Syften is better for general brand monitoring across platforms. But for **Reddit lead generation specifically**, RedLeads is purpose-built and more effective at finding customers.',
  },
  {
    slug: 'redleads-vs-billybuzz',
    competitor: 'BillyBuzz',
    competitorDescription: 'An AI-powered social listening tool for brand mentions.',
    title: 'RedLeads vs BillyBuzz: Which is Better for Reddit Marketing? (2025)',
    description: 'Compare RedLeads and BillyBuzz for Reddit marketing. See features, pricing, and which tool is best for finding leads.',
    keywords: ['BillyBuzz alternative', 'RedLeads vs BillyBuzz', 'Reddit marketing'],
    features: [
      { name: 'AI-Powered Analysis', redleads: true, competitor: true },
      { name: 'Lead Scoring', redleads: true, competitor: false },
      { name: 'Reddit Monitoring', redleads: true, competitor: true },
      { name: 'Brand Mention Tracking', redleads: true, competitor: true },
      { name: 'Buyer Intent Detection', redleads: true, competitor: false },
      { name: 'Lead Dashboard', redleads: true, competitor: false },
      { name: 'Sentiment Analysis', redleads: false, competitor: true },
      { name: 'Multi-Platform', redleads: 'Reddit Only', competitor: 'Multiple' },
    ],
    pricing: {
      redleads: 'Free trial, then $29/month',
      competitor: 'Custom pricing',
    },
    pros: {
      redleads: [
        'Focused on lead generation, not just monitoring',
        'AI detects buying intent',
        'Actionable lead dashboard',
        'Transparent pricing',
      ],
      competitor: [
        'Broader platform coverage',
        'Sentiment analysis',
        'Good for PR monitoring',
      ],
    },
    cons: {
      redleads: [
        'Reddit-specific',
        'No sentiment analysis',
      ],
      competitor: [
        'Not focused on lead generation',
        'Opaque pricing',
        'Monitoring-focused, not action-focused',
      ],
    },
    verdict: 'BillyBuzz is good for brand monitoring and PR. For **finding and converting leads from Reddit**, RedLeads is the clear winner with its intent detection and lead scoring.',
  },
  {
    slug: 'redleads-vs-replyguy',
    competitor: 'ReplyGuy',
    competitorDescription: 'An automated Reddit and Twitter engagement tool.',
    title: 'RedLeads vs ReplyGuy: Comparison for Reddit Marketing (2025)',
    description: 'Compare RedLeads and ReplyGuy for Reddit marketing. See why human-in-the-loop beats full automation for sustainable growth.',
    keywords: ['ReplyGuy alternative', 'RedLeads vs ReplyGuy', 'Reddit automation'],
    features: [
      { name: 'AI Lead Detection', redleads: true, competitor: false },
      { name: 'Automated Responses', redleads: false, competitor: true },
      { name: 'Reddit Monitoring', redleads: true, competitor: true },
      { name: 'Twitter Support', redleads: false, competitor: true },
      { name: 'Lead Scoring', redleads: true, competitor: false },
      { name: 'Human-in-the-Loop', redleads: true, competitor: false },
      { name: 'Risk of Ban', redleads: 'None', competitor: 'High' },
      { name: 'Authentic Engagement', redleads: true, competitor: false },
    ],
    pricing: {
      redleads: 'Free trial, then $29/month',
      competitor: 'Starts at $29/month',
    },
    pros: {
      redleads: [
        'No risk of account bans',
        'Authentic, human engagement builds trust',
        'AI finds leads, you respond naturally',
        'Sustainable long-term strategy',
      ],
      competitor: [
        'Saves time with automation',
        'Covers Reddit and Twitter',
        'Quick setup',
      ],
    },
    cons: {
      redleads: [
        'Requires manual response effort',
        'Reddit-only for now',
      ],
      competitor: [
        'High risk of Reddit bans',
        'Automated replies feel spammy',
        'Can damage brand reputation',
        'Violates Reddit ToS',
      ],
    },
    verdict: '**ReplyGuy automates responses, but at a cost.** Reddit actively bans automated accounts, and users can spot bot replies. RedLeads takes a safer approach: AI finds the leads, but YOU respond authentically. This builds real relationships and protects your account.',
  },
];

export function getComparisonBySlug(slug: string): ComparisonData | undefined {
  return comparisons.find(c => c.slug === slug);
}

export function getAllComparisons(): ComparisonData[] {
  return comparisons;
}
