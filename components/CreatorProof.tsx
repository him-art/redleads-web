import SocialProofTicker from './SocialProofTicker';

export default function CreatorProof() {
  return (
    <section className="py-16 md:py-24 bg-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.05] max-w-4xl mx-auto">
            The smartest founders <br />
            <span className="text-orange-500 font-serif-italic">know Reddit converts</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium opacity-60 max-w-2xl mx-auto">
            Creators with 100K followers are talking about it. <br className="hidden md:block" />
            Here&apos;s why they believe in the power of Reddit marketing.
          </p>
        </div>

        {/* Full-bleed ticker */}
        <div className="-mx-4 md:-mx-[max(1rem,calc((100vw-1152px)/2+1rem))]">
          <SocialProofTicker />
        </div>

      </div>
    </section>
  );
}
