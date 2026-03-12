'use client';
import { useState } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';
import { useRateLimit } from '@/lib/useRateLimit';
import RateLimitBanner from '@/components/tools/RateLimitBanner';

export default function RedditAdCostCalculator() {
    const [budget, setBudget] = useState('');
    const [cpc, setCpc] = useState('');
    const [conversionRate, setConversionRate] = useState('');
    const [result, setResult] = useState<{
        clicks: number;
        conversions: number;
        cpa: number;
        organicEquiv: number;
    } | null>(null);
    const { remaining, isLimited, resetTime, consume } = useRateLimit('ad-cost-calc', 5);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!consume()) return;
        const b = parseFloat(budget) || 0;
        const c = parseFloat(cpc) || 1;
        const cr = parseFloat(conversionRate) || 1;
        const clicks = Math.floor(b / c);
        const conversions = Math.floor(clicks * (cr / 100));
        const cpa = conversions > 0 ? Math.round(b / conversions) : 0;
        const organicEquiv = clicks * 15; // RedLeads provides 15x the reach for free
        setResult({ clicks, conversions, cpa, organicEquiv });
    };

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-0">
            <div className="bg-[#222] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <RateLimitBanner remaining={remaining} isLimited={isLimited} resetTime={resetTime} maxUses={5} />
                <form onSubmit={handleCalculate} className="space-y-4">
                    {[
                        { label: 'Monthly Ad Budget ($)', value: budget, setter: setBudget, placeholder: '500', icon: 'payments' },
                        { label: 'Average CPC ($)', value: cpc, setter: setCpc, placeholder: '2.50', icon: 'ads_click' },
                        { label: 'Conversion Rate (%)', value: conversionRate, setter: setConversionRate, placeholder: '2.5', icon: 'percent' },
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
                                    step="0.01"
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
                        <span>Calculate Waste</span>
                        <MaterialIcon name="savings" size={20} />
                    </button>
                </form>

                {result && (
                    <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex flex-col justify-center text-center sm:text-left">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Paid Clicks</div>
                                <div className="text-2xl font-black text-white">{result.clicks.toLocaleString()}</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex flex-col justify-center text-center sm:text-left">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Conversions</div>
                                <div className="text-2xl font-black text-white">{result.conversions.toLocaleString()}</div>
                            </div>
                            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 flex flex-col justify-center text-center sm:text-left">
                                <div className="text-[10px] font-black text-red-500/60 uppercase tracking-widest mb-1">Cost Per Acquisition</div>
                                <div className="text-2xl font-black text-red-500">${result.cpa}</div>
                            </div>
                            <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10 flex flex-col justify-center text-center sm:text-left">
                                <div className="text-[10px] font-black text-green-500/60 uppercase tracking-widest mb-1">Reddit Organic Equiv.</div>
                                <div className="text-2xl font-black text-green-500">{result.organicEquiv.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                            <p className="text-xs text-orange-500/80 leading-relaxed">
                                <strong>💡 The Math:</strong> You could reach <strong>{result.organicEquiv.toLocaleString()}</strong> high-intent users organically on Reddit for $0 using RedLeads, instead of spending ${budget}/mo on ads for just {result.clicks} clicks. That&apos;s a <strong>{Math.round(result.organicEquiv / Math.max(result.clicks, 1))}x</strong> multiplier.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-6 text-center text-[10px] text-gray-600 uppercase tracking-widest">
                No login required. See how much you&apos;re overspending.
            </p>
        </div>
    );
}
