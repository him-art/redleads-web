import { Filter, User, Plus } from 'lucide-react';

export default function InboundVisual() {
    return (
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between h-[600px] scale-[0.85] sm:scale-100 origin-top">
            <div>
                 {/* Header Icon */}
                <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-200">
                        <Filter className="w-8 h-8 text-orange-500 fill-orange-100" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-black text-slate-900 text-center mb-1.5 tracking-tight">
                    Public Reddit Posts
                </h3>

                {/* Subtitle */}
                <p className="text-slate-600 text-center mb-4 leading-relaxed max-w-[85%] mx-auto text-base">
                    Engage in Reddit threads and mention your product
                    to build brand authority and drive organic traffic.
                </p>

                {/* Central Visual - Stacked Cards */}
                <div className="relative h-52 mb-4 flex items-center justify-center -space-y-12 flex-col">
                    {/* Top Card (Rear) */}
                     <div className="w-[85%] h-20 bg-white rounded-[1.25rem] border border-slate-200 shadow-sm flex items-center px-3 gap-2.5 transform translate-y-6 scale-90 opacity-40 z-0">
                        <div className="w-7 h-7 bg-[#FF4500] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                           <span className="sr-only">Reddit Icon</span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <div className="h-2 bg-slate-300 rounded w-1/3"></div>
                            <div className="h-2 bg-slate-100 rounded w-full"></div>
                        </div>
                    </div>

                    {/* Middle Card (Highlighted) */}
                    <div className="w-full h-28 bg-[#FFEEE6] rounded-[1.25rem] border-2 border-[#FFBD9B] shadow-lg flex items-center px-4 gap-3 relative z-20">
                         <div className="absolute top-3 right-3 text-slate-400">
                            <Plus size={18} strokeWidth={3} />
                        </div>
                        <div className="w-9 h-9 bg-[#FF4500] rounded-full flex-shrink-0 flex items-center justify-center text-white">
                             {/* Simplified Reddit Face/User */}
                             <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                             <div className="h-2.5 bg-slate-600/80 rounded-full w-1/3"></div>
                             <div className="h-2.5 bg-slate-400/40 rounded-full w-full"></div>
                             <div className="h-2.5 bg-slate-400/40 rounded-full w-3/4"></div>
                        </div>
                    </div>

                    {/* Bottom Card (Rear) */}
                    <div className="w-[85%] h-20 bg-white rounded-[1.25rem] border border-slate-200 shadow-sm flex items-center px-3 gap-2.5 transform -translate-y-6 scale-90 opacity-40 z-10 mt-3">
                        <div className="w-7 h-7 bg-[#FF4500] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                           <span className="sr-only">Reddit Icon</span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                             <div className="h-2 bg-slate-300 rounded w-1/3"></div>
                             <div className="h-2 bg-slate-100 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits List (Green Pills) */}
            <div className="space-y-2.5">
                <div className="bg-[#ccfcdc] border border-[#9ffcb9] rounded-full py-2.5 px-3 text-center shadow-sm w-full">
                    <span className="text-slate-800 font-medium text-xs sm:text-sm block whitespace-nowrap">
                        Find 15 niche subreddits where your ICP hangs out
                    </span>
                </div>
                <div className="bg-[#ccfcdc] border border-[#9ffcb9] rounded-full py-2.5 px-3 text-center shadow-sm w-full">
                    <span className="text-slate-800 font-medium text-xs sm:text-sm block whitespace-nowrap">
                        Get honest feedback that shapes your product
                    </span>
                </div>
                <div className="bg-[#ccfcdc] border border-[#9ffcb9] rounded-full py-2.5 px-3 text-center shadow-sm w-full">
                    <span className="text-slate-800 font-medium text-xs sm:text-sm block whitespace-nowrap">
                        Creates brand awareness, SEO/GEO and trust
                    </span>
                </div>
            </div>

        </div>
    );
}
