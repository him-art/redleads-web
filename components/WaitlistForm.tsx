'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !db) return;

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'waitlist'), {
        email,
        timestamp: serverTimestamp(),
        status: 'pending' // 'source' was removed to match firestore rules allow list
      });
      setStatus('success');
      setEmail('');
    } catch (error: any) {
      console.error('Error adding document: ', error);
      setStatus('error');
      if (error.code === 'permission-denied') {
        setErrorMessage('Permission denied. Please check Firestore security rules.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center p-8 bg-[#2a2a2a] rounded-3xl border border-orange-500/20 shadow-2xl"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
            <p className="text-gray-400">
              Thanks for joining. We'll verify your spot and reach out soon.
            </p>
            <button 
                onClick={() => setStatus('idle')}
                className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
            >
                Add another email
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email..."
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-lg"
                />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 bg-[#f25e36] hover:bg-[#d94a24] text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-gray-600 mt-2">
                Join 100+ founders waiting for access.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
