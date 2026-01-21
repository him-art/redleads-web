import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'slim';
}

const Footer = ({ variant = 'default' }: FooterProps) => {
  if (variant === 'slim') {
    return (
      <footer className="border-t border-white/5 bg-[#1a1a1a] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span>&copy; {new Date().getFullYear()} RedLeads</span>
              <span className="text-white/10">•</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <span className="text-white/10">•</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-700">
              Built for Reddit
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 bg-[#1a1a1a] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">RedLeads.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/scanner" className="text-sm text-gray-400 hover:text-white transition-colors">Free Scanner</Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RedLeads. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
