"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, Sparkles, CheckCircle2, Code2 } from "lucide-react"
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
import { login } from "@/app/actions/auth/login"
import { LoginSchema } from "@/schemas"

type LoginFormValues = z.infer<typeof LoginSchema>

export function LoginForm() {
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

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

      toast.success("Selamat datang kembali di CodeGraph!")
      window.location.assign("/dashboard")
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

        {/* --- KARTU FORM AUTHENTICATION --- */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/80 sm:px-10 relative overflow-hidden">

          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />

          {/* Header Kartu */}
          <div className="mb-6 text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {showTwoFactor ? "Verifikasi Dua Langkah" : "Masuk ke Akun"}
            </h1>
            <p className="text-sm text-slate-500">
              {showTwoFactor
                ? "Masukkan kode dari aplikasi autentikator kamu"
                : "Akses aset digital dan dashboard kamu"}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* --- LAYAR 2FA CODE --- */}
            {showTwoFactor && (
              <div className="grid gap-5 justify-items-center py-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>

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
                      <InputOTPGroup className="gap-1.5">
                        <InputOTPSlot index={0} className="rounded-lg border-slate-200 focus:border-indigo-600" />
                        <InputOTPSlot index={1} className="rounded-lg border-slate-200 focus:border-indigo-600" />
                        <InputOTPSlot index={2} className="rounded-lg border-slate-200 focus:border-indigo-600" />
                        <InputOTPSlot index={3} className="rounded-lg border-slate-200 focus:border-indigo-600" />
                        <InputOTPSlot index={4} className="rounded-lg border-slate-200 focus:border-indigo-600" />
                        <InputOTPSlot index={5} className="rounded-lg border-slate-200 focus:border-indigo-600" />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />

                {form.formState.errors.code && (
                  <p className="text-xs font-semibold text-rose-600">
                    {form.formState.errors.code.message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowTwoFactor(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-semibold transition-colors pt-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke form kredensial</span>
                </button>
              </div>
            )}

            {/* --- LAYAR LOGIN CREDENTIALS --- */}
            {!showTwoFactor && (
              <>
                {/* Input Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.email ? "text-rose-600" : "text-slate-700"
                      }`}
                  >
                    Alamat Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="nama@email.com"
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
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className={`text-xs font-bold tracking-wide uppercase ${form.formState.errors.password ? "text-rose-600" : "text-slate-700"
                        }`}
                    >
                      Kata Sandi
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      Lupa password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoCapitalize="none"
                      autoComplete="current-password"
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
              </>
            )}

            {/* Tombol Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.99] mt-2"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {showTwoFactor ? (
                <span className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Konfirmasi Kode</span>
                </span>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* --- FOOTER ATURAN / TERMS --- */}
        <p className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed px-4">
          Dengan melanjutkan, Anda menyetujui{" "}
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