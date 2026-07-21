'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Clock, Copy, Check, ChevronDown, ChevronUp,
    Download, ShieldCheck, ExternalLink, RefreshCw,
    CheckCircle2, ArrowLeft, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

type PaymentData = {
    order_id?: string;
    qr_string?: string;
    deeplink_url?: string;
    account_number?: string;
};

export default function CustomCheckout() {
    // Step State: 1 = Choose Method, 2 = Payment Pending, 3 = Success / Complete
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [method, setMethod] = useState<'qris' | 'gopay' | 'bca' | ''>('');
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

    // UI Interactive States
    const [copied, setCopied] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit countdown
    const [isExpired, setIsExpired] = useState(false);

    const qrRef = useRef<SVGSVGElement>(null);

    // 1. Countdown Timer Logic (Hanya jalan jika berada di Step 2)
    useEffect(() => {
        if (step !== 2) return;

        if (timeLeft <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [step, timeLeft]);

    // 2. Real-time Status Polling (Cek status bayar dari Xendit Webhook/DB secara periodik)
    useEffect(() => {
        if (step !== 2 || !paymentData?.order_id || isExpired) return;

        const interval = setInterval(async () => {
            try {
                // Ganti dengan API endpoint pengecekan order kamu
                const res = await fetch(`/api/orders/check-status?order_id=${paymentData.order_id}`);
                const data = await res.json();

                if (data.status === 'PAID' || data.status === 'SETTLED') {
                    setStep(3); // Pindah ke Step Success
                }
            } catch (err) {
                console.error("Error checking payment status:", err);
            }
        }, 3000); // Cek tiap 3 detik

        return () => clearInterval(interval);
    }, [step, paymentData, isExpired]);

    // Format Countdown ke Format MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Handler Request Payment ke Backend
    const handleCreatePayment = async () => {
        if (!method) return alert('Pilih metode pembayaran terlebih dahulu!');

        setLoading(true);
        setPaymentData(null);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: 10000, // Dynamic amount bisa dikirim dari props/cart store
                    method: method,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setPaymentData(data);
                setTimeLeft(15 * 60); // Reset timer 15 mins
                setIsExpired(false);
                setStep(2); // Pindah ke Step Pembayaran
            } else {
                alert(data.message || 'Gagal memproses pembayaran');
            }
        } catch (error) {
            console.error(error);
            alert('Koneksi bermasalah. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Handler Copy Nomor VA
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Handler Download QRIS Image
    const handleDownloadQR = () => {
        const svg = qrRef.current;
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.href = pngFile;
            downloadLink.download = `QRIS-Payment-${paymentData?.order_id || 'order'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="max-w-xl mx-auto my-8 px-4">

            {/* === STEPPER / PROGRESS BAR === */}
            <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                    <span className={step >= 1 ? 'text-blue-600 font-bold' : ''}>1. Pilih Metode</span>
                    <span className={step >= 2 ? 'text-blue-600 font-bold' : ''}>2. Bayar</span>
                    <span className={step === 3 ? 'text-emerald-600 font-bold' : ''}>3. Akses Produk</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${step === 3 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
                    ></div>
                </div>
            </div>

            {/* CARD UTAMA */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Header Produk Ringkas */}
                <div className="bg-gray-50 p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Produk Digital
                        </span>
                        <h2 className="text-base font-bold text-gray-800 mt-1">Bundle Template Canva & CapCut</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total Tagihan</span>
                        <span className="text-lg font-extrabold text-blue-600">Rp 10.000</span>
                    </div>
                </div>

                <div className="p-6">
                    {/* ======================================================== */}
                    {/* STEP 1: PILIH METODE PEMBAYARAN                          */}
                    {/* ======================================================== */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Pilih Metode Pembayaran</h3>

                            {/* Option QRIS */}
                            <button
                                onClick={() => setMethod('qris')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${method === 'qris' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-left">
                                    <span className="font-bold block text-gray-800 text-sm">QRIS (Instant Check)</span>
                                    <span className="text-xs text-gray-500">BCA, Mandiri, OVO, GoPay, Dana, ShopeePay</span>
                                </div>
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'qris' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                    {method === 'qris' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                </span>
                            </button>

                            {/* Option GoPay */}
                            <button
                                onClick={() => setMethod('gopay')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${method === 'gopay' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-left">
                                    <span className="font-bold block text-gray-800 text-sm">GoPay Deeplink</span>
                                    <span className="text-xs text-gray-500">Buka langsung di aplikasi GoPay</span>
                                </div>
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'gopay' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                    {method === 'gopay' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                </span>
                            </button>

                            {/* Option BCA VA */}
                            <button
                                onClick={() => setMethod('bca')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${method === 'bca' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-left">
                                    <span className="font-bold block text-gray-800 text-sm">BCA Virtual Account</span>
                                    <span className="text-xs text-gray-500">Transfer via m-BCA atau ATM BCA</span>
                                </div>
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'bca' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                    {method === 'bca' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                </span>
                            </button>

                            <button
                                onClick={handleCreatePayment}
                                disabled={loading || !method}
                                className="w-full mt-6 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    'Lanjut ke Pembayaran'
                                )}
                            </button>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 2: HALAMAN INSTRUKSI PEMBAYARAN + TIMER            */}
                    {/* ======================================================== */}
                    {step === 2 && paymentData && (
                        <div className="space-y-6">

                            {/* Banner Timer Countdown */}
                            <div className={`p-3.5 rounded-xl flex items-center justify-between border ${isExpired
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-amber-50 border-amber-200 text-amber-800'
                                }`}>
                                <div className="flex items-center gap-2.5">
                                    <Clock className={`w-4 h-4 ${!isExpired && 'animate-pulse text-amber-600'}`} />
                                    <span className="text-xs font-semibold">
                                        {isExpired ? 'Waktu Pembayaran Habis' : 'Selesaikan Pembayaran Dalam'}
                                    </span>
                                </div>
                                <span className="font-mono font-bold text-sm">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>

                            {/* OVERLAY JIKA EXPIRED */}
                            {isExpired ? (
                                <div className="text-center py-6 space-y-3">
                                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                                    <p className="text-sm text-gray-600">Kode pembayaran sudah kadaluarsa. Silakan ulang proses untuk mendapatkan kode baru.</p>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Buat Ulang Pembayaran
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* --- DYNAMIC DISPLAY METHOD --- */}

                                    {/* 1. Tampilan QRIS */}
                                    {method === 'qris' && paymentData.qr_string && (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm relative">
                                                <QRCodeSVG
                                                    ref={qrRef}
                                                    value={paymentData.qr_string}
                                                    size={200}
                                                    includeMargin={true}
                                                />
                                            </div>
                                            <button
                                                onClick={handleDownloadQR}
                                                className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-lg border border-blue-100 transition"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Simpan Gambar QR
                                            </button>
                                        </div>
                                    )}

                                    {/* 2. Tampilan GoPay */}
                                    {method === 'gopay' && paymentData.deeplink_url && (
                                        <div className="text-center space-y-3 py-2">
                                            <p className="text-xs text-gray-500">Klik tombol di bawah untuk membuka aplikasi GoPay di HP Anda:</p>
                                            <a
                                                href={paymentData.deeplink_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
                                            >
                                                <span>Buka Aplikasi GoPay</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    )}

                                    {/* 3. Tampilan BCA Virtual Account */}
                                    {method === 'bca' && paymentData.account_number && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                                            <span className="text-xs text-gray-500 block">Nomor BCA Virtual Account</span>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                                                    {paymentData.account_number}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(paymentData.account_number || '')}
                                                    className="flex items-center gap-1.5 bg-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-700"
                                                >
                                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                    {copied ? 'Tersalin' : 'Salin'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Indicator Polling Otomatis */}
                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-1">
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                        <span>Menunggu verifikasi pembayaran otomatis...</span>
                                    </div>

                                    {/* ACCORDION TATA CARA PEMBAYARAN */}
                                    <div className="border-t pt-4 space-y-2">
                                        <p className="text-xs font-bold text-gray-700 mb-2">Cara Pembayaran:</p>

                                        {/* Item 1 */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                                            <button
                                                onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                                                className="w-full text-left p-3 font-semibold bg-gray-50 flex justify-between items-center text-gray-700"
                                            >
                                                <span>{method === 'bca' ? 'Transfer via m-BCA' : 'Cara Scan QRIS'}</span>
                                                {openAccordion === 1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                            {openAccordion === 1 && (
                                                <div className="p-3 bg-white text-gray-600 space-y-1.5 border-t">
                                                    {method === 'bca' ? (
                                                        <ol className="list-decimal list-inside space-y-1">
                                                            <li>Buka aplikasi **m-BCA** & pilih **m-Transfer**.</li>
                                                            <li>Pilih **BCA Virtual Account**.</li>
                                                            <li>Masukkan Nomor VA di atas lalu klik **Send**.</li>
                                                            <li>Periksa detail tagihan, masukkan PIN BCA Anda.</li>
                                                        </ol>
                                                    ) : (
                                                        <ol className="list-decimal list-inside space-y-1">
                                                            <li>Buka aplikasi m-Banking atau E-Wallet pilihan Anda.</li>
                                                            <li>Pilih menu **Scan QR / Pay**.</li>
                                                            <li>Arahkan kamera ke QR Code di atas (atau unggah dari galeri).</li>
                                                            <li>Konfirmasi nominal dan masukkan PIN transaksi.</li>
                                                        </ol>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tombol Simulasi Lulus Pembayaran (KHUSUS DEV/TESTING) */}
                                    <div className="pt-2 border-t text-center">
                                        <button
                                            onClick={() => setStep(3)}
                                            className="text-[11px] text-emerald-600 font-semibold underline hover:text-emerald-700"
                                        >
                                            [Dev Mode] Simulasi Pembayaran Sukses Direct
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Button Back */}
                            <button
                                onClick={() => setStep(1)}
                                className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition py-2"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Kembali & Pilih Metode Lain</span>
                            </button>

                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 3: SUCCESS PAGE & AKSES PRODUK                      */}
                    {/* ======================================================== */}
                    {step === 3 && (
                        <div className="text-center py-6 space-y-5">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-extrabold text-gray-800">Pembayaran Berhasil!</h3>
                                <p className="text-xs text-gray-500">
                                    Akses produk digital kamu sudah aktif dan bukti transaksi telah dikirim ke email.
                                </p>
                            </div>

                            {/* Tombol Akses Utama */}
                            <div className="pt-4 space-y-3">
                                <Link
                                    href="/library" // Direct ke halaman download/akses produk digital user
                                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>Buka Akses Template Canva</span>
                                </Link>

                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setMethod('');
                                        setPaymentData(null);
                                    }}
                                    className="text-xs text-blue-600 underline font-medium"
                                >
                                    Selesai / Kembali ke Beranda
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}