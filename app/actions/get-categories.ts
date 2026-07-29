import { prisma } from "@/lib/db";

export async function getCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: "asc" },
        });
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}