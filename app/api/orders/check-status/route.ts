import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/orders/check-status?order_id=...
 * Mengecek status pesanan terkini dari database yang diupdate via Webhook Xendit.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const orderId = searchParams.get("order_id");

        if (!orderId) {
            return NextResponse.json({ error: "Parameter order_id wajib diisi" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                status: true,
                totalAmount: true,
                paymentMethod: true,
                updatedAt: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({
            order_id: order.id,
            status: order.status,
            total_amount: order.totalAmount,
            payment_method: order.paymentMethod,
            updated_at: order.updatedAt,
        });
    } catch (error: any) {
        console.error("Error pada check-status route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



