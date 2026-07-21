"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArticleSchema, ArticleValues } from "@/schemas/article"
import { createArticle, updateArticle } from "@/app/actions/article"
import { SlugInput } from "@/components/slug-input"

interface ArticleFormProps {
  initialData?: ArticleValues & { id: string }
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<ArticleValues>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      slug: "",
      published: false,
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: ArticleValues) => {
      if (initialData) {
        return await updateArticle(initialData.id, values)
      }
      return await createArticle(values)
    },
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.success)
        await queryClient.invalidateQueries({ queryKey: ["articles"] })
        router.refresh()
        router.push("/dashboard/articles")
      } else {
        toast.error(result.error)
      }
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  })

  const onSubmit = (values: ArticleValues) => {
    mutation.mutate(values)
  }

  const isLoading = mutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Article title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <SlugInput 
                  placeholder="article-slug" 
                  sourceName="title"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                The URL-friendly version of the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your content here..." rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Make this article visible to the public.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Article" : "Create Article"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/articles")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
