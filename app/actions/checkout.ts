"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface CreateOrderResult {
    orderId?: string;
    error?: string;
}

export async function createOrderFromCart(
    selectedProductIds: string[]
): Promise<CreateOrderResult> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    if (selectedProductIds.length === 0) {
        return { error: "Pilih minimal satu produk." };
    }

    const userId = session.user.id;

    return await prisma.$transaction(async (tx) => {
        // Ambil cart item yang dipilih user
        const cartItems = await tx.cartItem.findMany({
            where: {
                cart: {
                    userId,
                },
                productId: {
                    in: selectedProductIds,
                },
            },
            include: {
                product: true,
            },
        });

        if (cartItems.length !== selectedProductIds.length) {
            return {
                error: "Produk tidak valid.",
            };
        }

        // Produk sudah dimiliki?
        const ownedProducts = await tx.userLibrary.findMany({
            where: {
                userId,
                productId: {
                    in: selectedProductIds,
                },
            },
        });

        if (ownedProducts.length > 0) {
            return {
                error: "Salah satu produk sudah ada di library.",
            };
        }

        // Cari order pending user
        const pendingOrders = await tx.order.findMany({
            where: {
                userId,
                status: "PENDING",
            },
            include: {
                items: true,
            },
        });

        const selected = [...selectedProductIds].sort();

        const existingOrder = pendingOrders.find((order) => {
            const products = order.items
                .map((item) => item.productId)
                .sort();

            return (
                products.length === selected.length &&
                products.every((id, index) => id === selected[index])
            );
        });

        if (existingOrder) {
            return {
                orderId: existingOrder.id,
            };
        }

        let totalAmount = 0;

        const orderItems = [];

        for (const item of cartItems) {
            if (!item.product.isPublished) {
                return {
                    error: `${item.product.name} sudah tidak tersedia.`,
                };
            }

            totalAmount += item.product.price;

            orderItems.push({
                productId: item.productId,
                productName: item.product.name, // kalau nanti ditambah
                price: item.product.price,
            });
        }

        const order = await tx.order.create({
            data: {
                userId,
                totalAmount,
                status: "PENDING",
                items: {
                    create: orderItems,
                },
            },
        });

        return {
            orderId: order.id,
        };
    });
}