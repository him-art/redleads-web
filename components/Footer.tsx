import Link from 'next/link';
import Image from 'next/image';
import { Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#1a1a1a] pt-24 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 mb-32 md:mb-40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Mission */}
          <div className="md:col-span-1">
            <div className="w-12 h-12 mb-8 relative">
               <Image 
                 src="/footer-logo.png" 
                 alt="RedLeads Logo" 
                 fill 
                 className="object-contain"
                 unoptimized={true}
               />
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-[280px]">
              RedLeads is the home for your automated Reddit growth.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-start-3 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-4 text-sm">
            {/* USEFUL */}
            <div className="flex flex-col gap-4">
               <h3 className="font-bold text-gray-500 text-[10px] tracking-widest uppercase">Useful</h3>
               <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</Link>
               <Link href="/scanner" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  Scanner
                  <span className="text-[9px] px-1 py-0.5 bg-white/10 text-white/60 rounded border border-white/10">BETA</span>
               </Link>
            </div>
             {/* LEGAL */}
            <div className="flex flex-col gap-4">
               <h3 className="font-bold text-gray-500 text-[10px] tracking-widest uppercase">Legal</h3>
               <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
               <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
             {/* UPDATES/SOCIALS */}
            <div className="flex flex-col gap-4">
               <h3 className="font-bold text-gray-500 text-[10px] tracking-widest uppercase">Updates</h3>
               <a 
                href="https://x.com/timjayas" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
               >
                 Twitter
               </a>
               <span className="text-gray-600 cursor-default">Instagram</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
