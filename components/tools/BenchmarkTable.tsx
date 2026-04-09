interface BenchmarkRow {
  label: string;
  value: string;
  grade?: string;
  color?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  rows: BenchmarkRow[];
}

export default function BenchmarkTable({ title, subtitle, rows }: Props) {
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'orange': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'green': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'blue': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'yellow': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'red': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Metric</th>
                <th className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Benchmark</th>
                {rows.some(r => r.grade) && (
                  <th className="text-center px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Rating</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-t border-white/[0.04] ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                >
                  <td className="px-5 py-4 text-sm text-white font-medium">{row.label}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{row.value}</td>
                  {rows.some(r => r.grade) && (
                    <td className="px-5 py-4 text-center">
                      {row.grade && (
                        <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${getColorClasses(row.color)}`}>
                          {row.grade}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
