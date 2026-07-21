"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { AuthLayout } from "@/components/auth-layout"
import { login } from "@/app/actions/auth/login"

import { LoginSchema } from "@/schemas"

type LoginFormValues = z.infer<typeof LoginSchema>

export function LoginForm() {
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    
    try {
      const result = await login(data)

      if (result?.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      if (result?.twoFactor) {
        setShowTwoFactor(true)
        setIsLoading(false)
        return
      }

      toast.success("Signed in successfully")
      window.location.assign("/dashboard")
    } catch {
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      quote="This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
      quoteAuthor="Sofia Davis"
      alternateLink={{ text: "Sign Up", href: "/register" }}
    >
      <div className="grid gap-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {showTwoFactor && (
              <div className="grid gap-4 justify-items-center">
                <Label htmlFor="code" className="text-center">Two-Factor Code</Label>
                <Controller
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      disabled={isLoading}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {form.formState.errors.code && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {form.formState.errors.code.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </div>
            )}
            {!showTwoFactor && (
              <>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className={form.formState.errors.password ? "text-destructive" : ""}>
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
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
              </>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {showTwoFactor ? "Confirm" : "Sign In"}
            </Button>
          </div>
        </form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign Up
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
