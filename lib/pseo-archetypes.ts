export type ArchetypeData = {
  id: string;
  name: string;
  vibe: string;
  strategy: string;
  topHacks: string[];
  communityRules: string[];
};

const ARCHETYPES: Record<string, ArchetypeData> = {
  founder: {
    id: 'founder',
    name: 'Founders & Builders',
    vibe: 'Validation & Feedback Oriented',
    strategy: 'Focus on 0-to-1 growth, finding early adopters, and achieving product-market fit.',
    topHacks: [
      'Offer a "Founder Pass" or lifetime deal for early adopters.',
      'Ask for genuine, harsh feedback on your MVP or landing page.',
      'Identify people describing a specific manual struggle and offer a beta solution.'
    ],
    communityRules: [
      'No direct links to your product without context or answering a question.',
      'Always use the "Build in Public" or "Storytelling" angle when posting.',
      'Maintain a 9:1 ratio of providing value vs self-promotion.'
    ]
  },
  marketing: {
    id: 'marketing',
    name: 'Growth & Marketing',
    vibe: 'Metrics & ROI Focused',
    strategy: 'Focus on lowering customer acquisition cost (CAC), engagement rates, and scalable growth tactics.',
    topHacks: [
      'Share a transparent case study with real numbers.',
      'Provide a free teardown of a popular marketing campaign.',
      "Compare your tool's conversion rates against traditional methods."
    ],
    communityRules: [
      'Back up all claims with real data and analytical proof.',
      'Avoid vague marketing agency buzzwords ("synergy", "growth hacking").',
      'Share the "How" and not just the "What" when discussing success.'
    ]
  },
  sales: {
    id: 'sales',
    name: 'Sales & Revenue',
    vibe: 'Quota & Pipeline Driven',
    strategy: 'Demonstrate immediate revenue impact, faster closing times, and automated pipeline generation.',
    topHacks: [
      'Show how to bypass gatekeepers or automate cold outreach.',
      'Share a high-converting cold email template.',
      'Offer a free lead list or CRM audit.'
    ],
    communityRules: [
      'Focus discussions on closing techniques, not lead gen tools.',
      'Do not pitch your B2B tool as a standalone post; wait for "Tool Stack" threads.',
      'Address the salesperson\'s commission, not just the company\'s bottom line.'
    ]
  },
  dev: {
    id: 'dev',
    name: 'Software Developers',
    vibe: 'Technical & No-BS',
    strategy: 'Focus on architecture, technical documentation, solving tough bugs, and maintaining clean code.',
    topHacks: [
      'Answer a specific technical hurdle or post a code snippet first.',
      'Link directly to your API documentation or GitHub repo.',
      'Offer a free, robust developer tier without requiring a credit card.'
    ],
    communityRules: [
      'Self-promotion is strictly banned outside of designated "Showoff Saturday" threads.',
      'Your product MUST have an open-source component or free utility.',
      'Include technical implementation details (architecture, stack) in your replies.'
    ]
  },
  mobile_dev: {
    id: 'mobile_dev',
    name: 'Mobile Development',
    vibe: 'App Store & Performance Focused',
    strategy: 'Address cross-platform challenges, app store optimization (ASO), and mobile performance metrics.',
    topHacks: [
      'Share open-source UI components or animations.',
      'Discuss strategies for bypassing App Store rejection.',
      'Offer analytics tools tailored for mobile retention.'
    ],
    communityRules: [
      'Do not post asking for app downloads or positive App Store reviews.',
      'Share specific code implementations (Swift/Kotlin/React Native) to earn trust.',
      'Discuss performance metrics (render times, bundle size) over UI updates.'
    ]
  },
  design: {
    id: 'design',
    name: 'Designers & UX',
    vibe: 'Aesthetic & Usability Centric',
    strategy: 'Provide inspiration, critique UI/UX patterns, and focus on human-computer interaction principles.',
    topHacks: [
      'Give constructive design critiques on community portfolios.',
      'Share a free Figma UI kit or component library.',
      'Discuss accessibility (a11y) improvements.'
    ],
    communityRules: [
      'Visual proof is required—always link to prototypes or case studies.',
      'Do not promote themes/templates for sale; offer free resources only.',
      'Critiques must be constructive, never purely negative or promotional.'
    ]
  },
  freelance: {
    id: 'freelance',
    name: 'Freelancers & Nomads',
    vibe: 'Independence & Hustle',
    strategy: 'Address client acquisition, managing uneven income, and remote work lifestyle optimization.',
    topHacks: [
      'Share actionable tips on increasing hourly rates.',
      'Provide customizable client contract templates.',
      'Discuss async communication tools or timezone hacks.'
    ],
    communityRules: [
      'Selling "Get Rich Quick" freelance courses will get you instantly banned.',
      'Focus on operational efficiency (billing, sourcing) rather than tool discovery.',
      'Share standardized pricing benchmarks before recommending premium tools.'
    ]
  },
  ai: {
    id: 'ai',
    name: 'AI & Machine Learning',
    vibe: 'Cutting-Edge & Experimental',
    strategy: 'Showcase novel use cases, model fine-tuning results, and agentic workflows.',
    topHacks: [
      'Share open-source prompts or custom GPTs.',
      'Compare token costs and latency across different LLMs.',
      'Provide a technical breakdown of a local deployment.'
    ],
    communityRules: [
      'Avoid vague "AI will change the world" hype posts.',
      'Include specific model configurations and benchmark testing data.',
      'Do not post generated AI art unless it demonstrates a novel workflow.'
    ]
  },
  product: {
    id: 'product',
    name: 'Product Management',
    vibe: 'Strategic & User-Centric',
    strategy: 'Focus on user research, roadmap prioritization, and aligning stakeholders.',
    topHacks: [
      'Share a proven template for user interviews.',
      'Discuss frameworks for saying "no" to feature requests.',
      'Offer a tool that simplifies roadmap visualization.'
    ],
    communityRules: [
      'Focus on methodology (Agile, Scrum, Jobs-to-be-Done) rather than software.',
      'Do not use the community to source user interviews for your own product.',
      'Provide actionable frameworks formatting over philosophical debates.'
    ]
  },
  fashion: {
    id: 'fashion',
    name: 'Fashion & E-Commerce',
    vibe: 'Visual & Trend-Driven',
    strategy: 'Focus on visual aesthetics, supply chain transparency, and brand storytelling.',
    topHacks: [
      'Share high-quality lookbooks or styling advice.',
      'Discuss sustainable sourcing or manufacturing challenges.',
      'Offer exclusive discounts or early access drops.'
    ],
    communityRules: [
      'Self-promotion is often limited to weekly mega-threads.',
      'High-quality, non-branded photography is required for all posts.',
      'Avoid fast-fashion affiliate links or dropshipping promotions.'
    ]
  },
  food: {
    id: 'food',
    name: 'Food & Hospitality',
    vibe: 'Fast-Paced & Profit-Margin Focused',
    strategy: 'Address labor shortages, food cost optimization, and local marketing tactics.',
    topHacks: [
      'Share spreadsheets for tracking ingredient costs.',
      'Discuss strategies for reducing waste or turnover.',
      'Offer a free POS system consultation.'
    ],
    communityRules: [
      'This is an industry vent-space; forced positivity or corporate speak is rejected.',
      'Target owners/managers separately from back-of-house staff.',
      'Provide hyper-local or operational ROI before pitching tech solutions.'
    ]
  },
  business: {
    id: 'business',
    name: 'General Business & Finance',
    vibe: 'Operational & Financial Precision',
    strategy: 'Focus on compounding growth, legal compliance, and operational efficiency.',
    topHacks: [
      'Share financial modeling spreadsheets.',
      'Discuss risk mitigation and compliance checklists.',
      'Offer a tool for automating repetitive admin tasks.'
    ],
    communityRules: [
      'No MLM, Crypto, or "Hustle Culture" spam.',
      'Always qualify legal or financial advice with standard disclaimers.',
      'Provide tangible ROI metrics (hours saved, overhead reduced) for all tools.'
    ]
  }
};

const KEYWORD_MAP: Record<string, string> = {
  // Founders
  saas: 'founder', indiehackers: 'founder', entrepreneur: 'founder', startups: 'founder', 
  microsaas: 'founder', sideproject: 'founder', entrepreneurship: 'founder', 
  ycombinator: 'founder', roastmystartup: 'founder', alphaandbetausers: 'founder',
  sweatystartup: 'founder', entrepreneurridealong: 'founder', juststart: 'founder', 
  leanstartup: 'founder', advancedentrepreneur: 'founder', buildinpublic: 'founder', 
  makers: 'founder', startupindia: 'founder', womenentrepreneurs: 'founder', 
  ladyproduct: 'founder', entrepreneurs: 'founder', askentrepreneur: 'founder',
  ideaextraction: 'founder', solopreneur: 'founder',

  // Marketing
  marketing: 'marketing', growmyproduct: 'marketing', growthhacking: 'marketing', 
  digitalmarketing: 'marketing', askmarketing: 'marketing', socialmedia: 'marketing', 
  seo: 'marketing', copywriting: 'marketing', contentmarketing: 'marketing', 
  emailmarketing: 'marketing', ppc: 'marketing', advertising: 'marketing', 
  branding: 'marketing', analytics: 'marketing', bigseo: 'marketing', 
  localseo: 'marketing', semrush: 'marketing', ahrefs: 'marketing', 
  b2bmarketing: 'marketing', growth: 'marketing', marketingautomation: 'marketing',

  // Sales
  sales: 'sales', b2bsales: 'sales', crm: 'sales', salesdevelopment: 'sales',

  // Dev
  programming: 'dev', webdev: 'dev', reactjs: 'dev', node: 'dev', javascript: 'dev', 
  python: 'dev', devops: 'dev', learnprogramming: 'dev', cscareerquestions: 'dev', 
  django: 'dev', flask: 'dev', opensource: 'dev',

  // Mobile Dev
  androiddev: 'mobile_dev', iosprogramming: 'mobile_dev', reactnative: 'mobile_dev', 
  flutterdev: 'mobile_dev', swift: 'mobile_dev', mobiledev: 'mobile_dev',

  // Design
  userexperience: 'design', design_critiques: 'design', web_design: 'design', 
  ui_design: 'design',

  // Freelance
  freelance: 'freelance', remotework: 'freelance', digitalnomad: 'freelance', forhire: 'freelance',

  // AI & Data
  machinelearning: 'ai', artificial: 'ai', ai_agents: 'ai', vibecoding: 'ai', 
  artificialinteligence: 'ai', openai: 'ai', chatgpt: 'ai', langchain: 'ai', 
  localllama: 'ai', chatbots: 'ai', dataisbeautiful: 'ai',

  // Product
  product: 'product', smallproduct: 'product', productmanagement: 'product', appproduct: 'product',

  // Fashion & E-Com
  femalefashionadvice: 'fashion', malefashionadvice: 'fashion', streetwear: 'fashion', 
  outfits: 'fashion', fashion: 'fashion', styleboards: 'fashion', capsulewardrobe: 'fashion', 
  findfashion: 'fashion', frugalfemalefashion: 'fashion',

  // Food
  restaurateur: 'food', kitchenconfidential: 'food', chefit: 'food', restaurantowners: 'food', 
  barowners: 'food', foodindustry: 'food', foodtrucks: 'food', talesfromyourserver: 'food', 
  chef: 'food', culinary: 'food',

  // General Business & Other
  productivity: 'business', getdisciplined: 'business', internetisbeautiful: 'business', 
  personalfinance: 'business', investing: 'business', legaladvice: 'business', 
  trademarks: 'business', automation: 'business', zapier: 'business', lowcode: 'business', 
  nocode: 'business', projectmanagement: 'business', customersuccess: 'business', 
  smallbusiness: 'business'
};

export function getArchetypeForSubreddit(subreddit: string): ArchetypeData {
  const normalized = subreddit.toLowerCase().replace(/r\//, '').replace(/\//g, '');
  
  // Direct match
  if (KEYWORD_MAP[normalized]) {
    return ARCHETYPES[KEYWORD_MAP[normalized]];
  }

  // Substring match heuristic as fallback
  if (normalized.includes('tech') || normalized.includes('code') || normalized.includes('dev')) return ARCHETYPES.dev;
  if (normalized.includes('market') || normalized.includes('seo') || normalized.includes('ad')) return ARCHETYPES.marketing;
  if (normalized.includes('sale') || normalized.includes('clos')) return ARCHETYPES.sales;
  if (normalized.includes('design') || normalized.includes('ux') || normalized.includes('ui')) return ARCHETYPES.design;
  if (normalized.includes('ai') || normalized.includes('gpt') || normalized.includes('llm')) return ARCHETYPES.ai;
  if (normalized.includes('food') || normalized.includes('cook')) return ARCHETYPES.food;
  if (normalized.includes('fashion') || normalized.includes('wear') || normalized.includes('style')) return ARCHETYPES.fashion;

  // Default
  return ARCHETYPES.founder;
}

export function getUniqueTitles(solutionName: string, subName: string, archetypeId: string) {
  // Use a simple hash of the names to deterministically pick a structure
  const hash = (solutionName + subName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const options = [
    {
      title: `How to market on ${subName}`,
      highlight: `for ${solutionName}`,
      desc: `Stop manual scrolling. Learn the exact Reddit marketing strategy to find ${solutionName} customers in ${subName} without getting banned.`
    },
    {
      title: `Get customers from ${subName}`,
      highlight: `for your ${solutionName}`,
      desc: `Discover how to identify high-intent buyers for ${solutionName} in ${subName}. Use RedLeads AI to monitor conversations and close leads faster.`
    },
    {
      title: `${subName} Marketing Strategy`,
      highlight: `for ${solutionName} Growth`,
      desc: `The ultimate guide to ${solutionName} lead generation in ${subName}. Find out where your customers hang out and what they are searching for.`
    },
    {
      title: `Finding ${solutionName} Users`,
      highlight: `in ${subName} (AI Tool)`,
      desc: `Don't guess which ${subName} threads are worth your time. Let our 24/7 AI listener find users who need ${solutionName} right now.`
    }
  ];

  return options[hash % options.length];
}
