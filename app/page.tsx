import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import NextSection from "@/components/NextSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero>
          <IntroSection />
        </Hero>
        <NextSection />
        <HowItWorks />
        <SocialProof />
        <Comparison />
        <Features />
        <Pricing />
        <FinalCTA />
        <FAQ />
        <Footer />
      </div>
    </main>
  );
}