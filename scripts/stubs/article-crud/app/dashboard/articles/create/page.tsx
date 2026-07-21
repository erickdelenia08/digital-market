import { Metadata } from "next"
import { ArticleForm } from "../article-form"

export const metadata: Metadata = {
  title: "Create Article",
  description: "Create a new article",
}

export default function NewArticlePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Article</h1>
        <p className="text-muted-foreground">
          Create a new article for your blog or website.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <ArticleForm />
      </div>
    </div>
  )
}
