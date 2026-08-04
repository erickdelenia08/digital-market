import BlogClient from "./blog-client";
import { Metadata } from "next";
import { getBlogCategories, getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
    title: "Blog & Tutorials", // Otomatis jadi "Blog & Tutorials | Codegraph" via template layout
    description: "Insights, tutorials, and updates on digital assets, Canva design tips, and Excel productivity tools from Codegraph.",
    keywords: [
        "Codegraph blog",
        "Canva tutorials",
        "Excel tips",
        "digital asset guide",
        "design templates tutorial"
    ],
    openGraph: {
        title: "Blog & Tutorials | Codegraph",
        description: "Discover insights, tutorials, and productivity guides on digital assets, Canva, and Excel.",
        url: "/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog & Tutorials | Codegraph",
        description: "Discover insights, tutorials, and productivity guides from Codegraph.",
    },
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
    const [
        categories,
        posts
    ] = await Promise.all([
        getBlogCategories(),
        getBlogPosts(),
    ]);

    const mappedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        publishedAt: post.publishedAt,
        viewsCount: post.viewsCount,
        author: {
            name: post.author?.name || "Author",
            avatarInitials: post.author?.name ? post.author.name.substring(0, 2).toUpperCase() : "AU",
        },
        category: post.category,
        relatedProduct: post.relatedProduct ? { id: post.relatedProduct.id, title: post.relatedProduct.name } : null
    }));

    const featuredPost = mappedPosts.length > 0 ? mappedPosts[0] : null;
    const initialPosts = mappedPosts.slice(1);

    return (
        <BlogClient
            initialPosts={initialPosts}
            categories={categories}
            featuredPost={featuredPost}
        />
    );
}