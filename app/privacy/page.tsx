import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-300 font-sans selection:bg-white/10">
      <div className="max-w-2xl mx-auto px-8 py-24 md:py-32">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm mb-12 inline-block">
          ← Back
        </Link>
        
        <h1 className="text-2xl font-semibold text-white mb-2">Privacy Policy for RedLeads</h1>
        <p className="text-sm text-gray-500 mb-12 border-b border-white/5 pb-4">Last Updated: January 21, 2026</p>

        <article className="space-y-10 text-[15px] leading-relaxed">
          <section className="space-y-4">
            <p>
              Thank you for visiting RedLeads (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). This Privacy Policy outlines how we collect, use, and protect your personal and non-personal information when you use our website located at https://RedLeads.app (the &quot;Website&quot;).
            </p>
            <p>
              By accessing or using the Website, you agree to the terms of this Privacy Policy. If you do not agree with the practices described in this policy, please do not use the Website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">1. Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-gray-200 font-medium">1.1 Personal Data</h3>
              <p>We collect the following personal information from you:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Name & Email:</strong> We collect your name and email address for authentication via Google OAuth, to personalize your experience, and to send you updates regarding relevant Reddit leads.</li>
                <li><strong>Payment Information:</strong> We collect payment details through Stripe to process subscriptions securely. We do not store your payment information on our servers.</li>
                <li><strong>Website Information:</strong> We collect and analyze your website URL and description to help find relevant Reddit opportunities.</li>
                <li><strong>Search Data:</strong> We store your search keywords and selected subreddits to monitor Reddit on your behalf.</li>
              </ul>

              <h3 className="text-gray-200 font-medium whitespace-nowrap">1.2 Non-Personal Data</h3>
              <p>We may use cookies and similar technologies to collect information such as your IP address, browser type, and browsing patterns to enhance your experience and improve our services.</p>

              <h3 className="text-gray-200 font-medium whitespace-nowrap">1.3 Reddit Data</h3>
              <p>We collect and store information from Reddit posts that match your criteria, including post titles, content, authors, and URLs, solely to provide our service to you.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">2. Purpose of Data Collection</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Authentication and account management via Supabase.</li>
              <li>Monitoring Reddit for relevant marketing opportunities.</li>
              <li>Analyzing post relevance using AI.</li>
              <li>Sending notifications about new relevant leads.</li>
              <li>Subscription and payment processing via Stripe.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">3. Data Storage and Security</h2>
            <p>
              All data is stored securely using industry-standard encryption via Supabase. We implement appropriate security measures to protect your personal information from unauthorized access.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">4. Data Sharing</h2>
            <p>We do not sell your personal data. We only share data with trusted service providers necessary to operate: Stripe (Payments), Supabase (Auth & DB), and OpenAI (AI analysis).</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. You can also export your data or opt out of notifications. To exercise these rights, please contact us at RedLeads.app@gmail.com.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">6. Contact Information</h2>
            <p className="italic text-gray-400">
              If you have any questions regarding this Privacy Policy, contact us at RedLeads.app@gmail.com
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
