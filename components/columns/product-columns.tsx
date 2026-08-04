"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Edit, Trash } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteProduct } from "@/app/actions/product-actions";

export type ProductColumn = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: {
    name: string;
  };
  isPublished: boolean;
};

export const productColumns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <PriceCell value={price} />;
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActionsCell product={row.original} />,
  },
];

const ProductActionsCell = ({ product }: { product: ProductColumn }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        const result = await deleteProduct(product.id);
        if (result.success) {
          toast.success("Product deleted successfully");
        } else {
          toast.error(result.error || "Failed to delete product");
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>} />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>

          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(product.id)}
          >
            Copy product ID
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>

          <Link href={`/dashboard/products/${product.id}/edit`}>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={handleDelete} disabled={isPending}>
            <Trash className="mr-2 h-4 w-4" /> {isPending ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const emptySubscribe = () => () => { };
const useIsClient = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Nilai saat di Client
    () => false  // Nilai saat di Server
  );
};

// 1. Buat komponen pembungkus kecil agar formatting hanya dieksekusi di Client
const PriceCell = ({ value }: { value: number }) => {
  const isClient = useIsClient();

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Menghilangkan ,00 di belakang Rp
  }).format(value);

  // Jika masih di server, tampilkan format teks statis yang aman 
  // agar server dan client sinkron di render pertama.
  return (
    <div className="font-medium">
      {isClient ? formatted : `Rp ${value}`}
    </div>
  );
};