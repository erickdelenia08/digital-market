import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Logo } from "@/components/logo"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  quote: string
  quoteAuthor: string
  alternateLink: {
    text: string
    href: string
  }
}

export function AuthLayout({
  children,
  title,
  description,
  quote,
  quoteAuthor,
  alternateLink,
}: AuthLayoutProps) {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href={alternateLink.href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8 hidden md:flex"
        )}
      >
        {alternateLink.text}
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#121212,transparent)]" />
        <Logo variant="white" className="relative z-20" />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;{quote}&rdquo;</p>
            <footer className="text-sm">{quoteAuthor}</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 w-full flex justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center items-center">
            <Logo variant="color" className="md:hidden mb-10" />
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
