import Link from 'next/link';
import {
    Search,
    Calendar,
    Clock,
    Tag,
    ChevronRight,
    Sparkles,
    ArrowRight,
    BookOpen
} from 'lucide-react';
import Footer from '@/components/footer';

// Dummy data yang mencerminkan tipe data Prisma Post & PostCategory
const categories = [
    { id: 'cat-1', name: 'All Posts', slug: 'all' },
    { id: 'cat-2', name: 'Tutorials', slug: 'tutorials' },
    { id: 'cat-3', name: 'Updates', slug: 'updates' },
    { id: 'cat-4', name: 'Tech Insights', slug: 'tech-insights' },
];

const featuredPost = {
    id: 'post-1',
    title: 'Memaksimalkan Workflow Frontend dengan Next.js App Router & Tailwind CSS',
    slug: 'memaksimalkan-workflow-frontend-nextjs',
    excerpt: 'Panduan mendalam tentang bagaimana mengatur arsitektur komponen React yang efisien, mudah dirawat, dan cepat menggunakan teknik Tailwind terapan.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    publishedAt: '18 Jul 2026',
    category: { name: 'Tutorials', slug: 'tutorials' },
    author: { name: 'Your Name', avatarInitials: 'YN' }
};

const posts = [
    {
        id: 'post-2',
        title: 'Mengapa Kami Memisahkan Database Library dan Download Log',
        slug: 'mengapa-memisahkan-database-library-download-log',
        excerpt: 'Pembahasan teknis mengenai arsitektur Prisma ERD untuk menangani data transaksi dan hak akses digital asset secara cepat.',
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop',
        publishedAt: '12 Jul 2026',
        category: { name: 'Tech Insights', slug: 'tech-insights' },
        author: { name: 'Your Name', avatarInitials: 'YN' }
    },
    {
        id: 'post-3',
        title: 'CodeGraph Update v2.4: Fitur Baru & Optimasi Performa',
        slug: 'codegraph-update-v24-fitur-baru',
        excerpt: 'Rangkuman pembaruan sistem minggu ini mencakup perbaikan UI tactile, penambahan komponen baru, dan percepatan response time.',
        coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop',
        publishedAt: '05 Jul 2026',
        category: { name: 'Updates', slug: 'updates' },
        author: { name: 'Your Name', avatarInitials: 'YN' }
    },
    {
        id: 'post-4',
        title: 'Tips Mengelola State Komponen tanpa Redundansi Kode',
        slug: 'tips-mengelola-state-komponen-tanpa-redundansi',
        excerpt: 'Bagaimana memanfaatkan custom hooks dan React Context secara tepat tanpa mengorbankan re-render performance.',
        coverImage: null, // Menguji penanganan jika coverImage bernilai null (sesuai Prisma schema String?)
        publishedAt: '28 Jun 2026',
        category: { name: 'Tutorials', slug: 'tutorials' },
        author: { name: 'Your Name', avatarInitials: 'YN' }
    }
];

export default function BlogIndexPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
            <main className="flex-1">

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
                                Artikel teknis, panduan pengoptimalan alur kerja, dan catatan rilis produk untuk membantu proses pengembangan aset digitalmu.
                            </p>
                        </div>

                        {/* Filter Categories & Search Bar */}
                        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-slate-100">

                            {/* Category Pills (Recessed Tactile Style) */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                                {categories.map((cat, idx) => (
                                    <button
                                        key={cat.id}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${idx === 0
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
                                    placeholder="Cari artikel..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner"
                                />
                            </div>

                        </div>
                    </div>
                </section>


                {/* --- MAIN CONTENT SECTION --- */}
                <section className="py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                        {/* --- FEATURED POST (Hero Card) --- */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="grid lg:grid-cols-12 gap-8 items-center">

                                {/* Image Cover */}
                                <div className="lg:col-span-7 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/60 h-64 sm:h-80 lg:h-96">
                                    <img
                                        src={featuredPost.coverImage}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="lg:col-span-5 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                                            Featured
                                        </span>
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            {featuredPost.category.name}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug hover:text-indigo-600 transition-colors">
                                        <Link href={`/blog/${featuredPost.slug}`}>
                                            {featuredPost.title}
                                        </Link>
                                    </h2>

                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                                {featuredPost.author.avatarInitials}
                                            </div>
                                            <span className="text-slate-800 font-semibold">{featuredPost.author.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{featuredPost.publishedAt}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/blog/${featuredPost.slug}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-sm"
                                    >
                                        <span>Baca Artikel</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                            </div>
                        </div>


                        {/* --- POST GRID (List Artikel) --- */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
                                Artikel Terbaru
                            </h3>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                    >
                                        <div>
                                            {/* Handling Fallback jika coverImage = null */}
                                            <div className="h-48 bg-slate-100 border-b border-slate-100 relative overflow-hidden">
                                                {post.coverImage ? (
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                                        <BookOpen className="w-10 h-10 opacity-40" />
                                                    </div>
                                                )}
                                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                                                    {post.category.name}
                                                </span>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-6 space-y-3">
                                                <h4 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
                                                    <Link href={`/blog/${post.slug}`}>
                                                        {post.title}
                                                    </Link>
                                                </h4>
                                                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100/60 mt-2">
                                            <span className="font-semibold text-slate-700">{post.author.name}</span>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{post.publishedAt}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

            </main>
        </div>
    );
}