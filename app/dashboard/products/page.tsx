import { prisma } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { productColumns } from "@/components/columns/product-columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map the data to match the column definitions
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    isPublished: product.isPublished,
    category: {
      name: product.category.name,
    },
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your digital products here.
          </p>
        </div>
        <Link href="/dashboard/products/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-background border rounded-lg shadow-sm">
        <DataTable columns={productColumns} data={formattedProducts} searchKey="name" />
      </div>
    </div>
  );
}
