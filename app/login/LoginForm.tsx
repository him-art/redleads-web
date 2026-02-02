'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../actions/auth';

export default function LoginForm({ 
  next = '/dashboard', 
  search = '' 
}: { 
  next?: string; 
  search?: string; 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const redirectTo = search ? `${next}?search=${encodeURIComponent(search)}` : next;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('redirectTo', redirectTo);

    let result;
    try {
      result = isSignUp 
        ? await signUpWithEmail(formData)
        : await signInWithEmail(formData);
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT') {
        return;
      }
      
      console.error('Submission error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return;
    }

    if (result && 'error' in result && result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result && 'success' in result && result.success) {
      setSuccess(result.success);
      setTimeout(() => setLoading(false), 1000);
    } else {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle(redirectTo);
    } catch (err: any) {
      if (err?.message === 'NEXT_REDIRECT') {
        return;
      }
      console.error('Google login error:', err);
      setError('Failed to initialize Google Login.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2a2a2a] rounded-3xl border border-white/5 p-8 shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#f25e36] to-[#ff8c6b]">
              RedLeads<span className="text-white">.app</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-gray-400">
            {isSignUp ? 'Start finding high-intent leads today' : 'Sign in to access your scanner'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            suppressHydrationWarning
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-black rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                />
                </svg>
            )}
            Continue with Google
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#2a2a2a] text-gray-500 uppercase tracking-widest font-bold">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium">
                    {success}
                </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  suppressHydrationWarning
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#f25e36] transition-colors"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  suppressHydrationWarning
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#f25e36] transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              suppressHydrationWarning
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#f25e36] hover:bg-[#d94a24] text-white rounded-xl font-black text-lg shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                    {isSignUp ? 'Create Account' : 'Sign In Now'}
                    <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <button
              suppressHydrationWarning
              onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
              }}
              className="text-[#f25e36] hover:text-[#ff8c6b] font-bold transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
