import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";


import RedditOpportunity from "@/components/RedditOpportunity";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import FounderNote from "@/components/FounderNote";
//import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

import Footer from "@/components/Footer";
import SectionCTA from "@/components/SectionCTA";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero />
        <HowItWorks />


        <RedditOpportunity />

        
        

        <Pricing />
        <FounderNote />

        
        <FAQ />
        <Footer />
      </div>
    </main>
  );
}