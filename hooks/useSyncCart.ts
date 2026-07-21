'use client'

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { addToCart } from '@/app/actions/cart';

export function useSyncCart(userId: string | undefined) {
    const cart = useCartStore((state) => state.cart);
    const clearCart = useCartStore((state) => state.clearCart);
    const _hasHydrated = useCartStore((state) => state._hasHydrated);

    // useRef digunakan untuk mencegah sinkronisasi ganda (double-running) akibat React StrictMode
    const isSyncing = useRef(false);

    useEffect(() => {
        async function sync() {
            // 1. Validasi: Jangan sinkronisasi jika user belum login, keranjang kosong, atau belum selesai hidrasi localStorage
            if (!userId || cart.length === 0 || !_hasHydrated || isSyncing.current) return;

            try {
                isSyncing.current = true;

                // 2. Kirim setiap produk dari Zustand ke database secara paralel
                // Server Action kini hanya butuh userId dan item.id (karena produk digital)
                const promises = cart.map((item) =>
                    addToCart(userId, item.id)
                );

                await Promise.all(promises);

                // 3. Bersihkan keranjang lokal di Zustand setelah data aman di database
                clearCart();
            } catch (error) {
                console.error("Gagal menyelaraskan keranjang ke database:", error);
            } finally {
                isSyncing.current = false;
            }
        }

        sync();
    }, [userId, cart, clearCart, _hasHydrated]);
}