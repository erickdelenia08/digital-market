"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

interface ProductFormProps {
  initialData?: (ProductInput & { id: string }) | null;
}

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function ProductForm({ initialData }: ProductFormProps = {}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

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
    },
  });

  // Category Modal Form
  const categoryForm = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
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
        router.push(`/dashboard/products/${res.data.id}/edit`);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e-book-react-mastery" {...field} />
                  </FormControl>
                  <FormDescription>Auto-generated from name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="150000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Category</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          />
                        </FormControl>
                      }
                    >
                      {field.value
                        ? categories.find(
                            (category) => category.id === field.value
                          )?.name
                        : "Select category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                value={category.name}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categoryId", category.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    category.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                        {/* Inline Create Category Button */}
                        <div className="p-2 border-t border-border">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => setIsCategoryModalOpen(true)}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Kategori Baru
                          </Button>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about this product"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    {field.value && (
                      <img
                        src={field.value}
                        alt="Cover"
                        className="h-16 w-16 object-cover rounded-md border"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
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
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting || isCategoriesLoading || isUploadingCover}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Product"}
          </Button>
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
