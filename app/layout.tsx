import type { Metadata } from "next";
import { Outfit, EB_Garamond } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import ClarityProvider from "@/components/providers/ClarityProvider";
import { cn } from "@/lib/utils";


// Lazy-load heavy client components to reduce initial JS bundle
const AnalyticsListener = dynamic(() => import("@/components/AnalyticsListener"));


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.redleads.app'),
  title: "RedLeads | #1 AI-First Reddit Marketing & Lead Gen Engine",
  description: "Stop tracking keywords, start scanning intent. RedLeads is the AI-First intelligence engine that finds high-value Reddit conversations and turns them into customers automatically.",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Open Graph (Facebook, LinkedIn, general social)
  openGraph: {
    title: "RedLeads - The AI-First Reddit Intelligence Engine",
    description: "Find high-intent leads on Reddit with proprietary AI. The ultimate growth tool for SaaS founders.",
    url: "https://www.redleads.app",
    siteName: "RedLeads AI",
    images: [
      {
        url: "https://www.redleads.app/og-image.webp?v=3",
        width: 1200,
        height: 630,
        alt: "RedLeads AI - Turn Reddit Conversations into Customers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RedLeads AI | Turn Reddit Conversations into Customers",
    description: "The AI-First Reddit Intelligence Engine. Stop guessing and start monitoring high-intent conversations with AI.",
    images: ["https://www.redleads.app/og-image.webp?v=3"],
  },
  
  // Additional SEO metadata
  keywords: ["AI Reddit Marketing", "Reddit AI Lead Gen", "Automated Reddit Outreach", "RedLeads AI", "Reddit Intent Engine", "Best Reddit Marketing Tools 2026", "Reddit Lead Generation", "SaaS marketing", "startup growth"],
  authors: [{ name: "RedLeads" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(outfit.variable, ebGaramond.variable, "font-sans")}>
      <head />
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.redleads.app/#software",
                  "name": "RedLeads",
                  "url": "https://www.redleads.app",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "RedLeads uses autonomous AI to find people looking for solutions your SaaS solves on Reddit. It identifies high-intent leads from Reddit conversations, helping founders find their first users and scale customer acquisition.",
                  "areaServed": {
                    "@type": "Country",
                    "name": "United States"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "120"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.redleads.app/#organization",
                  "name": "RedLeads",
                  "url": "https://www.redleads.app",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.redleads.app/favicon.png",
                    "width": 192,
                    "height": 192
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "RedLeads.app@gmail.com",
                    "contactType": "customer service"
                  },
                  "sameAs": [
                    "https://twitter.com/timjayas",
                    "https://www.linkedin.com/company/redleads"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.redleads.app/#website",
                  "url": "https://www.redleads.app",
                  "name": "RedLeads",
                  "publisher": { "@id": "https://www.redleads.app/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.redleads.app/blog?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Person",
                  "@id": "https://www.redleads.app/#founder",
                  "name": "Tim Jayas",
                  "url": "https://www.redleads.app",
                  "image": {
                    "@type": "ImageObject",
                    "url": "https://www.redleads.app/founder.webp",
                    "width": 400,
                    "height": 400
                  },
                  "jobTitle": "Founding Engineer",
                  "worksFor": { "@id": "https://www.redleads.app/#organization" },
                  "sameAs": [
                    "https://twitter.com/timjayas",
                    "https://www.linkedin.com/in/timjayas"
                  ],
                  "description": "Founder and lead developer of RedLeads. Expert in Reddit growth strategies and AI-powered automation."
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
