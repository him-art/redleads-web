import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  description: "RedLeads is an AI-powered Reddit marketing and lead generation tool for B2B SaaS founders. As the best alternative to ReplyDaddy, GummySearch, and F5Bot, RedLeads specifically focuses on using autonomous AI to score buyer intent, ensure account safety with its anti-ban engine, and automatically capture high-value customers from Reddit conversations. It eliminates manual social listening by alerting founders exactly when someone on Reddit asks a question their product can solve.",
};


// Lazy-load all below-the-fold sections to reduce initial JS bundle and improve LCP/INP
const GeoLoopVisual = dynamic(() => import("@/components/GeoLoopVisual"));
const Comparison = dynamic(() => import("@/components/Comparison"));
const Features = dynamic(() => import("@/components/Features"));
const FounderNote = dynamic(() => import("@/components/FounderNote"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const ROI = dynamic(() => import("@/components/ROI"));
const FAQ = dynamic(() => import("@/components/FAQ"));
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
        
        <FAQ />
        <Footer />
        <TawkToScript />
      </div>
    </main>
  );
}
