"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { registerUser } from "@/app/actions/auth/register"

import { RegisterFormSchema } from "@/schemas"

type RegisterFormValues = z.infer<typeof RegisterFormSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      toast.success("Account created! Logging you in...")
      
      // Auto login after registration
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
      })
    } catch {
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
      quote="The implementation was seamless and the results were immediate. I couldn't be happier with the platform."
      quoteAuthor="Alex Rivera"
      alternateLink={{ text: "Sign In", href: "/login" }}
    >
      <div className="grid gap-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className={form.formState.errors.name ? "text-destructive" : ""}>
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("name")}
                className={form.formState.errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
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
            <div className="grid gap-2">
              <Label htmlFor="password" className={form.formState.errors.password ? "text-destructive" : ""}>
                Password
              </Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("password")}
                className={form.formState.errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {form.formState.errors.password && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className={form.formState.errors.confirmPassword ? "text-destructive" : ""}>
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("confirmPassword")}
                className={form.formState.errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </div>
        </form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign In
        </Link>
      </p>

      <p className="px-8 text-center text-[10px] text-muted-foreground/50">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  )
}
