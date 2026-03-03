'use client';
import { useState, useCallback, useEffect } from 'react';

/**
 * Client-side rate limiter using localStorage.
 * Tracks usage per tool and blocks after `maxUses` within `windowMs`.
 * Shows a signup CTA when the limit is hit.
 *
 * @param toolId   Unique tool identifier (e.g. "headline-gen")
 * @param maxUses  Max uses per window (default: 5)
 * @param windowMs Rolling window in ms  (default: 1 hour)
 */
export function useRateLimit(toolId: string, maxUses = 5, windowMs = 60 * 60 * 1000) {
    const storageKey = `rl_${toolId}`;
    const [remaining, setRemaining] = useState(maxUses);
    const [isLimited, setIsLimited] = useState(false);
    const [resetTime, setResetTime] = useState<number | null>(null);

    // Read persisted usage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const data: { timestamps: number[] } = JSON.parse(raw);
                const now = Date.now();
                const valid = data.timestamps.filter((t) => now - t < windowMs);
                localStorage.setItem(storageKey, JSON.stringify({ timestamps: valid }));
                const left = Math.max(0, maxUses - valid.length);
                setRemaining(left);
                if (left === 0 && valid.length > 0) {
                    setIsLimited(true);
                    setResetTime(valid[0] + windowMs);
                }
            }
        } catch {
            // Fallback: no storage access (SSR, private browsing)
        }
    }, [storageKey, maxUses, windowMs]);

    /** Call this before executing the tool action. Returns true if allowed. */
    const consume = useCallback((): boolean => {
        try {
            const now = Date.now();
            const raw = localStorage.getItem(storageKey);
            const data: { timestamps: number[] } = raw ? JSON.parse(raw) : { timestamps: [] };
            const valid = data.timestamps.filter((t) => now - t < windowMs);

            if (valid.length >= maxUses) {
                setIsLimited(true);
                setRemaining(0);
                setResetTime(valid[0] + windowMs);
                return false;
            }

            valid.push(now);
            localStorage.setItem(storageKey, JSON.stringify({ timestamps: valid }));
            const left = Math.max(0, maxUses - valid.length);
            setRemaining(left);
            if (left === 0) {
                setIsLimited(true);
                setResetTime(valid[0] + windowMs);
            }
            return true;
        } catch {
            return true; // Fail-open if localStorage is unavailable
        }
    }, [storageKey, maxUses, windowMs]);

    return { remaining, isLimited, resetTime, consume };
}
