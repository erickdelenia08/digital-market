// app/actions/payment.ts
"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createXenditInvoice } from "@/lib/xendit"

export interface PaymentLinkResult {
    success?: string
    error?: string
    url?: string
}

/**
 * Server Action untuk membuat link pembayaran Xendit dari order id (Re-generate Invoice).
 */
export async function createPaymentLink(orderId: string): Promise<PaymentLinkResult> {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: "Akses ditolak. Silakan login terlebih dahulu." }
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        })

        if (!order) {
            return { error: "Pesanan tidak ditemukan." }
        }

        // Validasi kepemilikan pesanan: hanya pemilik atau ADMIN yang boleh melakukan pembayaran
        if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
            return { error: "Akses ditolak. Kredensial tidak sesuai dengan pemilik pesanan." }
        }

        if (order.status !== "PENDING") {
            return { error: `Pembayaran tidak valid. Status pesanan saat ini adalah ${order.status.toLowerCase()}.` }
        }

        const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

        // Sesuaikan redirect URL dengan routing produk digitalmu
        const successUrl = `${appUrl}/orders/${order.id}/success`
        const failureUrl = `${appUrl}/orders/${order.id}`

        const amount = Number(order.totalAmount)
        const invoice = await createXenditInvoice({
            externalId: order.id,
            amount,
            payerEmail: order.user.email || "customer@example.com",
            description: `Pembayaran Akses Produk Digital Pesanan #${order.id.substring(0, 8).toUpperCase()}`,
            successRedirectUrl: successUrl,
            failureRedirectUrl: failureUrl,
        })

        // UPDATE database dengan Xendit Invoice ID yang baru agar sinkron saat webhook masuk
        await prisma.order.update({
            where: { id: order.id },
            data: { xenditInvoiceId: invoice.id },
        })

        return {
            success: "Link pembayaran berhasil dibuat!",
            url: invoice.invoice_url,
        }
    } catch (error) {
        console.error("Error pada Server Action createPaymentLink:", error)
        return { error: "Gagal membuat link pembayaran. Silakan coba beberapa saat lagi." }
    }
}