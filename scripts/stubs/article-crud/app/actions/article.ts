"use server"

import * as z from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ArticleSchema } from "@/schemas/article"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export const getArticles = async () => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })
    return articles
  } catch {
    return []
  }
}

export const createArticle = async (values: z.infer<typeof ArticleSchema>) => {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = ArticleSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { title, content, slug, published } = validatedFields.data

  try {
     const userExists = await prisma.user.findUnique({
       where: { id: session.user.id }
     })

     if (!userExists) {
       return { error: "User session is stale (user not found in database). Please log out and sign in again." }
     }

    await prisma.article.create({
      data: {
        title,
        content,
        slug,
        published,
        authorId: session.user.id!,
      },
    })

    revalidatePath("/dashboard/articles")
    return { success: "Article created!" }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Slug already exists!" }
    }
    return { error: "Something went wrong!" }
  }
}

export const updateArticle = async (id: string, values: z.infer<typeof ArticleSchema>) => {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = ArticleSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { title, content, slug, published } = validatedFields.data

  try {
    await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        slug,
        published,
      },
    })

    revalidatePath("/dashboard/articles")
    return { success: "Article updated!" }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Slug already exists!" }
    }
    return { error: "Something went wrong!" }
  }
}

export const deleteArticle = async (id: string) => {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.article.delete({
      where: { id },
    })

    revalidatePath("/dashboard/articles")
    return { success: "Article deleted!" }
  } catch {
    return { error: "Something went wrong!" }
  }
}
