'use client';

import GuideView from './guide/GuideView';
import { BookOpen } from 'lucide-react';

export default function GuideTab({ onNavigate, user }: { onNavigate: (tab: string) => void, user: any }) {

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <BookOpen size={18} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
                            RedLeads OS
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Beta</span>
                        </h2>
                        <p className="text-xs text-text-secondary mt-1">Your 14-day gamified sprint to your first users.</p>
                    </div>
                </div>
            </div>

            <GuideView onNavigate={onNavigate} user={user} />
        </div>
    );
}
