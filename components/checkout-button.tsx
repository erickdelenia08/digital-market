"use client"

import { useState, useTransition } from "react"
import { checkoutCart } from "@/app/actions/checkout"
import { toast } from "sonner"
import { Loader2, CreditCard } from "lucide-react"

export default function CheckoutButton() {
    const [isPending, startTransition] = useTransition()

    const handleCheckout = () => {
        startTransition(async () => {
            const result = await checkoutCart()

            if (result.error) {
                toast.error(result.error)
            } else if (result.success && result.url) {
                toast.success(result.success)
                // Arahkan ke hosted checkout page Xendit
                window.location.href = result.url
            }
        })
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors cursor-pointer"
        >
            {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <CreditCard className="h-5 w-5" />
            )}
            Bayar Sekarang
        </button>
    )
}