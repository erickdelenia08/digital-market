"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/useCartStore';
import { getCart } from '@/app/actions/cart';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CheckoutButton from '@/components/checkout-button';
import { User, ShieldCheck, ShoppingBag, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const { cart: localCart, _hasHydrated } = useCartStore();
    const [dbCart, setDbCart] = useState<any[]>([]);
    const [isLoadingDb, setIsLoadingDb] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    // 1. Ambil data pilihan dari SessionStorage saat mounting
    useEffect(() => {
        const saved = sessionStorage.getItem('selected_cart_ids');
        if (saved) {
            try {
                setSelectedIds(JSON.parse(saved));
            } catch (e) {
                console.error("Gagal load dari storage", e);
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
            return selectedIds.includes(String(currentId));
        });
    }, [activeCart, selectedIds, isReady, isHybrid]);

    const subtotal = checkoutItems.reduce((total: number, item: any) => {
        const product = isHybrid ? item.product : item;
        return total + (product?.price || 0);
    }, 0);

    // Premium Skeleton Loading
    if (status === "loading" || (!isHybrid && !_hasHydrated) || (isHybrid && isLoadingDb) || !isReady) {
        return (
            <div className="min-h-screen bg-slate-50/50 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
                    <div className="h-9 w-1/5 bg-slate-200 rounded-xl"></div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 h-52 bg-slate-200 rounded-2xl"></div>
                        <div className="w-full lg:w-96 h-80 bg-slate-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Guard Clause: Harus Login Terlebih Dahulu (Premium Look)
    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center bg-white border border-slate-200/80 rounded-2xl p-8 shadow-md shadow-slate-200/30 space-y-5"
                >
                    <div className="flex justify-center">
                        <div className="bg-slate-50 border border-slate-100 shadow-inner p-4 rounded-2xl text-accent-indigo">
                            <LogIn className="w-8 h-8 stroke-[1.8]" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-bold text-primary-900 tracking-tight">Authentication Required</h2>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Please log in to tie your canvas templates, presets, or software licenses securely to your personal account.
                        </p>
                    </div>
                    <Button asChild className="w-full h-12 text-sm font-bold rounded-xl bg-primary-900 hover:bg-primary-955 text-white shadow-lg shadow-primary-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <Link href="/login?callbackUrl=/checkout">Log In to Secure Account</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Guard Clause: Jika Tidak Ada Item yang Dipilih
    if (checkoutItems.length === 0) {
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
                        <h2 className="text-xl font-bold text-primary-900 tracking-tight">No items selected</h2>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Your checkout queue is empty. Please check the items you want to process inside your active shopping cart.
                        </p>
                    </div>
                    <Button asChild className="w-full h-12 text-sm font-bold rounded-xl bg-white text-primary-900 border border-slate-200 shadow-sm hover:shadow hover:border-slate-300 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <Link href="/cart" className="flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Return to Cart</span>
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/40 py-12">
            <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Title */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-primary-900 tracking-tight">Secure Checkout</h1>
                    <p className="mt-1 text-sm text-slate-500">Double-check your account details and review your selected files.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT COLUMN: Access Account Details */}
                    <div className="flex-1 w-full space-y-6">
                        <Card className="border-slate-200/80 bg-white rounded-2xl shadow-md shadow-slate-200/40 overflow-hidden transition-all hover:shadow-lg">
                            <CardHeader className="pb-4 border-b border-slate-100">
                                <CardTitle className="text-base font-bold text-primary-900 flex items-center gap-2.5">
                                    <User className="w-4 h-4 text-accent-indigo stroke-[2.5]" />
                                    <span>Access Delivery Account</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                {/* Raised Container for Account Details */}
                                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl shadow-inner space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Licensee</p>
                                    <p className="text-base font-bold text-primary-900">{session.user?.name || "Premium Client"}</p>
                                    <p className="text-sm font-medium text-slate-500">{session.user?.email}</p>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-emerald-50/60 border border-emerald-100/80 rounded-xl">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                                        Your digital asset master links will be automatically injected into this account's Dashboard. A cryptographic invoice copy will instantly land in your email inbox upon verification.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Order Review Summary (Readonly Showcase) */}
                    <div className="w-full lg:w-96 shrink-0 sticky top-24">
                        <Card className="border-slate-200/80 bg-white rounded-2xl shadow-md shadow-slate-200/40 overflow-hidden">
                            <CardHeader className="border-b border-slate-100">
                                <CardTitle className="text-base font-bold text-primary-900">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">

                                {/* List Item Produk Digital dengan Custom Scrollbar */}
                                <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1.5 scrollbar-thin">
                                    {checkoutItems.map((item: any) => {
                                        const product = isHybrid ? item.product : item;
                                        const itemId = isHybrid ? item.productId : item.id;
                                        const imageUrl = product.media?.[0]?.url || product.coverImage || "";

                                        return (
                                            <div key={itemId} className="flex gap-3.5 items-center p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="relative w-12 h-12 shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/40 shadow-inner">
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-primary-900 truncate">{product.name}</h4>
                                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Digital Access Pass</p>
                                                    <p className="text-xs font-extrabold text-accent-indigo mt-0.5">
                                                        Rp {product.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Separator className="bg-slate-100" />

                                {/* Subtotal Rincian */}
                                <div className="space-y-2.5 text-sm font-medium text-slate-500">
                                    <div className="flex justify-between items-center">
                                        <span>Total Vault Assets</span>
                                        <span className="font-bold text-primary-900">{checkoutItems.length} File{checkoutItems.length > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Instant Setup Fee</span>
                                        <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">Free</span>
                                    </div>
                                </div>

                                <Separator className="bg-slate-100" />

                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-800">Total Settlement</span>
                                    <span className="text-xl font-black text-primary-900 leading-none">
                                        Rp {subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </CardContent>

                            {/* Container Inject Button Utama */}
                            <CardFooter className="p-5 pt-0 bg-white">
                                <div className="w-full [&_button]:w-full [&_button]:h-12 [&_button]:rounded-xl [&_button]:font-bold [&_button]:shadow-lg [&_button]:shadow-primary-900/15 [&_button]:border-primary-900 [&_button]:transition-all [&_button]:duration-200 [&_button:hover]:-translate-y-0.5 [&_button:hover]:shadow-xl [&_button:active]:translate-y-0">
                                    <CheckoutButton />
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;