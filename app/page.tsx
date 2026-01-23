import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import NextSection from "@/components/NextSection";
import RedditOpportunity from "@/components/RedditOpportunity";
import HowItWorks from "@/components/HowItWorks";
import StoryFlow from "@/components/StoryFlow";
import Features from "@/components/Features";
import TargetAudience from "@/components/TargetAudience";
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
        <Hero>
          
        </Hero>
        <NextSection />

        <RedditOpportunity />
        <SectionCTA title="Ready to turn Reddit into your best growth channel?" />
        <HowItWorks />
        <StoryFlow />
        <SectionCTA title="See how RedLeads can work for you." buttonText="Get early access" />
        
        <TargetAudience />
        <FounderNote />

        
        <FAQ />
        <Footer />
      </div>
    </main>
  );
}