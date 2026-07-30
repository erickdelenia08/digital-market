'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, Code2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useCartCount } from '@/hooks/use-cart-count';
import { SearchModal } from './search-modal';
import { NavLinks } from './nav-link';
import { UserDropdown } from './user-dropdown';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const totalUniqueItems = useCartCount();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-px pointer-events-none" />

      {/* Modal Pencarian */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <nav className="sticky top-0 z-50 pt-3 px-5 flex justify-center">
        <div
          className={`flex-1 px-4 sm:px-6 lg:px-8 rounded-xl transition-all duration-400 ease-in-out ${isScrolled ? 'shadow-xl bg-white/80 max-w-4xl backdrop-blur-md' : 'max-w-7xl'
            }`}
        >
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center shadow-md shadow-primary-900/20 border border-primary-800 border-t-white/20 group-hover:-translate-y-0.5 transition-all duration-300">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-900 tracking-tight sm:block hidden pr-5">
                CodeGraph
              </span>
            </Link>

            {/* Navigasi Desktop */}
            <NavLinks />

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Search Trigger Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 bg-white text-slate-600 hover:text-primary-900 rounded-full shadow-sm hover:shadow-md border border-slate-100 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 bg-white text-slate-600 hover:text-primary-900 rounded-full shadow-sm hover:shadow-md border border-slate-100 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalUniqueItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-indigo text-white text-xs font-medium rounded-full flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse-once">
                    {totalUniqueItems}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <UserDropdown />

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-primary-900 transition-colors duration-200 cursor-pointer"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <div className="flex flex-col gap-4">
                <Link
                  href="/products"
                  className="text-slate-600 hover:text-primary-900 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Product
                </Link>
                <Link
                  href="/blog"
                  className="text-slate-600 hover:text-primary-900 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-slate-600 hover:text-primary-900 font-medium py-2"
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