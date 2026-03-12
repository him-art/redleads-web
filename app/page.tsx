import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";


import RedditOpportunity from "@/components/RedditOpportunity";
import Comparison from "@/components/Comparison";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import FounderNote from "@/components/FounderNote";
import Pricing from "@/components/Pricing";
import ROI from "@/components/ROI";
import FAQ from "@/components/FAQ";

import Footer from "@/components/Footer";
import TawkToScript from "@/components/TawkToScript";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero />
        {/* <SocialProof /> */}
        <HowItWorks />


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
