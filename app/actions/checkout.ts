"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createXenditInvoice } from "@/lib/xendit"
import { revalidatePath } from "next/cache"
export interface CheckoutResult {
    success?: string
    error?: string
    url?: string
}

export async function checkoutCart(): Promise<CheckoutResult> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Akses ditolak. Silakan login terlebih dahulu." }
        }

        const userId = session.user.id

        // 1. Ambil data keranjang belanja pembeli
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        if (!cart || cart.items.length === 0) {
            return { error: "Keranjang belanja Anda kosong." }
        }

        // 2. Hitung total amount (Setiap item kuantitasnya pasti 1)
        let totalAmount = 0
        const orderItemsData: { productId: string; price: number }[] = []

        for (const item of cart.items) {
            // Pastikan produk masih aktif/published
            if (!item.product.isPublished) {
                return { error: `Produk ${item.product.name} sudah tidak tersedia.` }
            }

            const price = item.product.price
            totalAmount += price // Langsung tambah price tanpa dikali quantity

            orderItemsData.push({
                productId: item.productId,
                price: price,
            })
        }

        // 3. Daftarkan Order baru & bersihkan keranjang belanja via Database Transaction
        const newOrder = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: "PENDING",
                    items: {
                        create: orderItemsData,
                    },
                },
            })

            // Bersihkan keranjang belanja setelah sukses membuat draf order
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            })

            return order
        })

        // 4. Integrasi & Request URL Pembayaran Xendit Invoice
        const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
        const successUrl = `${appUrl}/orders/${newOrder.id}/success`
        const failureUrl = `${appUrl}/orders/${newOrder.id}`

        const invoice = await createXenditInvoice({
            externalId: newOrder.id,
            amount: totalAmount,
            payerEmail: session.user.email!,
            description: `Pembayaran Akses Produk Digital Pesanan #${newOrder.id.substring(0, 8).toUpperCase()}`,
            successRedirectUrl: successUrl,
            failureRedirectUrl: failureUrl,
        })

        // 5. Update Order dengan ID Invoice dari Xendit untuk keperluan callback webhook
        await prisma.order.update({
            where: { id: newOrder.id },
            data: { xenditInvoiceId: invoice.id },
        })

        revalidatePath("/cart")
        revalidatePath("/orders")

        return {
            success: "Pesanan berhasil dibuat!",
            url: invoice.invoice_url,
        }
    } catch (error) {
        console.error("Error pada checkoutCart:", error)
        return { error: "Terjadi kesalahan saat memproses checkout." }
    }
}