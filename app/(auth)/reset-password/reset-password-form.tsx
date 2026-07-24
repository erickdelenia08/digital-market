"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Eye, EyeOff, Code2, KeyRound, AlertTriangle, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/app/actions/auth/reset-password"

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi tidak cocok",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Token reset tidak ditemukan")
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword({
        ...data,
        token,
      })

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      toast.success("Kata sandi berhasil diperbarui! Silakan masuk.")
      router.push("/login")
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
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

        {/* --- KARTU FORM RESET PASSWORD --- */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/80 sm:px-10 relative overflow-hidden">

          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />

          {/* STATE 1: JIKA TOKEN TIDAK ADA / TIDAK VALID */}
          {!token ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-inner mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Token Tidak Valid
                </h1>
                <p className="text-sm text-slate-500">
                  Tautan reset kata sandi tidak ditemukan atau sudah kadaluwarsa.
                </p>
              </div>

              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center gap-2 w-full h-11 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.99] text-sm"
              >
                <span>Kirim Ulang Tautan Reset</span>
              </Link>
            </div>
          ) : (

            /* STATE 2: FORM INPUT PASSWORD BARU */
            <>
              {/* Header Kartu */}
              <div className="mb-6 text-center space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Reset Kata Sandi
                </h1>
                <p className="text-sm text-slate-500">
                  Masukkan kata sandi baru untuk akun kamu
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Input Password Baru */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.password ? "text-rose-600" : "text-slate-700"
                      }`}
                  >
                    Kata Sandi Baru
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

                {/* Input Konfirmasi Password Baru */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.confirmPassword ? "text-rose-600" : "text-slate-700"
                      }`}
                  >
                    Konfirmasi Kata Sandi Baru
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
                      <KeyRound className="w-4 h-4" />
                      <span>Simpan Kata Sandi Baru</span>
                    </span>
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Divider */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Masuk</span>
            </Link>
          </div>
        </div>

        {/* --- FOOTER ATURAN / TERMS --- */}
        <p className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed px-4">
          Dengan melanjutkannya, Anda menyetujui{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-slate-600">
            Ketentuan Layanan
          </Link>{" "}
          dan{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-slate-600">
            Kebijakan Privasi
          </Link>{" "}
          CodeGraph.
        </p>

      </div>
    </div>
  )
}