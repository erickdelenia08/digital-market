"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function deleteOrder(id: string) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.order.delete({
      where: { id },
    });

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/dashboard/orders");
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
