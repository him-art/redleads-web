'use client';
import MaterialIcon from '@/components/ui/MaterialIcon';
import Link from 'next/link';

interface RateLimitBannerProps {
    remaining: number;
    isLimited: boolean;
    resetTime: number | null;
    maxUses: number;
}

export default function RateLimitBanner({ remaining, isLimited, resetTime, maxUses }: RateLimitBannerProps) {
    if (isLimited) {
        const mins = resetTime ? Math.max(1, Math.ceil((resetTime - Date.now()) / 60000)) : 60;
        return (
            <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-center animate-in fade-in duration-500">
                <MaterialIcon name="lock" size={28} className="text-orange-500 mb-2" />
                <h3 className="text-white font-bold mb-1">Free Limit Reached</h3>
                <p className="text-xs text-slate-400 mb-4">
                    You&apos;ve used all {maxUses} free uses. Resets in ~{mins} min, or sign up for unlimited access.
                </p>
                <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-orange-600 transition-all"
                >
                    Unlock Unlimited Access
                </Link>
            </div>
        );
    }

    if (remaining <= 2 && remaining > 0) {
        return (
            <div className="mb-4 flex items-center justify-center gap-2 text-[10px] text-orange-500/60 uppercase tracking-widest font-bold">
                <MaterialIcon name="info" size={14} />
                {remaining} free use{remaining !== 1 ? 's' : ''} remaining
            </div>
        );
    }

    return null;
}
