import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getLatestBlogs = unstable_cache(
    async () => {
        return await prisma.post.findMany({
            where: {
                published: true,
            },
            include: {
                author: true,
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 3,
        });
    },
    ["latest-blogs"],
    {
        revalidate: 3600,
        tags: ["latest-blogs"],
    }
);


export const getBlogCategories = unstable_cache(
    async () => {
        return prisma.postCategory.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
            },
            orderBy: {
                name: "asc",
            },
        });
    },
    ["blog-categories"],
    {
        revalidate: 3600,
        tags: ["blog-categories"],
    }
);


export const getBlogPosts = unstable_cache(
    async () => {
        return prisma.post.findMany({
            where: {
                published: true,
            },
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
                relatedProduct: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                publishedAt: "desc",
            },
        });
    },
    ["blog-posts"],
    {
        revalidate: 3600,
        tags: ["blog-posts"],
    }
);