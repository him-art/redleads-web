import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getAllPosts } from "@/app/blog/posts";

export default function LatestStrategies() {
  const latestPosts = getAllPosts().slice(0, 3);

  if (latestPosts.length === 0) return null;

  return (
    <section className="relative py-24 bg-[#1a1a1a] border-t border-white/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
             <MaterialIcon name="auto_stories" size={14} className="text-orange-500" />
             <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Growth Hub</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Latest Strategies
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Actionable playbooks to turn Reddit into your #1 acquisition channel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-6 bg-[#222] border border-white/5 rounded-2xl hover:border-orange-500/20 transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/70">
                  {post.category}
                </span>
                <span className="text-[9px] text-slate-600">•</span>
                <span className="text-[9px] text-slate-600">{post.readTime}</span>
              </div>
              
              <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors mb-3 line-clamp-2 leading-snug flex-1">
                {post.title}
              </h3>
              
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {post.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/[0.04]">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                  Read Playbook <MaterialIcon name="arrow_forward" size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
          >
            View All Strategies
          </Link>
        </div>
      </div>
    </section>
  );
}
