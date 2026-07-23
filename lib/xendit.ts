// lib/xendit.ts
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY || ""
const XENDIT_API_URL = "https://api.xendit.co"

export interface CreatePaymentRequestParams {
    referenceId: string
    totalAmount: number
    method: string // 'qris' | 'shopeepay' | 'gopay' | 'ovo' | 'dana' | 'bca' | 'bni' | dll
    description?: string
    customerName?: string
    customerEmail?: string
    successReturnUrl?: string
    failureReturnUrl?: string
    cancelReturnUrl?: string
    expiresInMinutes?: number
}

export interface PaymentRequestResult {
    id: string
    reference_id: string
    status: string
    expires_at?: string
    qr_string?: string
    deeplink_url?: string
    account_number?: string
    rawResponse?: any
}

export async function createXenditPaymentRequest(
    params: CreatePaymentRequestParams
): Promise<PaymentRequestResult> {
    if (!XENDIT_SECRET_KEY) {
        throw new Error("XENDIT_SECRET_KEY belum dikonfigurasi di environment variables.")
    }

    const authHeaderValue = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")
    const methodUpper = params.method.toUpperCase()

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const successReturnUrl = params.successReturnUrl || `${siteUrl}/orders/success`
    const failureReturnUrl = params.failureReturnUrl || `${siteUrl}/checkout?status=failed`
    const cancelReturnUrl = params.cancelReturnUrl || `${siteUrl}/checkout?status=cancelled`

    const expiryMinutes = params.expiresInMinutes || 60
    const expiryIsoString = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString()

    // Base request payload sesuai v3 Direct Request
    const requestBody: any = {
        reference_id: params.referenceId,
        type: "PAY",
        country: "ID",
        currency: "IDR",
        request_amount: Math.round(params.totalAmount),
        capture_method: "AUTOMATIC",
        channel_code: methodUpper,
        description: params.description || `Pembayaran Pesanan #${params.referenceId.substring(0, 8).toUpperCase()}`,
        metadata: {
            reference_id: params.referenceId,
        },
    }

    // Penanganan channel_properties
    if (["SHOPEEPAY", "GOPAY", "OVO", "DANA", "LINKAJA"].includes(methodUpper)) {
        requestBody.channel_properties = {
            success_return_url: successReturnUrl,
            failure_return_url: failureReturnUrl,
            cancel_return_url: cancelReturnUrl,
        }
    } else if (methodUpper === "QRIS") {
        requestBody.channel_properties = {
            expires_at: expiryIsoString,
            qr_string_type: "DYNAMIC",
        }
    } else if (["BCA", "BNI", "BRI", "MANDIRI", "PERMATA", "CIMB"].includes(methodUpper)) {
        requestBody.channel_properties = {
            customer_name: params.customerName || "Customer",
            expires_at: expiryIsoString,
        }
    }

    const response = await fetch(`${XENDIT_API_URL}/v3/payment_requests`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${authHeaderValue}`,
            "Content-Type": "application/json",
            "api-version": "2024-11-11",
        },
        body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
        console.error("Xendit Payment Request Error:", data)
        throw new Error(data.message || data.error_code || "Gagal membuat Payment Request di Xendit.")
    }

    // Aliasing objek penampung
    const cp = data.channel_properties || {}
    const pm = data.payment_method || {}
    const pmCp = pm.channel_properties || {}

    // 1. EKSTRAKSI EXPIRES_AT
    // --- 1. Ekstraksi Waktu Expiry ---
    // Catatan: ShopeePay dari Xendit biasanya berlaku 30 menit dari field `created` jika `expires_at` tidak dikirim balik
    let expires_at: string | undefined =
        data.expires_at ||
        data.channel_properties?.expires_at ||
        new Date(new Date(data.created).getTime() + 1 * 60 * 1000).toISOString()

    // --- 2. Ekstraksi dari Array Actions (Gaya API v3 2024-11-11) ---
    let deeplink_url: string | undefined = undefined
    let qr_string: string | undefined = undefined
    let account_number: string | undefined =
        data.channel_properties?.virtual_account_number ||
        data.channel_properties?.account_number

    if (Array.isArray(data.actions)) {
        // A. Cari Deeplink / URL Redirect E-Wallet
        const redirectAction = data.actions.find(
            (a: any) =>
                a.type === "REDIRECT_CUSTOMER" ||
                a.descriptor === "DEEPLINK_URL" ||
                a.descriptor === "WEB_URL"
        )
        if (redirectAction?.value) {
            deeplink_url = redirectAction.value
        }

        // B. Cari QR String (jika user mau bayar via QR)
        const qrAction = data.actions.find(
            (a: any) =>
                a.type === "PRESENT_TO_CUSTOMER" ||
                a.descriptor === "QR_STRING" ||
                a.descriptor === "QR_CODE"
        )
        if (qrAction?.value) {
            qr_string = qrAction.value
        }

        // C. Cari VA Number (jika nanti panggil metode VA)
        const vaAction = data.actions.find(
            (a: any) => a.descriptor === "VIRTUAL_ACCOUNT_NUMBER"
        )
        if (vaAction?.value) {
            account_number = vaAction.value
        }
    }

    // Helper Fallback dari channel_properties
    if (!qr_string) qr_string = data.channel_properties?.qr_string
    if (!deeplink_url) deeplink_url = data.channel_properties?.mobile_web_checkout_url

    // console.log('ekstraksi data dari xendit ', data);


    return {
        id: data.payment_request_id || data.id,
        reference_id: data.reference_id,
        status: data.status,
        expires_at,
        qr_string,
        deeplink_url,
        account_number,
        rawResponse: data,
    }
}