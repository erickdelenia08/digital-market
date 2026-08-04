'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts } from '@/lib/product';
import Image from 'next/image';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: number;
    coverImage: string | null;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const debouncedQuery = useDebounce(searchQuery, 500);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setSearchQuery('');
            setResults([]);
        }
    }

    const handleClose = React.useCallback(() => {
        onClose();
    }, [onClose]);

    // Fetch data berdasarkan debounced query
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchProducts(debouncedQuery);
                setResults(data || []);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Handle shortcut Cmd+K dan ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (isOpen) handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-start justify-center pt-24 sm:pt-32 px-4">
                    {/* Backdrop Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                    >
                        {/* Form Input */}
                        <form onSubmit={handleSearch} className="relative flex items-center p-4 border-b border-slate-100">
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 text-slate-400 mr-3 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5 text-slate-400 mr-3" />
                            )}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, brands, or categories..."
                                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-base sm:text-lg"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-xs font-medium text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md px-1.5 py-0.5 ml-3 cursor-pointer"
                            >
                                ESC
                            </button>
                        </form>

                        {/* Area Hasil Pencarian / Status */}
                        <div className="max-h-80 overflow-y-auto p-2 bg-slate-50/50">
                            {/* State 1: Ketikan kurang dari 2 karakter */}
                            {searchQuery.trim().length < 2 && (
                                <div className="p-6 text-sm text-slate-400 flex flex-col items-center justify-center gap-1">
                                    <p className="font-medium text-slate-600">Start typing to search</p>
                                    <p className="text-xs text-slate-400">Type at least 2 characters...</p>
                                </div>
                            )}

                            {/* State 2: Tidak menemukan hasil */}
                            {!isLoading && searchQuery.trim().length >= 2 && results.length === 0 && (
                                <div className="p-6 text-sm text-slate-400 text-center">
                                    No products found for &quot;<span className="font-medium text-slate-600">{searchQuery}</span>&quot;
                                </div>
                            )}

                            {/* State 3: Menampilkan List Hasil */}
                            {results.length > 0 && (
                                <div className="flex flex-col gap-1">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.slug}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                                        >
                                            {product.coverImage ? (
                                                <Image
                                                    src={product.coverImage}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Search className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 truncate">{product.name}</p>
                                                <p className="text-xs text-primary-900 font-semibold">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};