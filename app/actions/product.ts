'use server'

import { prisma } from '@/lib/db'

export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { 
                media: true, 
                digitalAssets: true,
                category: true
            }
        });
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
