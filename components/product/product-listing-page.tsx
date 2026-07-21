"use client";

import React, { useMemo, useState } from 'react';
import { Filter, SortAsc, ChevronDown, X, Check, ChevronLeft, ChevronRight, Star, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Product } from '@prisma/client';

interface ProductListingPageProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

const ITEMS_PER_PAGE = 6; // Mengatur jumlah produk per halaman

const ProductListingPage = ({ initialProducts, initialCategories }: ProductListingPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const products = initialProducts;
  const categories = initialCategories;

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest' },
  ];


  const brands = ['Microsoft', 'Adobe', 'Motion'];
  const [selectedBrands] = useState<string[]>([]);

  // 1. Ambil State Filter & Pagination dari URL Params
  const categorySlug = searchParams.get('category');
  const sortBy = searchParams.get('sort') || 'featured';
  const page = Number(searchParams.get('page')) || 1;

  const [isSortOpen, setIsSortOpen] = useState(false);
  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Featured';

  // State lokal untuk search input (agar tidak re-render berat setiap mengetik)
  const [searchQuery, setSearchQuery] = useState('');

  // Cocokkan slug kategori di URL dengan data kategori
  const selectedCategoryObj = categories.find(c => c.slug === categorySlug);

  // 2. FILTERING & SORTING LOGIC (Menggunakan useMemo)
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter Kategori
    if (selectedCategoryObj) {
      result = result.filter(p => p.categoryId === selectedCategoryObj.id);
    }

    // Filter Search Bar
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting Logic
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.averageRating - a.averageRating);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return result;
  }, [products, selectedCategoryObj, searchQuery, sortBy]);

  // 3. PAGINATION LOGIC
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, page]);

  const activeFilterCount = (categorySlug ? 1 : 0) + (searchQuery ? 1 : 0);

  // 4. HANDLER UNTUK MODIFIKASI URL PARAMS
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (slug: string | null) => {
    updateQueryParams({ category: slug, page: '1' }); // Reset ke page 1 tiap ganti filter
  };

  const handleSortChange = (value: string) => {
    updateQueryParams({ sort: value, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateQueryParams({ page: newPage.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Efek scroll halus ke atas saat ganti page
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary-900">All Products</h1>
              <p className="mt-1 text-slate-600">
                Showing <span className="font-semibold text-primary-900">{filteredAndSortedProducts.length}</span> products
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              {/* Sort & Filter Section */}
              <div className="flex items-center gap-4">
                <div className="relative">

                  {/* Tombol Trigger (Menggantikan Select Bawaan) */}
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2.5 pl-4 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 min-w-[180px] justify-between"
                  >
                    <span className="text-slate-600 font-medium">
                      Sort: <span className="text-primary-900 font-bold">{currentSortLabel}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Jembatan Klik Luar untuk Menutup Dropdown */}
                  {isSortOpen && (
                    <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />
                  )}

                  {/* Kard Dropdown Menu (Framer Motion) */}
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -4 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl shadow-slate-900/5 border border-slate-100 p-1.5 z-40 origin-top-right"
                      >
                        <ul className="flex flex-col gap-0.5 text-sm font-medium text-slate-600">
                          {sortOptions.map((option) => {
                            const isSelected = sortBy === option.value;
                            return (
                              <li key={option.value}>
                                <button
                                  onClick={() => {
                                    handleSortChange(option.value);
                                    setIsSortOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between text-left py-2 px-3.5 rounded-lg transition-colors ${isSelected
                                    ? 'bg-slate-50 text-accent-indigo font-bold'
                                    : 'hover:bg-slate-50/80 hover:text-primary-900'
                                    }`}
                                >
                                  <span>{option.label}</span>
                                  {isSelected && <Check className="w-4 h-4 text-accent-indigo stroke-[3]" />}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tombol Clear Filters (Tetap Sama) */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear ({activeFilterCount})
                  </button>
                )}
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-accent-indigo transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters ({activeFilterCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sticky top-24 shadow-sm shadow-slate-100">

              {/* Header Sidebar */}
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
                <Filter className="w-4 h-4 text-slate-500" />
                <h2 className="text-base font-bold text-primary-900">Filters</h2>
              </div>

              {/* 1. Search Input Section */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Search Product
                </label>
                <div className="relative group">
                  {/* Kaca pembesar di dalam input yang berubah warna saat diketik */}
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent-indigo transition-colors duration-200" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      updateQueryParams({ page: '1' });
                    }}
                    placeholder="Type to search..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-accent-indigo focus:ring-4 focus:ring-accent-indigo/10 outline-none transition-all duration-200 shadow-inner"
                  />
                </div>
              </div>

              {/* 2. Category Filter Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Category
                </label>

                {/* Wrapper menu vertikal rapat agar animasi slide mulus */}
                <div className="flex flex-col gap-0.5 relative">

                  {/* Tombol All Categories */}
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-200 flex items-center group ${!categorySlug
                      ? 'text-accent-indigo font-bold'
                      : 'text-slate-600 hover:text-primary-900 hover:bg-slate-50/60'
                      }`}
                  >
                    {/* text z-10 wajib agar berada di atas pil animasi */}
                    <span className="relative z-10">All Categories</span>

                    {/* Efek Pil Meluncur Vertikal */}
                    {!categorySlug && (
                      <motion.span
                        layoutId="activeSidebarCategoryPill"
                        className="absolute inset-0 bg-accent-indigo/5 rounded-xl border border-accent-indigo/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>

                  {/* Daftar Kategori Dinamis */}
                  {categories.map((category) => {
                    const isActive = categorySlug === category.slug;

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-200 flex items-center group ${isActive
                          ? 'text-accent-indigo font-bold'
                          : 'text-slate-600 hover:text-primary-900 hover:bg-slate-50/60'
                          }`}
                      >
                        <span className="relative z-10">{category.name}</span>

                        {/* Menggunakan layoutId yang sama agar animasi meluncur dari tombol atas ke bawah */}
                        {isActive && (
                          <motion.span
                            layoutId="activeSidebarCategoryPill"
                            className="absolute inset-0 bg-accent-indigo/5 rounded-xl border border-accent-indigo/10"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  })}

                </div>
              </div>

            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="w-full lg:w-3/4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-primary-900">{paginatedProducts.length}</span> of {filteredAndSortedProducts.length} results
                </p>
                <SortAsc className="w-5 h-5 text-slate-400" />
              </div>

              {/* Product Grid */}
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <p className="text-slate-500 font-medium">No products found matching your criteria.</p>
                  <button onClick={clearFilters} className="mt-3 text-sm text-accent-indigo font-semibold hover:underline">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => {
                    const catName = categories.find(c => c.id === product.categoryId)?.name || product.categoryId;
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300/80 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                      >
                        {/* Image Section */}
                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex-shrink-0">
                          <img
                            src={product.coverImage!}
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {product.salesCount > 100 && (
                              <span className="px-2.5 py-1 bg-primary-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                                Bestseller
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-4 flex flex-col flex-1 justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-accent-indigo uppercase tracking-widest">{catName}</span>
                            <h3 className="mt-1 text-base font-bold text-primary-900 line-clamp-1 group-hover:text-accent-indigo transition-colors">
                              {product.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.floor(product.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-medium text-slate-500">({product.reviewCount})</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
                            <span className="text-lg font-black text-primary-900">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                            <Link
                              href={`/products/${product.slug}`}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-primary-900 hover:text-white text-primary-900 text-sm font-semibold rounded-xl border border-slate-100 hover:border-primary-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                              <span>Detail</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ===================================================== */}
            {/* MODERN TIMBUL PAGINATION CONTROLS                      */}
            {/* ===================================================== */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 border-t border-slate-200/60 pt-6">

                {/* Button Prev */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm hover:shadow hover:border-slate-300 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Number List */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isPageActive = page === pageNumber;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all duration-200 ${isPageActive
                          ? 'bg-primary-900 text-white shadow-md shadow-primary-900/15 border border-primary-900'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-primary-900'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Button Next */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm hover:shadow hover:border-slate-300 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;