"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";

import {
  ArrowLeft, Bold, Calendar, Code, Edit2, Heading1, Heading2, Heading3,
  Image as ImageIcon, Italic, Link as LinkIcon, List, ListOrdered,
  Strikethrough, Undo, Redo, X, Loader2, Plus, Check, ChevronsUpDown
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { postSchema, PostInput } from "@/schemas/post-schema";
import { createPost, updatePost, getPostCategories, getPostTags, createPostCategory, createPostTag } from "@/app/actions/post-actions";
import { getBasicProducts } from "@/app/actions/product-actions";
import { uploadSingleImage } from "@/app/actions/media-actions";
import { ImageUploadModal } from "./image-upload-modal";

interface TiptapToolbarProps {
  editor: Editor | null
}

const TiptapToolbar = ({ editor }: TiptapToolbarProps) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 bg-muted/50 p-2 border-b rounded-t-xl">
      <Button type="button" variant={editor.isActive("bold") ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Button>
      <Button type="button" variant={editor.isActive("italic") ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Button>
      <Button type="button" variant={editor.isActive("strike") ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Button type="button" variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="h-4 w-4" /></Button>
      <Button type="button" variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Button>
      <Button type="button" variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Button type="button" variant={editor.isActive("bulletList") ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Button>
      <Button type="button" variant={editor.isActive("orderedList") ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Button type="button" variant={editor.isActive("codeBlock") ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="h-4 w-4" /></Button>
      <ImageUploadModal
        onInsertImage={(url) => editor.chain().focus().setImage({ src: url }).run()}
      />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo className="h-4 w-4" /></Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo className="h-4 w-4" /></Button>
    </div>
  );
};

export default function PostForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const [isProductPopoverOpen, setIsProductPopoverOpen] = useState(false);

  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      publishedAt: null,
      metaTitle: "",
      metaDescription: "",
      categoryId: null,
      relatedProductId: null,
      tags: [],
    },
  });

  const { formState: { isSubmitting, errors }, setValue, handleSubmit, control } = form;
  const content = useWatch({ control, name: "content" });
  const coverImage = useWatch({ control, name: "coverImage" });
  const currentTags = useWatch({ control, name: "tags" }) || [];

  useEffect(() => {
    async function loadData() {
      const [catsRes, tagsRes, prodsRes] = await Promise.all([
        getPostCategories(),
        getPostTags(),
        getBasicProducts()
      ]);
      if (catsRes.success && catsRes.data) setCategories(catsRes.data);
      if (tagsRes.success && tagsRes.data) setTags(tagsRes.data);
      if (prodsRes.success && prodsRes.data) setProducts(prodsRes.data);
    }
    loadData();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({
        HTMLAttributes: {
          class: "rounded-xl border my-4 max-w-full h-auto mx-auto object-cover",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true, shouldDirty: true });
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-6 focus:outline-none",
      },
    },
  });

  const onSubmit = async (data: PostInput) => {
    try {
      const res = initialData?.id
        ? await updatePost(initialData.id, data)
        : await createPost(data);

      if (res.success) {
        toast.success(initialData?.id ? "Post updated successfully" : "Post created successfully");
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const res = await createPostCategory({ name: newCategoryName, slug });
    setIsCreatingCategory(false);
    if (res.success && res.data) {
      setCategories([...categories, res.data]);
      setValue("categoryId", res.data.id, { shouldValidate: true, shouldDirty: true });
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
      toast.success("Category created!");
    } else {
      toast.error(res.error || "Failed to create category");
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setIsCreatingTag(true);
    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const res = await createPostTag({ name: newTagName, slug });
    setIsCreatingTag(false);
    if (res.success && res.data) {
      setTags([...tags, res.data]);
      const updatedTags = [...currentTags, res.data];
      setValue("tags", updatedTags, { shouldValidate: true, shouldDirty: true });
      setNewTagName("");
      setIsTagDialogOpen(false);
      toast.success("Tag created!");
    } else {
      toast.error(res.error || "Failed to create tag");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto bg-muted/30 p-6 lg:p-10">
      <div className="mx-auto mb-8 flex max-w-[1200px] flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link href="/dashboard/posts" className="mb-1 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {initialData ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => setValue("published", false)}>Save Draft</Button>
          <Button type="submit" disabled={isSubmitting || isUploadingCover}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {initialData ? "Update Post" : "Publish Article"}
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title *</Label>
                <Input id="title" className="text-lg font-semibold" {...form.register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="relative">
                  <Input id="slug" className="font-mono text-sm pr-10" {...form.register("slug")} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary</Label>
                <Textarea id="excerpt" rows={3} {...form.register("excerpt")} />
              </div>
            </CardContent>

            <div className="border-t">
              <TiptapToolbar editor={editor} />
              <EditorContent editor={editor} />
              {errors.content && <p className="text-sm text-destructive p-4">{errors.content.message}</p>}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Linked Product (Cross-Selling)</CardTitle></CardHeader>
            <CardContent>
              <Controller
                name="relatedProductId"
                control={control}
                render={({ field }) => (
                  <Popover open={isProductPopoverOpen} onOpenChange={setIsProductPopoverOpen}>
                    <PopoverTrigger render={
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? products.find((product) => product.id === field.value)?.name
                          : "Search a product..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    }>

                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] lg:w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search product by name or id..." />
                        <CommandList>
                          <CommandEmpty>No product found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="none"
                              onSelect={() => {
                                field.onChange(null);
                                setIsProductPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === null ? "opacity-100" : "opacity-0"
                                )}
                              />
                              None
                            </CommandItem>
                            {products.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.name + " " + product.id}
                                onSelect={() => {
                                  field.onChange(product.id);
                                  setIsProductPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    product.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {product.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="published"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ? "published" : "draft"} onValueChange={(val) => field.onChange(val === "published")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">🟢 Published</SelectItem>
                        <SelectItem value="draft">🟡 Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedAt">Publish Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="datetime-local" id="publishedAt" className="pl-9 text-sm" {...form.register("publishedAt")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <Label>Cover Image</Label>
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                {coverImage ? (
                  <Image key={coverImage} src={coverImage} alt="Cover" fill className="object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                )}
              </div>
              <Label htmlFor="coverImageUpload" className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                {isUploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                Upload Image
              </Label>
              <Input
                id="coverImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploadingCover}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith("image/")) {
                    toast.error("Please upload an image file.");
                    return;
                  }

                  // preview instan
                  const previewUrl = URL.createObjectURL(file);
                  setValue("coverImage", previewUrl, { shouldDirty: true });

                  const reader = new FileReader();
                  reader.onload = async (event) => {
                    const base64Str = event.target?.result as string;
                    setIsUploadingCover(true);
                    const res = await uploadSingleImage(base64Str, "covers", coverImage);
                    setIsUploadingCover(false);
                    if (res.success && res.url) {
                      const bustedUrl = `${res.url}${res.url.includes("?") ? "&" : "?"}t=${Date.now()}`;
                      setValue("coverImage", bustedUrl, { shouldValidate: true, shouldDirty: true });
                      toast.success("Cover image uploaded!");
                    } else {
                      toast.error(res.error || "Failed to upload image");
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Category</Label>
                  <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger render={
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> New
                      </Button>
                    }>

                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Category Name</Label>
                          <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g. Tips & Tricks" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim() || isCreatingCategory}>
                          {isCreatingCategory ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || "none"} onValueChange={(val) => field.onChange(val === "none" ? null : val)}>
                      <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Tags</Label>
                  <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                    <DialogTrigger render={
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> New Tag
                      </Button>
                    }>

                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Tag</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Tag Name</Label>
                          <Input value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="e.g. React" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateTag} disabled={!newTagName.trim() || isCreatingTag}>
                          {isCreatingTag ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {currentTags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 font-normal">
                      #{tag.name}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => {
                        const newTags = [...currentTags];
                        newTags.splice(i, 1);
                        setValue("tags", newTags, { shouldValidate: true, shouldDirty: true });
                      }} />
                    </Badge>
                  ))}
                </div>
                <div className="relative flex gap-2">
                  <Select value="none" onValueChange={(val) => {
                    if (val !== "none" && !currentTags.find(t => t.id === val)) {
                      const selectedTag = tags.find(t => t.id === val);
                      if (selectedTag) setValue("tags", [...currentTags, selectedTag], { shouldValidate: true, shouldDirty: true });
                    }
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select Tag" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select Tag...</SelectItem>
                      {tags.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h4 className="font-semibold text-primary text-sm">SEO Settings</h4>
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" className="text-sm" placeholder="Post title will be used if empty" {...form.register("metaTitle")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" className="text-sm" placeholder="Write a catchy summary for search engines..." rows={3} {...form.register("metaDescription")} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}