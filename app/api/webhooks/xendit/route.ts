import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OrderStatus, PaymentStatus } from "@prisma/client";

/**
 * POST /api/webhooks/xendit
 * Menerima callback status transaksi otomatis dari Xendit
 */
export async function POST(req: Request) {
    try {
        const callbackToken = process.env.XENDIT_CALLBACK_TOKEN;
        const incomingToken = req.headers.get("x-callback-token");

        // 1. Pengamanan Token Callback
        if (callbackToken && incomingToken !== callbackToken) {
            console.warn("Request tidak dikenal. Token callback tidak sesuai.");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const payload = await req.json();
        console.log("Xendit Webhook Payload diterima:", JSON.stringify(payload, null, 2));

        const dataObj = payload.data || payload;

        // 2. Ekstraksi ID Referensi (Order ID)
        const referenceId =
            dataObj.reference_id ||
            payload.reference_id ||
            dataObj.external_id ||
            payload.external_id;


        // const referenceId = payload.data.reference_id;   // e.g. "d9966e69...-1784795145757"
        const paymentId = payload.data.payment_id || payload.data.payment_request_id

        if (!referenceId) {
            console.log('tidak ditemukan reference id', referenceId);

            console.warn("Kolom reference_id/external_id tidak ditemukan. Mengabaikan event ini.");
            return NextResponse.json({ success: true, message: "Ignored: No reference_id" });
        }

        const payment = await prisma.payment.findFirst({
            where: {
                OR: [
                    { xenditReferenceId: referenceId },
                    { xenditPaymentId: paymentId },
                ],
            },
            include: {
                order: {
                    include: { items: true },
                },
            },
        });

        if (!payment || !payment.order) {
            console.error(`Pesanan dengan Reference ID ${referenceId} tidak ditemukan.`);
            return;
        }

        const order = payment.order;
        const latestPayment = payment;


        // // 3. Cari Order dan Payment Terkait di Database
        // const order = await prisma.order.findUnique({
        //     where: { id: referenceId },
        //     include: {
        //         items: true,
        //         payments: {
        //             orderBy: { createdAt: "desc" },
        //             take: 1,
        //         },
        //     },
        // });

        console.log('order yang ditemukan', order);


        if (!order) {
            console.log('tidaakkk ditemukan order');

            console.warn(`Pesanan dengan ID ${referenceId} tidak ditemukan.`);
            return NextResponse.json({ success: true, message: "Ignored: Order not found" });
        }


        const rawStatus = (dataObj.status || payload.status || payload.event || "").toUpperCase();
        // 4. Kategori Status dari Xendit
        const isSuccess = [
            "PAID",
            "SETTLED",
            "SUCCEEDED",
            "COMPLETED",
            "PAYMENT.CAPTURE",
            "PAYMENT_REQUEST.SUCCEEDED",
        ].includes(rawStatus);

        const isExpired = [
            "EXPIRED",
            "PAYMENT_REQUEST.EXPIRED",
        ].includes(rawStatus);

        const isFailed = [
            "FAILED",
            "CANCELLED",
            "PAYMENT_REQUEST.FAILED",
        ].includes(rawStatus);

        // const latestPayment = order.payments[0];

        // 5. Eksekusi Pembayaran SUKSES
        console.log('INI rawStatus', rawStatus);

        if (isSuccess) {
            console.log('pembayaran suksesss');
            if (order.status !== OrderStatus.COMPLETED) {
                console.log('INI order.status', order.status);
                console.log('otwwww update ke completed');

                await prisma.$transaction(async (tx) => {
                    // A. Update Status Order -> COMPLETED
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: OrderStatus.COMPLETED },
                    });

                    // B. Update Status Payment -> PAID
                    if (latestPayment) {
                        await tx.payment.update({
                            where: { id: latestPayment.id },
                            data: { status: PaymentStatus.PAID },
                        });
                    }

                    // C. Masukkan Produk ke UserLibrary (Akses Pembeli)
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

                console.log(`[SUCCESS] Pesanan #${order.id} terbayar. Status diubah ke COMPLETED & UserLibrary di-update.`);
            }
        }
        // 6. Eksekusi Pembayaran EXPIRED atau FAILED
        else if (isExpired) {
            if (order.status === OrderStatus.PENDING) {
                await prisma.$transaction(async (tx) => {
                    // A. Update Status Order -> CANCELLED
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: OrderStatus.CANCELLED },
                    });

                    // B. Update Status Payment -> EXPIRED / FAILED
                    if (latestPayment) {
                        await tx.payment.update({
                            where: { id: latestPayment.id },
                            data: {
                                status: PaymentStatus.EXPIRED,
                            },
                        });
                    }
                });

                console.log(`[CANCELLED] Pesanan #${order.id} dibatalkan karena payment ${rawStatus}.`);
            }
        }
        else if (isFailed) {
            if (order.status === OrderStatus.PENDING) {
                await prisma.$transaction(async (tx) => {
                    // A. Update Status Order -> CANCELLED
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: OrderStatus.CANCELLED },
                    });

                    // B. Update Status Payment -> EXPIRED / FAILED
                    if (latestPayment) {
                        await tx.payment.update({
                            where: { id: latestPayment.id },
                            data: {
                                status: PaymentStatus.CANCELLED,
                            },
                        });
                    }
                });

                console.log(`[CANCELLED] Pesanan #${order.id} dibatalkan karena payment ${rawStatus}.`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saat memproses Webhook Xendit:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}