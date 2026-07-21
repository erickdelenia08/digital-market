import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/forms/product-form";
import { ProductMediaUploader } from "@/components/forms/product-media-uploader";
import { DigitalAssetManager } from "@/components/forms/digital-asset-manager";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      media: {
        orderBy: { sortOrder: "asc" },
      },
      digitalAssets: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    coverImage: product.coverImage || undefined,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-1">
            Update your product details, gallery, and digital assets.
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg shadow-sm p-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="assets">Digital Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-0">
            <ProductForm initialData={initialData} />
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-0">
            <ProductMediaUploader
              productId={product.id}
              initialMedia={product.media.map(m => ({
                id: m.id,
                url: m.url,
                type: m.type
              }))}
            />
          </TabsContent>
          
          <TabsContent value="assets" className="mt-0">
            <DigitalAssetManager 
              productId={product.id}
              initialAssets={product.digitalAssets.map(a => ({
                id: a.id,
                name: a.name,
                type: a.type,
                fileUrl: a.fileUrl,
                linkUrl: a.linkUrl
              }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
