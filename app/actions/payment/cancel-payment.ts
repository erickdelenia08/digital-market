"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function cancelPendingPayment(orderId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // Ubah status semua payment PENDING milik order ini menjadi CANCELLED
        await prisma.payment.updateMany({
            where: {
                orderId: orderId,
                status: "PENDING",
            },
            data: {
                status: "FAILED",
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Gagal membatalkan payment:", error);
        return { error: "Gagal memperbarui status pembayaran." };
    }
}