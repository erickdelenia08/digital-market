"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@prisma/client";

export type OrderColumn = {
  id: string;
  userEmail: string;
  userName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
};

interface OrderColumnActionsProps {
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

export const getOrderColumns = ({ onDelete, onUpdateStatus }: OrderColumnActionsProps): ColumnDef<OrderColumn>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-medium">{row.original.id.substring(0, 8)}...</span>,
  },
  {
    accessorKey: "userEmail",
    header: "User",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold">{row.original.userName || "Unknown"}</span>
        <span className="text-sm text-muted-foreground">{row.original.userEmail}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className={`font-semibold ${status === 'COMPLETED' ? 'text-green-600' : status === 'CANCELLED' ? 'text-red-600' : 'text-yellow-600'}`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>}>

          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>

              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {order.status !== 'COMPLETED' && (
                <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'COMPLETED')} className="cursor-pointer text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark Completed
                </DropdownMenuItem>
              )}

              {order.status !== 'CANCELLED' && (
                <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'CANCELLED')} className="cursor-pointer text-red-600">
                  <XCircle className="mr-2 h-4 w-4" /> Mark Cancelled
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => onDelete(order.id)} className="cursor-pointer text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete Order
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
