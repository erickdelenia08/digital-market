'use server'

import { prisma } from '@/lib/db'

export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: slug },
            include: {
                media: true,
                digitalAssets: true,
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: { id: true, name: true, image: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
