import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import dynamic from "next/dynamic";

// Lazy-load all below-the-fold sections to reduce initial JS bundle and improve LCP/INP
const CreatorProof = dynamic(() => import("@/components/CreatorProof"));
const RedditOpportunity = dynamic(() => import("@/components/RedditOpportunity"));
const Comparison = dynamic(() => import("@/components/Comparison"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const Features = dynamic(() => import("@/components/Features"));
const FounderNote = dynamic(() => import("@/components/FounderNote"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const ROI = dynamic(() => import("@/components/ROI"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Footer = dynamic(() => import("@/components/Footer"));
const TawkToScript = dynamic(() => import("@/components/TawkToScript"));
const WhyAIFirst = dynamic(() => import("@/components/WhyAIFirst"));

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero />
        {/* <SocialProof /> */}
        <CreatorProof />
        <HowItWorks />
        <WhyAIFirst />


        <RedditOpportunity />
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
