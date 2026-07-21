import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { OrderStatus } from "@prisma/client"

/**
 * POST /api/webhooks/xendit
 * Menerima callback status transaksi otomatis dari Xendit.
 */
export async function POST(req: Request) {
    try {
        const callbackToken = process.env.XENDIT_CALLBACK_TOKEN
        const incomingToken = req.headers.get("x-callback-token")

        // Pengamanan Token: Pastikan request benar-benar datang dari server resmi Xendit
        if (callbackToken && incomingToken !== callbackToken) {
            console.warn("Request tidak dikenal. Token callback tidak sesuai.")
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const payload = await req.json()
        console.log("Xendit Webhook Payload diterima:", payload)

        const { external_id, status } = payload

        console.log('ini statusnya: ', status);

        if (!external_id) {
            return NextResponse.json({ error: "Kolom external_id tidak ditemukan" }, { status: 400 })
        }

        // Cari pesanan di database kita
        const order = await prisma.order.findUnique({
            where: { id: external_id },
        })

        if (!order) {
            console.warn(`Pesanan dengan ID ${external_id} tidak ditemukan.`)
            return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 })
        }

        const paymentMethod = payload.payment_method || payload.payment_channel || "UNKNOWN"

        // Perbarui status pesanan dan log pembayaran berdasarkan notifikasi dari Xendit
        if (status === "PAID" || status === "SETTLED") {
            if (order.status === OrderStatus.PENDING) {
                await prisma.order.update({
                    where: { id: external_id },
                    data: {
                        status: OrderStatus.COMPLETED,
                        paymentMethod,
                        paymentLog: payload,
                    },
                })
                console.log(`Pesanan #${external_id} sukses terbayar. Status diubah ke COMPLETED.`)
            }
        } else if (status === "EXPIRED") {
            if (order.status === OrderStatus.PENDING) {
                await prisma.order.update({
                    where: { id: external_id },
                    data: {
                        status: OrderStatus.CANCELLED,
                        paymentLog: payload,
                    },
                })
                console.log(`Tagihan pesanan #${external_id} kedaluwarsa. Status diubah ke CANCELLED.`)
            }
        }

        // Kembalikan respon sukses HTTP 200 agar Xendit tahu notifikasi telah berhasil kita proses
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error saat memproses Webhook Xendit:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}