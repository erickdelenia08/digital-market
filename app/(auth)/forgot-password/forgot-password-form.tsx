"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Code2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestPasswordReset } from "@/app/actions/auth/reset-password"

const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [submittedEmail, setSubmittedEmail] = useState<string>("")

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

      toast.success(result.success || "Tautan reset kata sandi telah dikirim!")
      setSubmittedEmail(data.email)
      setIsSubmitted(true)
      setIsLoading(false)
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

        {/* --- KARTU FORM LUPA PASSWORD --- */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/80 sm:px-10 relative overflow-hidden">

          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />

          {/* STATE 1: EMAIL TERKIRIM */}
          {isSubmitted ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Periksa Email Kamu
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kami telah mengirimkan instruksi reset kata sandi ke alamat{" "}
                  <span className="font-semibold text-slate-800">{submittedEmail}</span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider mt-2"
              >
                Ganti Email / Coba Lagi
              </Button>
            </div>
          ) : (

            /* STATE 2: FORM INPUT EMAIL */
            <>
              {/* Header Kartu */}
              <div className="mb-6 text-center space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Lupa Kata Sandi?
                </h1>
                <p className="text-sm text-slate-500">
                  Masukkan email kamu untuk menerima tautan pemulihan
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
                      <Mail className="w-4 h-4" />
                      <span>Kirim Tautan Reset</span>
                    </span>
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Divider & Kembali ke Login */}
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