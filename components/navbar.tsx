'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, ShoppingCart, Menu, X, Code2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { signOut } from "next-auth/react"
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  // Jika belum terhidrasi, set 0 untuk mencegah hydration error. Jika sudah, ambil dari panjang array keranjang
  const totalUniqueItems = !hasHydrated ? 0 : cart.length;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Product', href: '/products' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];


  useEffect(() => {
    // Membuat observer untuk mendeteksi elemen sentinel
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      {
        threshold: 0, // Terpancing pas 100% elemen siluman ini lewat batas layar
        rootMargin: "0px 0px 0px 0px"
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    // Bersihkan observer saat komponen tidak dipakai
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      // Tutup pakai tombol ESC
      if (e.key === 'Escape') setIsSearchOpen(false);

      // Buka/Tutup pakai Cmd+K (Mac) atau Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (

    <>
      <div
        ref={sentinelRef}
        className="absolute top-0 left-0 w-full h-px pointer-events-none"
      />
      {/* SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-999 flex items-start justify-center pt-24 sm:pt-32 px-4">

            {/* 1. Backdrop Blur (Fade In / Out) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            />

            {/* 2. Search Box Container (Scale Up + Slide Down) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 border-t-white overflow-hidden"
            >
              {/* Form Input */}
              <form onSubmit={handleSearch} className="relative flex items-center p-4 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
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
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md px-1.5 py-0.5 ml-3 transition-colors"
                >
                  ESC
                </button>
              </form>

              {/* Area Hasil Pencarian (Bisa diisi list produk nanti) */}
              <div className="p-6 bg-slate-50/50 min-h-[120px] text-sm text-slate-400 flex flex-col items-center justify-center gap-1">
                <p className="font-medium text-slate-600">Start typing to search</p>
                <p className="text-xs text-slate-400">Looking for something specific?</p>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
      <nav className="sticky top-0 z-50 pt-3 px-5 flex justify-center">
        <div className={`flex-1 px-4 sm:px-6 lg:px-8 rounded-xl transition-all duration-400 ease-in-out ${isScrolled ? 'shadow-xl bg-white/80 max-w-4xl backdrop-blur-md' : 'max-w-7xl'}`}>
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {/* Ditambahkan class group di atas untuk trigger efek hover se-grup */}

              <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center shadow-md shadow-primary-900/20 border border-primary-800 border-t-white/20 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-primary-900/30 transition-all duration-300">
                <Code2 className="w-6 h-6 text-white" />
              </div>

              <span className="text-xl font-bold text-primary-900 tracking-tight sm:block hidden pr-5">
                CodeGraph
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${isActive
                      ? 'text-white' // Teks menu aktif
                      : 'text-slate-600 hover:text-primary-900' // Teks menu tidak aktif
                      }`}
                  >
                    {/* 1. Bungkus teks agar di atas background */}
                    <span className="relative z-10">{link.name}</span>

                    {/* 2. EFEK PIL MELUNCUR + TIMBUL MODERN */}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavbarPill"
                        // Ditambahkan shadow-md, border tipis, dan sedikit kecerahan di bagian atas (border-t-white/20)
                        className="absolute inset-0 bg-primary-900 rounded-xl shadow-xl shadow-primary-900/20 border border-primary-800 border-t-white/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 bg-white text-slate-600 hover:text-primary-900 rounded-full shadow-sm hover:shadow-md border border-slate-100 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Container */}
              <div className="relative group">

                <div className="p-2.5 text-slate-600 group-hover:text-primary-900 rounded-full shadow-sm bg-white border border-slate-100 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer">
                  <User className="w-5 h-5" />
                </div>

                {/* Dropdown Menu - Menggunakan opacity & translate untuk animasi halus */}
                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">

                  {/* Kard Dropdown (Diubah ke rounded-xl & shadow-xl agar seirama dengan Search Box) */}
                  <div className="bg-white rounded-xl shadow-xl shadow-slate-900/5 border border-slate-100 p-1.5">
                    <ul className="flex flex-col text-sm font-medium text-slate-600">

                      <li>
                        <Link href="/account" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                          Akun Saya
                        </Link>
                      </li>

                      <li>
                        <Link href="/orders" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                          Pesanan Saya
                        </Link>
                      </li>

                      <li>
                        <Link href="/library" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                          Library Saya
                        </Link>
                      </li>

                      <li>
                        <Link href="/dashboard" className="flex w-full hover:bg-slate-50 hover:text-primary-900 py-2 px-4 rounded-lg transition-colors">
                          Dashboard
                        </Link>
                      </li>

                      {/* Divider Line */}
                      <div className="my-1 border-t border-slate-100" />

                      <li>
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="flex w-full text-left text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors font-medium"
                        >
                          Log Out
                        </button>
                      </li>

                    </ul>
                  </div>

                </div>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 bg-white text-slate-600 hover:text-primary-900 rounded-full shadow-sm hover:shadow-md border border-slate-100 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />

                {hasHydrated && cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-indigo text-white text-xs font-medium rounded-full flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse-once">
                    {cart.length}
                  </span>
                )}
              </Link>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-primary-900 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <div className="flex flex-col gap-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full h-10 pl-4 pr-10 rounded-lg border border-slate-200 focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 outline-none text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </form>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-slate-600 hover:text-primary-900 font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Mobile Cart Link */}
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-slate-600 hover:text-primary-900 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({totalUniqueItems})</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
