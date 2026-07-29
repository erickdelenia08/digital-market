import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersClient from "./orders-client";

export const metadata: Metadata = {
  title: "Orders Management",
  description: "Manage all user orders here.",
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();

  // Ensure only authenticated users can access, 
  // typically you might want to restrict this to ADMIN only
  // if (!session?.user || session.user.role !== "ADMIN") {
  if (!session?.user) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    userEmail: order.user?.email || "No Email",
    userName: order.user?.name || "No Name",
    totalAmount: order.totalAmount,
    status: order.status,
    paymentMethod: order.payments[0]?.paymentMethod || null,
    paymentStatus: order.payments[0]?.status || null,
    createdAt: order.createdAt,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage your customer orders and update their status.
          </p>
        </div>
      </div>

      <OrdersClient data={formattedOrders} />
    </div>
  );
}
