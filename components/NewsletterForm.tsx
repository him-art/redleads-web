'use client';

import { useActionState } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { motion, AnimatePresence } from 'framer-motion';

type FormState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    websiteUrl?: string[];
  };
};

const initialState: FormState = {
  success: false,
  message: '',
};

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(subscribeToNewsletter, initialState);

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {state.success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center"
          >
            <div className="bg-green-500/20 p-3 rounded-full mb-3">
              <MaterialIcon name="check_circle" size={24} className="text-green-500" />
            </div>
            <h3 className="text-white font-semibold text-lg">You're on the list!</h3>
            <p className="text-gray-400 text-sm mt-1">
              Check your inbox for the welcome email. We're already scanning your niche.
            </p>
          </motion.div>
        ) : (
          <motion.form
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {/* Header/Hook */}
            <div className="mb-2">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                 Free Weekly Lead Digest
              </h3>
              <p className="text-gray-400 text-xs">
                Enter your website. We'll find leads that match your product.
              </p>
            </div>

            {/* URL Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MaterialIcon name="public" size={16} className="text-gray-500 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="url"
                name="websiteUrl"
                required
                placeholder="https://your-saas.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-sm"
              />
            </div>
            {state.errors?.websiteUrl && (
              <p className="text-red-400 text-xs pl-1">{state.errors.websiteUrl[0]}</p>
            )}

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MaterialIcon name="mail" size={16} className="text-gray-500 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="founder@company.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-sm"
              />
            </div>
            {state.errors?.email && (
              <p className="text-red-400 text-xs pl-1">{state.errors.email[0]}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-[#f25e36] hover:bg-[#d94a24] text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <MaterialIcon name="sync" size={16} className="animate-spin" />
              ) : (
                <>
                  Get My Leads
                  <MaterialIcon name="arrow_right" size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Error Message */}
            {!state.success && state.message && (
              <p className="text-red-400 text-xs text-center mt-1">{state.message}</p>
            )}

             <p className="text-[10px] text-gray-600 text-center">
                100% Free. No spam. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
