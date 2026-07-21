// lib/xendit.ts
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
 * Membuat invoice pembayaran dengan Xendit API (Legacy / Standard Invoice).
 */
export async function createXenditInvoice(params: CreateInvoiceParams): Promise<XenditInvoiceResponse> {
    if (!XENDIT_SECRET_KEY) {
        throw new Error("XENDIT_SECRET_KEY belum dikonfigurasi di environment variables.")
    }

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

// ==========================================
// PAYMENT REQUEST V2 / V3 API INTEGRATION
// ==========================================

export interface CreatePaymentRequestParams {
    referenceId: string
    amount: number
    method: string // 'qris' | 'gopay' | 'ovo' | 'dana' | 'shopeepay' | 'bca' | 'bni' | 'bri' | 'mandiri' | 'permata'
    description?: string
    customerName?: string
    customerEmail?: string
    successReturnUrl?: string
    failureReturnUrl?: string
    cancelReturnUrl?: string
}

export interface PaymentRequestResult {
    id: string
    reference_id: string
    status: string
    qr_string?: string
    deeplink_url?: string
    account_number?: string
    rawResponse?: any
}

/**
 * Membuat Payment Request Xendit menggunakan endpoint modern Payment Requests V2/V3 API.
 */
export async function createXenditPaymentRequest(params: CreatePaymentRequestParams): Promise<PaymentRequestResult> {
    if (!XENDIT_SECRET_KEY) {
        throw new Error("XENDIT_SECRET_KEY belum dikonfigurasi di environment variables.")
    }

    const authHeaderValue = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")
    const methodLower = params.method.toLowerCase()
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const successReturnUrl = params.successReturnUrl || `${siteUrl}/orders/success`
    const failureReturnUrl = params.failureReturnUrl || `${siteUrl}/checkout?status=failed`
    const cancelReturnUrl = params.cancelReturnUrl || `${siteUrl}/checkout?status=cancelled`

    let paymentMethodObj: any = {}

    // 1. QRIS
    if (methodLower === "qris") {
        paymentMethodObj = {
            type: "QR_CODE",
            reusability: "ONE_TIME_USE",
            qr_code: {
                channel_code: "QRIS"
            }
        }
    } 
    // 2. EWALLETS (GOPAY, OVO, DANA, SHOPEEPAY)
    else if (["gopay", "ovo", "dana", "shopeepay"].includes(methodLower)) {
        const channelCode = methodLower.toUpperCase()
        paymentMethodObj = {
            type: "EWALLET",
            reusability: "ONE_TIME_USE",
            ewallet: {
                channel_code: channelCode,
                channel_properties: {
                    success_return_url: successReturnUrl,
                    failure_return_url: failureReturnUrl,
                    cancel_return_url: cancelReturnUrl,
                }
            }
        }
    }
    // 3. VIRTUAL ACCOUNTS (BCA, BNI, BRI, MANDIRI, PERMATA)
    else if (["bca", "bni", "bri", "mandiri", "permata"].includes(methodLower)) {
        const channelCode = methodLower.toUpperCase()
        paymentMethodObj = {
            type: "VIRTUAL_ACCOUNT",
            reusability: "ONE_TIME_USE",
            virtual_account: {
                channel_code: channelCode,
                channel_properties: {
                    customer_name: params.customerName || "Digital Market Customer"
                }
            }
        }
    } else {
        throw new Error(`Metode pembayaran '${params.method}' tidak didukung.`)
    }

    const requestBody = {
        reference_id: params.referenceId,
        currency: "IDR",
        amount: Math.round(params.amount),
        country: "ID",
        payment_method: paymentMethodObj,
        description: params.description || `Pembayaran Pesanan #${params.referenceId.substring(0, 8).toUpperCase()}`
    }

    const response = await fetch(`${XENDIT_API_URL}/payment_requests`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${authHeaderValue}`,
            "Content-Type": "application/json",
            "api-version": "2022-07-31"
        },
        body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
        console.error("Xendit Payment Request Error:", data)
        throw new Error(data.message || data.error_code || "Gagal membuat Payment Request di Xendit.")
    }

    // Extraction helper
    let qr_string: string | undefined = undefined
    let deeplink_url: string | undefined = undefined
    let account_number: string | undefined = undefined

    // Extract QR String
    if (data.payment_method?.qr_code?.channel_properties?.qr_string) {
        qr_string = data.payment_method.qr_code.channel_properties.qr_string
    } else if (Array.isArray(data.actions)) {
        const qrAction = data.actions.find((a: any) => a.qr_string || a.action === "GET_QR_CODE" || a.action === "PRESENT_TO_CUSTOMER")
        if (qrAction?.qr_string) qr_string = qrAction.qr_string
    }

    // Extract EWALLET Deeplink / Checkout URL
    if (Array.isArray(data.actions)) {
        const linkAction = data.actions.find((a: any) => 
            a.url && (a.action === "DESKTOP_WEB_CHECKOUT" || a.action === "DEEPLINK_CHECKOUT" || a.action === "MOBILE_CHECKOUT" || a.action === "REDIRECT_CUSTOMER")
        ) || data.actions.find((a: any) => a.url)
        if (linkAction?.url) deeplink_url = linkAction.url
    }

    // Extract Virtual Account Number
    if (data.payment_method?.virtual_account?.channel_properties?.virtual_account_number) {
        account_number = data.payment_method.virtual_account.channel_properties.virtual_account_number
    } else if (data.payment_method?.virtual_account?.channel_properties?.account_number) {
        account_number = data.payment_method.virtual_account.channel_properties.account_number
    } else if (Array.isArray(data.actions)) {
        const vaAction = data.actions.find((a: any) => a.virtual_account_number || a.account_number)
        if (vaAction) account_number = vaAction.virtual_account_number || vaAction.account_number
    }

    return {
        id: data.id,
        reference_id: data.reference_id,
        status: data.status,
        qr_string,
        deeplink_url,
        account_number,
        rawResponse: data
    }
}