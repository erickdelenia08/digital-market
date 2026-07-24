import Link from 'next/link';
import {
    Calendar,
    ArrowLeft,
    Share2,
    Eye,
    ShoppingBag,
    UserCheck
} from 'lucide-react';
import Footer from '@/components/footer';

// ==========================================
// MOCK DATA (100% Match dengan Skema Prisma)
// ==========================================
const mockPost = {
    id: 'post-1',
    title: 'Memaksimalkan Workflow Frontend dengan Next.js App Router & Tailwind CSS',
    slug: 'memaksimalkan-workflow-frontend-nextjs',
    excerpt: 'Panduan mendalam tentang bagaimana mengatur arsitektur komponen React yang efisien, mudah dirawat, dan cepat menggunakan teknik Tailwind terapan.',
    content: `
    <p>Dalam pengembangan aplikasi web modern, kecepatan iterasi dan kerapian struktur kode menjadi dua kunci utama keberhasilan tim engineering. Penggunaan Next.js App Router bersama Tailwind CSS menawarkan fondasi yang sangat solid untuk membangun UI responsif berkinerja tinggi.</p>
    
    <h2>1. Arsitektur Komponen Sederhana & Terstruktur</h2>
    <p>Salah satu kesalahan umum developer adalah mencampuradukkan logika fetch data dengan komponen UI visual. Dengan memisahkan Server Components dan Client Components secara tegas, kita dapat mengurangi besarnya bundle JavaScript yang dikirim ke browser pengguna.</p>

    <blockquote>"Kunci utama dari performa aplikasi yang cepat bukanlah menggunakan library paling sedikit, melainkan hanya mengirim kode yang benar-benar dibutuhkan oleh browser."</blockquote>

    <h2>2. Pengelolaan Warna Solid tanpa Gradasi</h2>
    <p>Desain modern kini banyak beralih ke pendekatan <strong>Tactile Light Tech</strong> yang mengutamakan kontras warna solid, border tipis yang tegas, dan struktur elevasi berbasis bayangan mikro (micro-shadows).</p>
  `,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    published: true,
    publishedAt: new Date('2026-07-18'),
    viewsCount: 1240,

    author: {
        id: 'user-1',
        name: 'Your Name',
        image: null,
        bio: 'Fokus membangun aset digital dan komponen siap pakai untuk mempercepat workflow para kreator.',
    },

    category: {
        id: 'cat-1',
        name: 'Tutorials',
        slug: 'tutorials',
    },

    relatedProduct: {
        id: 'prod-1',
        name: 'Next.js & Tailwind Starter Kit',
        slug: 'nextjs-tailwind-starter-kit',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    }
};

export default function BlogPostDetailPage() {
    const post = mockPost;

    const avatarInitials = post.author.name
        ? post.author.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
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
                                href={`/blog/category/${post.category.slug}`}
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
                                {post.author.image ? (
                                    <img
                                        src={post.author.image}
                                        alt={post.author.name || 'Author'}
                                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                        {avatarInitials}
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{post.author.name || 'Penulis'}</div>
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
                                    <span>{post.viewsCount.toLocaleString('id-ID')} x dibaca</span>
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
                        <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full max-h-[480px] object-cover"
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
                                <h4 className="font-bold text-slate-900 text-base">{post.author.name}</h4>
                                <UserCheck className="w-4 h-4 text-indigo-600" />
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                {post.author.bio}
                            </p>
                        </div>
                    </div>

                </article>
            </main>
            <Footer />
        </div>
    );
}