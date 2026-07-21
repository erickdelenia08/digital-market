// src/store/useProductStore.ts
import { create } from "zustand";
import { MockProduct, MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/mock-data/product"; // Sesuaikan path-nya

interface ProductState {
    products: MockProduct[];
    categories: typeof MOCK_CATEGORIES;
    isLoading: boolean;

    // Actions
    fetchProducts: () => Promise<void>; // Nanti digunakan untuk sinkronisasi database asli
    addProduct: (newProduct: MockProduct) => void; // Simulasi fitur admin
    deleteProduct: (productId: string) => void;    // Simulasi fitur admin
}

export const useProductStore = create<ProductState>((set) => ({
    // Inisialisasi awal menggunakan mock data kita
    products: MOCK_PRODUCTS,
    categories: MOCK_CATEGORIES,
    isLoading: false,

    fetchProducts: async () => {
        set({ isLoading: true });
        // Simulasi delay jaringan seolah-olah sedang mengambil data dari MySQL selama 0.5 detik
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ products: MOCK_PRODUCTS, isLoading: false });
    },

    addProduct: (newProduct) =>
        set((state) => ({
            products: [newProduct, ...state.products],
        })),

    deleteProduct: (productId) =>
        set((state) => ({
            products: state.products.filter((p) => p.id !== productId),
        })),
}));