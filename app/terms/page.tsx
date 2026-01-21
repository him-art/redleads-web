import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-300 font-sans selection:bg-white/10">
      <div className="max-w-2xl mx-auto px-8 py-24 md:py-32">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm mb-12 inline-block">
          ← Back
        </Link>
        
        <h1 className="text-2xl font-semibold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-12 border-b border-white/5 pb-4">Last Updated: January 21, 2026</p>

        <article className="space-y-10 text-[15px] leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-white font-medium">Welcome to RedLeads!</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of the RedLeads website at https://redleads.app (&quot;Website&quot;) and the services provided by RedLeads. By using our Website and services, you agree to these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">1. Description of RedLeads</h2>
            <p>
              RedLeads is a platform that helps businesses discover marketing opportunities on Reddit. Our service monitors subreddits for relevant posts based on your keywords, uses AI to score relevance, and helps you identify leads to engage with potential customers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">2. Subscription and Services</h2>
            <p>
              When you subscribe to RedLeads, you gain access to our Reddit monitoring and AI-powered lead discovery features. Your subscription will automatically renew according to your selected billing cycle unless cancelled. You can cancel your subscription at any time through your account settings or the Stripe customer portal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">3. Refund Policy</h2>
            <p>
              We offer refunds on a case-by-case basis. If you are not satisfied with our service, please contact us at redleads.app@gmail.com to discuss your situation.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">4. User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Maintaining the security of your account credentials.</li>
              <li>Ensuring your use of Reddit complies with Reddit&apos;s Terms of Service and Content Policy.</li>
              <li>Compliance with applicable laws regarding marketing and advertising.</li>
              <li>Not engaging in spam or manipulative behavior on Reddit.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">5. Reddit Usage and Compliance</h2>
            <p>
              RedLeads is designed to help you find genuine marketing opportunities. You agree to use the service for legitimate business purposes only and to follow Reddit&apos;s rules and community guidelines. We are not affiliated with Reddit, Inc.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">6. AI-Generated Content</h2>
            <p>
              Our service uses AI to score post relevance and generate insights. While we strive for accuracy, AI results should be used as a guide. You are responsible for reviewing leads and for your own engagements on Reddit.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">7. Prohibited Uses</h2>
            <p>You may not use RedLeads to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Violate any laws or regulations.</li>
              <li>Violate Reddit&apos;s Terms of Service or Content Policy.</li>
              <li>Engage in spam, vote manipulation, or deceptive practices.</li>
              <li>Attempt to gain unauthorized access to other users&apos; data.</li>
            </ul>
          </section>

          <section className="space-y-4 text-gray-400">
            <h2 className="text-white font-medium">8. Contact Information</h2>
            <p>
              For any questions or concerns regarding these Terms, please contact us at redleads.app@gmail.com.
            </p>
          </section>
        </article>

        <footer className="mt-24 pt-8 border-t border-white/5 text-[12px] text-gray-600">
          RedLeads &copy; 2026. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
