"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash, Image as ImageIcon, Film } from "lucide-react";
import { toast } from "sonner";
import { addMediaToProduct, removeMedia } from "@/app/actions/media-actions";

type ProductMedia = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
};

interface ProductMediaUploaderProps {
  productId: string;
  initialMedia: ProductMedia[];
}

export function ProductMediaUploader({
  productId,
  initialMedia,
}: ProductMediaUploaderProps) {
  const [mediaList, setMediaList] = useState<ProductMedia[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Invalid file type. Please upload an image or video.");
      return;
    }

    const type = file.type.startsWith("image/") ? "IMAGE" : "VIDEO";

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Str = reader.result as string;

      setIsUploading(true);
      const res = await addMediaToProduct(productId, base64Str, type);
      setIsUploading(false);

      if (res.success && res.data) {
        toast.success("Media uploaded successfully!");
        setMediaList((prev) => [...prev, res.data]);
      } else {
        toast.error(res.error || "Failed to upload media");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (mediaId: string) => {
    setDeletingId(mediaId);
    const res = await removeMedia(mediaId, productId);
    setDeletingId(null);

    if (res.success) {
      toast.success("Media deleted successfully!");
      setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
    } else {
      toast.error(res.error || "Failed to delete media");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Product Media</h3>
          <p className="text-sm text-muted-foreground">
            Manage images and videos for your product gallery.
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            type="button"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Upload Media
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {mediaList.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No media uploaded yet.
          </div>
        )}
        {mediaList.map((media) => (
          <Card key={media.id} className="relative group overflow-hidden">
            <CardContent className="p-0 aspect-square flex items-center justify-center bg-muted">
              {media.type === "IMAGE" ? (
                <img
                  src={media.url}
                  alt="Product media"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <Film className="h-10 w-10 mb-2" />
                  <span className="text-xs font-medium">Video</span>
                </div>
              )}
            </CardContent>
            {/* Overlay and actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(media.id)}
                disabled={deletingId === media.id}
                type="button"
              >
                {deletingId === media.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </div>
            {/* Type Icon Badge */}
            <div className="absolute top-2 left-2 bg-background/80 p-1.5 rounded-md backdrop-blur-sm">
              {media.type === "IMAGE" ? (
                <ImageIcon className="h-3 w-3" />
              ) : (
                <Film className="h-3 w-3" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
