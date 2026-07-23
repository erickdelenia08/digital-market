"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createXenditPaymentRequest } from "@/lib/xendit";

interface CreatePaymentResult {
    error?: string;
    payment?: {
        id: string;
        orderId: string
        status: string;
        expiresAt?: Date | null;
        qrString?: string | null;
        deeplinkUrl?: string | null;
        accountNumber?: string | null;
    };
}

// Helper Best Practice Expired Time
function getExpiryMinutesByMethod(method: string): number {
    const methodLower = method.toLowerCase();
    if (["qris", "gopay", "ovo", "dana", "shopeepay"].includes(methodLower)) {
        return 10; // untuk QRIS & E-Wallet
    }
    if (["bca", "bni", "bri", "mandiri", "permata"].includes(methodLower)) {
        return 30; // untuk Virtual Account
    }
    return 60;
}

export async function createPayment(
    orderId: string,
    method: string
): Promise<CreatePaymentResult> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // ===========================
    // 1. Ambil Order
    // ===========================
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
        include: {
            payments: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });

    // console.log('hasi pencarian orderrrr ', order);


    if (!order) {
        return { error: "Order tidak ditemukan." };
    }

    if (order.status !== "PENDING") {
        return { error: "Order sudah tidak dapat dibayar." };
    }

    // ===========================
    // 2. Reuse Pending Payment (Idempotency)
    // ===========================
    const latestPayment = order.payments[0];

    if (
        latestPayment &&
        latestPayment.status === "PENDING" &&
        latestPayment.expiresAt &&
        latestPayment.expiresAt > new Date()
    ) {
        // Langsung ambil dari kolom Prisma (Type-safe & Rapi)
        return {
            payment: {
                id: latestPayment.id,
                orderId: order.id,
                status: latestPayment.status,
                expiresAt: latestPayment.expiresAt,
                qrString: latestPayment.qrString,
                deeplinkUrl: latestPayment.deeplinkUrl,
                accountNumber: latestPayment.accountNumber,
            },
        };
    }

    // ===========================
    // 3. Request ke Xendit
    // ===========================
    const uniqueReferenceId = `${order.id}-${Date.now()}`;
    const expiresInMinutes = getExpiryMinutesByMethod(method);

    try {
        // console.log('paymentMethod ', method);
        // console.log('berikut total amount ', Number(order.totalAmount));

        const paymentRes = await createXenditPaymentRequest({
            referenceId: uniqueReferenceId,
            totalAmount: Number(order.totalAmount),
            method,
            customerName: session.user.name ?? "Customer",
            customerEmail: session.user.email ?? "customer@example.com",
            description: `Order #${order.id.substring(0, 8).toUpperCase()}`,
            expiresInMinutes,
        });

        // console.log('payment responseee ', paymentRes);
        // console.log('payment responseee ', paymentRes.id);


        // ===========================
        // 4. Simpan ke DB (Eksplisit per Kolom)
        // ===========================
        const payment = await prisma.payment.create({
            data: {
                orderId: order.id,
                xenditPaymentId: paymentRes.id,
                xenditReferenceId: uniqueReferenceId,
                paymentMethod: method.toUpperCase(),
                status: "PENDING",

                // Simpan langsung ke kolom masing-masing
                accountNumber: paymentRes.account_number || null,
                qrString: paymentRes.qr_string || null,
                deeplinkUrl: paymentRes.deeplink_url || null,

                expiresAt: paymentRes.expires_at ? new Date(paymentRes.expires_at) : null,
            },
        });

        // console.log('payment yang berhasil di simpan ', payment);


        return {
            payment: {
                id: payment.id,
                orderId: order.id,
                status: payment.status,
                expiresAt: payment.expiresAt,
                qrString: payment.qrString,
                deeplinkUrl: payment.deeplinkUrl,
                accountNumber: payment.accountNumber,
            },
        };
    } catch (error: any) {
        console.error("Error creating payment:", error);
        return {
            error: error.message || "Gagal memproses pembayaran.",
        };
    }
}