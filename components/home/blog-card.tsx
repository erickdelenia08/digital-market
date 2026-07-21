import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Blog } from '@/mock-data/products';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300">
      {/* Blog Image */}
      <Link href={`/blog/${blog.id}`}>
        <div className={`aspect-[16/10] ${blog.image} relative overflow-hidden`}>
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-900 text-xs font-semibold rounded-full">
              {blog.category}
            </span>
          </div>
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </Link>

      {/* Blog Info */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{blog.date}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{blog.author}</span>
        </div>

        {/* Title */}
        <Link href={`/blog/${blog.id}`}>
          <h3 className="mt-3 text-xl font-semibold text-primary-900 group-hover:text-accent-indigo transition-colors duration-200 line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-2">
          {blog.excerpt}
        </p>

        {/* Read More Link */}
        <Link
          href={`/blog/${blog.id}`}
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-accent-indigo hover:text-accent-cyan transition-colors duration-200 group/link"
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
