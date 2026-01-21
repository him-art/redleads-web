import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import NextSection from "@/components/NextSection";
import PainPoints from "@/components/PainPoints";
import HowItWorks from "@/components/HowItWorks";
import StoryFlow from "@/components/StoryFlow";
import Features from "@/components/Features";
import TargetAudience from "@/components/TargetAudience";
import FounderNote from "@/components/FounderNote";
//import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero>
          
        </Hero>
        <NextSection />

        <PainPoints />
        <HowItWorks />
        <StoryFlow />
        
        <TargetAudience />
        <FounderNote />

        <Pricing />

        
        <FAQ />
        <Footer />
      </div>
    </main>
  );
}