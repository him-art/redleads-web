import Link from 'next/link';
import Image from 'next/image';
import { Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#1a1a1a] pt-24 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 mb-32 md:mb-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 lg:gap-16">
          
          {/* Brand Mission */}
          <div className="flex flex-col gap-6">
            <div className="w-12 h-12 relative">
               <Image 
                 src="/footer-logo.png" 
                 alt="RedLeads Logo" 
                 fill 
                 className="object-contain"
               />
            </div>
            <p className="text-gray-500 text-[13px] font-medium leading-relaxed tracking-wide uppercase max-w-[200px]">
              RedLeads is the home for your automated Reddit growth.
            </p>
          </div>

          {/* USEFUL */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-500 text-[10px] tracking-widest uppercase">Useful</h3>
             <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</Link>
             <Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
             <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
          </div>

          {/* COMPARE */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-500 text-[10px] tracking-widest uppercase">Compare</h3>
             <Link href="/compare/redleads-vs-gummysearch" className="text-gray-400 hover:text-white transition-colors">RedLeads vs GummySearch</Link>
             <Link href="/compare/redleads-vs-f5bot" className="text-gray-400 hover:text-white transition-colors">RedLeads vs F5Bot</Link>
             <Link href="/compare/redleads-vs-syften" className="text-gray-400 hover:text-white transition-colors">RedLeads vs Syften</Link>
             <Link href="/compare/redleads-vs-billybuzz" className="text-gray-400 hover:text-white transition-colors">RedLeads vs BillyBuzz</Link>
             <Link href="/compare/redleads-vs-replyguy" className="text-gray-400 hover:text-white transition-colors">RedLeads vs ReplyGuy</Link>
          </div>

          {/* LEGAL & CONTACT */}
          <div className="flex flex-col gap-4">
             <h3 className="font-bold text-gray-500 text-[10px] tracking-widest uppercase">Legal</h3>
             <a 
              href="https://x.com/timjayas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
             >
               Twitter
             </a>
             <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
             
             <a 
              href="mailto:RedLeads.app@gmail.com" 
              className="text-gray-400 hover:text-white transition-colors"
             >
               RedLeads.app@gmail.com
             </a>
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
