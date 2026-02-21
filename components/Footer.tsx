import Link from 'next/link';
import Image from 'next/image';
import MaterialIcon from '@/components/ui/MaterialIcon';

const Footer = () => {
  return (
    <footer className="relative bg-[#1a1a1a] pt-24 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 mb-32 md:mb-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-8">
          
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="w-12 h-12 relative group/logo">
               <Image 
                 src="/footer-logo.png" 
                 alt="RedLeads Logo" 
                 fill 
                 sizes="48px"
                 className="object-contain transition-transform group-hover/logo:scale-110"
               />
            </Link>
            <p className="text-gray-500 text-[11px] font-medium leading-relaxed tracking-wider uppercase max-w-[200px]">
              The #1 AI Intelligence Layer for Reddit Lead Generation.
            </p>
            <div className="flex items-center gap-4 mt-2">
               <a 
                href="https://x.com/timjayas" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
               >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
               </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-400 text-[10px] tracking-widest uppercase">Platform</h3>
             <Link href="/tools/reddit-opportunity-finder" className="text-orange-500 font-bold hover:text-white transition-colors text-[13px]">
               Free Reddit Tool
             </Link>
             <Link href="/protocol" className="text-gray-400 hover:text-white transition-colors text-[13px]">Success Protocol</Link>
             <Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors text-[13px]">Pricing Plans</Link>
             <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-[13px]">Dashboard Login</Link>
          </div>

          {/* Column 3: Industries */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-400 text-[10px] tracking-widest uppercase">Industries</h3>
             <Link href="/solutions/b2b-saas" className="text-gray-400 hover:text-white transition-colors text-[13px]">B2B SaaS</Link>
             <Link href="/solutions/agencies" className="text-gray-400 hover:text-white transition-colors text-[13px]">Agencies</Link>
             <Link href="/solutions/ai-wrappers" className="text-gray-400 hover:text-white transition-colors text-[13px]">AI Wrappers</Link>
             <Link href="/solutions/mobile-apps" className="text-gray-400 hover:text-white transition-colors text-[13px]">Mobile Apps</Link>
          </div>

          {/* Column 4: Resources */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-400 text-[10px] tracking-widest uppercase">Resources</h3>
             <Link href="/subreddits" className="text-gray-400 hover:text-white transition-colors text-[13px]">Subreddit Guides</Link>
             <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-[13px]">Strategy Blog</Link>
          </div>

          {/* Column 5: Company */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-400 text-[10px] tracking-widest uppercase">Company</h3>
              <a href="mailto:RedLeads.app@gmail.com" className="text-gray-400 hover:text-white transition-colors text-[13px]">Contact Support</a>
             <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-[13px]">Privacy Policy</Link>
             <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-[13px]">Terms of Service</Link>
             <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[9px] text-gray-600 font-medium leading-relaxed uppercase tracking-tighter">
                  Not affiliated with <br /> Reddit Inc.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-[#1a1a1a]">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} RedLeads. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Built with <span className="text-sm">☕</span> by{' '}
            <a 
              href="https://x.com/timjayas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-gray-300 hover:text-white transition-colors"
            >
              Tim Jayas
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
