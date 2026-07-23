"use server";

import { prisma } from "@/lib/db";

export async function checkOrderStatus(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                status: true,
                payments: {
                    select: { status: true },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        if (!order) return { success: false, status: "NOT_FOUND" };

        const latestPaymentStatus = order.payments[0]?.status;

        // Cek apakah Order / Payment sudah berhasil
        const isPaid =
            order.status === "COMPLETED" ||
            latestPaymentStatus === "PAID"
        //   latestPaymentStatus === "SETTLED";

        return {
            success: true,
            isPaid,
            status: order.status,
        };
    } catch (error) {
        console.error("Error checking order status:", error);
        return { success: false, isPaid: false };
    }
}