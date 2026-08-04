"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Eye, EyeOff, Code2, UserPlus, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/app/actions/auth/register"
import { RegisterFormSchema } from "@/schemas"

type RegisterFormValues = z.infer<typeof RegisterFormSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

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

      toast.success("Account created successfully! Redirecting to dashboard...")

      // Auto login setelah registrasi
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
      })
    } catch {
      toast.error("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-600 selection:text-white">

      {/* Container Utama */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* --- BRANDING / LOGO CODEGRAPH --- */}
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:bg-indigo-600 transition-colors duration-200">
              <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Code<span className="text-indigo-600">Graph</span>
            </span>
          </Link>

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
            Digital Assets & Creator Platform
          </p>
        </div>

        {/* --- KARTU FORM REGISTRASI --- */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/80 sm:px-10 relative overflow-hidden">

          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />

          {/* Header Kartu */}
          <div className="mb-6 text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Account
            </h1>
            <p className="text-sm text-slate-500">
              Fill in the data below to access the platform
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Input Nama Lengkap */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.name ? "text-rose-600" : "text-slate-700"
                  }`}
              >
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
                className={`h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-600 ${form.formState.errors.name
                  ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/20"
                  : "hover:border-slate-300"
                  }`}
              />
              {form.formState.errors.name && (
                <p className="text-xs font-medium text-rose-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.email ? "text-rose-600" : "text-slate-700"
                  }`}
              >
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="[EMAIL_ADDRESS]"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("email")}
                className={`h-11 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-600 ${form.formState.errors.email
                  ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/20"
                  : "hover:border-slate-300"
                  }`}
              />
              {form.formState.errors.email && (
                <p className="text-xs font-medium text-rose-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.password ? "text-rose-600" : "text-slate-700"
                  }`}
              >
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...form.register("password")}
                  className={`h-11 pr-10 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-600 ${form.formState.errors.password
                    ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/20"
                    : "hover:border-slate-300"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {form.formState.errors.password && (
                <p className="text-xs font-medium text-rose-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Input Konfirmasi Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.confirmPassword ? "text-rose-600" : "text-slate-700"
                  }`}
              >
                Confirm Password
              </Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...form.register("confirmPassword")}
                  className={`h-11 pr-10 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-600 ${form.formState.errors.confirmPassword
                    ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/20"
                    : "hover:border-slate-300"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {form.formState.errors.confirmPassword && (
                <p className="text-xs font-medium text-rose-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Tombol Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up Now</span>
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* --- FOOTER ATURAN / TERMS --- */}
        <p className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed px-4">
          By registering, you agree to{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-slate-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-slate-600">
            Privacy Policy
          </Link>{" "}
          CodeGraph.
        </p>

      </div>
    </div>
  )
}