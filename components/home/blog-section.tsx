import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { blogs } from '@/mock-data/products';
import BlogCard from './blog-card';

const BlogSection = () => {
  const latestBlogs = blogs.slice(0, 3);

  return (
    <section id="blog" className="py-20 md:py-28 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">

        {/* --- HEADER BLOCK --- */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200/60 pb-8">
          <div className="space-y-3">
            {/* Raised Emblem Badge */}
            <div className="inline-flex items-center gap-2 bg-accent-indigo/5 border border-accent-indigo/10 px-3.5 py-1.5 rounded-full text-accent-indigo text-[11px] font-black uppercase tracking-widest shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>From The Blog</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-900 tracking-tight">
              Latest Insights & Tutorials
            </h2>

            <p className="text-sm sm:text-base font-medium text-slate-500 max-w-lg leading-relaxed">
              Workflow tips, design insights, and tutorials to help you get the most out of your digital assets.
            </p>
          </div>

          {/* Tactile Action Button */}
          <Link
            href="/blog"
            className="group shrink-0 inline-flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200/80 rounded-xl text-xs font-black text-primary-900 uppercase tracking-wider shadow-sm hover:shadow-md hover:border-slate-300 hover:text-accent-indigo hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent-indigo group-hover:translate-x-1 transition-all duration-200" />
          </Link>
        </div>

        {/* --- BLOG GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;