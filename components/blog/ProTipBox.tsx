interface Props {
  tip: string;
}

export default function ProTipBox({ tip }: Props) {
  return (
    <div className="my-8 p-5 sm:p-6 bg-orange-500/[0.05] border-l-4 border-orange-500/60 rounded-r-2xl relative overflow-hidden">
      <div className="absolute top-3 right-3 opacity-[0.06]">
        <span className="material-symbols-outlined" style={{ fontSize: 40 }}>tips_and_updates</span>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest mb-2">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lightbulb</span>
          Pro Tip
        </div>
        <p className="text-slate-200 text-sm leading-relaxed font-medium">
          {tip}
        </p>
      </div>
    </div>
  );
}
