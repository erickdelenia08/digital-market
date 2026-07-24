"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-user";
import { auth } from "@/lib/auth";

export interface CreateReviewInput {
    productId: string;
    rating: number; // 1 - 5
    comment?: string;
}

/**
 * Server Action: Membuat atau Memperbarui Ulasan Produk
 */
export async function createReview(input: CreateReviewInput) {
    try {
        const user = await getAuthUser();
        const { productId, rating, comment } = input;

        // 1. Validasi Input Rating
        if (rating < 1 || rating > 5) {
            return { success: false, error: "Rating harus bernilai antara 1 hingga 5." };
        }

        // 2. Syarat Utama: Cek apakah user sudah membeli produk (ada di UserLibrary)
        const hasAccess = await prisma.userLibrary.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId,
                },
            },
        });

        if (!hasAccess) {
            return {
                success: false,
                error: "Anda harus membeli produk ini terlebih dahulu untuk memberikan ulasan.",
            };
        }

        // 3. Gunakan Prisma Transaction untuk konsistensi data
        await prisma.$transaction(async (tx) => {
            // Upsert ulasan (Buat baru jika belum ada, atau update jika sudah pernah mengulas)
            await tx.review.upsert({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: productId,
                    },
                },
                update: {
                    rating,
                    comment: comment?.trim() || null,
                },
                create: {
                    userId: user.id,
                    productId,
                    rating,
                    comment: comment?.trim() || null,
                },
            });

            // Recalculate Denormalized Rating Data
            const aggregate = await tx.review.aggregate({
                where: { productId },
                _avg: { rating: true },
                _count: { rating: true },
            });

            const averageRating = aggregate._avg.rating || 0;
            const reviewCount = aggregate._count.rating || 0;

            // Update data denormalisasi di tabel Product
            await tx.product.update({
                where: { id: productId },
                data: {
                    averageRating: Number(averageRating.toFixed(1)),
                    reviewCount,
                },
            });
        });

        // Revalidate cache Halaman Produk
        revalidatePath(`/products/${productId}`);

        return { success: true, message: "Ulasan berhasil disimpan!" };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Gagal menyimpan ulasan. Silakan coba lagi.",
        };
    }
}

/**
 * Server Action: Menghapus Ulasan Produk
 */
export async function deleteReview(productId: string) {
    try {
        const user = await getAuthUser();

        await prisma.$transaction(async (tx) => {
            await tx.review.delete({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: productId,
                    }
                }
            });

            const aggregate = await tx.review.aggregate({
                where: { productId },
                _avg: { rating: true },
                _count: { rating: true },
            });

            const averageRating = aggregate._avg.rating || 0;
            const reviewCount = aggregate._count.rating || 0;

            await tx.product.update({
                where: { id: productId },
                data: {
                    averageRating: Number(averageRating.toFixed(1)),
                    reviewCount,
                },
            });
        });

        revalidatePath(`/products/${productId}`);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Gagal menghapus ulasan.",
        };
    }
}

/**
 * Server Action: Mengambil Semua Ulasan Berdasarkan Product ID
 */
export async function getProductReviews(productId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: { productId },
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
        });

        return { success: true, data: reviews };
    } catch (error) {
        return { success: false, error: "Gagal memuat ulasan produk." };
    }
}

export interface UserProductStatusResponse {
    hasPurchased: boolean;
    userReview: {
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        userId: string;
    } | null;
}

export async function getUserProductStatus(productId: string): Promise<UserProductStatusResponse> {
    try {

        const session = await auth();
        const userId = session?.user?.id;

        // Jika user belum login, return status default
        if (!userId) {
            return {
                hasPurchased: false,
                userReview: null,
            };
        }

        // 1. Cek Kepemilikan Produk di UserLibrary
        const libraryEntry = await prisma.userLibrary.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });

        const hasPurchased = !!libraryEntry;

        // 2. Cari Ulasan yang Pernah Dibuat User untuk Produk Ini
        const userReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                userId: true,
            },
        });

        return {
            hasPurchased,
            userReview,
        };
    } catch (error) {
        console.error("Error checking user product status:", error);
        return {
            hasPurchased: false,
            userReview: null,
        };
    }
}