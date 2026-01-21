import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-300 font-sans selection:bg-white/10">
      <div className="max-w-2xl mx-auto px-8 py-24 md:py-32">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm mb-12 inline-block">
          ← Back
        </Link>
        
        <h1 className="text-2xl font-semibold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-12 border-b border-white/5 pb-4">Last Updated: January 14, 2026</p>

        <article className="space-y-10 text-[15px] leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-white font-medium">1. Information Collection</h2>
            <p>
              RedLeads collects minimal data necessary to provide our service. This includes your email address via Supabase authentication (including Google OAuth if you choose that option) for account management.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white font-medium">2. Data Usage</h2>
            <p>
              Your data is used solely to find relevant leads on Reddit based on your configured keywords and subreddits. We use AI to analyze public Reddit posts for intent scoring and reply generation. We do not use your private lead data, keywords, or monitoring configurations to train general AI models.
            </p>
          </section>


          <section className="space-y-4">
            <h2 className="text-white font-medium">3. Third Parties</h2>
            <p>
              We use Supabase for secure authentication services. We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-4 italic text-gray-400">
            <p>
              For privacy inquiries, contact vidzaar.create@gmail.com
            </p>
          </section>
        </article>

        <footer className="mt-24 pt-8 border-t border-white/5 text-[12px] text-gray-600">
          RedLeads &copy; 2026. For compliance and OAuth purposes only.
        </footer>
      </div>
    </div>
  );
}
