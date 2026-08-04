"use server";

import { prisma } from "@/lib/db";
import { uploadImage, deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function addMediaToProduct(
  productId: string,
  base64File: string,
  type: "IMAGE" | "VIDEO" = "IMAGE"
) {
  try {
    // We use "product-{id}" as the prefix for the filename
    const url = await uploadImage(base64File, `product-${productId}`);

    const productMedia = await prisma.productMedia.create({
      data: {
        productId,
        url,
        type,
      },
    });

    revalidatePath(`/dashboard/products/${productId}/edit`);
    return { success: true, data: productMedia };
  } catch (error: any) {
    console.error("Failed to add media:", error);
    return { success: false, error: "Failed to upload media" };
  }
}

export async function removeMedia(mediaId: string, productId: string) {
  try {
    const media = await prisma.productMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return { success: false, error: "Media not found" };
    }

    // Delete the actual file from the filesystem
    await deleteImage(media.url);

    // Delete the database record
    await prisma.productMedia.delete({
      where: { id: mediaId },
    });

    revalidatePath(`/dashboard/products/${productId}/edit`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove media:", error);
    return { success: false, error: "Failed to remove media" };
  }
}

export async function uploadSingleImage(base64File: string, folder: string = "uploads", oldPath?: string | null) {
  try {
    // Using a generic prefix
    const url = await uploadImage(base64File, `cover`, oldPath, folder);
    return { success: true, url };
  } catch (error: any) {
    // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

    console.error("Failed to upload image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

// Tambahkan di bagian bawah file server action kamu
export async function deleteSingleImage(url: string) {
  try {
    if (!url) return { success: false, error: "No URL provided" };

    // Hapus file fisik lokal/cloud menggunakan helper deleteImage kamu
    await deleteImage(url);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete image:", error);
    return { success: false, error: "Failed to delete image file" };
  }
}