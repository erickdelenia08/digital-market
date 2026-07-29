import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import PostForm from "@/components/forms/post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    const post = await prisma.post.findUnique({
        where: { id: id },
        include: {
            tags: true,
            category: true,
            relatedProduct: true,
        },
    });

    if (!post) {
        notFound();
    }

    // Menyiapkan initialData sesuai struktur skema model Post
    const initialData = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || undefined,
        content: post.content,
        coverImage: post.coverImage || undefined,
        published: post.published,
        publishedAt: post.publishedAt || undefined,
        metaTitle: post.metaTitle || undefined,
        metaDescription: post.metaDescription || undefined,
        categoryId: post.categoryId || undefined,
        relatedProductId: post.relatedProductId || undefined,
        // Format tag menjadi array of strings atau objects sesuai kebutuhan PostForm kamu
        tags: post.tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
        })),
    };

    return <PostForm initialData={initialData} />;
}