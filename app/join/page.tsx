import WaitlistForm from '@/components/WaitlistForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[100px]" />
            
        </div>

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
            
            <Link 
                href="/" 
                className="absolute top-[-80px] left-0 text-gray-400 hover:text-white flex items-center gap-2 transition-colors mb-8"
            >
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <div className="text-center mb-12 space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                    Join <span className="text-orange-500">RedLeads</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-lg mx-auto">
                    Get early access to the Reddit marketing tool that helps you find your next customer.
                </p>
            </div>

            <WaitlistForm />

            <div className="mt-12 flex flex-col items-center gap-4 text-sm text-gray-500">
                 <p>© {new Date().getFullYear()} RedLeads. All rights reserved.</p>
                 <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                 </div>
            </div>
        </div>
    </main>
  );
}
