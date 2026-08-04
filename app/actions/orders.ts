"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function getCheckoutOrder(
  orderId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              price: true,
              coverImage: true,
            },
          },
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!order) {
    return {
      error: "Order tidak ditemukan.",
    };
  }

  return {
    order: JSON.parse(JSON.stringify(order)),
  };
}

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

export async function getUserOrders() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
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

    return { success: true, data: orders };
  } catch (error) {
    console.error("Failed to get user orders:", error);
    return { success: false, error: "Failed to fetch orders." };
  }
}
