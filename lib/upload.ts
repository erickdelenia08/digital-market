import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

/**
 * Uploads a base64 encoded image to the local filesystem.
 * 
 * @param base64 The base64 encoded image string.
 * @param userId The ID of the user (used for file naming).
 * @param oldPath Optional relative path of the old image to delete.
 * @param uploadDirName The directory name within public/ to upload to (default: "uploads").
 * @returns The relative path of the uploaded image.
 */
export async function uploadImage(
  base64: string, 
  userId: string, 
  oldPath?: string | null,
  uploadDirName: string = "uploads"
): Promise<string> {
  // If it's already a path (not base64), return it as is
  if (!base64.startsWith("data:image")) {
    return base64
  }

  try {
    const base64Data = base64.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")
    
    // Determine extension from mime type
    const mimeType = base64.split(";")[0].split(":")[1]
    const extension = mimeType.split("/")[1] || "png"
    
    const fileName = `${userId}-${Date.now()}.${extension}`
    const uploadDir = join(process.cwd(), "public", uploadDirName)
    const filePath = join(uploadDir, fileName)

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Cleanup old image if provided
    if (oldPath) {
      await deleteImage(oldPath)
    }

    await writeFile(filePath, buffer)
    return `/${uploadDirName}/${fileName}`
  } catch {
    throw new Error("Failed to upload image")
  }
}

/**
 * Deletes an image from the local filesystem.
 * 
 * @param path The relative path of the image (starting with /).
 */
export async function deleteImage(path: string) {
  if (!path || !path.startsWith("/")) return

  try {
    const fullPath = join(process.cwd(), "public", path)
    if (existsSync(fullPath)) {
      await unlink(fullPath)
    }
  } catch {
    // We don't throw here to avoid failing the whole operation if a file delete fails
  }
}
