import Link from 'next/link';

interface Props {
  toolName: string;
  toolDescription: string;
  toolHref: string;
  toolIcon: string;
}

export default function ToolCallout({ toolName, toolDescription, toolHref, toolIcon }: Props) {
  return (
    <div className="my-12 p-6 sm:p-8 bg-gradient-to-br from-orange-500/[0.08] via-orange-500/[0.04] to-transparent border border-orange-500/15 rounded-3xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute -top-8 -right-8 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
        <span className="material-symbols-outlined" style={{ fontSize: 120 }}>{toolIcon}</span>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-green-400">
            Free Tool — No Login Required
          </span>
        </div>
        
        <h3 className="text-xl font-black text-white mb-2 tracking-tight">
          Try Our {toolName}
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-lg leading-relaxed">
          {toolDescription}
        </p>
        
        <Link
          href={toolHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors group/btn"
        >
          Use Free Tool
          <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-0.5" style={{ fontSize: 16 }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
