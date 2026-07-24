"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Clock, Copy, Check, ChevronDown, ChevronUp,
    Download, ShieldCheck, ExternalLink, RefreshCw,
    CheckCircle2, ArrowLeft, AlertCircle, LogIn, ShoppingBag,
    QrCode, Wallet, Building2, CreditCard, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';
import { createPayment } from '@/app/actions/payment/create-payment';
import { formatCountdown, formatTimeLeft } from '@/helper/payment-timer';
import { checkOrderStatus } from '@/app/actions/payment';
import { getCheckoutOrder } from "@/app/actions/orders";
import { cancelPayment } from '@/app/actions/payment/cancel-payment';


type CheckoutResponse = Awaited<ReturnType<typeof getCheckoutOrder>>;


type PaymentMethodType =
    | 'qris'
    | 'gopay'
    | 'shopeepay'
    | 'dana'
    | 'ovo'
    | 'bca'
    | 'bni'
    | 'bri'
    | 'mandiri'
    | 'permata';

type Order = Extract<CheckoutResponse, { order: unknown }>["order"];

interface CheckoutPageProps {
    order: Order
}

interface PaymentData {
    id: string;
    orderId: string;
    status: string;
    expiresAt?: Date | string | null;
    qrString?: string | null;
    deeplinkUrl?: string | null;
    accountNumber?: string | null;
}



const CheckoutPage = ({ order }: CheckoutPageProps) => {
    // console.log("PAYMENT DATAAAAAAAAAAAAAAA");
    // console.log(order);
    const latestPayment = order.payments[0];

    const [step, setStep] = useState(() => {
        if (!latestPayment) return 1;

        const isPendingExpired =
            latestPayment.status === "PENDING" &&
            latestPayment.expiresAt &&
            new Date(latestPayment.expiresAt) <= new Date();

        if (isPendingExpired) {
            return 1;
        }

        switch (latestPayment.status) {
            case "PENDING":
                return 2;
            case "PAID":
                return 3;
            default:
                return 1;
        }
    });
    const { data: session, status } = useSession();

    // Checkout Flow States: Step 1 = Select Method, Step 2 = Payment Pending, Step 3 = Payment Success

    const [method, setMethod] = useState<PaymentMethodType | ''>(() => {
        if (latestPayment?.paymentMethod) {
            return latestPayment.paymentMethod.toLowerCase() as PaymentMethodType;
        }
        return '';
    });

    const [loadingPayment, setLoadingPayment] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(() => {
        if (latestPayment && latestPayment.status === "PENDING") {
            return {
                id: latestPayment.id,
                orderId: order.id,
                status: latestPayment.status,
                expiresAt: latestPayment.expiresAt,
                qrString: latestPayment.qrString,
                deeplinkUrl: latestPayment.deeplinkUrl,
                accountNumber: latestPayment.accountNumber,
            };
        }
        return null;
    });

    // UI Interactive States
    const [copied, setCopied] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<number | null>(1);
    const [timeLeft, setTimeLeft] = useState(0); // 15 menit countdown
    const [isExpired, setIsExpired] = useState(false);

    const [cancelling, setCancelling] = useState(false);

    const qrRef = useRef<SVGSVGElement>(null);


    useEffect(() => {
        // Hanya jalankan jika ada di Step 2 dan paymentData memilki expiresAt
        if (step !== 2 || !paymentData?.expiresAt) return;

        const targetTime = new Date(paymentData.expiresAt).getTime();

        // Fungsi kalkulasi sisa detik nyata
        const calculateTimeLeft = () => {
            const now = Date.now();
            const diffInSeconds = Math.floor((targetTime - now) / 1000);

            if (diffInSeconds <= 0) {
                setTimeLeft(0);
                setIsExpired(true);
                return false; // Penanda sudah expired
            }

            setTimeLeft(diffInSeconds);
            setIsExpired(false);
            return true; // Masih berjalan
        };

        // 1. Jalankan kalkulasi pertama kali saat mount/step 2 aktif
        const isStillValid = calculateTimeLeft();
        if (!isStillValid) return;

        // 2. Set interval tiap 1 detik untuk update tampilan
        const interval = setInterval(() => {
            const isValid = calculateTimeLeft();
            if (!isValid) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [step, paymentData?.expiresAt]);


    useEffect(() => {
        const orderId = paymentData?.orderId;

        if (step !== 2 || !orderId || isExpired) return;

        const interval = setInterval(async () => {
            // 🚀 Panggil Server Action secara langsung
            const res = await checkOrderStatus(orderId);

            if (res.isPaid) {
                clearInterval(interval); // Hentikan polling
                setStep(3); // Transisi otomatis ke Step Success
                toast.success("Pembayaran berhasil diverifikasi!");
            }
        }, 4000); // Polling tiap 4 detik

        return () => clearInterval(interval);
    }, [step, paymentData?.orderId, isExpired]);

    const handleCancelAndChangeMethod = async () => {
        // 💡 Gunakan paymentData, fallback ke latestPayment
        const currentPaymentId = paymentData?.id || latestPayment?.id;

        console.log("ini payment ID yang mau dibatalkan:", currentPaymentId);

        if (!currentPaymentId) {
            toast.error("Tidak ada pembayaran aktif yang bisa dibatalkan.");
            return;
        }

        setCancelling(true);

        try {
            // 1. Batalkan transaksi menggunakan ID yang aktif saat ini
            const res = await cancelPayment(currentPaymentId);
            console.log("ini cancel res", res);

            if (res.error) {
                toast.error(res.error);
                return;
            }

            // 2. Bersihkan State Frontend
            setPaymentData(null);
            setTimeLeft(0);
            setIsExpired(false);

            // 3. Kembalikan ke Step 1
            setStep(1);
            toast.success("Pembayaran berhasil dibatalkan, silakan pilih metode lain.");
        } catch (err) {
            console.error(err);
            toast.error("Gagal membatalkan pembayaran.");
        } finally {
            setCancelling(false);
        }
    };

    // Handler Request Payment ke Backend Xendit Payment Request V2 API
    const handleCreatePayment = async () => {
        if (!method) {
            toast.error('Silakan pilih metode pembayaran terlebih dahulu!');
            return;
        }

        setLoadingPayment(true);
        setPaymentData(null);

        try {
            // 🚀 Panggil Server Action langsung
            const res = await createPayment(order.id, method);
            console.log(res);
            if (res.error) {
                toast.error(res.error);
                return;
            }

            if (res.payment) {
                setPaymentData(res.payment);

                // Default fallback 15 menit jika expiresAt tidak ada dari server
                const DEFAULT_EXPIRY_SECONDS = 15 * 60;

                if (res.payment.expiresAt) {
                    const expiresAtTime = new Date(res.payment.expiresAt).getTime();
                    const diffInSeconds = Math.floor((expiresAtTime - Date.now()) / 1000);

                    if (diffInSeconds > 0) {
                        setTimeLeft(diffInSeconds);
                        setIsExpired(false);
                    } else {
                        // Jika tagihan sudah kedaluwarsa dari waktu server
                        setTimeLeft(0);
                        setIsExpired(true);
                        toast.error("Waktu pembayaran untuk tagihan ini telah berakhir.");
                    }
                } else {
                    // Jika tidak ada expiresAt dari server, jalankan countdown bawaan 15 menit
                    setTimeLeft(DEFAULT_EXPIRY_SECONDS);
                    setIsExpired(false);
                }

                setStep(2); // Pindah ke Step Instruksi Pembayaran

                if (!isExpired) {
                    toast.success('Instruksi pembayaran berhasil dibuat!');
                }
            }

        } catch (error) {
            console.error(error);
            toast.error('Koneksi bermasalah. Silakan coba lagi.');
        } finally {
            setLoadingPayment(false);
        }
    };

    // Handler Copy Nomor Virtual Account
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Nomor Virtual Account tersalin ke clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Handler Download QRIS Image
    const handleDownloadQR = () => {
        const svg = qrRef.current;
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new window.Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.href = pngFile;
            downloadLink.download = `QRIS-Payment-${paymentData?.orderId || 'order'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            toast.success("Gambar QRIS berhasil diunduh!");
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    // Premium Skeleton Loading
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-50/50 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
                    <div className="h-9 w-1/5 bg-slate-200 rounded-xl"></div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 h-96 bg-slate-200 rounded-2xl"></div>
                        <div className="w-full lg:w-96 h-80 bg-slate-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Guard Clause: Harus Login Terlebih Dahulu
    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center bg-white border border-slate-200/80 rounded-2xl p-8 shadow-md shadow-slate-200/30 space-y-5"
                >
                    <div className="flex justify-center">
                        <div className="bg-slate-50 border border-slate-100 shadow-inner p-4 rounded-2xl text-indigo-600">
                            <LogIn className="w-8 h-8 stroke-[1.8]" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Login Diperlukan</h2>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Silakan login ke akun Anda untuk menyelesaikan transaksi dan mendapatkan akses otomatis ke perpustakaan produk digital.
                        </p>
                    </div>
                    <Link href="/login?callbackUrl=/checkout" className="w-full h-12 flex items-center justify-center text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all">
                        Log In ke Akun Saya
                    </Link>
                </motion.div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-slate-50/40 py-8 md:py-12">
            <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Stepper Progress Bar */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Checkout Pembayaran</h1>
                            <p className="text-sm text-slate-500">Selesaikan transaksi produk digital menggunakan Xendit Payment Request V2.</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-slate-700">Enkripsi SSL Xendit 256-bit</span>
                        </div>
                    </div>

                    {/* STEPPER BAR */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 px-1">
                            <span className={step >= 1 ? 'text-indigo-600 flex items-center gap-1.5' : ''}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                                Pilih Metode
                            </span>
                            <span className={step >= 2 ? 'text-indigo-600 flex items-center gap-1.5' : ''}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                                Bayar
                            </span>
                            <span className={step === 3 ? 'text-emerald-600 flex items-center gap-1.5' : ''}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
                                Akses Produk
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${step === 3 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT COLUMN: Payment Process */}
                    <div className="flex-1 w-full space-y-6">

                        {/* ======================================================== */}
                        {/* STEP 1: PILIH METODE PEMBAYARAN                          */}
                        {/* ======================================================== */}
                        {step === 1 && (
                            <Card className="border-slate-200/80 bg-white rounded-2xl shadow-md shadow-slate-200/40 overflow-hidden">
                                <CardHeader className="pb-4 border-b border-slate-100">
                                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-indigo-600" />
                                        <span>Pilih Metode Pembayaran Xendit</span>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">

                                    {/* KATEGORI 1: QRIS */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                            <QrCode className="w-4 h-4 text-indigo-600" />
                                            <span>Instant QR Code (Aggregator)</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setMethod('qris')}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition text-left ${method === 'qris'
                                                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                }`}
                                        >
                                            <div>
                                                <span className="font-bold text-slate-900 text-sm block">QRIS (Scan Serbaguna)</span>
                                                <span className="text-xs text-slate-500 block mt-0.5">
                                                    BCA Mobile, Livin Mandiri, GoPay, OVO, DANA, ShopeePay, LinkAja
                                                </span>
                                            </div>
                                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${method === 'qris' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                                {method === 'qris' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                                            </span>
                                        </button>
                                    </div>

                                    {/* KATEGORI 2: E-WALLETS */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                            <Wallet className="w-4 h-4 text-emerald-600" />
                                            <span>E-Wallet Direct</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { id: 'gopay', name: 'GoPay', desc: 'Deeplink Gojek / GoPay' },
                                                { id: 'shopeepay', name: 'ShopeePay', desc: 'Aplikasi Shopee' },
                                                { id: 'dana', name: 'DANA', desc: 'Dompet Digital DANA' },
                                                { id: 'ovo', name: 'OVO', desc: 'Aplikasi OVO' },
                                            ].map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setMethod(item.id as PaymentMethodType)}
                                                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition text-left ${method === item.id
                                                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                        }`}
                                                >
                                                    <div>
                                                        <span className="font-bold text-slate-900 text-sm block">{item.name}</span>
                                                        <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                                                    </div>
                                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${method === item.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                                        {method === item.id && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* KATEGORI 3: VIRTUAL ACCOUNTS */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                            <Building2 className="w-4 h-4 text-blue-600" />
                                            <span>Virtual Account (Transfer Bank API V2)</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { id: 'bca', name: 'BCA Virtual Account', code: 'BCA' },
                                                { id: 'bni', name: 'BNI Virtual Account', code: 'BNI' },
                                                { id: 'bri', name: 'BRI Virtual Account', code: 'BRI' },
                                                { id: 'mandiri', name: 'Mandiri Virtual Account', code: 'MANDIRI' },
                                                { id: 'permata', name: 'Permata Virtual Account', code: 'PERMATA' },
                                            ].map((bank) => (
                                                <button
                                                    key={bank.id}
                                                    type="button"
                                                    onClick={() => setMethod(bank.id as PaymentMethodType)}
                                                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition text-left ${method === bank.id
                                                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                        }`}
                                                >
                                                    <div>
                                                        <span className="font-bold text-slate-900 text-sm block">{bank.name}</span>
                                                        <span className="text-[11px] text-slate-400 font-mono">Verifikasi Otomatis</span>
                                                    </div>
                                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${method === bank.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                                        {method === bank.id && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        type="button"
                                        onClick={handleCreatePayment}
                                        disabled={loadingPayment || !method}
                                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
                                    >
                                        {loadingPayment ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span>Membuat Payment Request Xendit...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Lanjut ke Instruksi Pembayaran</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </CardContent>
                            </Card>
                        )}

                        {/* ======================================================== */}
                        {/* STEP 2: HALAMAN INSTRUKSI PEMBAYARAN + TIMER            */}
                        {/* ======================================================== */}
                        {step === 2 && paymentData && (
                            <Card className="border-slate-200/80 bg-white rounded-2xl shadow-md shadow-slate-200/40 overflow-hidden">
                                <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-bold text-slate-900">
                                        Instruksi Pembayaran Xendit
                                    </CardTitle>
                                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        {method.toUpperCase()}
                                    </span>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">

                                    {/* Banner Countdown Timer */}
                                    <div className={`p-4 rounded-xl flex items-center justify-between border ${isExpired
                                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                                        : 'bg-amber-50/80 border-amber-200 text-amber-900'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <Clock className={`w-5 h-5 ${!isExpired && 'animate-pulse text-amber-600'}`} />
                                            <div>
                                                <span className="text-xs font-bold block">
                                                    {isExpired ? 'Waktu Pembayaran Habis' : 'Batas Waktu Pembayaran'}
                                                </span>
                                                <span className="text-[11px] text-slate-600">
                                                    {isExpired ? 'Kode pembayaran telah kedaluwarsa.' : 'Selesaikan transaksi sebelum timer berakhir.'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="font-mono font-black text-lg">
                                            {formatCountdown(timeLeft)}
                                        </span>
                                    </div>

                                    {isExpired ? (
                                        <div className="text-center py-8 space-y-4">
                                            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                                            <p className="text-sm text-slate-600">
                                                Kode pembayaran ini sudah kadaluarsa. Silakan buat ulang transaksi baru.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="bg-indigo-600 text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-indigo-700 transition"
                                            >
                                                Buat Ulang Pembayaran
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* --- DYNAMIC DISPLAY SESUAI METODE --- */}

                                            {/* 1. Tampilan QRIS */}
                                            {method === 'qris' && paymentData.qrString && (
                                                <div className="flex flex-col items-center space-y-4 py-2">
                                                    <div className="p-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm relative">
                                                        <QRCodeSVG
                                                            ref={qrRef}
                                                            value={paymentData.qrString}
                                                            size={210}
                                                            includeMargin={true}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleDownloadQR}
                                                        className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100 transition cursor-pointer"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Simpan / Download Gambar QRIS</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* 2. Tampilan E-Wallet (GoPay, ShopeePay, DANA, OVO) */}
                                            {['gopay', 'shopeepay', 'dana', 'ovo'].includes(method) && paymentData.deeplinkUrl && (
                                                <div className="text-center space-y-4 py-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                                                    <p className="text-xs text-slate-600 font-medium">
                                                        Klik tombol di bawah ini untuk membuka dan menyelesaikan pembayaran di aplikasi {method.toUpperCase()}:
                                                    </p>
                                                    <a
                                                        href={paymentData.deeplinkUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-600/20 text-sm"
                                                    >
                                                        <span>Buka Aplikasi {method.toUpperCase()}</span>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            )}

                                            {/* 3. Tampilan Virtual Account */}
                                            {['bca', 'bni', 'bri', 'mandiri', 'permata'].includes(method) && paymentData.accountNumber && (
                                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                                        Nomor Virtual Account {method.toUpperCase()}
                                                    </span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-2xl font-mono font-black text-slate-900 tracking-wider">
                                                            {paymentData.accountNumber}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(paymentData.accountNumber || '')}
                                                            className="flex items-center gap-1.5 bg-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition text-slate-700 cursor-pointer shadow-xs"
                                                        >
                                                            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                                            {copied ? 'Tersalin' : 'Salin Nomor'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Real-time Polling Status Indicator */}
                                            <div className="flex items-center justify-center gap-2.5 text-xs text-slate-500 py-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                                                <span>Menunggu verifikasi pembayaran otomatis dari Xendit Webhook...</span>
                                            </div>

                                            {/* ACCORDION CARA PEMBAYARAN */}
                                            <div className="border-t border-slate-100 pt-4 space-y-2">
                                                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Panduan Pembayaran:</p>

                                                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                                                        className="w-full text-left p-3.5 font-bold bg-slate-50 flex justify-between items-center text-slate-700"
                                                    >
                                                        <span>
                                                            {method === 'qris'
                                                                ? 'Cara Transfer via QRIS'
                                                                : ['bca', 'bni', 'bri', 'mandiri', 'permata'].includes(method)
                                                                    ? `Cara Transfer via Virtual Account ${method.toUpperCase()}`
                                                                    : `Cara Bayar via ${method.toUpperCase()}`}
                                                        </span>
                                                        {openAccordion === 1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>
                                                    {openAccordion === 1 && (
                                                        <div className="p-4 bg-white text-slate-600 space-y-2 border-t border-slate-100 leading-relaxed">
                                                            {method === 'qris' ? (
                                                                <ol className="list-decimal list-inside space-y-1.5">
                                                                    <li>Buka aplikasi Mobile Banking atau E-Wallet favorit Anda.</li>
                                                                    <li>Pilih menu **Scan QR / QRIS**.</li>
                                                                    <li>Arahkan kamera ke QR Code di atas (atau unggah hasil tangkapan layar/download QR).</li>
                                                                    <li>Periksa nominal tagihan **Rp {order.totalAmount.toLocaleString('id-ID')}** dan selesaikan transaksi dengan PIN Anda.</li>
                                                                </ol>
                                                            ) : ['bca', 'bni', 'bri', 'mandiri', 'permata'].includes(method) ? (
                                                                <ol className="list-decimal list-inside space-y-1.5">
                                                                    <li>Buka aplikasi Mobile Banking ({method.toUpperCase()}) Anda.</li>
                                                                    <li>Pilih menu **Transfer / Pembayaran** &gt; **Virtual Account**.</li>
                                                                    <li>Masukkan nomor Virtual Account: <strong className="font-mono text-slate-900">{paymentData.accountNumber}</strong>.</li>
                                                                    <li>Konfirmasi nama penerima dan nominal tagihan. Masukkan PIN transaksi Anda.</li>
                                                                </ol>
                                                            ) : (
                                                                <ol className="list-decimal list-inside space-y-1.5">
                                                                    <li>Klik tombol **Buka Aplikasi {method.toUpperCase()}** di atas.</li>
                                                                    <li>Anda akan diarahkan ke aplikasi {method.toUpperCase()} di perangkat Anda.</li>
                                                                    <li>Periksa rincian pembayaran dan selesaikan transaksi dengan PIN {method.toUpperCase()} Anda.</li>
                                                                </ol>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* DEV SIMULATION BUTTON */}
                                            <div className="pt-2 border-t border-slate-100 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setStep(3);
                                                        toast.success("[Dev Mode] Simulasi pembayaran sukses berhasil!");
                                                    }}
                                                    className="text-[11px] text-indigo-600 font-semibold underline hover:text-indigo-700 cursor-pointer"
                                                >
                                                    [Dev Mode] Simulasi Verifikasi Pembayaran Sukses Direct
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Button Back / Change Method */}
                                    <button
                                        type="button"
                                        onClick={handleCancelAndChangeMethod}
                                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2 cursor-pointer"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>{cancelling ? "Membatalkan..." : "Pilih Metode Pembayaran Lain"}</span>
                                    </button>

                                </CardContent>
                            </Card>
                        )}

                        {/* ======================================================== */}
                        {/* STEP 3: SUCCESS PAGE & AKSES PRODUK                      */}
                        {/* ======================================================== */}
                        {step === 3 && (
                            <Card className="border-slate-200/80 bg-white rounded-2xl shadow-md shadow-slate-200/40 overflow-hidden">
                                <CardContent className="p-8 text-center space-y-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                                        className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"
                                    >
                                        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                                    </motion.div>

                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pembayaran Berhasil!</h2>
                                        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                                            Transaksi Anda telah terverifikasi oleh Xendit. Hak akses produk digital telah otomatis ditambahkan ke perpustakaan akun Anda.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 space-y-3 max-w-sm mx-auto">
                                        <Link
                                            href="/library"
                                            className="w-full h-12 flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all"
                                        >
                                            <ShieldCheck className="w-5 h-5" />
                                            <span>Buka Perpustakaan Digital Saya</span>
                                        </Link>

                                        <Link
                                            href="/orders"
                                            className="w-full h-11 flex items-center justify-center text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-700"
                                        >
                                            Lihat Riwayat Pesanan
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    </div>

                    {/* RIGHT COLUMN: Order Summary Card */}
                    <div className="w-full lg:w-96 shrink-0 sticky top-24">
                        <Card className="border-slate-200/80 bg-white rounded-2xl shadow-md shadow-slate-200/40 overflow-hidden">
                            <CardHeader className="border-b border-slate-100">
                                <CardTitle className="text-base font-bold text-slate-900">Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">

                                {/* List Item Produk Digital */}
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                                    {order.items.map((item) => {
                                        const product = item.product
                                        const itemId = item.id;
                                        const imageUrl = item.product?.coverImage || "";

                                        return (
                                            <div key={itemId} className="flex gap-3.5 items-center p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 shadow-2xs">
                                                <div className="relative w-12 h-12 shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/40 shadow-inner">
                                                    {imageUrl ? (
                                                        // <img
                                                        //     src={imageUrl}
                                                        //     alt={product.name}
                                                        //     className="object-cover w-full h-full"
                                                        // />
                                                        <Image
                                                            src={imageUrl}
                                                            alt={product.name}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <ShoppingBag className="w-5 h-5 text-slate-400 m-auto" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                                                    <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider mt-0.5">
                                                        Rp {product.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Separator className="bg-slate-100" />

                                {/* Subtotal Rincian */}
                                <div className="space-y-2 text-xs font-medium text-slate-500">
                                    <div className="flex justify-between items-center">
                                        <span>Total Produk</span>
                                        <span className="font-bold text-slate-900">{order.items.length} Item</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Biaya Transaksi (Xendit)</span>
                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide text-[10px]">Gratis</span>
                                    </div>
                                </div>

                                <Separator className="bg-slate-100" />

                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-700">Total Tagihan</span>
                                    <span className="text-xl font-black text-slate-900 leading-none">
                                        Rp {order.totalAmount.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;