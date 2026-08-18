'use client';

import MaterialIcon from '@/components/ui/MaterialIcon';


import { useState } from 'react';

type ROICase = 'worst' | 'realistic' | 'best';

const scenarios = {
    worst: {
        posts: 30,
        conversion: 0.01,
        ltv: 150,
        postsStr: '30',
        conversionStr: '1%',
        ltvStr: '$150',
        payback: 'Pays for itself in month 1',
        lifetimePayback: 'Pays for Lifetime in 4.4 months',
        colorClass: 'text-white'
    },
    realistic: {
        posts: 50,
        conversion: 0.02,
        ltv: 250,
        postsStr: '50',
        conversionStr: '2%',
        ltvStr: '$250',
        payback: 'Pays for itself in days',
        lifetimePayback: 'Pays for Lifetime in 24 days',
        colorClass: 'text-orange-500'
    },
    best: {
        posts: 100,
        conversion: 0.05,
        ltv: 500,
        postsStr: '100+',
        conversionStr: '5%',
        ltvStr: '$500+',
        payback: 'Pays for itself immediately',
        lifetimePayback: 'Pays for Lifetime immediately',
        colorClass: 'text-green-500'
    }
};

const ROI = () => {
    const [activeCase, setActiveCase] = useState<ROICase>('realistic');
    const stats = scenarios[activeCase];
    const cost = 39; // Growth plan monthly cost
    const revenue = Math.round(stats.posts * stats.conversion * stats.ltv);
    const roiPercent = Math.round(((revenue - cost) / cost) * 100);
    const formattedRevenue = `$${revenue.toLocaleString()}`;
    const formattedROI = `ROI: ~${roiPercent.toLocaleString()}%`;
    const formula = `(${stats.postsStr} posts × ${stats.conversionStr} conversion × ${stats.ltvStr} value)`;

    return (
        <section className="pt-0 pb-24 bg-[#1a1a1a] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="p-2 bg-white/5 border border-white/5 rounded-[3.5rem]">
                <div className="bg-[#0c0c0c] rounded-[3rem] p-8 md:p-16 border border-white/5 relative overflow-hidden shadow-none">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                        
                        {/* Header */}
                        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">
                                Why $39/mo is the <span className="text-orange-500">easiest investment</span> <br />
                                you&apos;ll make this year
                            </h2>
                            
                            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                                <span className="text-orange-500 font-bold">Only one</span> successful customer that finds you via Reddit can already cover your entire investment. <span className="text-white font-bold">Here's the math that makes it obvious.</span>
                            </p>
                        </div>
                        
                        {/* Toggle Buttons */}
                        <div className="flex justify-center mb-16 relative z-10">
                            <div className="inline-flex items-center p-1.5 bg-white/5 rounded-2xl">
                                <button
                                    onClick={() => setActiveCase('worst')}
                                    className={`w-28 sm:w-36 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCase === 'worst' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    Worst Case
                                </button>
                                <button
                                    onClick={() => setActiveCase('realistic')}
                                    className={`w-28 sm:w-36 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCase === 'realistic' ? 'bg-orange-500/20 text-orange-400 shadow-sm' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    Realistic
                                </button>
                                <button
                                    onClick={() => setActiveCase('best')}
                                    className={`w-28 sm:w-36 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCase === 'best' ? 'bg-green-500/20 text-green-400 shadow-sm' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    Best Case
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 transition-all duration-300 min-h-[420px] lg:min-h-[380px]">
                            
                            {/* Left Column: Stats List */}
                            <div className="space-y-8">
                                <StatItem 
                                    icon={<MaterialIcon name="search" size={20} />}
                                    color="bg-green-500/20 text-green-400 border-green-500/20"
                                    title="Relevant posts found per month"
                                    description="AI finds highly relevant Reddit opportunities automatically"
                                    value={stats.postsStr}
                                />
                                <StatItem 
                                    icon={<MaterialIcon name="group" size={20} />}
                                    color="bg-blue-500/20 text-blue-400 border-blue-500/20"
                                    title="Conversion rate to customers"
                                    description="Estimate from engaging with quality leads"
                                    value={stats.conversionStr}
                                />
                                <StatItem 
                                    icon={<MaterialIcon name="attach_money" size={20} />}
                                    color="bg-purple-500/20 text-purple-400 border-purple-500/20"
                                    title="Your average customer value"
                                    description="Estimated customer lifetime value"
                                    value={stats.ltvStr}
                                />
                            </div>

                            {/* Right Column: Big ROI Box */}
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="mb-8 h-32 flex flex-col justify-center">
                                    <span className={`text-6xl md:text-8xl font-black ${stats.colorClass} tracking-tighter block mb-2 transition-colors duration-300`}>
                                        {formattedRevenue}
                                    </span>
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500 block mb-2">
                                        Potential monthly revenue
                                    </span>
                                    <span className="text-xs text-gray-600 font-medium font-mono min-h-[40px] flex items-center justify-center">
                                        {formula}
                                    </span>
                                </div>

                                <div className="w-full p-2 bg-white/5 border border-white/5 rounded-[2.5rem]">
                                    <div className="w-full bg-[#080808] border border-white/10 rounded-[2rem] p-8 min-h-[160px] flex flex-col justify-center relative overflow-hidden group hover:bg-[#0c0c0c] transition-colors shadow-none">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        
                                        <div className="flex flex-col items-center gap-3 relative z-10">
                                            <div className="bg-white/10 text-white rounded-full p-1.5 mb-1">
                                                <MaterialIcon name="check" size={16} />
                                            </div>
                                            <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                                                {formattedROI}
                                            </h3>
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 h-4">
                                                {stats.payback}
                                            </p>
                                            <div className="w-full mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-500">
                                                <MaterialIcon name="bolt" size={12} className="text-orange-500 animate-pulse" />
                                                <span>{stats.lifetimePayback}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer disclaimer */}
                        <div className="mt-16 text-center pt-8 border-t border-white/5">
                            <p className="text-gray-500 text-sm font-serif-italic">
                                <span className="font-bold text-gray-400 font-sans not-italic">Based on the $39/mo Growth plan or $199 One-Time Payment.</span> The $199 Lifetime option pays for itself in weeks (and in days for realistic/best cases) with zero recurring monthly fees thereafter.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ icon, color, title, description, value }: { icon: any, color: string, title: string, description: string, value: string }) => (
    <div className="flex gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${color}`}>
            {value === "$" ? <span className="text-xl font-black">$</span> : 
             value.includes("+") || value.includes("%") ? <span className="text-sm font-black">{value}</span> : 
             icon}
        </div>
        <div>
            <h4 className="text-lg font-black text-white mb-1.5 tracking-tight">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
        </div>
    </div>
);

export default ROI;
