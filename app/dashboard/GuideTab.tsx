'use client';

import GuideView from './guide/GuideView';
import { BookOpen } from 'lucide-react';

export default function GuideTab({ onNavigate }: { onNavigate: (tab: string) => void }) {

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <BookOpen size={18} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary tracking-tight">Guide</h2>
                        <p className="text-xs text-text-secondary">Your 90-day roadmap to first 100 users.</p>
                    </div>
                </div>
            </div>

            <GuideView onNavigate={onNavigate} />
        </div>
    );
}
