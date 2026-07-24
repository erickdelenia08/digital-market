"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, FileText, CheckCircle2, PackageX, ShieldCheck, ArrowRight } from 'lucide-react';
import { addToCart as addToCartDB } from '@/app/actions/cart';
import { getProductBySlug } from '@/app/actions/product';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ProductReviewsSection from './product-review-section';
import { getUserProductStatus } from '@/app/actions/review-actions';

interface ProductDetailPageProps {

  params: Promise<{ slug: string }>;

}


// 1. Tipe data mentah return dari fungsi (Product | null)
export type ProductResponse = Awaited<ReturnType<typeof getProductBySlug>>;

// 2. Tipe data HANYA objek Product saja (menghilangkan 'null')
export type Product = NonNullable<ProductResponse>;
export type ProductCategory = Product["category"];

// type Product = Extract<ProductResponse, { product: unknown }>["product"];


export default function ProductDetailPage(props: ProductDetailPageProps) {
  const { slug } = use(props.params);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const { cart, addToCart, _hasHydrated } = useCartStore();

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<ProductCategory | null | undefined>(null);
  // const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   getProductBySlug(slug).then(res => {
  //     setProduct(res);
  //     setCategory(res?.category);
  //     setIsLoadingProduct(false);
  //   });
  // }, [slug]);


  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      setIsLoading(true);

      try {
        // 1. Fetch Produk dulu untuk mendapatkan productId
        const productData = await getProductBySlug(slug);

        if (!isMounted) return;

        if (!productData) {
          setProduct(null);
          setIsLoading(false);
          return;
        }

        setProduct(productData);

        // 2. Jika produk ketemu, cek status pembelian & review user
        const userStatus = await getUserProductStatus(productData.id);

        if (isMounted) {
          setHasPurchased(userStatus.hasPurchased);
          setUserReview(userStatus.userReview);
        }
      } catch (error) {
        console.error("Gagal memuat data detail produk:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      isMounted = false; // Cleanup untuk mencegah memory leak / state update unmounted component
    };
  }, [slug]);

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12">
        <div className="container max-w-6xl mx-auto px-4 animate-pulse space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-4/3 bg-slate-200 rounded-2xl w-full"></div>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => <div key={i} className="w-20 h-20 bg-slate-200 rounded-xl"></div>)}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6 pt-4">
              <div className="h-6 bg-slate-200 rounded-full w-24"></div>
              <div className="h-10 bg-slate-200 rounded-xl w-3/4"></div>
              <div className="h-5 bg-slate-200 rounded w-1/2"></div>
              <div className="h-12 bg-slate-200 rounded-xl w-1/3 mt-8"></div>
              <div className="h-14 bg-slate-200 rounded-xl w-full mt-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-24 text-center">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="flex justify-center mb-6 text-slate-300">
            <PackageX className="w-20 h-20 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Product Not Found</h1>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">The asset you are looking for might have been moved or the URL is invalid.</p>
          <Link href="/products">
            <Button className="rounded-xl font-semibold shadow-sm">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayImage = activeImage || product.coverImage || product.media[0]?.url || "";
  const isHybrid = !!userId;
  const isInCart = isHybrid ? false : cart.some((item) => item.id === product.id);

  const handleBuyNow = async () => {
    if (isHybrid) {
      try {
        const res = await addToCartDB(userId!, product.id);
        if (res.success) {
          router.push('/cart');
        } else {
          alert(res.error);
        }
      } catch (error) {
        console.error("Error adding to DB cart", error);
      }
    } else {
      if (isInCart) {
        router.push('/cart');
      } else {
        addToCart(product);
        router.push('/cart');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 py-12">
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- TOP SECTION: Interactive Grid Gallery & Info --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* LEFT: Premium Dynamic Image Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-white border border-slate-200/80 relative shadow-md shadow-slate-200/50 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={displayImage}
                    alt={product.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    fill
                    className="object-cover w-full h-full"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails dengan Timbul Border Active */}
            {product.media.length > 0 && (
              <div className="flex gap-3.5 overflow-x-auto pb-1 scrollbar-hide">
                {product.coverImage && (
                  <button
                    onClick={() => setActiveImage(product.coverImage)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 shadow-sm ${displayImage === product.coverImage
                      ? 'border-accent-indigo ring-4 ring-accent-indigo/10 scale-95 shadow-md'
                      : 'border-slate-200/60 hover:border-slate-400'
                      }`}
                  >
                    <Image src={product.coverImage} alt="Cover Preview" fill sizes="80px" className="object-cover" />
                  </button>
                )}

                {product.media.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveImage(m.url)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 shadow-sm ${displayImage === m.url
                      ? 'border-accent-indigo ring-4 ring-accent-indigo/10 scale-95 shadow-md'
                      : 'border-slate-200/60 hover:border-slate-400'
                      }`}
                  >
                    <Image src={m.url} alt="Media Preview" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Timbul Information Dashboard */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md shadow-slate-200/40 space-y-6">

              {/* Badges */}
              <div className="flex items-center gap-2.5">
                {category && (
                  <Badge className="bg-slate-100 hover:bg-slate-100 text-accent-indigo text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200/40 shadow-inner">
                    {category.name}
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-accent-indigo hover:bg-accent-indigo text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Title & Micro Stats */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{product.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <a href="#reviews-section" className="hover:text-accent-indigo hover:underline transition-colors">
                    {product.reviewCount} Reviews
                  </a>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-bold">{product.salesCount} Sold</span>
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Price Panel */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-inner">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">License Price</p>
                <p className="text-3xl font-black text-primary-900">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Features Perks Grid */}
              <div className="grid grid-cols-1 gap-2.5 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Lifetime Access Protection</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>One-Time Premium Purchase</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant Encrypted Delivery</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  className="w-full h-13 text-sm font-bold text-white bg-primary-900 hover:bg-primary-950 rounded-xl shadow-lg shadow-primary-900/15 border border-primary-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-105" />
                  <span>{isInCart ? "Go to Shopping Cart" : "Buy Digital Assets"}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Button>
              </div>

            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: Description & Included Contents --- */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Main Description */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-primary-900 border-b border-slate-100 pb-3">
              Product Description
            </h2>
            <div className="prose prose-slate max-w-none text-sm font-medium text-slate-600 leading-relaxed space-y-4">
              <p>{product.description}</p>
              <p>
                Get all supporting master files meticulously bundled to guarantee standard cross-platform integration.
                Our premium assets are fully configured to blend seamlessly into demanding creative workflows.
              </p>
            </div>
          </div>

          {/* Package Deliverables */}
          <div className="lg:col-span-5">
            <Card className="border-slate-200/80 bg-white shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-base font-bold mb-5 text-primary-900">What&apos;s Included inside?</h3>
                <div className="space-y-3">
                  {product.digitalAssets && product.digitalAssets.length > 0 ? (
                    product.digitalAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-3.5 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/40 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 group">
                        <div className="bg-white border border-slate-200 shadow-sm p-2.5 rounded-lg shrink-0 text-accent-indigo group-hover:scale-95 transition-transform">
                          <FileText className="w-4 h-4 stroke-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">{asset.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-extrabold">Format Architecture: {asset.type}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic font-medium">No assets bundled into this catalog item yet.</p>
                  )}
                </div>

                <div className="mt-5 p-3.5 bg-accent-indigo/5 border border-accent-indigo/10 rounded-xl flex gap-3 items-start">
                  <ShieldCheck className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    Original download packages are cryptographically secured and delivered straight to your secure portal area instantly after successful validation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* <ProductReviewsSection /> */}
        <ProductReviewsSection
          productId={product.id}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
          reviews={product.reviews}
          hasPurchased={hasPurchased}
          userReview={userReview}
        />

      </main>
    </div>
  );
}