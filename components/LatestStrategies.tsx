import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getAllPosts } from "@/app/blog/posts";

export default function LatestStrategies() {
  const latestPosts = getAllPosts().slice(0, 3);

  if (latestPosts.length === 0) return null;

  return (
    <section className="relative py-24 bg-[#1a1a1a] border-t border-white/5">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Latest Strategies
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Actionable playbooks to turn Reddit into your #1 acquisition channel.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="p-2 bg-white/5 border border-white/5 rounded-[2.5rem] group transition-all duration-300 hover:border-orange-500/20 flex flex-col"
            >
              <div className="bg-[#0c0c0c] rounded-[2rem] p-8 border border-white/5 flex flex-col h-full relative overflow-hidden group-hover:border-orange-500/20 transition-all duration-300">
                {/* Top shimmer line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-orange-500/30 transition-all duration-500" />

                {/* Category + read time */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/70">
                    {post.category}
                  </span>
                  <span className="text-[9px] text-slate-600">•</span>
                  <span className="text-[9px] text-slate-600">{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-white group-hover:text-orange-500 transition-colors mb-4 line-clamp-2 leading-snug flex-1 tracking-tight">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] font-medium text-gray-500 line-clamp-2 leading-relaxed tracking-wide mb-6">
                  {post.description}
                </p>

                {/* CTA */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500 group-hover:text-orange-400 transition-colors">
                    Read Playbook <MaterialIcon name="arrow_forward" size={14} />
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                    <MaterialIcon name="arrow_forward" size={12} className="text-orange-500" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-500/5 hover:border-orange-500/30 hover:text-orange-400 transition-all duration-300"
          >
            <MaterialIcon name="auto_stories" size={14} className="text-orange-500" />
            View All Strategies
          </Link>
        </div>
      </div>
    </section>
  );
}
