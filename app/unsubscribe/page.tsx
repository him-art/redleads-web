import { Metadata } from 'next';
import { Suspense } from 'react';
import UnsubscribeClient from './UnsubscribeClient';

export const metadata: Metadata = {
  title: 'Email Unsubscribe | RedLeads',
  description: 'Manage your email preferences and notification settings for RedLeads.',
  robots: {
    index: false, // Unsubscribe pages should never be indexed by search engines
    follow: false,
  },
};

export default function UnsubscribePage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f25e36]"></div>
        </div>
      }
    >
      <UnsubscribeClient />
    </Suspense>
  );
}
