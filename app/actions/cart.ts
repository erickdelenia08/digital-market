'use server'

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface CartActionResponse {
    success: boolean;
    error?: string;
}

export async function addToCart(
    userId: string,
    productId: string
): Promise<CartActionResponse> {
    try {
        // 1. Validasi apakah produk ada di katalog
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return { success: false, error: "Produk tidak ditemukan." };
        }

        // 2. VALIDASI KRUSIAL: Cek apakah user sudah pernah membeli produk ini sebelumnya
        const alreadyPurchased = await prisma.order.findFirst({
            where: {
                userId,
                status: 'COMPLETED',
                items: {
                    some: {
                        productId
                    }
                }
            }
        });

        if (alreadyPurchased) {
            return { success: false, error: "Kamu sudah memiliki produk ini. Silakan langsung unduh di riwayat pembelian." };
        }

        // 3. Ambil atau buat keranjang belanja untuk user tersebut
        let cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        // 4. Cek apakah produk sudah ada di dalam keranjang
        const alreadyInCart = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                }
            }
        });

        if (alreadyInCart) {
            return { success: false, error: "Produk sudah ada di dalam keranjang belanja kamu." };
        }

        // 5. Masukkan produk ke keranjang (Tanpa quantity / variant)
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
            },
        });

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error("Gagal menambahkan ke keranjang:", error);
        return { success: false, error: "Terjadi kesalahan pada server." };
    }
}

export async function getCart(userId: string) {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: { media: true }
                        }
                    }
                }
            }
        });
        return cart?.items || [];
    } catch (error) {
        console.error("Gagal mengambil keranjang:", error);
        return [];
    }
}

export async function getCartCountAction() {
    const session = await auth();
    if (!session?.user) return 0;

    const cart = await getCart(session.user.id);
    return cart.length;
}

export async function removeFromCartDB(userId: string, productId: string) {
    try {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) return { success: false, error: "Keranjang tidak ditemukan." };

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId
            }
        });

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error("Gagal menghapus dari keranjang:", error);
        return { success: false, error: "Terjadi kesalahan pada server." };
    }
}