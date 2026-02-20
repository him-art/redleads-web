
export interface SolutionData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    badgeIcon: string;
    badgeText: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryCta: string;
    secondaryCta?: string;
  };
  painPoints: {
    icon: string;
    colorClass: string; // e.g. "text-red-500"
    bgClass: string; // e.g. "bg-red-500/10"
    title: string;
    description: string;
  }[];
  useCases: {
    title: string; // "4 Ways SaaS Founders Use RedLeads"
    items: {
      title: string;
      description: string;
      targeting?: string;
      colorClass?: string; // Optional for colorful headers
    }[];
  };
  footerCta: {
    title: string;
    buttonText: string;
  };
}

export const solutions: SolutionData[] = [
  {
    slug: 'saas',
    metaTitle: 'Reddit Marketing for SaaS Founders | RedLeads',
    metaDescription: 'Scale your SaaS growth with automated Reddit lead generation. Find your first 100 users and beyond with AI intent scoring.',
    hero: {
      badgeIcon: 'rocket_launch',
      badgeText: 'SaaS Growth Engine',
      title: 'Scale Your SaaS',
      titleHighlight: 'On Reddit',
      description: 'The best customers are the ones already searching for a solution. Use RedLeads to identify high-intent founders, developers, and product managers at the exact moment they need you.',
      primaryCta: 'Start automated',
      secondaryCta: 'Safe Engagement'
    },
    painPoints: [
      {
        icon: 'group',
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        title: 'High CAC',
        description: 'Ads are becoming unaffordable for bootstrapped founders. Reddit allows you to reach your niche for $0 in ad spend.'
      },
      {
        icon: 'bar_chart',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'Low Conversion',
        description: 'Cold outreach conversion rates are dropping. Reddit conversations provide the context needed for a 5x higher reply rate.'
      },
      {
        icon: 'target',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'Feature Blindness',
        description: "Don't guess what features to build. Monitor subreddits to see exactly what pain points your competitors' users are complaining about."
      }
    ],
    useCases: {
      title: '4 Ways SaaS Founders <br /><span class="text-orange-500 italic font-serif">Use RedLeads</span>',
      items: [
        {
          title: 'Competitor Churn Exploitation',
          description: 'Monitor keywords like "alternative to [Competitor]" or "[Competitor] down". Reach out instantly when a user is frustrated and looking for an exit.'
        },
        {
          title: 'Zero-to-One Validation',
          description: 'Find people describing a problem your MVP solves. Offer a free account in exchange for a demo. This is the fastest way to hit your first 10 paying users.'
        },
        {
          title: 'Programmatic SEO Research',
          description: 'See which questions are asked most frequently in /r/SaaS or /r/Entrepreneur. Use these questions as titles for your blog posts to dominate search results.'
        },
        {
          title: 'Brand Sentiment Tracking',
          description: 'Get an instant alert the second someone mentions your product on Reddit. Join the conversation to provide support or correct misconceptions before they spread.'
        }
      ]
    },
    footerCta: {
      title: 'Build a growth engine that never sleeps.',
      buttonText: 'START YOUR FREE TRIAL'
    }
  },
  {
    slug: 'agencies',
    metaTitle: 'Reddit Lead Generation for Agencies | RedLeads',
    metaDescription: 'Scale your agency by finding high-intent clients on Reddit. Discover businesses and founders actively looking for your services.',
    hero: {
      badgeIcon: 'work',
      badgeText: 'Agency Growth Vertical',
      title: 'Scale Your Agency',
      titleHighlight: 'Lead Gen',
      description: 'Stop waiting for referrals. RedLeads identifies potential clients on Reddit the moment they express a need for your services—from Web Design to B2B Sales.',
      primaryCta: 'Start Finding Clients'
    },
    painPoints: [
      {
        icon: 'layers',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'White-Label Insights',
        description: 'Use RedLeads data to provide your clients with "Market Intelligence Reports" showing exactly where their customers are talking.'
      },
      {
        icon: 'target',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'Intent over Keywords',
        description: 'Our AI scores leads so your account managers only spend time on prospects with high closing probability.'
      },
      {
        icon: 'percent',
        colorClass: 'text-green-500',
        bgClass: 'bg-green-500/10',
        title: 'Low Lead Cost',
        description: "While your competitors fight over Google Ads prices, you're finding clients organically for a fraction of the cost."
      }
    ],
    useCases: {
      title: 'Lead Sources for <br /><span class="text-orange-500 italic font-serif">Every Agency Type</span>',
      items: [
        {
          title: 'Dev Agencies',
          description: 'Monitor: "Looking for a dev partner", "Bubble freelancer help", "[Tech] stack recommendation".',
          targeting: 'r/startups, r/business, r/lowcode',
          colorClass: 'text-orange-500'
        },
        {
          title: 'Marketing Agencies',
          description: 'Monitor: "Meta Ads not working", "SEO agency review", "Need a growth marketer".',
          targeting: 'r/SaaS, r/marketing, r/entrepreneur',
          colorClass: 'text-blue-500'
        },
        {
          title: 'Design Agencies',
          description: 'Monitor: "UI/UX feedback", "Need a logo for my startup", "Landing page critique".',
          targeting: 'r/design, r/SideProject, r/SaaS',
          colorClass: 'text-purple-500'
        },
        {
          title: 'B2B Sales Agencies',
          description: 'Monitor: "How to find B2B leads", "Cold email is dead", "Help with outreach".',
          targeting: 'r/sales, r/agencies, r/B2B',
          colorClass: 'text-green-500'
        }
      ]
    },
    footerCta: {
      title: "Your agency's next flagship client is on Reddit.",
      buttonText: 'Start Ethical Lead Gen'
    }
  },
  {
    slug: 'ai-wrappers',
    metaTitle: 'Reddit Marketing for AI Wrappers | RedLeads',
    metaDescription: 'Stop relying on launch days. Find users asking for your specific AI use case on Reddit. The perfect growth engine for AI wrapper startups.',
    hero: {
      badgeIcon: 'smart_toy',
      badgeText: 'AI Growth System',
      title: 'Grow Your AI Wrapper',
      titleHighlight: 'Organic & Viral',
      description: 'The "Launch Day" traffic spike fades in 48 hours. RedLeads helps you build a sustainable stream of users who are actually looking for your AI solution right now.',
      primaryCta: 'Get AI Users'
    },
    painPoints: [
      {
        icon: 'trending_down',
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        title: 'Post-Launch Dropoff',
        description: 'Product Hunt gives you a spike, then silence. You need a consistent channel that brings in users every single day.'
      },
      {
        icon: 'search_off',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'SEO Takes Too Long',
        description: 'You cannot wait 6 months for SEO to kick in. You need users testing your model and paying for subscriptions today.'
      },
      {
        icon: 'cancel',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'Ads Ban Risk',
        description: "Many ad platforms often reject AI tools or have incredibly high CPAs. Reddit organic marketing is safe, free, and highly targeted."
      }
    ],
    useCases: {
      title: 'How AI Wrappers <br /><span class="text-orange-500 italic font-serif">Win on Reddit</span>',
      items: [
        {
          title: 'PDF Chat Tools',
          description: 'Monitor: "Summarize PDF", "Chat with document", "Student study tools".',
          targeting: 'r/college, r/students, r/productivity',
          colorClass: 'text-orange-500'
        },
        {
          title: 'Headshot Generators',
          description: 'Monitor: "Professional LinkedIn photo", "AI headshot free", "Resume help".',
          targeting: 'r/jobs, r/linkedin, r/careerguidance',
          colorClass: 'text-blue-500'
        },
        {
          title: 'Copywriting Assistants',
          description: 'Monitor: "Write blog post fast", "Email subject lines", "Marketing copy help".',
          targeting: 'r/marketing, r/copywriting, r/content_marketing',
          colorClass: 'text-green-500'
        },
        {
          title: 'Video Editors / Captions',
          description: 'Monitor: "Add captions to video", "Short form content editor", "TikTok editing tool".',
          targeting: 'r/Tiktokhelp, r/NewTubers, r/contentcreation',
          colorClass: 'text-purple-500'
        }
      ]
    },
    footerCta: {
      title: 'Turn Reddit comments into paid subscribers.',
      buttonText: 'Start Growing'
    }
  },
  {
    slug: 'web3-dapps',
    metaTitle: 'Reddit Marketing for Web3 & dApps | RedLeads',
    metaDescription: 'Find real users for your dApp or protocol. Cut through the "wen moon" spam and identify developers and power users asking for your specific solution.',
    hero: {
      badgeIcon: 'currency_bitcoin',
      badgeText: 'Web3 Growth',
      title: 'Grow Your DAPP',
      titleHighlight: 'Without Shilling',
      description: 'Crypto subreddits are full of noise. RedLeads uses AI to filter out price speculation so you can find developers, early adopters, and users asking for your specific protocol.',
      primaryCta: 'Find Web3 Users',
      secondaryCta: 'Anti-Spam Filter'
    },
    painPoints: [
      {
        icon: 'notifications_off',
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        title: 'Too Much Noise',
        description: '90% of crypto comments are bots or price speculation. Our AI filters this out so you only see genuine product usage opportunities.'
      },
      {
        icon: 'gpp_bad',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'Ban Risk',
        description: 'Generic shilling gets you banned. Answering specific technical questions with helpful advice builds trust and gets you whitelisted.'
      },
      {
        icon: 'timeline',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'Volatile Ad Prices',
        description: "Crypto ad networks are expensive and low quality. Organic Reddit marketing builds a loyal technical community."
      }
    ],
    useCases: {
      title: 'How Web3 Projects <br /><span class="text-orange-500 italic font-serif">Build Community</span>',
      items: [
        {
          title: 'DeFi Protocols',
          description: 'Monitor: "Best yield farm", "Staking rewards", "Alternative to [Competitor]".',
          targeting: 'r/defi, r/ethereum, r/cryptocurrency',
          colorClass: 'text-blue-500'
        },
        {
          title: 'NFT Platforms',
          description: 'Monitor: "NFT marketplace dev", "Minting tool", "Digital art infrastructure".',
          targeting: 'r/NFT, r/ethdev, r/solana',
          colorClass: 'text-purple-500'
        },
        {
          title: 'Web3 Wallets',
          description: 'Monitor: "Wallet hacked", "Best cold storage", "Metamask alternative".',
          targeting: 'r/BitcoinBeginners, r/ledgerwallet, r/trezor',
          colorClass: 'text-green-500'
        },
        {
          title: 'L1/L2 Scaling',
          description: 'Monitor: "Gas fees too high", "Optimism vs Arbitrum", "Bridging assets".',
          targeting: 'r/ethdev, r/layer2, r/polygon',
          colorClass: 'text-orange-500'
        }
      ]
    },
    footerCta: {
      title: 'Build a community of users, not just speculators.',
      buttonText: 'Start Web3 Growth'
    }
  },
  {
    slug: 'mobile-apps',
    metaTitle: 'Reddit Marketing for iOS & Android Apps | RedLeads',
    metaDescription: 'Get more downloads for your mobile app. Find users asking for "best app for X" and drive high-retention installs from Reddit.',
    hero: {
      badgeIcon: 'smartphone',
      badgeText: 'App Growth',
      title: 'Get More Downloads',
      titleHighlight: 'Organic & High Retention',
      description: 'CPIs on Facebook are skyrocketing. RedLeads helps you find users who are actively asking for an app like yours. These users have higher retention and LTV than paid installs.',
      primaryCta: 'Find Users',
    },
    painPoints: [
      {
        icon: 'trending_up',
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        title: 'High CPI',
        description: 'Paid ads for mobile apps are becoming unprofitably expensive. Reddit comments are free and target users with high intent.'
      },
      {
        icon: 'star_rate',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'Getting Reviews',
        description: 'It’s hard to get early reviews. Engaging with users on Reddit allows you to ask for feedback and build a loyal beta community.'
      },
      {
        icon: 'visibility',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'App Store Visibility',
        description: "ASO takes time. Driving external traffic from Reddit signals to Apple/Google that your app is popular, boosting your organic rank."
      }
    ],
    useCases: {
      title: 'How App Devs <br /><span class="text-orange-500 italic font-serif">Drive Installs</span>',
      items: [
        {
          title: 'Alternative Seeking',
          description: 'Monitor: "Alternative to [Competitor App]", "Free version of [Popular App]", "App for [Task]".',
          targeting: 'r/apps, r/Alternativeto, r/androidapps',
          colorClass: 'text-green-500'
        },
        {
          title: 'Problem Verification',
          description: 'Monitor: "How to track [Habit]", "Best way to [Scan Document]", "Game like [Title]".',
          targeting: 'r/iphone, r/productivity, r/mobilegaming',
          colorClass: 'text-blue-500'
        },
        {
          title: 'Beta Testing',
          description: 'Monitor: "Looking for testers", "Test my app", "Feedback on UI".',
          targeting: 'r/TestFlight, r/AndroidDev',
          colorClass: 'text-orange-500'
        },
        {
          title: 'Launch Radar',
          description: 'Monitor mentions of your app category to jump in and suggest your solution.',
          targeting: 'Global Search',
          colorClass: 'text-purple-500'
        }
      ]
    },
    footerCta: {
      title: 'Stop paying $5 per install. Get them for free on Reddit.',
      buttonText: 'Find App Users'
    }
  },
  {
    slug: 'b2b-saas',
    metaTitle: 'Reddit Lead Gen for B2B SaaS | RedLeads',
    metaDescription: 'Find high-ticket B2B buyers on Reddit. Monitor discussions about vendor selection, software alternatives, and pain points in your niche.',
    hero: {
      badgeIcon: 'business_center',
      badgeText: 'Enterprise Sales',
      title: 'Find B2B Buyers',
      titleHighlight: 'Before They Book a Demo',
      description: 'B2B buyers research on Reddit long before they contact a sales team. RedLeads lets you influence the decision during the critical research phase.',
      primaryCta: 'Find Enterprise Leads'
    },
    painPoints: [
      {
        icon: 'manage_search',
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        title: 'LinkedIn is Noisy',
        description: 'LinkedIn inboxes are full of spam. Reddit allows you to engage with buyers when they are actively seeking advice, not when you interrupt them.'
      },
      {
        icon: 'handshake',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'Long Sales Cycles',
        description: 'Shorten deals by entering the conversation when intent is highest. Answer technical questions to establish authority instantly.'
      },
      {
        icon: 'group_work',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'Hard to Reach Decision Makers',
        description: "CTOs and VPs hang out in niche subreddits (e.g., r/sysadmin, r/devops) where they are honest about their stack problems."
      }
    ],
    useCases: {
      title: 'How B2B Teams <br /><span class="text-orange-500 italic font-serif">Fill Pipeline</span>',
      items: [
        {
          title: 'Vendor Switching',
          description: 'Monitor: "Leaving Salesforce", "Alternative to Jira", "Too expensive [Competitor]".',
          targeting: 'r/salesforce, r/projectmanagement, r/sysadmin',
          colorClass: 'text-red-500'
        },
        {
          title: 'Technical Implementation',
          description: 'Monitor: "How to integrate X", "API limits on Y", "Best practice for Z".',
          targeting: 'r/devops, r/programming, r/aws',
          colorClass: 'text-blue-500'
        },
        {
          title: 'Software Recommendations',
          description: 'Monitor: "Best CRM for small team", "HR software review", "Accounting tool for startup".',
          targeting: 'r/smallbusiness, r/humanresources, r/accounting',
          colorClass: 'text-green-500'
        },
        {
          title: 'Pain Point Hunting',
          description: 'Monitor complaints about manual processes that your software automates.',
          targeting: 'Global Search',
          colorClass: 'text-purple-500'
        }
      ]
    },
    footerCta: {
      title: 'Fill your pipeline with high-intent opportunities.',
      buttonText: 'Start B2B Monitoring'
    }
  },
  {
    slug: 'dev-tools',
    metaTitle: 'Reddit Marketing for Developer Tools | RedLeads',
    metaDescription: 'Developers hang out on Reddit. Market your API, library, or dev tool to engineers without being spammy.',
    hero: {
      badgeIcon: 'terminal',
      badgeText: 'DevRel Automation',
      title: 'Market to Developers',
      titleHighlight: 'Where They Live',
      description: 'Developers hate traditional ads, but they love helpful tool recommendations. RedLeads finds engineers asking technical questions that your tool solves.',
      primaryCta: 'Find Developers'
    },
    painPoints: [
      {
        icon: 'block',
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        title: 'Ad Blockers',
        description: '99% of developers use ad blockers. You literally cannot reach them with display ads. You have to be part of the community discussion.'
      },
      {
        icon: 'code_off',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'Skeptical Audience',
        description: 'Developers can smell marketing BS from a mile away. Offering a genuine solution to a bug or architectural problem builds real credibility.'
      },
      {
        icon: 'hub',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'Niche Fragmentation',
        description: "Python devs are in r/Python, Rust devs in r/rust. We help you monitor the specific syntax and libraries relevant to your tool."
      }
    ],
    useCases: {
      title: 'How DevTools <br /><span class="text-orange-500 italic font-serif">Gain Adoption</span>',
      items: [
        {
          title: 'Stack Recommendations',
          description: 'Monitor: "Best database for X", "Auth provider for Nextjs", "Stripe alternative".',
          targeting: 'r/webdev, r/programming, r/saas',
          colorClass: 'text-pink-500'
        },
        {
          title: 'Debugging Help',
          description: 'Monitor error codes or specific problems your tool fixes (e.g., "CORS error", "Memory leak help").',
          targeting: 'r/learnprogramming, r/frontend, r/backend',
          colorClass: 'text-purple-500'
        },
        {
          title: 'Modernization',
          description: 'Monitor: "Migrating from Jenkins", "Legacy code refactor", "Modern alternative to X".',
          targeting: 'r/devops, r/sysadmin',
          colorClass: 'text-blue-500'
        },
        {
          title: 'Showcase',
          description: 'Find "Showoff Saturday" or "Feedback Request" threads to present your tool naturally.',
          targeting: 'r/sideproject, r/reactjs',
          colorClass: 'text-orange-500'
        }
      ]
    },
    footerCta: {
      title: 'Get your code in the hands of more developers.',
      buttonText: 'Start Dev Marketing'
    }
  },
  {
    slug: 'indie-hackers',
    metaTitle: 'Reddit Marketing for Indie Hackers | RedLeads',
    metaDescription: 'Validate your idea and find your first users on Reddit. The essential tool for bootstrap founders and indie developers.',
    hero: {
      badgeIcon: 'code',
      badgeText: 'Indie Growth',
      title: 'Validate Ideas',
      titleHighlight: 'Before You Build',
      description: 'Don\'t write a single line of code until you find people complaining about the problem. RedLeads helps indie hackers find "Hair on Fire" problems to solve.',
      primaryCta: 'Find Problems'
    },
    painPoints: [
      {
        icon: 'build',
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        title: 'Building in a Vacuum',
        description: 'Most indie products fail because nobody wanted them. Find the demand first on Reddit.'
      },
      {
        icon: 'campaign',
        colorClass: 'text-orange-500',
        bgClass: 'bg-orange-500/10',
        title: 'Zero Marketing Budget',
        description: 'You can\'t afford ads. You need free, organic channels. Reddit is the largest community of early adopters on the internet.'
      },
      {
        icon: 'psychology',
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500/10',
        title: 'Idea Validation',
        description: "See if people are actually paying to solve this problem before you spend months building it."
      }
    ],
    useCases: {
      title: 'How Indie Hackers <br /><span class="text-orange-500 italic font-serif">Launch on Reddit</span>',
      items: [
        {
          title: 'Problem Discovery',
          description: 'Monitor: "How do I...", "Best tool for...", "Why is X so hard?", "I hate [Competitor]".',
          targeting: 'r/SaaS, r/Entrepreneur, r/smallbusiness',
          colorClass: 'text-orange-500'
        },
        {
          title: 'Beta Testers',
          description: 'Monitor: "Looking for feedback", "Beta test opp", "New tool for X".',
          targeting: 'r/SideProject, r/IndieHackers',
          colorClass: 'text-blue-500'
        },
        {
          title: 'Tech Stack Decisions',
          description: 'Monitor: "Nextjs vs Remix", "Supabase vs Firebase", "Hosting recommendations".',
          targeting: 'r/webdev, r/reactjs',
          colorClass: 'text-green-500'
        },
        {
          title: 'Launch Radar',
          description: 'Monitor your own product name and competitors to jump into conversations immediately.',
          targeting: 'Global Search',
          colorClass: 'text-purple-500'
        }
      ]
    },
    footerCta: {
      title: 'Find your first 100 users this weekend.',
      buttonText: 'Validate Now'
    }
  }
];

export function getSolutionBySlug(slug: string): SolutionData | undefined {
  return solutions.find(s => s.slug === slug);
}

export function getAllSolutions(): SolutionData[] {
  return solutions;
}
