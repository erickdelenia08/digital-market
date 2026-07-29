import { prisma } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { postColumns } from "@/components/columns/post-column"; // Pastikan buat/ubah kolom ini
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
    const posts = await prisma.post.findMany({
        include: {
            category: true,
            author: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Format data agar sesuai dengan definisi kolom tabel Blog
    const formattedPosts = posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        published: post.published,
        publishedAt: post.publishedAt,
        viewsCount: post.viewsCount,
        author: {
            name: post.author.name,
        },
        category: post.category ? {
            name: post.category.name,
        } : null,
        createdAt: post.createdAt,
    }));

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground mt-2">
                        Kelola dan publikasikan artikel blog kamu di sini.
                    </p>
                </div>
                <Link href="/dashboard/posts/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Post
                    </Button>
                </Link>
            </div>

            <div className="bg-background border rounded-lg shadow-sm">
                <DataTable
                    columns={postColumns}
                    data={formattedPosts}
                    searchKey="title"
                />
            </div>
        </div>
    );
}