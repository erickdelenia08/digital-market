import LibraryComponent, { LibraryProduct } from '@/components/library-component'
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-user";
import { redirect } from 'next/navigation';

export default async function LibraryPage() {
    const user = await getAuthUser();

    if (!user) {
        redirect('/login');
    }

    const libraryItems = await prisma.userLibrary.findMany({
        where: { userId: user.id as string },
        include: {
            product: {
                include: {
                    category: true,
                    digitalAssets: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const products: LibraryProduct[] = libraryItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        type: item.product.category.name.toUpperCase(),
        category: item.product.category.name,
        coverImage: item.product.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop",
        purchaseDate: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(item.createdAt),
        timestamp: item.createdAt.getTime(),
        digitalAssets: item.product.digitalAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            fileUrl: asset.fileUrl,
            linkUrl: asset.linkUrl,
            type: asset.type,
            fileSize: asset.fileSize,
            extension: asset.extension
        }))
    }));

    console.log('jumlah library , ', libraryItems.length);


    return (
        <>
            <LibraryComponent initialProducts={products} />
        </>
    )
}