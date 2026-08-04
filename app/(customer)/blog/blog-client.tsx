'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    Calendar,
    Eye,
    BookOpen,
    ArrowRight,
    ShoppingBag,
    Tag
} from 'lucide-react';

type PostWithRelations = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: string | Date | null;
    viewsCount: number;
    author: {
        name: string | null;
        avatarInitials?: string;
    };
    category: {
        name: string;
        slug: string;
    } | null;
    relatedProduct?: {
        id: string;
        title: string;
    } | null;
};

// Helper Format Tanggal
function formatDate(dateInput: string | Date | null) {
    if (!dateInput) return '-';
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function BlogClient({
    initialPosts,
    categories,
    featuredPost
}: {
    initialPosts: PostWithRelations[],
    categories: { id: string, name: string, slug: string }[],
    featuredPost: PostWithRelations | null
}) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const allCategories = [{ id: 'all', name: 'All Posts', slug: 'all' }, ...categories];

    // Filtering Logika
    const filteredPosts = initialPosts.filter((post) => {
        const matchesCategory =
            selectedCategory === 'all' ||
            post.category?.slug === selectedCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
            <main className="flex-1 pb-20">

                {/* --- HERO & FILTER SECTION --- */}
                <section className="bg-white border-b border-slate-200/80 py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest shadow-inner">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>CodeGraph Blog</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                                Insights, Tutorials & <span className="text-indigo-600">Updates</span>
                            </h1>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Technical articles, workflow optimization guides, and product release notes to help with your digital asset development process.
                            </p>
                        </div>

                        {/* Filter Categories & Search Bar */}
                        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-slate-100">

                            {/* Category Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                                {allCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedCategory === cat.slug
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Search Box */}
                            <div className="relative w-full md:w-72">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari artikel..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner"
                                />
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- MAIN CONTENT SECTION --- */}
                <section className="mt-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                        {/* --- FEATURED POST --- */}
                        {featuredPost && (
                            <div className="group bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                                    {/* Image Cover */}
                                    <div className="lg:col-span-7 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/60 h-64 sm:h-80 lg:h-[380px] relative">
                                        {featuredPost.coverImage ? (
                                            <Image
                                                src={featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 60vw"
                                                priority
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 text-slate-400">
                                                <BookOpen className="w-12 h-12 opacity-40 mb-2" />
                                                <span className="text-xs font-medium">CodeGraph Article</span>
                                            </div>
                                        )}

                                        {featuredPost.relatedProduct && (
                                            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                                                <ShoppingBag className="w-3 h-3 text-indigo-400" />
                                                <span>Includes {featuredPost.relatedProduct.title}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                                    Featured
                                                </span>
                                                {featuredPost.category && (
                                                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                        <Tag className="w-3 h-3 text-slate-400" />
                                                        {featuredPost.category.name}
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                                                <Link href={`/blog/${featuredPost.slug}`}>
                                                    {featuredPost.title}
                                                </Link>
                                            </h2>

                                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                                                {featuredPost.excerpt || 'Klik untuk membaca selengkapnya tentang artikel teknis ini.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-50">
                                                        {featuredPost.author.avatarInitials || 'A'}
                                                    </div>
                                                    <span className="text-slate-800 font-semibold">{featuredPost.author.name || 'Author'}</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{formatDate(featuredPost.publishedAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{featuredPost.viewsCount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/blog/${featuredPost.slug}`}
                                                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm"
                                            >
                                                <span>Read Articles</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        )}

                        {/* --- POST GRID --- */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                    Latest Articles
                                </h3>
                                <span className="text-xs font-semibold text-slate-500">
                                    {filteredPosts.length} Articles
                                </span>
                            </div>

                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-slate-500 text-sm">No articles match your search.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPosts.map((post) => (
                                        <article
                                            key={post.id}
                                            className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                                        >
                                            <div>
                                                <div className="h-48 bg-slate-100 border-b border-slate-100 relative overflow-hidden">
                                                    {post.coverImage ? (
                                                        <Image
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/50 text-slate-400">
                                                            <BookOpen className="w-8 h-8 opacity-40 mb-1" />
                                                            <span className="text-[11px] font-medium text-slate-400">CodeGraph Tech</span>
                                                        </div>
                                                    )}

                                                    {post.category && (
                                                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm z-10">
                                                            {post.category.name}
                                                        </span>
                                                    )}

                                                    {post.relatedProduct && (
                                                        <span className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm z-10">
                                                            <ShoppingBag className="w-2.5 h-2.5" />
                                                            Asset
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-5 space-y-2.5">
                                                    <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                                                            {post.title}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                                                        {post.excerpt || 'Baca selengkapnya mengenai dokumentasi teknis ini...'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="px-5 pb-5 pt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100/80">
                                                <span className="font-semibold text-slate-700">{post.author.name || 'Author'}</span>

                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-slate-400" />
                                                        <span>{formatDate(post.publishedAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3 text-slate-400" />
                                                        <span>{post.viewsCount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </section>

            </main>
        </div>
    );
}
