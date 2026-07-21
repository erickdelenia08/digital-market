import React from 'react'
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
      <ProductListingPage initialProducts={products} initialCategories={categories} />
    </div>
  )
}

export default ProductPage
