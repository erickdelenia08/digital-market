"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/upload";
import { digitalAssetSchema, DigitalAssetInput } from "@/schemas/digital-asset-schema";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function uploadAssetFile(base64File: string, prefix: string, oldPath?: string | null) {
  try {
    if (!base64File.startsWith("data:")) {
      return { success: false, error: "Invalid file data" };
    }

    const base64Data = base64File.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    
    const mimeType = base64File.split(";")[0].split(":")[1];
    let extension = "bin";
    
    if (mimeType) {
      if (mimeType.includes("pdf")) extension = "pdf";
      else if (mimeType.includes("zip")) extension = "zip";
      else if (mimeType.includes("rar")) extension = "rar";
      else extension = mimeType.split("/")[1] || "bin";
    }

    let fileName = `asset-${prefix}-${Date.now()}.${extension}`;
    const uploadDirName = "assets";
    
    if (oldPath && oldPath.startsWith(`/${uploadDirName}/`)) {
      const oldFileName = oldPath.split("/").pop();
      if (oldFileName) {
        fileName = oldFileName;
      }
    } else if (oldPath) {
      await deleteImage(oldPath);
    }

    const uploadDir = join(process.cwd(), "public", uploadDirName);
    const filePath = join(uploadDir, fileName);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(filePath, buffer);
    return { success: true, url: `/${uploadDirName}/${fileName}` };
  } catch (error: any) {
    console.error("Failed to upload asset:", error);
    return { success: false, error: "Failed to upload asset" };
  }
}

export async function addDigitalAsset(
  productId: string,
  data: DigitalAssetInput
) {
  try {
    const validatedData = digitalAssetSchema.parse(data);

    const fileUrl = validatedData.fileUrl;

    if (validatedData.type === "FILE" && !fileUrl) {
       return { success: false, error: "File is required for FILE type assets." };
    }

    const digitalAsset = await prisma.digitalAsset.create({
      data: {
        productId,
        name: validatedData.name,
        type: validatedData.type,
        fileUrl: fileUrl,
        linkUrl: validatedData.type === "LINK" ? validatedData.linkUrl : null,
      },
    });

    revalidatePath(`/dashboard/products/${productId}/edit`);
    return { success: true, data: digitalAsset };
  } catch (error: any) {
    console.error("Failed to add digital asset:", error);
    return { success: false, error: error.message || "Failed to add digital asset" };
  }
}

export async function removeDigitalAsset(assetId: string, productId: string) {
  try {
    const asset = await prisma.digitalAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return { success: false, error: "Asset not found" };
    }

    if (asset.type === "FILE" && asset.fileUrl) {
      await deleteImage(asset.fileUrl); // deleteImage in upload.ts just unlinks any path inside public/
    }

    await prisma.digitalAsset.delete({
      where: { id: assetId },
    });

    revalidatePath(`/dashboard/products/${productId}/edit`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove digital asset:", error);
    return { success: false, error: "Failed to remove digital asset" };
  }
}
