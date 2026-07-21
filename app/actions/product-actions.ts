"use server";

import { prisma } from "@/lib/db";
import { productSchema, ProductInput } from "@/schemas/product-schema";
import { categorySchema, CategoryInput } from "@/schemas/category-schema";
import { revalidatePath } from "next/cache";

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
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function createCategory(data: CategoryInput) {
  try {
    const validatedData = categorySchema.parse(data);

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    return { success: true, data: category };
  } catch (error: unknown) {
    console.error("Failed to create category:", error);
    return { success: false, error: (error as Error).message || "Failed to create category" };
  }
}
