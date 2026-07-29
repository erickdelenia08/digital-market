"use server";

import { prisma } from "@/lib/db";
import { productSchema, ProductInput } from "@/schemas/product-schema";
import { categorySchema, CategoryInput } from "@/schemas/category-schema";
import { revalidatePath } from "next/cache";
// import { validate } from "uuid";
import { unstable_cache } from "next/cache";

export interface ErrorResponse {
  message: string;
}

export async function createProduct(data: ProductInput) {
  try {
    const validatedData = productSchema.parse(data);

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        coverImage: validatedData.coverImage,
        isPublished: validatedData.isPublished,
        isFeatured: validatedData.isFeatured,
        media: {
          create: validatedData.media.map(m => ({
            url: m.url,
            type: m.type,
          })),
        },
        digitalAssets: {
          create: validatedData.digitalAssets.map(a => ({
            name: a.name,
            type: a.type,
            fileUrl: a.fileUrl,
            linkUrl: a.linkUrl,
            mimeType: a.mimeType,
            fileSize: a.fileSize,
            extension: a.extension,
          })),
        },
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, data: product };
  } catch (error: unknown) {
    console.error("Failed to create product:", error);
    return { success: false, error: (error as Error).message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: ProductInput) {
  try {
    const validatedData = productSchema.parse(data);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        coverImage: validatedData.coverImage,
        isPublished: validatedData.isPublished,
        isFeatured: validatedData.isFeatured,
        media: {
          deleteMany: {
            id: { notIn: validatedData.media.filter(m => m.id).map(m => m.id as string) }
          },
          create: validatedData.media.filter(m => !m.id).map(m => ({
            url: m.url,
            type: m.type,
          })),
          update: validatedData.media.filter(m => m.id).map(m => ({
            where: { id: m.id as string },
            data: { url: m.url, type: m.type }
          }))
        },
        digitalAssets: {
          deleteMany: {
            id: { notIn: validatedData.digitalAssets.filter(a => a.id).map(a => a.id as string) }
          },
          create: validatedData.digitalAssets.filter(a => !a.id).map(a => ({
            name: a.name,
            type: a.type,
            fileUrl: a.fileUrl,
            linkUrl: a.linkUrl,
            mimeType: a.mimeType,
            fileSize: a.fileSize,
            extension: a.extension,
          })),
          update: validatedData.digitalAssets.filter(a => a.id).map(a => ({
            where: { id: a.id as string },
            data: {
              name: a.name,
              type: a.type,
              fileUrl: a.fileUrl,
              linkUrl: a.linkUrl,
              mimeType: a.mimeType,
              fileSize: a.fileSize,
              extension: a.extension,
            }
          }))
        }
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${id}/edit`);
    return { success: true, data: product };
  } catch (error: unknown) {
    console.error("Failed to update product:", error);
    return { success: false, error: (error as Error).message || "Failed to update product" };
  }
}

export async function getCategories() {
  try {
    return await unstable_cache(
      async () => {
        const categories = await prisma.category.findMany({
          orderBy: {
            name: "asc",
          },
        });

        return {
          success: true as const,
          data: categories,
        };
      },
      ["categories"],
      {
        revalidate: 3600,
        tags: ["categories"],
      }
    )();
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    return {
      success: false as const,
      error: "Failed to fetch categories",
    };
  }
}

export async function createCategory(data: CategoryInput) {
  try {
    const validatedData = categorySchema.parse(data);

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        icon: validatedData.icon
      },
    });

    return { success: true, data: category };
  } catch (error: unknown) {
    console.error("Failed to create category:", error);
    return { success: false, error: (error as Error).message || "Failed to create category" };
  }
}

export async function getBasicProducts() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, price: true },
      orderBy: { name: "asc" }
    });
    return { success: true, data: products };
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}
