import type { Metadata } from "next";
import { Outfit, EB_Garamond } from "next/font/google";
import "./globals.css";
import AnalyticsListener from "@/components/AnalyticsListener";
import ClarityProvider from "@/components/providers/ClarityProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://redleads.app'),
  title: "RedLeads | Find High-Intent Customers on Reddit",
  description: "AI-powered lead discovery that monitors Reddit 24/7 for high-intent conversations. Turn Reddit into your #1 customer acquisition channel.",
  
  // Open Graph (Facebook, LinkedIn, general social)
  openGraph: {
    title: "RedLeads | Find High-Intent Customers on Reddit",
    description: "AI-powered lead discovery that monitors Reddit 24/7. First 10 get lifetime beta pricing.",
    url: "https://redleads.app",
    siteName: "RedLeads",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RedLeads - Turn Reddit Conversations Into Paying Customers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RedLeads | Find High-Intent Customers on Reddit",
    description: "AI-powered lead discovery that monitors Reddit 24/7. First 10 get lifetime beta pricing.",
    images: ["/og-image.png"],
  },
  
  // Additional SEO metadata
  keywords: ["Reddit marketing", "lead generation", "Reddit leads", "customer acquisition", "SaaS marketing", "Reddit automation"],
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
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${ebGaramond.variable}`}>
      <body className="antialiased font-sans">
        <ClarityProvider>
          {children}
          <AnalyticsListener />
        </ClarityProvider>
      </body>
    </html>
  );
}