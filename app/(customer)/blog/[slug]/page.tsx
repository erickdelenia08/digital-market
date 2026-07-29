import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
    Calendar,
    ArrowLeft,
    Share2,
    Eye,
    ShoppingBag,
    UserCheck
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = await prisma.post.findUnique({
        where: { slug: slug },
    });
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
    };
}

export default async function BlogPostDetailPage({ params }: Props) {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug: slug, published: true },
        include: {
            author: true,
            category: true,
            relatedProduct: true,
        },
    });
    console.log('ini postt , ', post);


    if (!post) {
        return notFound();
    }

    // Increment views asynchronously
    prisma.post.update({
        where: { id: post.id },
        data: { viewsCount: { increment: 1 } },
    }).catch(console.error);

    const avatarInitials = post.author?.name
        ? post.author.name.substring(0, 2).toUpperCase()
        : 'AU';

    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'Draft';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
            <main className="flex-1 py-12 md:py-20">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                    {/* --- BACK BUTTON & CATEGORY --- */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-6">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Blog</span>
                        </Link>

                        {post.category && (
                            <Link
                                href={`/blog?category=${post.category.slug}`}
                                className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-md uppercase tracking-widest shadow-inner hover:bg-indigo-100 transition-colors"
                            >
                                {post.category.name}
                            </Link>
                        )}
                    </div>

                    {/* --- ARTICLE HEADER --- */}
                    <div className="space-y-6 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-lg text-slate-600 leading-relaxed font-normal">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Author, Date & Views Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                    {avatarInitials}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{post.author?.name || 'Penulis'}</div>
                                    <div className="text-slate-500 text-xs">Author</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>{formattedDate}</span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{(post.viewsCount + 1).toLocaleString('id-ID')} x dibaca</span>
                                </div>

                                <button
                                    aria-label="Share article"
                                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg transition-colors shadow-sm"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN COVER IMAGE --- */}
                    {post.coverImage && (
                        <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-white relative aspect-video">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="w-full object-cover"
                            />
                        </div>
                    )}

                    {/* --- ARTICLE CONTENT --- */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm text-slate-700 leading-relaxed text-base sm:text-lg">
                        <div
                            className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:mb-4 prose-a:text-indigo-600 prose-a:font-bold prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* --- RELATED PRODUCT (Tactile Tech Solid Widget) --- */}
                    {post.relatedProduct && (
                        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 text-center sm:text-left">
                                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-lg">
                                    <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>REKOMENDASI PRODUK</span>
                                </span>
                                <h3 className="text-xl font-bold text-white">{post.relatedProduct.name}</h3>
                                <p className="text-xs text-slate-400">
                                    Tertarik dengan topik di artikel ini? Cek produk digital pendukungnya.
                                </p>
                            </div>
                            <Link
                                href={`/products/${post.relatedProduct.slug}`}
                                className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 hover:-translate-y-0.5"
                            >
                                Lihat Produk
                            </Link>
                        </div>
                    )}

                    {/* --- AUTHOR FOOTER BOX --- */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-sm">
                            {avatarInitials}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <h4 className="font-bold text-slate-900 text-base">{post.author?.name || 'Author'}</h4>
                                <UserCheck className="w-4 h-4 text-indigo-600" />
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Kreator aktif CodeGraph. Fokus membangun aset digital dan komponen siap pakai untuk mempercepat workflow para developer.
                            </p>
                        </div>
                    </div>

                </article>
            </main>
        </div>
    );
}