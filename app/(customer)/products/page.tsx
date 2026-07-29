import React, { Suspense } from 'react'
import ProductListingPage from '@/components/product/product-listing-page'
import { prisma } from '@/lib/db'

const ProductPage = async () => {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: { media: true }
  });

  const categories = await prisma.category.findMany();

  return (
    <div>
      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListingPage initialProducts={products} initialCategories={categories} />
      </Suspense>
    </div>
  )
}

export default ProductPage


const ProductListingSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {/* Title Skeleton */}
              <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
              {/* Subtitle Skeleton */}
              <div className="h-4 w-36 bg-slate-200 rounded mt-2"></div>
            </div>

            {/* Sort Dropdown Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-[180px] bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sticky top-24 shadow-sm shadow-slate-100 space-y-6">

              {/* Sidebar Header */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="h-5 w-20 bg-slate-200 rounded"></div>
              </div>

              {/* Search Bar Skeleton */}
              <div>
                <div className="h-3 w-28 bg-slate-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
              </div>

              {/* Category Filter Skeleton */}
              <div>
                <div className="h-3 w-20 bg-slate-200 rounded mb-3"></div>
                <div className="flex flex-col gap-1.5">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-9 w-full bg-slate-200/70 rounded-xl"></div>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Grid Skeleton */}
          <main className="w-full lg:w-3/4 flex flex-col justify-between">
            <div>
              {/* Results Count Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
                <div className="w-5 h-5 bg-slate-200 rounded"></div>
              </div>

              {/* Product Grid Skeleton (6 Items) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col"
                  >
                    {/* Image Skeleton */}
                    <div className="aspect-[4/3] bg-slate-200 relative"></div>

                    {/* Info Section Skeleton */}
                    <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                      <div className="space-y-2">
                        {/* Category Label */}
                        <div className="h-3 w-16 bg-slate-200 rounded"></div>
                        {/* Title */}
                        <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
                        {/* Rating */}
                        <div className="h-4 w-24 bg-slate-200 rounded mt-1"></div>
                      </div>

                      {/* Price & Button Skeleton */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                        <div className="h-6 w-28 bg-slate-200 rounded"></div>
                        <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-12 flex items-center justify-center gap-2 border-t border-slate-200/60 pt-6">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="h-12 w-36 bg-slate-200 rounded-2xl"></div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};
