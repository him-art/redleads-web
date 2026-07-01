import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "RedLeads | Find Your First Users on Reddit",
  description: "RedLeads automatically finds warm, high-intent Reddit conversations for your SaaS so you can land your first users in your first week, with no manual searching.",
  alternates: {
    canonical: 'https://www.redleads.app',
  },
  openGraph: {
    title: "RedLeads | Find Your First Users on Reddit",
    description: "RedLeads automatically finds warm, high-intent Reddit conversations for your SaaS so you can land your first users in your first week, with no manual searching.",
    url: "https://www.redleads.app",
    images: [
      {
        url: "https://www.redleads.app/og-image.webp?v=3",
        width: 1200,
        height: 630,
        alt: "RedLeads - Find Your First Users on Reddit",
      },
    ],
  },
};


// Lazy-load all below-the-fold sections to reduce initial JS bundle and improve LCP/INP
const GeoLoopVisual = dynamic(() => import("@/components/GeoLoopVisual"));
const Comparison = dynamic(() => import("@/components/Comparison"));
const Features = dynamic(() => import("@/components/Features"));
const FounderNote = dynamic(() => import("@/components/FounderNote"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const ROI = dynamic(() => import("@/components/ROI"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const LatestStrategies = dynamic(() => import("@/components/LatestStrategies"));
const Footer = dynamic(() => import("@/components/Footer"));
const TawkToScript = dynamic(() => import("@/components/TawkToScript"));

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero />
        
        <GeoLoopVisual />
        <Comparison />
        <Features />

        <FounderNote />

        <Pricing />
        <ROI />
        
        <LatestStrategies />
        <FAQ />
        <Footer />
        <TawkToScript />
      </div>
    </main>
  );
}
