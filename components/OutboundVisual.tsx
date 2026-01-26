import { MessageCircle, User, Plus } from 'lucide-react';

export default function OutboundVisual() {
    return (
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between h-[600px] scale-[0.85] sm:scale-100 origin-top">
            <div>
                 {/* Header Icon */}
                <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                        <MessageCircle className="w-8 h-8 text-blue-500 fill-blue-100" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-black text-slate-900 text-center mb-1.5 tracking-tight">
                    Smart Engagement
                </h3>

                {/* Subtitle */}
                <p className="text-slate-600 text-center mb-4 leading-relaxed max-w-[90%] mx-auto text-base">
                    Join relevant Reddit conversations with authentic 
                    input that builds trust.
                </p>

                {/* Central Visual - Threaded Comments */}
                <div className="relative h-52 mb-4 flex flex-col items-center justify-center pl-3">
                    
                    {/* Visual Connection Line */}
                    <div className="absolute left-[3rem] top-10 bottom-10 w-px border-l-2 border-slate-300 border-dashed z-0"></div>

                    {/* Top Comment (Parent) */}
                    <div className="w-[90%] h-16 bg-white rounded-[1.25rem] border border-slate-200 shadow-sm flex items-center px-3 gap-2.5 relative z-10 mb-[-0.5rem] ml-auto">
                         <div className="w-7 h-7 bg-[#FF4500] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                           <span className="sr-only">Reddit Icon</span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                             <div className="h-2 bg-slate-300 rounded w-1/3"></div>
                             <div className="h-2 bg-slate-100 rounded w-full"></div>
                        </div>
                    </div>

                     {/* Connection Curve */}
                    <svg className="absolute left-[3rem] top-[3.5rem] w-7 h-14 z-0 fill-none stroke-slate-300 stroke-[2] stroke-dashed" viewBox="0 0 32 64">
                        <path d="M0 0 C 0 32, 32 32, 32 64" />
                    </svg>

                    {/* Middle Comment (Highlighted Reply) */}
                    <div className="w-full h-24 bg-[#E6F0FF] rounded-[1.25rem] border-2 border-[#9BBDFC] shadow-lg flex items-center px-4 gap-3 relative z-20 my-3 transform translate-x-[-0.75rem]">
                         <div className="absolute top-2.5 right-3 text-slate-400">
                            <Plus size={18} strokeWidth={3} />
                        </div>
                         <div className="w-8 h-8 bg-[#FF4500] rounded-full flex-shrink-0 flex items-center justify-center text-white">
                             <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                             <div className="h-2.5 bg-slate-600/80 rounded-full w-1/3"></div>
                             <div className="h-2.5 bg-slate-400/40 rounded-full w-full"></div>
                        </div>
                    </div>

                    {/* Bottom Comment (Next Reply) */}
                     <div className="w-[85%] h-16 bg-white rounded-[1.25rem] border border-slate-200 shadow-sm flex items-center px-3 gap-2.5 relative z-10 mt-[-0.5rem] ml-auto mr-6">
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
                        Get alerted when people ask for solutions you provide
                    </span>
                </div>
                <div className="bg-[#ccfcdc] border border-[#9ffcb9] rounded-full py-2.5 px-3 text-center shadow-sm w-full">
                    <span className="text-slate-800 font-medium text-xs sm:text-sm block whitespace-nowrap">
                        AI writes safe replies that help first, promote second
                    </span>
                </div>
                <div className="bg-[#ccfcdc] border border-[#9ffcb9] rounded-full py-2.5 px-3 text-center shadow-sm w-full">
                    <span className="text-slate-800 font-medium text-xs sm:text-sm block whitespace-nowrap">
                        Learn what resonates from real user engagement
                    </span>
                </div>
            </div>

        </div>
    );
}
