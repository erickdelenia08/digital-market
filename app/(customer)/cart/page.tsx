"use client";

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { getCart, removeFromCartDB } from '@/app/actions/cart';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cart } from '@prisma/client';

const CartPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { cart: localCart, removeFromCart: removeLocal, _hasHydrated } = useCartStore();
  const [dbCart, setDbCart] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('selected_cart_ids');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // Fetch dari DB jika user login
  useEffect(() => {
    if (userId) {
      // setIsLoadingDb(true);
      getCart(userId).then(res => {
        setDbCart(res);
        setIsLoadingDb(false);
      });
    }
  }, [userId]);

  const isHybrid = !!userId;
  const cartData = isHybrid ? dbCart : localCart;

  useEffect(() => {
    const saved = sessionStorage.getItem('selected_cart_ids');
    if (saved) {
      setSelectedIds(JSON.parse(saved));
    } else {
      if (isHybrid && dbCart.length > 0) {
        setSelectedIds(dbCart.map(c => c.id));
      } else if (!isHybrid && _hasHydrated && localCart.length > 0) {
        setSelectedIds(localCart.map(c => c.id));
      }
    }
  }, [_hasHydrated, isHybrid, dbCart, localCart]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      sessionStorage.setItem('selected_cart_ids', JSON.stringify(selectedIds));
    } else {
      sessionStorage.removeItem('selected_cart_ids');
    }
  }, [selectedIds]);

  const subtotal = cartData
    .filter((item: any) => {
      const id = isHybrid ? item.productId : item.id;
      return selectedIds.includes(id);
    })
    .reduce((total: number, item: any) => {
      const product = isHybrid ? item.product : item;
      return total + product.price;
    }, 0);

  const toggleItemSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const removeItem = async (id: string) => {
    if (isHybrid) {
      setDbCart(prev => prev.filter(i => i.productId !== id));
      await removeFromCartDB(userId!, id);
    } else {
      removeLocal(id);
    }
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleCheckoutClick = async () => {
    if (selectedIds.length === 0) return;
    router.push('/test');
    // router.push('/checkout');
  };

  // Mencegah Hydration Mismatch & Loading State
  if ((!isHybrid && !_hasHydrated) || (isHybrid && isLoadingDb)) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-9 bg-slate-200 rounded-xl w-1/4 mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
            </div>
            <div className="w-full lg:w-96 h-72 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900 tracking-tight">Shopping Cart</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your selected digital assets before securing your download access.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT COLUMN: Products List */}
          <div className="flex-1 w-full space-y-4">
            <AnimatePresence mode="popLayout">
              {cartData.length > 0 ? (
                cartData.map((item: any) => {
                  const product = isHybrid ? item.product : item;
                  const itemId = isHybrid ? item.productId : item.id;
                  const imageUrl = product.media?.[0]?.url || product.coverImage || "";
                  const isSelected = selectedIds.includes(itemId);

                  return (
                    <motion.div
                      key={itemId}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-4 sm:gap-6 relative transition-all duration-350 ${isSelected
                        ? 'border-slate-200 shadow-md shadow-slate-200/40 hover:shadow-lg hover:-translate-y-0.5'
                        : 'border-slate-200/60 opacity-60 bg-slate-50/40 shadow-inner'
                        }`}
                    >
                      {/* Checkbox Wrapper */}
                      <div className="flex items-center justify-center">
                        <Checkbox
                          id={`checkbox-${itemId}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleItemSelection(itemId)}
                          className="w-5 h-5 rounded-lg border-slate-300 text-accent-indigo data-[state=checked]:bg-accent-indigo data-[state=checked]:border-accent-indigo transition-all duration-200"
                        />
                      </div>

                      {/* Premium Image Canvas */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-100 shadow-inner group">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-350 group-hover:scale-105"
                        />
                      </div>

                      {/* Product Content Details */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <label
                            htmlFor={`checkbox-${itemId}`}
                            className="font-bold text-base sm:text-lg text-primary-900 line-clamp-1 cursor-pointer hover:text-accent-indigo transition-colors"
                          >
                            {product.name}
                          </label>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Digital License Granted
                          </p>
                          <p className="font-extrabold text-base sm:text-lg text-primary-900 pt-1">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>

                        {/* Interactive Trash Action Button */}
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => removeItem(itemId)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/80 border border-transparent hover:border-red-100 active:scale-95 transition-all duration-200"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })
              ) : (
                /* Premium Empty State Container */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-md shadow-slate-200/30 p-8"
                >
                  <div className="flex justify-center mb-5">
                    <div className="bg-slate-50 border border-slate-100 shadow-inner p-4 rounded-2xl text-slate-400">
                      <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-primary-900 mb-1.5">Your cart is empty</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
                    You haven't added any premium digital products yet. Explore our curated collections to get started.
                  </p>
                  <Link href="/products">
                    <Button className="px-6 h-11 text-sm font-semibold rounded-xl bg-white text-primary-900 border border-slate-200 shadow-sm hover:shadow hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                      Browse Digital Store
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Timbul Summary Sidebar */}
          {cartData.length > 0 && (
            <div className="w-full lg:w-90 xl:w-96 shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md shadow-slate-200/40 flex flex-col gap-5">

                <div>
                  <h2 className="text-base font-bold text-primary-900">Order Summary</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Review items and tax before proceeding.</p>
                </div>

                <div className="space-y-3.5 pt-1">
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>Selected Assets</span>
                    <span className="font-bold text-primary-900">{selectedIds.length} item{selectedIds.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>Platform Service Fee</span>
                    <span className="text-green-600 font-bold uppercase tracking-wide text-xs bg-green-50 px-2 py-0.5 rounded-md border border-green-100">Free</span>
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="flex justify-between items-end pt-1">
                    <span className="text-sm font-bold text-slate-800">Total Subtotal</span>
                    <div className="text-right">
                      <p className="text-xl font-black text-primary-900 leading-none">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highly Tactile Premium Checkout Button */}
                <div className="mt-2 space-y-3">
                  <Button
                    size="lg"
                    disabled={subtotal === 0 || selectedIds.length === 0}
                    onClick={handleCheckoutClick}
                    className="w-full text-sm font-bold h-12 rounded-xl bg-primary-900 hover:bg-primary-950 text-white shadow-lg shadow-primary-900/15 border border-primary-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Secure Encrypted Checkout Process</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;