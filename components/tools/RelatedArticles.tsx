import Link from 'next/link';

interface ArticleLink {
  title: string;
  description: string;
  href: string;
  category: string;
}

interface Props {
  articles: ArticleLink[];
}

export default function RelatedArticles({ articles }: Props) {
  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">Learn More</h2>
          <p className="text-sm text-slate-500">Deep-dive guides related to this tool</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {articles.map((article, idx) => (
            <Link
              key={idx}
              href={article.href}
              className="group p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-orange-500/20 transition-all duration-300"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/70">
                {article.category}
              </span>
              <h3 className="text-sm font-bold text-white mt-2 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {article.description}
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-[10px] font-bold text-orange-500/80 group-hover:text-orange-500 transition-colors">
                Read Article
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-0.5" style={{ fontSize: 12 }}>arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
