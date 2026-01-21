import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#1a1a1a] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            
              
            
            <span className="font-bold text-white">RedLeads.</span>
          </div>
          <div className="flex gap-6">
            {/* <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link> */}
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
