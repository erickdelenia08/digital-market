import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createXenditPaymentRequest } from '@/lib/xendit';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Akses ditolak. Silakan login terlebih dahulu.' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { method, amount, selectedIds } = body;

        if (!method) {
            return NextResponse.json({ message: 'Metode pembayaran wajib dipilih.' }, { status: 400 });
        }

        // 1. Ambil data keranjang pengguna dari DB
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ message: 'Keranjang belanja Anda kosong.' }, { status: 400 });
        }

        // Filter items berdasarkan selectedIds jika dikirimkan oleh frontend
        const targetItems = (Array.isArray(selectedIds) && selectedIds.length > 0)
            ? cart.items.filter((item) => selectedIds.includes(item.productId))
            : cart.items;

        if (targetItems.length === 0) {
            return NextResponse.json({ message: 'Tidak ada produk yang dipilih untuk di-checkout.' }, { status: 400 });
        }

        let calculatedTotal = 0;
        const orderItemsData: { productId: string; price: number }[] = [];
        const deleteItemIds: string[] = [];

        for (const item of targetItems) {
            if (!item.product.isPublished) {
                return NextResponse.json({ message: `Produk "${item.product.name}" sudah tidak tersedia.` }, { status: 400 });
            }

            const price = item.product.price;
            calculatedTotal += price;

            orderItemsData.push({
                productId: item.productId,
                price: price,
            });

            deleteItemIds.push(item.id);
        }

        const finalAmount = amount ? Number(amount) : calculatedTotal;

        // 2. Buat Draf Order & Hapus Item dari Cart via Transaction
        const newOrder = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount: finalAmount,
                    status: 'PENDING',
                    paymentMethod: method,
                    items: {
                        create: orderItemsData,
                    },
                },
            });

            // Hapus item dari cart yang sudah masuk ke order
            await tx.cartItem.deleteMany({
                where: {
                    id: { in: deleteItemIds },
                },
            });

            return order;
        });

        // 3. Request ke Xendit Payment Request V2
        const paymentRes = await createXenditPaymentRequest({
            referenceId: newOrder.id,
            amount: finalAmount,
            method: method,
            customerName: session.user.name || 'Digital Store Customer',
            customerEmail: session.user.email || 'customer@example.com',
            description: `Pembayaran Akses Produk Digital #${newOrder.id.substring(0, 8).toUpperCase()}`,
        });

        // 4. Update Order dengan Xendit Payment Request ID
        await prisma.order.update({
            where: { id: newOrder.id },
            data: {
                xenditInvoiceId: paymentRes.id,
            },
        });

        return NextResponse.json({
            order_id: newOrder.id,
            qr_string: paymentRes.qr_string,
            deeplink_url: paymentRes.deeplink_url,
            account_number: paymentRes.account_number,
            status: newOrder.status,
            reference_id: paymentRes.reference_id,
        });

    } catch (error: any) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ message: error.message || 'Gagal memproses checkout Xendit.' }, { status: 500 });
    }
}