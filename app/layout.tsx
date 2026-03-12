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
  title: "RedLeads | Find Your First 100 Users",
  description: "RedLeads uses autonomous AI to find people looking for solutions your SaaS solves on Reddit. Turn Reddit users into customers.",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Open Graph (Facebook, LinkedIn, general social)
  openGraph: {
    title: "RedLeads | Turn Reddit users into customers",
    description: "AI-powered Reddit lead generation for SaaS founders. Find your first 100 users.",
    url: "https://www.redleads.app",
    siteName: "RedLeads",
    images: [
      {
        url: "https://www.redleads.app/og-image.png?v=3",
        width: 1200,
        height: 630,
        alt: "RedLeads - Turn Reddit users into customers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RedLeads | Turn Reddit users into customers",
    description: "Find Your First 100 Users. Stop guessing and start monitoring high-intent conversations on Reddit.",
    images: ["https://www.redleads.app/og-image.png?v=3"],
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
          <StickyLeadMagnet />
        </ClarityProvider>
      </body>
    </html>
  );
}
