'use client';
import { useState } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { useRateLimit } from '@/lib/useRateLimit';
import RateLimitBanner from '@/components/tools/RateLimitBanner';

export default function RedditEngagementCalculator() {
    const [upvotes, setUpvotes] = useState('');
    const [comments, setComments] = useState('');
    const [subscribers, setSubscribers] = useState('');
    const [result, setResult] = useState<{ rate: number; grade: string; color: string; tip: string } | null>(null);
    const { remaining, isLimited, resetTime, consume } = useRateLimit('engagement-calc', 5);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!consume()) return;
        const uv = parseInt(upvotes) || 0;
        const cm = parseInt(comments) || 0;
        const subs = parseInt(subscribers) || 1;
        const rate = ((uv + cm * 2) / subs) * 100;
        let grade = 'D';
        let color = 'text-red-500';
        let tip = 'This post underperformed. Consider testing a different headline format or posting at peak hours.';
        if (rate > 1) { grade = 'C'; color = 'text-yellow-500'; tip = 'Average engagement. The topic resonated somewhat. Try adding a more specific hook.'; }
        if (rate > 3) { grade = 'B'; color = 'text-blue-500'; tip = 'Good engagement! This topic clearly resonated. Consider creating a follow-up post or a deeper dive.'; }
        if (rate > 5) { grade = 'A'; color = 'text-green-500'; tip = 'Exceptional engagement! This is viral-tier content. Replicate this formula across related subreddits.'; }
        if (rate > 10) { grade = 'S'; color = 'text-orange-500'; tip = 'Legendary engagement. This post is top 1% of all Reddit content. Study what made this work and systematize it.'; }
        setResult({ rate: Math.round(rate * 100) / 100, grade, color, tip });
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-[#222] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <RateLimitBanner remaining={remaining} isLimited={isLimited} resetTime={resetTime} maxUses={5} />
                <form onSubmit={handleCalculate} className="space-y-4">
                    {[
                        { label: 'Post Upvotes', value: upvotes, setter: setUpvotes, placeholder: '150', icon: 'thumb_up' },
                        { label: 'Comments', value: comments, setter: setComments, placeholder: '42', icon: 'chat_bubble' },
                        { label: 'Subreddit Subscribers', value: subscribers, setter: setSubscribers, placeholder: '50000', icon: 'group' },
                    ].map((field) => (
                        <div key={field.label}>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                {field.label}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MaterialIcon name={field.icon} size={18} className="text-gray-600" />
                                </div>
                                <input
                                    type="number"
                                    value={field.value}
                                    onChange={(e) => field.setter(e.target.value)}
                                    placeholder={field.placeholder}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-[#1a1a1a] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] mt-6"
                    >
                        <span>Calculate Rate</span>
                        <MaterialIcon name="calculate" size={20} />
                    </button>
                </form>

                {result && (
                    <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="text-center">
                                <div className={`text-6xl font-black ${result.color}`}>{result.grade}</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Grade</div>
                            </div>
                            <div className="flex-1 bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Engagement Rate</div>
                                <div className="text-3xl font-black text-white">{result.rate}%</div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong className="text-white">Analysis:</strong> {result.tip}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-6 text-center text-[10px] text-gray-600 uppercase tracking-widest">
                No login required. Instant engagement analytics.
            </p>
        </div>
    );
}
