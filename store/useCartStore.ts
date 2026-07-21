// src/store/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockProduct } from "@/mock-data/product";

interface CartState {
    cart: MockProduct[];
    totalAmount: number;

    // Actions
    addToCart: (product: MockProduct) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            totalAmount: 0,
            _hasHydrated: false, // Default false di sisi server
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            addToCart: (product) =>
                set((state) => {
                    const isExist = state.cart.some((item) => item.id === product.id);
                    if (isExist) return state;

                    const updatedCart = [...state.cart, product];
                    const updatedTotal = updatedCart.reduce((sum, item) => sum + item.price, 0);

                    return {
                        cart: updatedCart,
                        totalAmount: updatedTotal,
                    };
                }),

            removeFromCart: (productId) =>
                set((state) => {
                    const updatedCart = state.cart.filter((item) => item.id !== productId);
                    const updatedTotal = updatedCart.reduce((sum, item) => sum + item.price, 0);

                    return {
                        cart: updatedCart,
                        totalAmount: updatedTotal,
                    };
                }),

            clearCart: () => set({ cart: [], totalAmount: 0 }),
        }),
        {
            name: "tokodigital-cart-storage",
            // 🌟 TAMBAHKAN BAGIAN INI BIAR OTOMATIS BERUBAH JADI TRUE DI BROWSER
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);