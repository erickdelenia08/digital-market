import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

async function fetchProductBySlug(slug: string) {
    return await prisma.product.findUnique({
        where: { slug },
        include: {
            media: true,
            digitalAssets: true,
            category: true,
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
}


export async function getProductBySlug(slug: string) {
    try {
        return await unstable_cache(
            () => fetchProductBySlug(slug),
            ["product", slug],
            {
                revalidate: 3600,
                tags: [`product-${slug}`],
            }
        )();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}



export async function getFeaturedProducts() {
    return unstable_cache(
        async () => {
            return prisma.product.findMany({
                where: {
                    isPublished: true,
                    isFeatured: true,
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 4,
            });
        },
        ["featured-products"],
        {
            revalidate: 3600,
            tags: ["featured-products"],
        }
    )();
}