import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { amount, method } = await request.json();
        const secretKey = process.env.XENDIT_SECRET_KEY;

        if (!secretKey) {
            return NextResponse.json({ message: 'Secret Key Xendit belum dipasang di .env.local' }, { status: 500 });
        }

        // Memastikan amount adalah number
        const cleanAmount = Number(amount);
        const referenceId = `tokodigital-${Date.now()}`;
        const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

        const headers = {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
        };

        // 1. JIKA USER MEMILIH QRIS
        if (method === 'qris') {
            const resXendit = await fetch('https://api.xendit.co/qr_codes', {
                method: 'POST',
                headers: {
                    ...headers,
                    'api-version': '2022-07-31' // QRIS butuh api-version ini
                },
                body: JSON.stringify({
                    reference_id: referenceId,
                    type: 'DYNAMIC',
                    amount: cleanAmount,
                    currency: 'IDR',
                }),
            });

            const data = await resXendit.json();
            console.log(data);

            if (!resXendit.ok) throw new Error(data.message || 'Gagal generate QRIS');

            // Mengembalikan qr_string untuk di-render jadi QR Code di frontend (pakai lib qrcode.react)
            return NextResponse.json({
                reference_id: referenceId,
                qr_string: data.qr_string
            });
        }

        // 2. JIKA USER MEMILIH GOPAY (E-Wallet v2)
        if (method === 'gopay') {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const resXendit = await fetch('https://api.xendit.co/ewallets/charges', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    reference_id: referenceId,
                    currency: 'IDR',
                    amount: cleanAmount,
                    checkout_method: 'ONE_TIME_PAYMENT',
                    channel_code: 'GOPAY',
                    channel_properties: {
                        success_redirect_url: `${siteUrl}/checkout/success`,
                        failure_redirect_url: `${siteUrl}/cart?status=failed`,
                        cancel_redirect_url: `${siteUrl}/cart`,
                    },
                }),
            });

            const data = await resXendit.json();
            console.log(data);

            if (!resXendit.ok) throw new Error(data.message || 'Gagal generate GoPay');

            const actions = data.actions || {};
            const deeplink = actions.mobile_deeplink_checkout_url || actions.mobile_web_checkout_url || actions.desktop_web_checkout_url || '';

            return NextResponse.json({
                reference_id: referenceId,
                deeplink_url: deeplink
            });
        }

        // 3. JIKA USER MEMILIH BCA VIRTUAL ACCOUNT (Menggunakan API V2 terbaru)
        if (method === 'bca') {
            const resXendit = await fetch('https://api.xendit.co/callback_virtual_accounts', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    external_id: referenceId,
                    bank_code: 'BCA',
                    name: 'DIGITAL STORE CUSTOMER',
                    currency: 'IDR',
                    is_closed: true,
                    expected_amount: cleanAmount,
                }),
            });

            const data = await resXendit.json();
            console.log(data);

            if (!resXendit.ok) throw new Error(data.message || 'Gagal generate BCA VA');

            return NextResponse.json({
                reference_id: referenceId,
                account_number: data.account_number,
                expiration_date: data.expiration_date
            });
        }


        return NextResponse.json({ message: 'Metode pembayaran tidak didukung' }, { status: 400 });

    } catch (error: any) {
        console.error('Xendit Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}