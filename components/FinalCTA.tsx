"use client";

import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const WaitlistCTA = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Add email to Firebase Firestore
      await addDoc(collection(db, 'waitlist'), {
        email,
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
        status: 'pending'
      });

      setStatus('success');
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      console.error('Waitlist submission error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section id="waitlist" className="relative overflow-hidden bg-[#1a1a1a] py-24 border-t border-white/5">
      {/* Abstract Background Patterns */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 p-32 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded-full bg-orange-500/10 p-32 blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Stop Wasting Hours on Reddit.<br />Start Finding Customers Today.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Join the waitlist and be among the first founders to automate their lead generation with RedLeads.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="w-full sm:w-80">
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              disabled={status === 'loading' || status === 'success'}
              className="w-full rounded-full border border-white/10 bg-[#222] px-6 py-4 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || status === 'success'}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-4 font-semibold text-white shadow-xl shadow-amber-900/20 transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
          >
            {status === 'loading' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Joining...
              </>
            )}
            {status === 'success' && (
              <>
                <Check className="h-4 w-4" />
                You're on the list!
              </>
            )}
            {status !== 'loading' && status !== 'success' && (
              <>
                Join Waitlist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <p className="mt-4 text-sm text-red-400">
            {errorMessage}
          </p>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <p className="mt-4 text-sm text-green-400">
            🎉 Welcome aboard! We'll notify you when we launch.
          </p>
        )}

        {/* Default message */}
        {status !== 'error' && status !== 'success' && (
          <p className="mt-4 text-sm text-gray-500">
            Be the first to know when we launch
          </p>
        )}
      </div>
    </section>
  );
};

export default WaitlistCTA;