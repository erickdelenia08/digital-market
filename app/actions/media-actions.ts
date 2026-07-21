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

export async function uploadSingleImage(base64File: string, folder: string = "uploads") {
  try {
    // Using a generic prefix
    const url = await uploadImage(base64File, `cover`, null, folder);
    return { success: true, url };
  } catch (error: any) {
    console.error("Failed to upload image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
