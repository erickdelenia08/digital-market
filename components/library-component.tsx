"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Search,
    Sparkles,
    // Calendar,
    Layers,
    ArrowUpRight,
    // X,
    ChevronDown,
    Check,
    // Filter,
    // FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AssetsModal from '@/components/asset-modal';
import Image from 'next/image';

export interface LibraryProduct {
    id: string;
    name: string;
    type: string;
    category: string;
    coverImage: string;
    purchaseDate: string;
    timestamp: number;
    digitalAssets: {
        id: string;
        name: string;
        fileUrl: string | null;
        linkUrl: string | null;
        type: string;
        fileSize: number | null;
        extension: string | null;
    }[];
}

const SORT_OPTIONS = [
    { value: "NEWEST", label: "Newest" },
    { value: "OLDEST", label: "Oldest" },
    { value: "AZ", label: "Name: A - Z" }
];


export default function ScalableLibraryComponent({ initialProducts }: { initialProducts: LibraryProduct[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("NEWEST");

    const categoryOptions = useMemo(() => {
        // Mengambil nilai category & type dari setiap produk user
        const rawCategories = initialProducts.flatMap(item => [item.category, item.type]);

        // Menyaring nilai null/undefined/kosong dan mengambil nilai unik
        const uniqueCategories = Array.from(
            new Set(rawCategories.filter((cat): cat is string => Boolean(cat)))
        );

        // Format menjadi array of object { value, label }
        const dynamicOptions = uniqueCategories.map(cat => ({
            value: cat,
            label: cat
        }));

        // Selalu sertakan pilihan "All Categories" di paling atas
        return [
            { value: "ALL", label: "All Categories" },
            ...dynamicOptions
        ];
    }, [initialProducts]);


    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<LibraryProduct | null>(null);

    // Dropdown visibility states
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Get active labels for premium layout display
    const currentCategoryLabel = categoryOptions.find(c => c.value === selectedCategory)?.label || "All Categories";
    const currentSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label || "Newest";

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        const result = initialProducts.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' ||
                item.type === selectedCategory ||
                item.category === selectedCategory;
            // const matchesTag = !selectedTag || item.tags.includes(selectedTag);

            return matchesSearch && matchesCategory;
        });

        // Real Execution Sorting
        if (sortBy === "NEWEST") result.sort((a, b) => b.timestamp - a.timestamp);
        if (sortBy === "OLDEST") result.sort((a, b) => a.timestamp - b.timestamp);
        if (sortBy === "AZ") result.sort((a, b) => a.name.localeCompare(b.name));

        return result;
    }, [searchQuery, selectedCategory, selectedTag, sortBy]);

    const activeFilterCount = (selectedCategory !== "ALL" ? 1 : 0) + (selectedTag ? 1 : 0) + (searchQuery ? 1 : 0);

    const handleResetAll = () => {
        setSearchQuery("");
        setSelectedCategory("ALL");
        setSelectedTag(null);
        setSortBy("NEWEST");
    };

    return (
        <div className="min-h-screen bg-slate-50/40 py-12">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* --- HEADER BLOCK --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-accent-indigo/5 border border-accent-indigo/10 rounded-xl shadow-inner text-accent-indigo">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-primary-900 tracking-tight">
                                Assets Library
                            </h1>
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                            Access and manage all premium digital asset licenses you have secured.
                        </p>
                    </div>

                    {/* Stats Embossed Pill */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Assets</span>
                        <span className="text-xs font-black bg-accent-indigo/5 text-accent-indigo border border-accent-indigo/10 px-2.5 py-0.5 rounded-lg shadow-inner">
                            {initialProducts.length} Assets
                        </span>
                    </div>
                </div>

                {/* --- FILTER CONTROLS BAR --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                    {/* Premium Kaca Pembesar Input (Col 6) */}
                    <div className="relative md:col-span-6 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent-indigo transition-colors duration-200" />
                        <input
                            type="text"
                            placeholder="Search your digital assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-accent-indigo focus:ring-4 focus:ring-accent-indigo/10 outline-none transition-all duration-200 shadow-sm"
                        />
                    </div>

                    {/* Custom Category Dropdown Trigger (Col 4) */}
                    <div className="relative md:col-span-4">
                        <button
                            onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsSortOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        >
                            <span className="truncate">Category: <span className="text-primary-900 font-bold">{currentCategoryLabel}</span></span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoryOpen && <div className="fixed inset-0 z-30" onClick={() => setIsCategoryOpen(false)} />}

                        <AnimatePresence>
                            {isCategoryOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-40 max-h-60 overflow-y-auto"
                                >
                                    {categoryOptions.map((cat) => {
                                        const isSelected = selectedCategory === cat.value;
                                        return (
                                            <button
                                                key={cat.value}
                                                onClick={() => { setSelectedCategory(cat.value); setIsCategoryOpen(false); }}
                                                className={`flex w-full items-center justify-between text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isSelected ? 'bg-slate-50 text-accent-indigo font-bold' : 'hover:bg-slate-50/80 text-slate-600 hover:text-primary-900'
                                                    }`}
                                            >
                                                <span>{cat.label}</span>
                                                {isSelected && <Check className="w-4 h-4 text-accent-indigo stroke-[3]" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Custom Sort Dropdown Trigger (Col 2) */}
                    <div className="relative md:col-span-2">
                        <button
                            onClick={() => { setIsSortOpen(!isSortOpen); setIsCategoryOpen(false); }}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        >
                            <span className="truncate">Sort: {currentSortLabel}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortOpen && <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />}

                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 w-44 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-40 origin-top-right"
                                >
                                    {SORT_OPTIONS.map((opt) => {
                                        const isSelected = sortBy === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                                                className={`flex w-full items-center justify-between text-left py-2 px-3 rounded-lg text-xs font-bold transition-colors ${isSelected ? 'bg-slate-50 text-accent-indigo' : 'hover:bg-slate-50/80 text-slate-600'
                                                    }`}
                                            >
                                                <span>{opt.label}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-accent-indigo stroke-[3]" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* --- TAG CHIPS FILTERS --- */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    {/* Tactile Reset Action */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={handleResetAll}
                            className="text-xs font-black text-red-500 hover:text-red-600 hover:underline shrink-0 ml-auto pl-4 transition-colors"
                        >
                            Reset Filter ({activeFilterCount})
                        </button>
                    )}
                </div>

                {/* --- MOTION CONTAINER FOR CARDS GRID --- */}
                <motion.div layout className="w-full">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="text-center py-20 bg-white border border-slate-200/80 rounded-2xl shadow-md p-8"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-400 shadow-inner">
                                        <Layers className="w-8 h-8 stroke-[1.5]" />
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-primary-900 mb-1">Asset not found</h3>
                                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                                    Please check your search keywords or reset filters to display all items.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.28, ease: "easeInOut" }}
                                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-md shadow-slate-200/30 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full"
                                    >
                                        {/* Canvas Preview Area */}
                                        <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                                            <Image
                                                src={item.coverImage}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-103 transition-transform duration-500"
                                            />
                                            {/* Raised Platform Token Type Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md text-white shadow-md border uppercase ${item.type === 'CANVA' ? 'bg-cyan-600 border-cyan-500 shadow-cyan-600/10' :
                                                    item.type === 'CAPCUT' ? 'bg-slate-900 border-slate-800 shadow-slate-900/10' :
                                                        'bg-emerald-600 border-emerald-500 shadow-emerald-600/10'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Info Details */}
                                        <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                                            <div className="space-y-2.5">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-indigo uppercase tracking-wider">
                                                    <span>{item.category}</span>
                                                </div>
                                                <h3 className="font-bold text-base text-primary-900 line-clamp-2 group-hover:text-accent-indigo transition-colors duration-200 leading-snug">
                                                    {item.name}
                                                </h3>
                                            </div>

                                            {/* Action Control Blocks */}
                                            <div className="space-y-2 pt-1 mt-auto">
                                                <Button
                                                    onClick={() => {
                                                        if (item.digitalAssets.length === 1) {
                                                            const asset = item.digitalAssets[0];
                                                            if (asset.type === 'LINK' && asset.linkUrl) {
                                                                window.open(asset.linkUrl, '_blank');
                                                            } else {
                                                                const downloadUrl = `/api/downloads/${asset.id}`;
                                                                const a = document.createElement('a');
                                                                a.href = downloadUrl;
                                                                a.setAttribute('download', '');
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                            }
                                                        } else if (item.digitalAssets.length > 1) {
                                                            setSelectedProduct(item);
                                                            setIsModalOpen(true);
                                                        }
                                                    }}
                                                    disabled={item.digitalAssets.length === 0}
                                                    className="w-full h-11 text-xs font-bold rounded-xl bg-primary-900 hover:bg-primary-950 text-white shadow-lg shadow-primary-900/15 border border-primary-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group/btn flex items-center justify-center gap-1.5"
                                                >
                                                    <span>{item.digitalAssets.length > 1 ? "Pilih Asset / Download" : "Akses / Download"}</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>

            <AssetsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Assets: ${selectedProduct?.name || ''}`}
                description="Select and download individual assets included in this package:"
                assets={selectedProduct?.digitalAssets || []}
            />
        </div>
    );
}