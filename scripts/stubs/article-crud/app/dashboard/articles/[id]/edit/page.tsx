import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { ArticleForm } from "../../article-form"

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: "Edit Article",
  description: "Edit your article",
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: {
      id,
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Article</h1>
        <p className="text-muted-foreground">
          Update your article content and settings.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <ArticleForm initialData={article} />
      </div>
    </div>
  )
}
