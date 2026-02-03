import type { Metadata } from "next";
import { Outfit, EB_Garamond } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://RedLeads.app'),
  title: "RedLeads - Stop Searching for Customers. Let Them Find You.",
  description: "Your customers are already looking for you on Reddit. RedLeads alerts you the moment they ask for your solution. 10x your leads without ads.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Open Graph (Facebook, LinkedIn, general social)
  openGraph: {
    title: "RedLeads - Stop Searching for Customers. Let Them Find You.",
    description: "Your customers are already looking for you on Reddit. RedLeads alerts you the moment they ask for your solution. 10x your leads without ads.",
    url: "https://RedLeads.app",
    siteName: "RedLeads",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RedLeads - Stop Searching for Customers. Let Them Find You.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "RedLeads - Stop Searching for Customers. Let Them Find You.",
    description: "Your customers are already looking for you on Reddit. RedLeads alerts you the moment they ask for your solution. 10x your leads without ads.",
    images: ["/og-image.png"],
  },
  
  // Additional SEO metadata
  keywords: ["Reddit marketing", "lead generation", "Reddit leads", "customer acquisition", "SaaS marketing", "Reddit automation", "growth hacking"],
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