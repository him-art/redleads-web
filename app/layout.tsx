import type { Metadata } from "next";
import { Outfit, EB_Garamond, Merriweather } from "next/font/google";
import "./globals.css";
import AnalyticsListener from "@/components/AnalyticsListener";
import ClarityProvider from "@/components/providers/ClarityProvider";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://RedLeads.app'),
  title: "RedLeads - Reddit Lead Generation Tool | Find Customers on Reddit",
  description: "Stop searching, start finding. RedLeads uses AI to scan Reddit for high-intent customers. Monitor subreddits, score leads with neural synthesis, and find users actively seeking your SaaS solution. The ultimate Reddit lead generation tool.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Open Graph (Facebook, LinkedIn, general social)
  openGraph: {
    title: "RedLeads - Reddit Lead Generation Tool | Find Customers on Reddit",
    description: "AI-powered Reddit lead generation for SaaS. Monitor subreddits for buying intent, scan conversations for high-match leads, and acquire customers where they're already talking about their problems.",
    url: "https://RedLeads.app",
    siteName: "RedLeads",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RedLeads - Reddit Lead Generation Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RedLeads - Reddit Lead Generation Tool | Find Customers on Reddit",
    description: "AI-powered Reddit lead generation for SaaS. Stop guessing and start monitoring high-intent conversations where your future customers are asking for help.",
    images: ["/og-image.png"],
  },
  
  // Additional SEO metadata
  keywords: ["Reddit marketing", "Reddit lead generation", "find customers on Reddit", "Reddit marketing tool", "SaaS lead generation", "find users for my SaaS", "find users for my app", "Reddit automation", "customer acquisition Reddit", "lead generation tools"],
  authors: [{ name: "RedLeads" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${ebGaramond.variable} ${merriweather.variable}`}>
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": "RedLeads",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "The leading AI-powered Reddit marketing tool for SaaS. RedLeads uses neural synthesis and real-time monitoring to identify high-intent leads from Reddit conversations, helping founders find their first users and scale customer acquisition.",
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "120"
                  },
                  "featureList": [
                    "Reddit marketing automation",
                    "AI-powered lead scoring",
                    "Real-time Reddit monitoring",
                    "SaaS customer discovery"
                  ]
                },
                {
                  "@type": "Organization",
                  "name": "RedLeads",
                  "url": "https://www.redleads.app",
                  "logo": "https://www.redleads.app/icon.png",
                  "sameAs": [
                    "https://twitter.com/timjayas"
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "How do I find customers on Reddit?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "RedLeads monitors relevant subreddits and uses AI to identify high-intent conversations where users are actively seeking solutions like yours. When someone asks for recommendations or expresses a need you can solve, you get notified instantly."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What are the best Reddit marketing tools?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "RedLeads is the leading Reddit marketing tool for SaaS and app founders. Unlike basic keyword trackers, it uses AI to understand context and buying intent, helping you find warm leads instead of just mentions."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How can I find users for my SaaS on Reddit?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Enter your product description and target keywords into RedLeads. Our AI scans thousands of subreddits daily to find people asking for exactly what you offer whether that's project management, analytics, design tools, or any other SaaS category."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does RedLeads work?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "RedLeads uses AI to monitor relevant subreddits for conversations about your product and competitors which are publicly available. We then analyze these posts for purchase intent and organize high-potential leads in your dashboard."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What is RedLeads?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "RedLeads is an AI-powered Reddit lead generation tool that helps SaaS founders and app developers find their first customers. It monitors Reddit 24/7 and alerts you when potential users are asking for solutions you provide."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What makes RedLeads different from other lead generation tools?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Unlike generic lead generation tools that focus on email lists or LinkedIn, RedLeads specializes in Reddit where users actively discuss problems and seek recommendations. Our AI understands context, not just keywords."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can I cancel anytime?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Absolutely. There are no contracts or lock-in periods. You can cancel your subscription at any time within 7 days."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
        <ClarityProvider>
          {children}
          <AnalyticsListener />
        </ClarityProvider>
      </body>
    </html>
  );
}