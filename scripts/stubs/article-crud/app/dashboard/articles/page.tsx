import { Metadata } from "next"
import ArticlesClient from "./articles-client"

export const metadata: Metadata = {
  title: "Articles",
  description: "Manage your articles and content here.",
}

export default function ArticlesPage() {
  return <ArticlesClient />
}
