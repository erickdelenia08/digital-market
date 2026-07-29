"use server";

import { prisma } from "@/lib/db";
import { postSchema, PostInput } from "@/schemas/post-schema";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth-user";

export async function createPost(data: PostInput) {
  try {
    const user = await getAuthUser();
    const validatedData = postSchema.parse(data);

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        published: validatedData.published,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        categoryId: validatedData.categoryId,
        relatedProductId: validatedData.relatedProductId,
        authorId: user.id as string,
        tags: {
          connect: validatedData.tags.filter(t => t.id).map(t => ({ id: t.id as string }))
        }
      },
    });

    revalidatePath("/dashboard/posts");
    return { success: true, data: post };
  } catch (error: any) {
    console.error("Failed to create post:", error);
    return { success: false, error: error.message || "Failed to create post" };
  }
}

export async function updatePost(id: string, data: PostInput) {
  try {
    await getAuthUser(); // Just to verify auth
    const validatedData = postSchema.parse(data);

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        published: validatedData.published,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        categoryId: validatedData.categoryId,
        relatedProductId: validatedData.relatedProductId,
        tags: {
          set: validatedData.tags.filter(t => t.id).map(t => ({ id: t.id as string }))
        }
      },
    });

    revalidatePath("/dashboard/posts");
    revalidatePath(`/dashboard/posts/${id}/edit`);
    return { success: true, data: post };
  } catch (error: any) {
    console.error("Failed to update post:", error);
    return { success: false, error: error.message || "Failed to update post" };
  }
}

export async function getPostCategories() {
  try {
    const categories = await prisma.postCategory.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch post categories" };
  }
}

export async function getPostTags() {
  try {
    const tags = await prisma.postTag.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: tags };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch post tags" };
  }
}

export async function createPostCategory(data: { name: string, slug: string }) {
  try {
    const category = await prisma.postCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
    return { success: true, data: category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPostTag(data: { name: string, slug: string }) {
  try {
    const tag = await prisma.postTag.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
    return { success: true, data: tag };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
