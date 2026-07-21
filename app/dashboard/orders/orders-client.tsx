"use client";

import { DataTable } from "@/components/data-table";
import { getOrderColumns, OrderColumn } from "@/components/columns/order-columns";
import { deleteOrder, updateOrderStatus } from "@/app/actions/orders";
import { useTransition } from "react";
import { OrderStatus } from "@prisma/client";

interface OrdersClientProps {
  data: OrderColumn[];
}

export default function OrdersClient({ data }: OrdersClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      startTransition(async () => {
        await deleteOrder(id);
      });
    }
  };

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(id, status);
    });
  };

  const columns = getOrderColumns({
    onDelete: handleDelete,
    onUpdateStatus: handleUpdateStatus,
  });

  return (
    <div className="bg-background border rounded-lg shadow-sm">
      <DataTable columns={columns} data={data} searchKey="id" />
    </div>
  );
}
