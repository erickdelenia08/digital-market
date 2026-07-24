// lib/xendit.ts
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY || ""
const XENDIT_API_URL = "https://api.xendit.co"

export interface CreatePaymentRequestParams {
    referenceId: string
    totalAmount: number
    method: string // 'qris' | 'shopeepay' | 'gopay' | 'ovo' | 'dana' | 'bca' | 'bni' | 'bri' | 'mandiri' | 'permata' | 'cimb' | dll
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

// Banks that use the {BANK}_VIRTUAL_ACCOUNT channel_code convention
const VA_BANKS = ["BCA", "BNI", "BRI", "MANDIRI", "PERMATA", "CIMB"]
const EWALLETS = ["SHOPEEPAY", "GOPAY", "OVO", "DANA", "LINKAJA"]

export async function createXenditPaymentRequest(
    params: CreatePaymentRequestParams
): Promise<PaymentRequestResult> {
    if (!XENDIT_SECRET_KEY) {
        throw new Error("XENDIT_SECRET_KEY belum dikonfigurasi di environment variables.")
    }

    const authHeaderValue = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")
    const methodUpper = params.method.toUpperCase()
    const isVA = VA_BANKS.includes(methodUpper)
    const isEwallet = EWALLETS.includes(methodUpper)
    const isQris = methodUpper === "QRIS"

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const successReturnUrl = params.successReturnUrl || `${siteUrl}/orders/success`
    const failureReturnUrl = params.failureReturnUrl || `${siteUrl}/checkout?status=failed`

    const expiryMinutes = params.expiresInMinutes || 60
    const expiryIsoString = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString()

    // Base request payload sesuai v3 Payment Requests
    const requestBody: any = {
        reference_id: params.referenceId,
        // VA numbers are a reusable payment code (a fixed number a customer transfers into),
        // everything else here is a single-shot payment.
        type: isVA ? "REUSABLE_PAYMENT_CODE" : "PAY",
        country: "ID",
        currency: "IDR",
        request_amount: Math.round(params.totalAmount),
        channel_code: isVA ? `${methodUpper}_VIRTUAL_ACCOUNT` : methodUpper,
        description: params.description || `Pembayaran Pesanan #${params.referenceId.substring(0, 8).toUpperCase()}`,
    }

    // capture_method only applies to PAY / PAY_AND_SAVE requests, not REUSABLE_PAYMENT_CODE
    if (!isVA) {
        requestBody.capture_method = "AUTOMATIC"
    }

    // Penanganan channel_properties per jenis channel
    if (isEwallet) {
        requestBody.channel_properties = {
            success_return_url: successReturnUrl,
            failure_return_url: failureReturnUrl,
        }
    } else if (isQris) {
        requestBody.channel_properties = {
            expires_at: expiryIsoString,
            qr_string_type: "DYNAMIC",
        }
    } else if (isVA) {
        requestBody.channel_properties = {
            display_name: params.customerName || "Customer",
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

    // --- 1. Ekstraksi Waktu Expiry ---
    // Fallback ke nilai expiry yang sudah kita kirim ke Xendit (expiryIsoString),
    // bukan angka baru yang tidak berhubungan dengan expiryMinutes.
    const expires_at: string | undefined =
        data.expires_at ||
        data.channel_properties?.expires_at ||
        expiryIsoString

    // --- 2. Ekstraksi dari Array Actions (API v3 2024-11-11) ---
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
                a.descriptor === "QR_STRING" ||
                a.descriptor === "QR_CODE"
        )
        if (qrAction?.value) {
            qr_string = qrAction.value
        }

        // C. Cari VA Number
        const vaAction = data.actions.find(
            (a: any) => a.descriptor === "VIRTUAL_ACCOUNT_NUMBER"
        )
        if (vaAction?.value) {
            account_number = vaAction.value
        }
    }

    // Fallback dari channel_properties jika tidak ada di actions
    if (!qr_string) qr_string = data.channel_properties?.qr_string
    if (!deeplink_url) deeplink_url = data.channel_properties?.mobile_web_checkout_url

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

export async function cancelXenditPaymentRequest(paymentRequestId: string): Promise<any> {
    const authHeaderValue = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")

    const response = await fetch(
        `${XENDIT_API_URL}/v3/payment_requests/${paymentRequestId}/cancel`,
        {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authHeaderValue}`,
                "Content-Type": "application/json",
                "api-version": "2024-11-11",
            },
        }
    )

    const data = await response.json()

    if (!response.ok) {
        // e.g. already SUCCEEDED/EXPIRED/CANCELLED — not always a hard failure for your flow,
        // but you must branch on it rather than assume cancel always works.
        throw new Error(data.message || data.error_code || "Gagal membatalkan Payment Request di Xendit.")
    }

    return data
}