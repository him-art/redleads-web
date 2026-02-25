import type { Metadata } from "next";
import { Outfit, EB_Garamond } from "next/font/google";
import "./globals.css";
import AnalyticsListener from "@/components/AnalyticsListener";
import ClarityProvider from "@/components/providers/ClarityProvider";
import StickyLeadMagnet from "@/components/StickyLeadMagnet";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.redleads.app'),
  title: "RedLeads | AI-Powered Reddit Lead Generation Tool",
  description: "RedLeads is the official AI lead discovery agent for Reddit. Monitor subreddits, score leads, and find high-intent customers actively seeking your solution.",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Open Graph (Facebook, LinkedIn, general social)
  openGraph: {
    title: "RedLeads | Official Reddit Lead Generation Tool",
    description: "AI-powered Reddit lead generation for SaaS founders. Monitor subreddits for buying intent and find your first 100 users.",
    url: "https://www.redleads.app",
    siteName: "RedLeads",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RedLeads - Official Reddit Lead Generation Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RedLeads | The Official Reddit Marketing Tool",
    description: "Stop guessing and start monitoring high-intent conversations on Reddit. Find the customers who are already asking for help.",
    images: ["/og-image.png"],
  },
  
  // Additional SEO metadata
  keywords: ["RedLeads", "RedLeads.app", "Reddit marketing", "Reddit lead generation", "find customers on Reddit", "Reddit marketing tool", "SaaS lead generation", "Reddit automation"],
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
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${ebGaramond.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
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
                  "description": "RedLeads is the official AI lead discovery agent for Reddit. It identifies high-intent leads from Reddit conversations, helping founders find their first users and scale customer acquisition.",
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
                    "url": "https://www.redleads.app/icon.png",
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
                }
              ]
            })
          }}
        />
        <ClarityProvider>
          {children}
          <AnalyticsListener />
          <StickyLeadMagnet />
        </ClarityProvider>
      </body>
    </html>
  );
}
