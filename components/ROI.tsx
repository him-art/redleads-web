'use client';

import MaterialIcon from '@/components/ui/MaterialIcon';
import { motion } from 'framer-motion';

const ROI = () => {
    return (
        <section className="pt-0 pb-24 bg-[#1a1a1a] relative">
            <div className="max-w-5xl mx-auto px-6">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#141414] rounded-[3rem] p-8 md:p-16 border border-white/5 relative overflow-hidden "
                >
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
                        
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">
                            How <span className="text-orange-500">RedLeads</span> pays for <br />
                            itself in days
                        </h2>
                        
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            <span className="text-orange-500 font-bold">Only one</span> successful customer that finds you via Reddit can already cover your entire investment. <span className="text-white font-bold">Here's the math that makes it obvious.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        
                        {/* Left Column: Stats List */}
                        <div className="space-y-8">
                            <StatItem 
                                icon={<MaterialIcon name="search" size={20} />}
                                color="bg-green-500/20 text-green-400 border-green-500/20"
                                title="Relevant posts found weekly"
                                description="AI finds highly relevant Reddit opportunities automatically"
                                value="50+"
                            />
                            <StatItem 
                                icon={<MaterialIcon name="group" size={20} />}
                                color="bg-blue-500/20 text-blue-400 border-blue-500/20"
                                title="Conversion rate to customers"
                                description="Conservative estimate from engaging with quality leads"
                                value="5%"
                            />
                            <StatItem 
                                icon={<MaterialIcon name="attach_money" size={20} />}
                                color="bg-purple-500/20 text-purple-400 border-purple-500/20"
                                title="Your average customer value"
                                description="Most businesses have $500+ customer lifetime value"
                                value="$"
                            />
                        </div>

                        {/* Right Column: Big ROI Box */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="mb-8">
                                <span className="text-7xl md:text-8xl font-black text-orange-500 tracking-tighter block mb-2">
                                    $1,250
                                </span>
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500 block mb-2">
                                    Potential monthly revenue
                                </span>
                                <span className="text-xs text-gray-600 font-medium font-mono">
                                    (50 posts × 5% conversion × $500 value)
                                </span>
                            </div>

                            <div className="w-full bg-green-500/5 border border-green-500/20 rounded-3xl p-8 relative overflow-hidden group hover:bg-green-500/10 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />
                                
                                <div className="flex flex-col items-center gap-3 relative z-10">
                                    <div className="bg-green-500 text-black rounded-full p-1.5 mb-1">
                                        <MaterialIcon name="check" size={16} />
                                    </div>
                                    <h3 className="text-3xl font-black text-green-400 tracking-tight">
                                        ROI: 2,500%+
                                    </h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-green-500/80">
                                        Pays for itself in the first week
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer disclaimer */}
                    <div className="mt-16 text-center pt-8 border-t border-white/5">
                        <p className="text-gray-500 text-sm font-serif-italic">
                            <span className="font-bold text-gray-400 font-sans not-italic">Conservative estimate.</span> You might get different results but you get the idea.
                        </p>
                    </div>

                </motion.div>
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
