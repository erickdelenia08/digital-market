"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cancelXenditPaymentRequest } from "@/lib/xendit";

export async function cancelPayment(paymentId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const payment = await prisma.payment.findUnique({
        where: { id: paymentId }
    });

    if (!payment || !payment.xenditPaymentId) {
        return { error: "Data pembayaran tidak ditemukan." };
    }

    try {
        // Panggil pembatalan ke Xendit dari Server
        const xenditRes = await cancelXenditPaymentRequest(payment.xenditPaymentId);

        // Update status di DB Prisma
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: "CANCELLED" }
        });

        console.log("ini xendit res", xenditRes);

        return { success: true, data: xenditRes };
    } catch (error: any) {
        return { error: error.message || "Gagal membatalkan pembayaran di Xendit." };
    }
}