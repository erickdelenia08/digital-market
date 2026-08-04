import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getBlogCategories } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://codegraph.com';
interface BlogCategory {
    id: string | number;
    slug?: string;
    updatedAt?: Date | string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Fetch Dynamic Data concurrently for maximum performance
    const [products, categories, blogCategories] = await Promise.all([
        prisma.product.findMany({
            where: { isPublished: true },
            select: {
                id: true,
                slug: true, // Gunakan slug atau id sesuai URL produk kamu
                updatedAt: true,
            },
        }),
        prisma.category.findMany({
            select: {
                id: true,
                slug: true,
            },
        }),
        getBlogCategories(), // Memanggil fungsi helper blog milikmu
    ]);

    // 2. Map Products to Sitemap URLs
    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${BASE_URL}/products/${product.slug || product.id}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // 3. Map Store Categories to Sitemap URLs
    const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${BASE_URL}/categories/${cat.slug || cat.id}`,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // 4. Map Blog Categories to Sitemap URLs
    const blogCategoryUrls: MetadataRoute.Sitemap = blogCategories.map((blogCat: BlogCategory) => ({
        url: `${BASE_URL}/blog/category/${blogCat.slug || blogCat.id}`,
        lastModified: blogCat.updatedAt ? new Date(blogCat.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // 5. Static Core Pages (Customer Side ONLY - Admin pages excluded!)
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Combine static and all dynamic routes
    return [
        ...staticPages,
        ...productUrls,
        ...categoryUrls,
        ...blogCategoryUrls,
    ];
}