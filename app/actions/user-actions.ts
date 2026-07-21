"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { createUserSchema, updateUserSchema, CreateUserInput, UpdateUserInput } from "@/schemas/user-schema";

export async function createUser(data: CreateUserInput) {
  try {
    const validatedData = createUserSchema.parse(data);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return { success: false, error: error.message || "Failed to create user" };
  }
}

export async function updateUser(id: string, data: UpdateUserInput) {
  try {
    const validatedData = updateUserSchema.parse(data);

    // Check if email already exists for another user
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser && existingUser.id !== id) {
      return { success: false, error: "Email already in use by another user" };
    }

    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    };

    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}/edit`);
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return { success: false, error: error.message || "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    if (session.user.id === id) {
      return { success: false, error: "You cannot delete your own account" };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
