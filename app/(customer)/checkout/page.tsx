"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/useCartStore';
import { getCart } from '@/app/actions/cart';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Clock, Copy, Check, ChevronDown, ChevronUp,
    Download, ShieldCheck, ExternalLink, RefreshCw,
    CheckCircle2, ArrowLeft, AlertCircle, LogIn, ShoppingBag,
    QrCode, Wallet, Building2, CreditCard, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type PaymentData = {
    order_id?: string;
    qr_string?: string;
    deeplink_url?: string;
    account_number?: string;
    bank_code?: string;
    reference_id?: string;
};

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

const CheckoutPage = () => {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const { cart: localCart, _hasHydrated } = useCartStore();
    const [dbCart, setDbCart] = useState<any[]>([]);
    const [isLoadingDb, setIsLoadingDb] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    // Checkout Flow States: Step 1 = Select Method, Step 2 = Payment Pending, Step 3 = Payment Success
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [method, setMethod] = useState<PaymentMethodType | ''>('qris');
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

    // UI Interactive States
    const [copied, setCopied] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<number | null>(1);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit countdown
    const [isExpired, setIsExpired] = useState(false);

    const qrRef = useRef<SVGSVGElement>(null);

    // 1. Ambil data pilihan dari SessionStorage saat mounting
    useEffect(() => {
        const saved = sessionStorage.getItem('selected_cart_ids');
        if (saved) {
            try {
                setSelectedIds(JSON.parse(saved));
            } catch (e) {
                console.error("Gagal load pilihan cart dari storage", e);
            }
        }
        setIsReady(true);
    }, []);

    // 2. Fetch cart dari DB jika user authenticated
    useEffect(() => {
        if (userId) {
            setIsLoadingDb(true);
            getCart(userId).then(res => {
                setDbCart(res || []);
                setIsLoadingDb(false);
            });
        }
    }, [userId]);

    const isHybrid = !!userId;
    const activeCart = isHybrid ? dbCart : localCart;

    const checkoutItems = useMemo(() => {
        if (!isReady || !activeCart || activeCart.length === 0) return [];

        return activeCart.filter(item => {
            const currentId = isHybrid ? item.productId : item.id;
            return selectedIds.length === 0 || selectedIds.includes(String(currentId));
        });
    }, [activeCart, selectedIds, isReady, isHybrid]);

    const subtotal = checkoutItems.reduce((total: number, item: any) => {
        const product = isHybrid ? item.product : item;
        return total + (product?.price || 0);
    }, 0);

    // 3. Countdown Timer Logic (Step 2)
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

    // 4. Real-time Status Polling dari Database / Webhook Xendit
    useEffect(() => {
        if (step !== 2 || !paymentData?.order_id || isExpired) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/orders/check-status?order_id=${paymentData.order_id}`);
                const data = await res.json();

                if (data.status === 'COMPLETED' || data.status === 'PAID' || data.status === 'SETTLED') {
                    setStep(3); // Transisi otomatis ke Step Success
                    toast.success("Pembayaran berhasil diverifikasi!");
                }
            } catch (err) {
                console.error("Error checking payment status:", err);
            }
        }, 3000); // Polling tiap 3 detik

        return () => clearInterval(interval);
    }, [step, paymentData, isExpired]);

    // Format Countdown ke Format MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Handler Request Payment ke Backend Xendit Payment Request V2 API
    const handleCreatePayment = async () => {
        if (!method) {
            toast.error('Silakan pilih metode pembayaran terlebih dahulu!');
            return;
        }

        if (checkoutItems.length === 0) {
            toast.error('Keranjang belanja Anda kosong.');
            return;
        }

        setLoadingPayment(true);
        setPaymentData(null);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: subtotal,
                    method: method,
                    selectedIds: checkoutItems.map(item => isHybrid ? item.productId : item.id),
                }),
            });

            const data = await res.json();

            if (res.ok && data.order_id) {
                setPaymentData(data);
                setTimeLeft(15 * 60); // Reset timer ke 15 menit
                setIsExpired(false);
                setStep(2); // Pindah ke Step Instrukasi Pembayaran
                toast.success('Instruksi pembayaran berhasil dibuat!');
            } else {
                toast.error(data.message || 'Gagal memproses pembayaran dengan Xendit.');
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
        const img = new Image();

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
            downloadLink.download = `QRIS-Payment-${paymentData?.order_id || 'order'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            toast.success("Gambar QRIS berhasil diunduh!");
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    // Premium Skeleton Loading
    if (status === "loading" || (!isHybrid && !_hasHydrated) || (isHybrid && isLoadingDb) || !isReady) {
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

    // Guard Clause: Jika Tidak Ada Item yang Dipilih
    if (checkoutItems.length === 0 && step === 1) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center bg-white border border-slate-200/80 rounded-2xl p-8 shadow-md shadow-slate-200/30 space-y-5"
                >
                    <div className="flex justify-center">
                        <div className="bg-slate-50 border border-slate-100 shadow-inner p-4 rounded-2xl text-slate-400">
                            <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tidak Ada Produk Dipilih</h2>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Antrean checkout Anda kosong. Silakan pilih produk dari keranjang belanja Anda.
                        </p>
                    </div>
                    <Link href="/cart" className="w-full h-12 flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-white text-slate-900 border border-slate-200 shadow-xs hover:bg-slate-50 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Keranjang Belanja</span>
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
                                        disabled={loadingPayment || !method || checkoutItems.length === 0}
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
                                            {formatTime(timeLeft)}
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
                                            {method === 'qris' && paymentData.qr_string && (
                                                <div className="flex flex-col items-center space-y-4 py-2">
                                                    <div className="p-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm relative">
                                                        <QRCodeSVG
                                                            ref={qrRef}
                                                            value={paymentData.qr_string}
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
                                            {['gopay', 'shopeepay', 'dana', 'ovo'].includes(method) && paymentData.deeplink_url && (
                                                <div className="text-center space-y-4 py-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                                                    <p className="text-xs text-slate-600 font-medium">
                                                        Klik tombol di bawah ini untuk membuka dan menyelesaikan pembayaran di aplikasi {method.toUpperCase()}:
                                                    </p>
                                                    <a
                                                        href={paymentData.deeplink_url}
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
                                            {['bca', 'bni', 'bri', 'mandiri', 'permata'].includes(method) && paymentData.account_number && (
                                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                                        Nomor Virtual Account {method.toUpperCase()}
                                                    </span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-2xl font-mono font-black text-slate-900 tracking-wider">
                                                            {paymentData.account_number}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(paymentData.account_number || '')}
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
                                                                    <li>Periksa nominal tagihan **Rp {subtotal.toLocaleString('id-ID')}** dan selesaikan transaksi dengan PIN Anda.</li>
                                                                </ol>
                                                            ) : ['bca', 'bni', 'bri', 'mandiri', 'permata'].includes(method) ? (
                                                                <ol className="list-decimal list-inside space-y-1.5">
                                                                    <li>Buka aplikasi Mobile Banking ({method.toUpperCase()}) Anda.</li>
                                                                    <li>Pilih menu **Transfer / Pembayaran** &gt; **Virtual Account**.</li>
                                                                    <li>Masukkan nomor Virtual Account: <strong className="font-mono text-slate-900">{paymentData.account_number}</strong>.</li>
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
                                        onClick={() => setStep(1)}
                                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2 cursor-pointer"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Pilih Metode Pembayaran Lain</span>
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
                                    {checkoutItems.map((item: any) => {
                                        const product = isHybrid ? item.product : item;
                                        const itemId = isHybrid ? item.productId : item.id;
                                        const imageUrl = product.media?.[0]?.url || product.coverImage || "";

                                        return (
                                            <div key={itemId} className="flex gap-3.5 items-center p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 shadow-2xs">
                                                <div className="relative w-12 h-12 shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/40 shadow-inner">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={product.name}
                                                            className="object-cover w-full h-full"
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
                                        <span className="font-bold text-slate-900">{checkoutItems.length} Item</span>
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
                                        Rp {subtotal.toLocaleString('id-ID')}
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