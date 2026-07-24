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
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListingPage initialProducts={products} initialCategories={categories} />
      </Suspense>
    </div>
  )
}

export default ProductPage
