"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { requestPasswordReset } from "@/app/actions/auth/reset-password"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true)
    
    try {
      const result = await requestPasswordReset(data.email)

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      toast.success(result.success)
      setIsLoading(false)
    } catch {
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email to receive a password reset link"
      quote="Security and ease of use are paramount. This reset flow ensures users can always regain access safely."
      quoteAuthor="Marcus Aurelius"
      alternateLink={{ text: "Sign In", href: "/login" }}
    >
      <div className="grid gap-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className={form.formState.errors.email ? "text-destructive" : ""}>
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("email")}
                className={form.formState.errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </div>
        </form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}
