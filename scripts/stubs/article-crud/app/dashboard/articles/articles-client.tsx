"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { getArticles, deleteArticle } from "@/app/actions/article"
import { DataTable } from "@/components/data-table"
import { getArticleColumns, Article } from "@/components/columns/article"

export default function ArticlesClient() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const data = await getArticles()
      return data as Article[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.success)
        await queryClient.invalidateQueries({ queryKey: ["articles"] })
        router.refresh()
      } else {
        toast.error(result.error)
      }
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const columns = getArticleColumns(handleDelete)

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">
            Manage your articles and content here.
          </p>
        </div>
        <Link href="/dashboard/articles/create">
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      ) : (
        <DataTable 
          data={articles} 
          columns={columns} 
          enableTabs={false} 
          searchKey="title"
        />
      )}
    </div>
  )
}
