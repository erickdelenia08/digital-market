// / lib/xendit.ts
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY || ""
const XENDIT_API_URL = "https://api.xendit.co"

export interface CreateInvoiceParams {
    externalId: string
    amount: number
    payerEmail: string
    description: string
    successRedirectUrl?: string
    failureRedirectUrl?: string
}

export interface XenditInvoiceResponse {
    id: string
    external_id: string
    status: string
    merchant_name: string
    amount: number
    payer_email: string
    description: string
    invoice_url: string
    expiry_date: string
}

/**
 * Membuat invoice pembayaran dengan Xendit API.
 * Menggunakan fetch native dengan HTTP Basic Auth.
 */
export async function createXenditInvoice(params: CreateInvoiceParams): Promise<XenditInvoiceResponse> {
    if (!XENDIT_SECRET_KEY) {
        throw new Error("XENDIT_SECRET_KEY belum dikonfigurasi di environment variables.")
    }

    // Lakukan Base64 encoding pada secret key dengan akhiran titik dua (Username:Password)
    const authHeaderValue = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")

    const response = await fetch(`${XENDIT_API_URL}/v2/invoices`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${authHeaderValue}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            external_id: params.externalId,
            amount: params.amount,
            payer_email: params.payerEmail,
            description: params.description,
            success_redirect_url: params.successRedirectUrl,
            failure_redirect_url: params.failureRedirectUrl,
        }),
    })

    if (!response.ok) {
        const errorBody = await response.text()
        console.error("Xendit API Error Response:", errorBody)
        throw new Error(`Koneksi Xendit API gagal: ${response.statusText} (${response.status})`)
    }

    return response.json()
}