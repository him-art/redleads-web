'use client';

import MaterialIcon from '@/components/ui/MaterialIcon';
import { motion } from 'framer-motion';

const Comparison = () => {
  return (
    <section className="py-24 bg-[#1a1a1a] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-4 block">
                Why Choose RedLeads?
            </span>
            <h2 className="text-4xl md:text-[4.5rem] font-black text-white leading-[1.05] tracking-tighter mb-6">
                Finding new customers feels too hard? <br className="hidden md:block" />
                <span className="text-orange-500 font-serif-italic">RedLeads is the better way.</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                Stop wasting hours searching customers on Reddit manually and start finding high-intent 
                conversations that actually convert. RedLeads is your <span className="text-orange-500 font-bold">Reddit Marketing OS</span>.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Manual Card */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#141414] rounded-[2.5rem] p-8 md:p-12 border border-white/5 flex flex-col h-full relative overflow-hidden"
            >
                <div className="mb-10 text-center">
                    <h3 className="text-2xl font-black text-gray-400 mb-2">Finding Customers Manually</h3>
                </div>

                <ul className="space-y-5 mb-12 flex-1">
                    <ManualItem text="Do keyword research manually (1-2 hours)" />
                    <ManualItem text="Go through hundreds of Google search results (2-3 hours)" />
                    <ManualItem text="Find high-ranking Reddit posts manually (1-2 hours)" />
                    <ManualItem text="Pay for expensive SEO tools ($120+/month minimum)" />
                    <ManualItem text="Read through hundreds of potentially irrelevant posts (2-3 hours)" />
                    <ManualItem text="Craft authentic replies manually (1-2 hours)" />
                    <ManualItem text="Miss time-sensitive new opportunities (daily)" />
                </ul>

                <div className="mt-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center justify-center gap-3 text-red-400">
                    <MaterialIcon name="schedule" size={20} />
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest">
                        2-3 hours daily + $120+/month tools
                    </span>
                </div>
            </motion.div>

            {/* RedLeads Card - Updated with Orange Background */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#FF9154] rounded-[2.5rem] p-8 md:p-12 border border-[#FF9154] flex flex-col h-full relative overflow-hidden shadow-2xl shadow-orange-500/20"
            >
                {/* Subtle sheen effect */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full pointer-events-none -mr-20 -mt-20" />
                
                <div className="relative z-10 mb-10 text-center">
                    <h3 className="text-2xl font-black text-[#141414] mb-2 flex items-center justify-center gap-2">
                        With <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">RedLeads</span>
                        {/* Custom Cursor Icon */}
                        <svg className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </h3>
                </div>

                <ul className="relative z-10 space-y-8 mb-12 flex-1">
                    <BenefitItem 
                        title="Create your project (2 minutes)"
                        description="Simply add your website & description. RedLeads AI automatically finds the most relevant keywords for your business and niche."
                    />
                    <BenefitItem 
                        title="Get high-ranking Reddit opportunities"
                        description="AI tracks search engine indexed Reddit posts and brand mentions inside Reddit comments to surface highly-ranking Reddit posts to engage with."
                    />
                    <BenefitItem 
                        title="Invest just 20 minutes daily"
                        description="Review curated opportunities and engage authentically. Highly effective marketing with minimal time investment."
                    />
                </ul>

                <div className="relative z-10 mt-auto bg-white rounded-2xl p-6 flex items-center justify-center gap-3 text-[#141414] border-2 border-black">
                    <MaterialIcon name="check_circle" size={20} />
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest">
                        Effective growth marketing in 20 min/day
                    </span>
                </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};

const ManualItem = ({ text }: { text: string }) => (
    <li className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0 text-red-500/50">
            <MaterialIcon name="close" size={16} weight={700} />
        </div>
        <span className="text-[13px] font-medium text-gray-500 leading-relaxed">
            {text}
        </span>
    </li>
);

const BenefitItem = ({ title, description }: { title: string, description: string }) => (
    <li className="flex items-start gap-4">
        {/* Updated Icon: White Bg with Orange Check */}
        <div className="mt-1 flex-shrink-0 bg-white text-[#FF9154] rounded-full p-1 shadow-sm flex items-center justify-center">
            <MaterialIcon name="check" size={12} weight={700} />
        </div>
        <div>
            {/* Updated Text: Warm Black */}
            <h4 className="text-base font-black text-[#1F100B] mb-2 tracking-tight">{title}</h4>
            <span className="text-[13px] font-medium text-[#1F100B]/80 leading-relaxed block">
                {description}
            </span>
        </div>
    </li>
);

export default Comparison;
