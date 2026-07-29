"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Pencil,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Code,
  ImagePlus,
  Plus,
  Trash2,
  Star,
  Loader2,
  File,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { productSchema, ProductInput } from "@/schemas/product-schema";
import { categorySchema, CategoryInput } from "@/schemas/category-schema";
import { createProduct, updateProduct, getCategories, createCategory } from "@/app/actions/product-actions";
import { uploadSingleImage } from "@/app/actions/media-actions";
import { uploadAssetFile } from "@/app/actions/digital-asset-actions";
import { DynamicIcon } from "../dynamic-icon";

const QUICK_SUGGESTIONS = ["Figma", "Video", "Code", "BookOpen", "Palette", "Sparkles", "Box", "Layers"];

interface ProductFormProps {
  initialData?: (ProductInput & { id: string }) | null;
}

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

export function ProductForm({ initialData }: ProductFormProps = {}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [open, setOpen] = useState(false);

  // Main Product Form
  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      categoryId: "",
      coverImage: "",
      isPublished: true,
      isFeatured: false,
      media: [],
      digitalAssets: [],
    },
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control: form.control,
    name: "media",
  });

  const { fields: assetFields, append: appendAsset, remove: removeAsset } = useFieldArray({
    control: form.control,
    name: "digitalAssets",
  });

  // Category Modal Form
  const categoryForm = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: "",
    },
  });

  // Auto-slug for Product Name
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name" && value.name) {
        const generatedSlug = value.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        form.setValue("slug", generatedSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Auto-slug for Category Name
  useEffect(() => {
    const subscription = categoryForm.watch((value, { name }) => {
      if (name === "name" && value.name) {
        const generatedSlug = value.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        categoryForm.setValue("slug", generatedSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [categoryForm]);

  // Load Categories
  useEffect(() => {
    async function loadCategories() {
      const res = await getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
      setIsCategoriesLoading(false);
    }
    loadCategories();
  }, []);

  async function onSubmit(data: ProductInput) {
    setIsSubmitting(true);
    let res;
    if (initialData) {
      res = await updateProduct(initialData.id, data);
    } else {
      res = await createProduct(data);
    }
    setIsSubmitting(false);

    if (res.success && res.data) {
      toast.success(initialData ? "Product updated successfully!" : "Product created successfully!");
      if (!initialData) {
        router.push(`/dashboard/products`);
      } else {
        router.push(`/dashboard/products`);
      }
    } else {
      toast.error(res.error || (initialData ? "Failed to update product" : "Failed to create product"));
    }
  }

  async function onCategorySubmit(data: CategoryInput) {
    setIsCreatingCategory(true);
    const res = await createCategory(data);
    setIsCreatingCategory(false);

    if (res.success && res.data) {
      toast.success("Category created!");
      setCategories((prev) => [...prev, res.data]);
      form.setValue("categoryId", res.data.id, { shouldValidate: true });
      setIsCategoryModalOpen(false);
      categoryForm.reset();
    } else {
      toast.error(res.error || "Failed to create category");
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
          {/* Header Page */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/products">
                <Button type="button" variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {initialData ? `Edit: ${initialData.name}` : "Create Product"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isSubmitting || isCategoriesLoading || isUploadingCover}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </div>

          {/* Grid Layout 70% / 30% */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Kolom Kiri (70%) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E-Book React Mastery" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="e-book-react-mastery" className="pr-10" {...field} />
                            <Pencil className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                            <div className="bg-muted/50 px-3 py-2 flex items-center gap-3 border-b">
                              <button type="button" className="text-muted-foreground hover:text-foreground">
                                <Bold className="w-4 h-4" />
                              </button>
                              <button type="button" className="text-muted-foreground hover:text-foreground">
                                <Italic className="w-4 h-4" />
                              </button>
                              <button type="button" className="text-muted-foreground hover:text-foreground">
                                <List className="w-4 h-4" />
                              </button>
                              <button type="button" className="text-muted-foreground hover:text-foreground">
                                <LinkIcon className="w-4 h-4" />
                              </button>
                              <div className="w-px h-4 bg-border" />
                              <button type="button" className="text-muted-foreground hover:text-foreground">
                                <Code className="w-4 h-4" />
                              </button>
                            </div>
                            <Textarea
                              placeholder="Tell us a little bit about this product"
                              className="border-0 focus-visible:ring-0 rounded-none resize-none"
                              rows={6}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Media Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Media Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image</FormLabel>
                          <FormControl>
                            <div className="relative group aspect-video rounded-lg overflow-hidden border">
                              {field.value ? (
                                <Image
                                  src={field.value}
                                  alt="Cover Preview"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                  No Image
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button type="button" variant="secondary" size="sm" className="gap-2 relative">
                                  <ImagePlus className="w-4 h-4" /> Replace Image
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={isUploadingCover}
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;

                                      if (!file.type.startsWith("image/")) {
                                        toast.error("Please upload an image file.");
                                        return;
                                      }

                                      const reader = new FileReader();
                                      reader.readAsDataURL(file);
                                      reader.onload = async () => {
                                        const base64Str = reader.result as string;
                                        setIsUploadingCover(true);
                                        const res = await uploadSingleImage(base64Str);
                                        setIsUploadingCover(false);

                                        if (res.success && res.url) {
                                          form.setValue("coverImage", res.url, { shouldValidate: true });
                                          toast.success("Cover image uploaded!");
                                        } else {
                                          toast.error(res.error || "Failed to upload image");
                                        }
                                      };
                                    }}
                                  />
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gallery Previews */}
                    <div className="space-y-2">
                      <FormLabel>Gallery Previews</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {mediaFields.map((field, index) => (
                          <div key={field.id} className="relative rounded-lg overflow-hidden border aspect-video group">
                            <Image
                              src={field.url}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeMedia(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors aspect-video text-muted-foreground hover:text-foreground bg-muted/50 overflow-hidden">
                          <Plus className="w-6 h-6" />
                          <span className="text-xs font-medium mt-1">
                            + Upload
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;
                              for (const file of files) {
                                if (!file.type.startsWith("image/")) continue;
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = async () => {
                                  const base64Str = reader.result as string;
                                  toast.info(`Uploading ${file.name}...`);
                                  const res = await uploadSingleImage(base64Str, "gallery");
                                  if (res.success && res.url) {
                                    appendMedia({ url: res.url, type: "IMAGE" });
                                    toast.success(`${file.name} uploaded!`);
                                  } else {
                                    toast.error(`Failed to upload ${file.name}`);
                                  }
                                };
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Digital Assets */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl font-semibold">
                    Digital Assets
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Button type="button" variant="outline" size="sm" className="gap-1">
                        <Plus className="w-4 h-4" /> Upload New File
                      </Button>
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const mimeType = file.type;
                          const fileSize = file.size;
                          const extension = file.name.split(".").pop()?.toLowerCase() || "";

                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = async () => {
                            const base64Str = reader.result as string;
                            toast.info(`Uploading ${file.name}...`);
                            const prefix = form.getValues("slug") || "asset";
                            const res = await uploadAssetFile(base64Str, prefix);
                            if (res.success && res.url) {
                              appendAsset({
                                name: file.name,
                                type: "FILE",
                                fileUrl: res.url,
                                mimeType: mimeType,
                                fileSize: fileSize,
                                extension: extension,
                              });
                              console.log("fileSize", fileSize);
                              console.log("mimeType", mimeType);
                              console.log("extension", extension);
                              toast.success(`${file.name} uploaded!`);
                            } else {
                              toast.error(`Failed to upload ${file.name}`);
                            }
                          };
                        }}
                      />
                    </div>
                    <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => {
                      appendAsset({
                        name: "External Link",
                        type: "LINK",
                        linkUrl: "https://",
                      });
                    }}>
                      <LinkIcon className="w-4 h-4" /> Add External Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assetFields.length === 0 && (
                    <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                      No digital assets added yet.
                    </div>
                  )}
                  {assetFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3 p-3 bg-muted/40 rounded-lg border">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                          {field.type === "FILE" ? <File className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                          <Input
                            placeholder="Asset Name (e.g. Source Code)"
                            {...form.register(`digitalAssets.${index}.name`)}
                            className="h-8 text-sm font-medium"
                          />
                          {field.type === "LINK" ? (
                            <Input
                              placeholder="https://..."
                              {...form.register(`digitalAssets.${index}.linkUrl`)}
                              className="h-8 text-xs text-muted-foreground"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground w-50 md:w-auto">
                              <span className="whitespace-nowrap">File URL: {field.fileUrl}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAsset(index)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Kolom Kanan (30%) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (IDR)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                              Rp
                            </span>
                            <Input
                              type="number"
                              className="pl-9"
                              placeholder="150000"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Organization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="text-primary text-xs font-medium flex items-center gap-1 hover:underline mt-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add New Category
                        </button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-2 border-t">
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-0">
                          <FormLabel className="cursor-pointer font-normal text-base">
                            Published Status
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-0">
                          <FormLabel className="cursor-pointer font-normal text-base">
                            Featured Product
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Metrics (khusus untk products/edit)*/}
              {initialData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/40 p-3 rounded-lg border space-y-3">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-xs">Total Sales</span>
                        <span className="text-xs font-semibold text-foreground">
                          {/* This would ideally come from initialData if available */}
                          -
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-xs">Average Rating</span>
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                          - / 5.0{" "}
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </form>
      </Form>

      {/* Dialog for Creating New Category */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Buat kategori baru untuk produk Anda. Kategori ini akan langsung
              dipilih setelah dibuat.
            </DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form
              onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
              className="space-y-4"
            >
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Buku, Template, dll" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={categoryForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="buku" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 3. IKON (Lucide Selector dengan Live Preview) */}
              <FormField
                control={categoryForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ikon Kategori</FormLabel>

                    <div className="flex items-center gap-3">
                      {/* 1. Live Preview Ikon yang Diketik User */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted shadow-sm">
                        <DynamicIcon name={field.value} className="h-5 w-5 text-foreground" />
                      </div>

                      {/* 2. Input Teks Bebas */}
                      <FormControl className="flex-1">
                        <Input
                          placeholder="Ketik nama ikon Lucide (misal: Rocket, Heart, Cpu...)"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </div>

                    {/* 3. Quick Chips / Suggestion (Bisa Diklik User) */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs text-muted-foreground mr-1">Saran populer:</span>
                      {QUICK_SUGGESTIONS.map((iconName) => (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => categoryForm.setValue("icon", iconName)}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <DynamicIcon name={iconName} className="w-3 h-3" />
                          {iconName}
                        </button>
                      ))}
                    </div>

                    <p className="text-[0.8rem] text-muted-foreground pt-0.5">
                      Bebas ketik nama ikon sesuai nama di{" "}
                      <a
                        href="https://lucide.dev/icons"
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-medium text-primary"
                      >
                        lucide.dev/icons
                      </a>
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 4. DESKRIPSI (Textarea) */}
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jelaskan secara singkat jenis produk dalam kategori ini..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isCreatingCategory}>
                  {isCreatingCategory && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Simpan
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
