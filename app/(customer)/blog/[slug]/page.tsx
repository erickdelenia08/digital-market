import Link from 'next/link';
import {
    Calendar,
    ArrowLeft,
    Share2,
    Bookmark,
    Play,
    Tag,
    CheckCircle2,
    UserCheck
} from 'lucide-react';
import Footer from '@/components/footer';

// Dummy data detail artikel berdasarkan skema Prisma Post & PostMedia
const postDetail = {
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
    publishedAt: '18 Jul 2026',
    category: { name: 'Tutorials', slug: 'tutorials' },
    author: {
        name: 'Your Name',
        role: 'Lead Creator & Developer',
        avatarInitials: 'YN',
        bio: 'Fokus membangun aset digital dan komponen siap pakai untuk mempercepat workflow para kreator.'
    },
    // Array dari model PostMedia (IMAGE & VIDEO)
    media: [
        {
            id: 'media-1',
            url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
            type: 'IMAGE',
            sortOrder: 1
        },
        {
            id: 'media-2',
            url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
            type: 'IMAGE',
            sortOrder: 2
        }
    ]
};

export default function BlogPostDetailPage() {
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

                        <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-md uppercase tracking-widest shadow-inner">
                            {postDetail.category.name}
                        </span>
                    </div>


                    {/* --- ARTICLE HEADER --- */}
                    <div className="space-y-6 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {postDetail.title}
                        </h1>

                        <p className="text-lg text-slate-600 leading-relaxed font-normal">
                            {postDetail.excerpt}
                        </p>

                        {/* Author & Date Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                    {postDetail.author.avatarInitials}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{postDetail.author.name}</div>
                                    <div className="text-slate-500 text-xs">{postDetail.author.role}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>{postDetail.publishedAt}</span>
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
                    {postDetail.coverImage && (
                        <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
                            <img
                                src={postDetail.coverImage}
                                alt={postDetail.title}
                                className="w-full max-h-[480px] object-cover"
                            />
                        </div>
                    )}


                    {/* --- ARTICLE CONTENT (Rich Text Formatting) --- */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">

                        {/* Render konten HTML/Rich Text */}
                        <div
                            className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:mb-4 prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl"
                            dangerouslySetInnerHTML={{ __html: postDetail.content }}
                        />

                        {/* --- MEDIA GALLERY SECTION (Rendering PostMedia) --- */}
                        {postDetail.media && postDetail.media.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 space-y-4">
                                <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest text-xs">
                                    Lampiran & Galeri Media
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {postDetail.media.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group"
                                        >
                                            {item.type === 'IMAGE' ? (
                                                <img
                                                    src={item.url}
                                                    alt="Post attachment"
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-slate-900 flex items-center justify-center text-white">
                                                    <Play className="w-10 h-10 text-cyan-400" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>


                    {/* --- AUTHOR FOOTER BOX --- */}
                    <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200 shadow-inner flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-sm">
                            {postDetail.author.avatarInitials}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <h4 className="font-bold text-slate-900 text-base">{postDetail.author.name}</h4>
                                <UserCheck className="w-4 h-4 text-indigo-600" />
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                {postDetail.author.bio}
                            </p>
                        </div>
                    </div>

                </article>
            </main>

        </div>
    );
}