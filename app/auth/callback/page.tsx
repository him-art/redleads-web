'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LoadingIcon from '@/components/ui/LoadingIcon';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();
    const next = searchParams.get('next') || '/dashboard';

    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    // The Supabase Browser Client automatically detects ?code= in the URL, 
    // verifies the PKCE code_verifier from storage, and exchanges it for a session.
    // We listen for the successful SIGNED_IN event or the initial session recovery.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        if (!isMounted) return;
        
        // Wait briefly to ensure document.cookie is fully flushed
        setTimeout(() => {
          const checkoutIntent = getCookie('rl_checkout_intent');
          let redirectUrl = next;

          if (checkoutIntent) {
            const [plan, interval] = checkoutIntent.split(':');
            redirectUrl = `/api/payments/checkout-redirect?plan=${plan}&interval=${interval || 'monthly'}`;
          }

          // Force top-level navigation to clear state and trigger a fresh server request
          window.location.href = redirectUrl;
        }, 500);
      }
    });

    // Fallback: If for some reason the event doesn't fire but we get an error in the URL
    const errorDescription = searchParams.get('error_description');
    if (errorDescription && isMounted) {
      setError(errorDescription);
    }

    // Safety timeout: if 10 seconds pass and nothing happens, something broke
    const safetyTimeout = setTimeout(() => {
      if (isMounted && !error) {
         // Check if session exists just in case the event listener missed it
         supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
               window.location.href = next;
            } else {
               setError("Authentication timed out. Please try again.");
            }
         });
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2a2a2a] rounded-3xl border border-white/5 p-8 shadow-2xl text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-[#f25e36] text-white rounded-xl font-bold hover:bg-[#d94a24] transition-colors"
            >
              Return to Login
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <LoadingIcon className="w-12 h-12 text-[#f25e36]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verifying Authentication</h2>
            <p className="text-gray-400">Please wait while we securely sign you in...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#2a2a2a] rounded-3xl border border-white/5 p-8 shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <LoadingIcon className="w-12 h-12 text-[#f25e36]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verifying Authentication</h2>
          <p className="text-gray-400">Please wait while we securely sign you in...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
