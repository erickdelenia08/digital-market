import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/forms/product-form";

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
    isPublished: product.isPublished,
    isFeatured: product.isFeatured,
    media: product.media.map(m => ({ id: m.id, url: m.url, type: m.type })),
    digitalAssets: product.digitalAssets.map(a => ({ 
      id: a.id, 
      name: a.name, 
      type: a.type, 
      fileUrl: a.fileUrl, 
      linkUrl: a.linkUrl 
    })),
  };

  return <ProductForm initialData={initialData} />;
}
