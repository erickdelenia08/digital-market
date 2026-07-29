// File: app/api/downloads/[assetId]/route.ts (Next.js App Router)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ assetId: string }> }
) {
    const { assetId } = await params;

    // 1. Dapatkan User yang sedang Login
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const sessionUser = session.user

    // 2. Cari Asset Digital berdasarkan assetId
    const asset = await prisma.digitalAsset.findUnique({
        where: { id: assetId },
        include: { product: true },
    });

    if (!asset || !asset.fileUrl) {
        return new NextResponse('File tidak ditemukan', { status: 404 });
    }

    // 3. CEK HAK AKSES (Mencegah pencurian file)
    const userHasAccess = await prisma.userLibrary.findUnique({
        where: {
            userId_productId: {
                userId: sessionUser.id,
                productId: asset.productId,
            },
        },
    });

    if (!userHasAccess) {
        return new NextResponse('Kamu belum membeli produk ini!', { status: 403 });
    }

    // 4. ESTRAK IP ADDRESS & USER AGENT (TRACKING DATA)
    // Menangkap IP dari Client/Header Server
    const ipAddress =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';

    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // 5. CATAT KE DATABASE (DownloadLog) 📝
    await prisma.downloadLog.create({
        data: {
            userId: sessionUser.id,
            assetId: asset.id,
            productId: asset.productId,
            ipAddress: ipAddress, // Store IP Address
            userAgent: userAgent, // Store Device/Browser
        },
    });

    console.log('asset.mimeType', asset.mimeType);
    console.log('asset.extension', asset.extension);
    console.log('asset.name', asset.name);

    // 6. SAJIKAN FILE UNTUK DI-DOWNLOAD
    // (Mengalirkan file dari Storage Internal/Folder Lokal)

    const cleanFileUrl = asset.fileUrl.startsWith('/')
        ? asset.fileUrl.slice(1)
        : asset.fileUrl;

    const filePath = path.join(process.cwd(), 'public', cleanFileUrl);
    console.log('filePath', filePath);

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': asset.mimeType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${asset.name}.${asset.extension}"`,
        },
    });
}