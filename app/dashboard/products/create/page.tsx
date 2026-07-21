import { ProductForm } from "@/components/forms/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateProductPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to add a new product to your store.
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg shadow-sm p-6">
        <ProductForm />
      </div>
    </div>
  );
}
