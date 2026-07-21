// src/data/mockData.ts

// Enums (Sesuai dengan skema Prisma Anda)
export enum MediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}

export enum AssetType {
    FILE = "FILE",
    LINK = "LINK"
}

export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED"
}


export interface ProductMedia {
    id: string;
    productId: string;
    url: string;
    type: MediaType;
    sortOrder: number;
}

// 3. Tipe Data untuk Relasi DigitalAsset
export interface DigitalAsset {
    id: string;
    productId: string;
    name: string;
    type: AssetType;
    fileUrl: string | null;
    linkUrl: string | null;
}

// 4. Tipe Data Utama untuk Product (Lengkap dengan Include Relations)
export interface MockProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    isPublished: boolean;
    isFeatured: boolean; // Tambahan field untuk banner/unggulan
    salesCount: number;  // Tambahan field untuk kalkulasi Best Seller di frontend
    deletedAt: Date | null;
    averageRating: number;
    reviewCount: number;
    categoryId: string;
    coverImage: string | null;
    // coverImage: string | null;
    createdAt: Date;
    updatedAt: Date;

    // Relations (Array objek)
    media: ProductMedia[];
    digitalAssets: DigitalAsset[];
}


// 1. DATA KATEGORI
export const MOCK_CATEGORIES = [
    { id: "cat_1", name: "Source Code & Templates", slug: "source-code-templates" },
    { id: "cat_2", name: "E-Books & Guides", slug: "e-books-guides" },
    { id: "cat_3", name: "Design Assets & UI Kits", slug: "design-assets-ui-kits" },
];

// 2. DATA USER
export const MOCK_USERS = [
    {
        id: "user_customer_1",
        name: "Budi Santoso",
        email: "budi@gmail.com",
        image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    }
];

// 3. DATA PRODUK UTAMA (Total 9 Produk untuk simulasi Best Seller & Featured)
export const MOCK_PRODUCTS = [
    // --- KATEGORI 1: SOURCE CODE & TEMPLATES ---
    {
        id: "prod_nextjs_saas",
        name: "SaaS Boilerplate Next.js 15 & Tailwind CSS",
        slug: "saas-boilerplate-nextjs-15-tailwind-css",
        description: "Kembangkan aplikasi SaaS Anda 10x lebih cepat. Sudah termasuk integrasi NextAuth, Stripe Payment, Prisma ORM, dan komponen UI siap pakai menggunakan Shadcn.",
        price: 499000,
        isPublished: true,
        isFeatured: true, // Tampil di banner utama
        salesCount: 145,   // Tertinggi ke-2 di cat_1
        deletedAt: null,
        averageRating: 4.8,
        reviewCount: 2,
        categoryId: "cat_1",
        coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_1", productId: "prod_nextjs_saas", url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600", type: MediaType.IMAGE, sortOrder: 0 },
            { id: "med_2", productId: "prod_nextjs_saas", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600", type: MediaType.IMAGE, sortOrder: 1 }
        ],
        digitalAssets: [
            { id: "asset_saas_zip", productId: "prod_nextjs_saas", name: "Source Code (ZIP)", type: AssetType.FILE, fileUrl: "/secure-downloads/saas-boilerplate-v1.zip", linkUrl: null },
            { id: "asset_saas_docs", productId: "prod_nextjs_saas", name: "Dokumentasi Online", type: AssetType.LINK, fileUrl: null, linkUrl: "https://docs.mystore.com/saas-boilerplate" }
        ]
    },
    {
        id: "prod_pos_electron",
        name: "Aplikasi Kasir (POS) Desktop dengan Electron & React",
        slug: "aplikasi-kasir-pos-desktop-electron-react",
        description: "Source code aplikasi kasir offline-first dengan sinkronisasi cloud otomatis. Sangat cocok untuk bisnis ritel, cafe, dan UMKM.",
        price: 750000,
        isPublished: true,
        isFeatured: false,
        salesCount: 210,   // WINNER: Best Seller di Kategori 1
        deletedAt: null,
        averageRating: 4.9,
        reviewCount: 1,
        categoryId: "cat_1",
        coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_pos_1", productId: "prod_pos_electron", url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_pos_zip", productId: "prod_pos_electron", name: "Full Repository Source (ZIP)", type: AssetType.FILE, fileUrl: "/secure-downloads/pos-electron.zip", linkUrl: null }
        ]
    },
    {
        id: "prod_laravel_api",
        name: "RESTful API Boilerplate Laravel 11 dengan RajaOngkir",
        slug: "restful-api-boilerplate-laravel-11-rajaongkir",
        description: "Starter kit API Laravel tangguh yang sudah terintegrasi dengan modul pengiriman RajaOngkir, manajemen JWT, dan arsitektur repositori clean code.",
        price: 199000,
        isPublished: true,
        isFeatured: false,
        salesCount: 88,
        deletedAt: null,
        averageRating: 4.5,
        reviewCount: 0,
        categoryId: "cat_1",
        coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_laravel_1", productId: "prod_laravel_api", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_laravel_zip", productId: "prod_laravel_api", name: "Laravel Boilerplate", type: AssetType.FILE, fileUrl: "/secure-downloads/laravel-api.zip", linkUrl: null }
        ]
    },

    // --- KATEGORI 2: E-BOOKS & GUIDES ---
    {
        id: "prod_ebook_prisma",
        name: "E-Book: Master Next.js & Prisma untuk Pemula",
        slug: "ebook-master-nextjs-prisma-untuk-pemula",
        description: "Buku panduan lengkap membangun aplikasi web modern berskala produksi dari nol. Dipandu langkah demi langkah hingga proses deployment.",
        price: 149000,
        isPublished: true,
        isFeatured: false,
        salesCount: 420,   // WINNER: Best Seller di Kategori 2
        deletedAt: null,
        averageRating: 5.0,
        reviewCount: 1,
        categoryId: "cat_2",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_3", productId: "prod_ebook_prisma", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_ebook_pdf", productId: "prod_ebook_prisma", name: "E-Book PDF Version", type: AssetType.FILE, fileUrl: "/secure-downloads/master-nextjs-prisma.pdf", linkUrl: null }
        ]
    },
    {
        id: "prod_ebook_css",
        name: "E-Book: Merajai CSS Grid & Flexbox Tanpa Stres",
        slug: "ebook-merajai-css-grid-flexbox-tanpa-stres",
        description: "Visual book yang membedah properti CSS Layouting paling ditakuti frontend developer dengan analogi dunia nyata dan cheat-sheet interaktif.",
        price: 99000,
        isPublished: true,
        isFeatured: true, // Tampil di bagian promo / featured
        salesCount: 310,
        deletedAt: null,
        averageRating: 4.7,
        reviewCount: 0,
        categoryId: "cat_2",
        coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_css_1", productId: "prod_ebook_css", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_ebook_css", productId: "prod_ebook_css", name: "CSS Guide PDF", type: AssetType.FILE, fileUrl: "/secure-downloads/css-grid-flexbox.pdf", linkUrl: null }
        ]
    },
    {
        id: "prod_guide_freelance",
        name: "Panduan Menembus Klien Dollar di Upwork & Fiverr",
        slug: "panduan-menembus-klien-dollar-di-upwork-fiverr",
        description: "Strategi praktis menulis proposal, menyusun portofolio yang menjual, dan cara bernegosiasi agar rate kerja lu dihargai tinggi oleh klien luar negeri.",
        price: 185000,
        isPublished: true,
        isFeatured: false,
        salesCount: 195,
        deletedAt: null,
        averageRating: 4.9,
        reviewCount: 0,
        categoryId: "cat_2",
        coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_free_1", productId: "prod_guide_freelance", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_freelance_pdf", productId: "prod_guide_freelance", name: "Freelance Guide Book", type: AssetType.FILE, fileUrl: "/secure-downloads/upwork-fiverr-guide.pdf", linkUrl: null }
        ]
    },

    // --- KATEGORI 3: DESIGN ASSETS & UI KITS ---
    {
        id: "prod_ui_kit",
        name: "Figma UI Kit Dashboard Admin Pro",
        slug: "figma-ui-kit-dashboard-admin-pro",
        description: "Sistem desain dashboard premium dengan 100+ komponen varian, mode gelap/terang otomatis, dan 20+ contoh halaman siap pakai.",
        price: 299000,
        isPublished: true,
        isFeatured: false,
        salesCount: 154,
        deletedAt: null,
        averageRating: 4.6,
        reviewCount: 0,
        categoryId: "cat_3",
        coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2bP24Z-Mbk844fMnd_FwOSkoxMTs588QGKLt9O-X0a10qGJ71WJ_Dd-8&s=10",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_4", productId: "prod_ui_kit", url: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_figma_link", productId: "prod_ui_kit", name: "Akses File Figma", type: AssetType.LINK, fileUrl: null, linkUrl: "https://figma.com/file/dashboard-admin-pro" }
        ]
    },
    {
        id: "prod_saas_landing_kit",
        name: "SaaS Landing Page Design System Mobile & Web",
        slug: "saas-landing-page-design-system-mobile-web",
        description: "UI Kit Figma khusus halaman konversi tinggi (Landing Page) startup teknologi. Tinggal drag-and-drop untuk merakit konsep web yang bersih.",
        price: 249000,
        isPublished: true,
        isFeatured: true, // Tampil di banner utama
        salesCount: 289,   // WINNER: Best Seller di Kategori 3
        deletedAt: null,
        averageRating: 4.9,
        reviewCount: 0,
        categoryId: "cat_3",
        coverImage: "https://static.vecteezy.com/system/resources/thumbnails/054/876/032/small/mirror-image-snow-capped-mountain-peaks-reflected-in-pristine-lake-free-photo.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_saas_kit_1", productId: "prod_saas_landing_kit", url: "https://images.unsplash.com/photo-1541462608141-ad4979e408c9?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_saas_landing_figma", productId: "prod_saas_landing_kit", name: "Link File Figma", type: AssetType.LINK, fileUrl: null, linkUrl: "https://figma.com/file/saas-landing-kit" }
        ]
    },
    {
        id: "prod_icon_3d_pack",
        name: "3D Premium Icon Pack untuk Aplikasi FinTech",
        slug: "3d-premium-icon-pack-untuk-aplikasi-fintech",
        description: "Koleksi 50+ ikon 3D resolusi tinggi dalam format PNG & Blender (.blend). Desain bertema investasi, dompet digital, crypto, dan perbankan modern.",
        price: 125000,
        isPublished: true,
        isFeatured: false,
        salesCount: 112,
        deletedAt: null,
        averageRating: 4.4,
        reviewCount: 0,
        categoryId: "cat_3",
        coverImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [
            { id: "med_icon_1", productId: "prod_icon_3d_pack", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600", type: MediaType.IMAGE, sortOrder: 0 }
        ],
        digitalAssets: [
            { id: "asset_icon_zip", productId: "prod_icon_3d_pack", name: "High-Res Assets & Blender Files (ZIP)", type: AssetType.FILE, fileUrl: "/secure-downloads/3d-icons-fintech.zip", linkUrl: null }
        ]
    }
];

// 4. DATA REVIEWS
export const MOCK_REVIEWS = [
    {
        id: "rev_1",
        rating: 5,
        comment: "Keren banget boilerplatenya! Hemat waktu berhari-hari buat setup auth sama payment.",
        userId: "user_customer_1",
        productId: "prod_nextjs_saas",
        createdAt: new Date()
    },
    {
        id: "rev_2",
        rating: 5,
        comment: "Penjelasannya di e-book ini daging semua, gampang dipahami buat pemula.",
        userId: "user_customer_1",
        productId: "prod_ebook_prisma",
        createdAt: new Date()
    }
];