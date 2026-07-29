import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Post, User, PostCategory } from '@prisma/client';
import Image from 'next/image';

interface BlogCardProps {
  blog: Post & {
    author: User;
    category: PostCategory | null;
  };
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(blog.createdAt));

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 flex flex-col h-full">
      {/* Blog Image */}
      <Link href={`/blog/${blog.slug}`}>
        <div className="aspect-16/10 relative overflow-hidden bg-slate-100">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}

          {/* Category Badge */}
          {blog.category && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-900 text-xs font-semibold rounded-full shadow-sm">
                {blog.category.name}
              </span>
            </div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-0" />
        </div>
      </Link>

      {/* Blog Info */}
      <div className="p-6 flex flex-col grow">
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <time dateTime={blog.createdAt.toISOString()}>{formattedDate}</time>
          {/* <span className="w-1 h-1 rounded-full bg-slate-300" /> */}
          {/* <span className="truncate">{blog.author.name || 'Anonymous'}</span> */}
        </div>

        {/* Title */}
        <Link href={`/blog/${blog.slug}`} className="block mt-3">
          <h3 className="text-xl font-semibold text-primary-900 group-hover:text-accent-indigo transition-colors duration-200 line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-2 grow">
            {blog.excerpt}
          </p>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-accent-indigo hover:text-accent-cyan transition-colors duration-200 group/link mt-auto pt-4"
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
