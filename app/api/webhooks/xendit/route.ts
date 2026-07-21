import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

/**
 * POST /api/webhooks/xendit
 * Menerima callback status transaksi otomatis dari Xendit (Invoice & Payment Requests API V2/V3).
 */
export async function POST(req: Request) {
    try {
        const callbackToken = process.env.XENDIT_CALLBACK_TOKEN;
        const incomingToken = req.headers.get("x-callback-token");

        // Pengamanan Token: Pastikan request benar-benar datang dari server resmi Xendit
        if (callbackToken && incomingToken !== callbackToken) {
            console.warn("Request tidak dikenal. Token callback tidak sesuai.");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const payload = await req.json();
        console.log("Xendit Webhook Payload diterima:", JSON.stringify(payload, null, 2));

        // Format Payment Request V2/V3 bisa membungkus data dalam object 'data'
        const dataObj = payload.data || payload;

        // Ekstraksi ID Referensi (Order ID) dari berbagai kemungkinan field Xendit
        const referenceId =
            dataObj.reference_id ||
            payload.reference_id ||
            dataObj.external_id ||
            payload.external_id ||
            dataObj.id ||
            payload.id;

        // Ekstraksi Status Pembayaran
        const rawStatus = (dataObj.status || payload.status || payload.event || "").toUpperCase();
        console.log(`Webhook Xendit untuk ID ${referenceId} - Status: ${rawStatus}`);

        if (!referenceId) {
            console.warn("Kolom reference_id/external_id tidak ditemukan. Mengabaikan event ini (mungkin test webhook).");
            return NextResponse.json({ success: true, message: "Ignored: No reference_id" });
        }

        // Cari pesanan di database berdasarkan Order ID (atau xenditInvoiceId)
        let order = await prisma.order.findUnique({
            where: { id: referenceId },
            include: { items: true },
        });

        if (!order) {
            // Fallback cari via xenditInvoiceId
            order = await prisma.order.findFirst({
                where: { xenditInvoiceId: referenceId },
                include: { items: true },
            });
        }

        if (!order) {
            console.warn(`Pesanan dengan ID ${referenceId} tidak ditemukan. Mengabaikan event ini (mungkin test webhook).`);
            return NextResponse.json({ success: true, message: "Ignored: Order not found" });
        }

        const paymentMethod =
            dataObj.payment_method?.type ||
            dataObj.channel_code ||
            payload.payment_method ||
            payload.payment_channel ||
            order.paymentMethod ||
            "UNKNOWN";

        // Daftar status sukses dari Xendit
        const isSuccess = [
            "PAID",
            "SETTLED",
            "SUCCEEDED",
            "COMPLETED",
            "PAYMENT.CAPTURE",
            "PAYMENT_REQUEST.SUCCEEDED",
        ].includes(rawStatus);

        // Daftar status gagal / kedaluwarsa dari Xendit
        const isExpiredOrFailed = [
            "EXPIRED",
            "FAILED",
            "CANCELLED",
            "PAYMENT_REQUEST.FAILED",
            "PAYMENT_REQUEST.EXPIRED",
        ].includes(rawStatus);

        if (isSuccess) {
            if (order.status === OrderStatus.PENDING) {
                await prisma.$transaction(async (tx) => {
                    // 1. Update status pesanan ke COMPLETED
                    await tx.order.update({
                        where: { id: order.id },
                        data: {
                            status: OrderStatus.COMPLETED,
                            paymentMethod: String(paymentMethod),
                            paymentLog: payload,
                        },
                    });

                    // 2. Tambahkan produk ke UserLibrary untuk akses otomatis
                    for (const item of order.items) {
                        await tx.userLibrary.upsert({
                            where: {
                                userId_productId: {
                                    userId: order.userId,
                                    productId: item.productId,
                                },
                            },
                            create: {
                                userId: order.userId,
                                productId: item.productId,
                                orderId: order.id,
                            },
                            update: {
                                orderId: order.id,
                            },
                        });
                    }
                });

                console.log(`Pesanan #${order.id} sukses terbayar. Status diubah ke COMPLETED & UserLibrary di-update.`);
            }
        } else if (isExpiredOrFailed) {
            if (order.status === OrderStatus.PENDING) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: OrderStatus.CANCELLED,
                        paymentLog: payload,
                    },
                });
                console.log(`Tagihan pesanan #${order.id} kedaluwarsa/gagal. Status diubah ke CANCELLED.`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saat memproses Webhook Xendit:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}