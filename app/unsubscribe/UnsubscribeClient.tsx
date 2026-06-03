'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MailCheck, MailX, AlertCircle, Loader2, CheckCircle2, ChevronRight, Home } from 'lucide-react';

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'confirm' | 'loading' | 'success' | 'resubscribed' | 'error'>('confirm');
  const [errorMessage, setErrorMessage] = useState('');

  // Validate parameters immediately
  useEffect(() => {
    if (!email || !token) {
      setStatus('error');
      setErrorMessage('This unsubscribe link is incomplete or missing necessary parameters.');
    }
  }, [email, token]);

  const handleAction = async (action: 'unsubscribe' | 'subscribe') => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, action }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus(action === 'unsubscribe' ? 'success' : 'resubscribed');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to update your subscription preferences. Please try again.');
      }
    } catch (err) {
      console.error('[Unsubscribe Action Error]', err);
      setStatus('error');
      setErrorMessage('A network error occurred. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-300 font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-orange-500/20 selection:text-white">
      {/* Dynamic background glowing grids */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md px-6 z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block active:scale-[0.98] transition-transform">
            <span className="font-sans font-extrabold text-2xl tracking-tight text-white">
              Red<span className="text-[#f25e36]">Leads</span>
            </span>
          </Link>
        </div>

        {/* Card Body */}
        <div className="bg-[#121214] border border-white/5 shadow-2xl rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden transition-all duration-300">
          
          {/* Status 1: Confirmation */}
          {status === 'confirm' && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#f25e36]">
                <MailX className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Email Preferences</h1>
                <p className="text-sm text-gray-400">
                  Are you sure you want to stop receiving marketing and automated update emails?
                </p>
              </div>

              {email && (
                <div className="bg-[#18181b] border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-gray-400 break-all select-all">
                  {email}
                </div>
              )}

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left text-xs leading-relaxed space-y-2 text-gray-400">
                <p className="font-semibold text-gray-300">By unsubscribing you will no longer receive:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Daily Intelligence Digests (leads matched to your product)</li>
                  <li>Onboarding & lifecycle milestones</li>
                  <li>Special offers and dashboard updates</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => handleAction('unsubscribe')}
                  className="w-full bg-[#f25e36] hover:bg-[#e04d27] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all text-sm cursor-pointer"
                >
                  Unsubscribe Me
                </button>
                <Link
                  href="/dashboard"
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 px-6 rounded-xl border border-white/5 active:scale-[0.98] transition-all text-sm block"
                >
                  Keep Subscribed
                </Link>
              </div>
            </div>
          )}

          {/* Status 2: Loading */}
          {status === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in duration-200">
              <Loader2 className="w-10 h-10 text-[#f25e36] animate-spin" />
              <div className="space-y-1">
                <p className="text-white font-semibold">Updating preferences</p>
                <p className="text-xs text-gray-500">Contacting servers...</p>
              </div>
            </div>
          )}

          {/* Status 3: Success Unsubscribed */}
          {status === 'success' && (
            <div className="space-y-6 text-center animate-in fade-in scale-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Unsubscribed</h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  You have been successfully removed from our mailing list. You will no longer receive automated digests or lifecycle emails.
                </p>
              </div>

              {email && (
                <div className="bg-[#18181b] border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-gray-500 break-all select-all">
                  {email}
                </div>
              )}

              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <button
                  onClick={() => handleAction('subscribe')}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 px-6 rounded-xl border border-white/5 active:scale-[0.98] transition-all text-sm cursor-pointer"
                >
                  Undo & Resubscribe
                </button>
                <Link
                  href="/"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1 mt-2"
                >
                  <Home className="w-3.5 h-3.5" /> Return to Homepage
                </Link>
              </div>
            </div>
          )}

          {/* Status 4: Success Resubscribed (Undo) */}
          {status === 'resubscribed' && (
            <div className="space-y-6 text-center animate-in fade-in scale-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#f25e36]">
                <MailCheck className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back!</h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Your email subscription is active again. You will continue to receive daily lead digests and updates.
                </p>
              </div>

              {email && (
                <div className="bg-[#18181b] border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-gray-400 break-all select-all">
                  {email}
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <Link
                  href="/dashboard"
                  className="w-full bg-[#f25e36] hover:bg-[#e04d27] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  Go to Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Status 5: Error */}
          {status === 'error' && (
            <div className="space-y-6 text-center animate-in fade-in scale-in duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Action Failed</h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {errorMessage || 'We encountered an error verifying or processing your request.'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left text-xs leading-relaxed text-gray-400">
                <p className="font-semibold text-gray-300">Why did this happen?</p>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-500">
                  <li>The link might be invalid or copied incorrectly.</li>
                  <li>The security token doesn't match the email format.</li>
                  <li>Our servers might be experiencing temporary difficulties.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <Link
                  href="/"
                  className="w-full bg-[#f25e36] hover:bg-[#e04d27] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg active:scale-[0.98] transition-all text-sm block"
                >
                  Back to Homepage
                </Link>
                <a
                  href="mailto:redleads.app@gmail.com"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Need help? Contact support
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-gray-600 mt-8">
          RedLeads &copy; 2026. All rights reserved. <br/>
          Secure email preference verification powered by Supabase.
        </p>

      </div>
    </div>
  );
}
