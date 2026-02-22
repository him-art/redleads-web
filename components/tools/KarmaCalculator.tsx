'use client';
import { useState } from 'react';
import MaterialIcon from '@/components/ui/MaterialIcon';

export default function KarmaCalculator() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate calculation for shell
        setTimeout(() => {
            setResult({
                postKarma: Math.floor(Math.random() * 10000),
                commentKarma: Math.floor(Math.random() * 50000),
                totalKarma: 0, // will calc below
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-[#222] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleCalculate} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                            Reddit Username
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-bold">u/</span>
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="vlad_the_impaler"
                                className="block w-full pl-10 pr-4 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-900 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Check Karma</span>
                                <MaterialIcon name="bolt" size={20} />
                            </>
                        )}
                    </button>
                </form>

                {result && !loading && (
                    <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Post Karma</div>
                                <div className="text-2xl font-black text-white">{result.postKarma.toLocaleString()}</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Comment Karma</div>
                                <div className="text-2xl font-black text-white">{result.commentKarma.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="mt-4 bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl text-center">
                            <div className="text-xs font-black text-orange-500/60 uppercase tracking-widest mb-1">Total Impact Score</div>
                            <div className="text-4xl font-black text-orange-500">
                                {(result.postKarma + result.commentKarma).toLocaleString()}
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                "This user is a Reddit veteran. Perfect for high-trust outreach."
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-6 text-center text-[10px] text-gray-600 uppercase tracking-widest">
                No login required. Works for any public profile.
            </p>
        </div>
    );
}
