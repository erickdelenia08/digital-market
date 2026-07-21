"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { digitalAssetSchema, DigitalAssetInput } from "@/schemas/digital-asset-schema";
import { addDigitalAsset, removeDigitalAsset, uploadAssetFile } from "@/app/actions/digital-asset-actions";
import { toast } from "sonner";
import { FileIcon, LinkIcon, Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DigitalAsset = {
  id: string;
  name: string;
  type: "FILE" | "LINK";
  fileUrl: string | null;
  linkUrl: string | null;
};

interface DigitalAssetManagerProps {
  productId: string;
  initialAssets: DigitalAsset[];
}

export function DigitalAssetManager({
  productId,
  initialAssets,
}: DigitalAssetManagerProps) {
  const [assets, setAssets] = useState<DigitalAsset[]>(initialAssets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [base64File, setBase64File] = useState<string | undefined>(undefined);

  const form = useForm<DigitalAssetInput>({
    resolver: zodResolver(digitalAssetSchema),
    defaultValues: {
      name: "",
      type: "FILE",
      linkUrl: "",
    },
  });

  const assetType = form.watch("type");

  const onSubmit = async (data: DigitalAssetInput) => {
    setIsSubmitting(true);

    // For FILE type, we must have a base64 string
    if (data.type === "FILE" && !base64File) {
      toast.error("Please select a file to upload.");
      setIsSubmitting(false);
      return;
    }

    if (data.type === "FILE" && base64File) {
      const uploadRes = await uploadAssetFile(base64File, productId);
      if (!uploadRes.success || !uploadRes.url) {
        toast.error(uploadRes.error || "Failed to upload file.");
        setIsSubmitting(false);
        return;
      }
      data.fileUrl = uploadRes.url;
    }

    const res = await addDigitalAsset(productId, data);
    setIsSubmitting(false);

    if (res.success && res.data) {
      toast.success("Digital asset added!");
      setAssets((prev) => [...prev, res.data]);
      setIsModalOpen(false);
      form.reset();
      setBase64File(undefined);
    } else {
      toast.error(res.error || "Failed to add digital asset");
    }
  };

  const handleDelete = async (assetId: string) => {
    setDeletingId(assetId);
    const res = await removeDigitalAsset(assetId, productId);
    setDeletingId(null);

    if (res.success) {
      toast.success("Asset deleted successfully!");
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    } else {
      toast.error(res.error || "Failed to delete asset");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setBase64File(undefined);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBase64File(reader.result as string);
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Digital Assets</h3>
          <p className="text-sm text-muted-foreground">
            Manage files or links that users receive upon purchasing this product.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Digital Asset</DialogTitle>
              <DialogDescription>
                Upload a source file or provide a secure link to the product asset.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Project Source Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          // Reset conflicting fields
                          if (val === "LINK") setBase64File(undefined);
                          if (val === "FILE") form.setValue("linkUrl", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FILE">File Upload</SelectItem>
                          <SelectItem value="LINK">External Link</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {assetType === "FILE" && (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <Input type="file" onChange={handleFileChange} />
                    </FormControl>
                  </FormItem>
                )}

                {assetType === "LINK" && (
                  <FormField
                    control={form.control}
                    name="linkUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Asset
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        {assets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No digital assets added yet.
          </div>
        ) : (
          <div className="divide-y">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-md">
                    {asset.type === "FILE" ? (
                      <FileIcon className="h-4 w-4" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {asset.type === "FILE" ? "Direct File Download" : "External Link"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(asset.id)}
                    disabled={deletingId === asset.id}
                  >
                    {deletingId === asset.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
