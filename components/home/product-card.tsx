"use client"; // 1. WAJIB: Nyalakan client component di sini

import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react'; // 2. Import Framer Motion
import Image from 'next/image';
import { Prisma } from '@prisma/client';

// 1. Definisikan tipe payload dari Prisma sesuai query parent
type ProductWithCategoryName = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        name: true;
      };
    };
  };
}>;

// 2. Gunakan tipe tersebut di Props komponen child
interface ProductCardProps {
  product: ProductWithCategoryName;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    // 3. Ubah div paling luar jadi motion.div
    <motion.div
      initial={{ opacity: 0, y: 24 }} // Animasi awal (samar & di bawah)
      whileInView={{ opacity: 1, y: 0 }} // Muncul pas di-scroll ke layar
      viewport={{ once: true, margin: "-50px" }} // Jalan sekali saja demi performa
      whileHover={{ y: -6 }} // Kartu terangkat mulus ke atas saat di-hover
      transition={{ duration: 0.4, ease: "easeOut" }}
      // Perhatikan: Trik ganti transition-all ke spesifik border & shadow agar tidak bentrok dengan Framer Motion
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-[border-color,box-shadow] duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-4/3 bg-linear-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
          <Image
            src={product.coverImage!}
            alt={product.name || "Product Image"} // Bagus untuk aksesibilitas SEO
            fill // Memaksa gambar mengisi penuh kontainer aspect-[4/3]
            sizes="(max-w-1024px) 50vw, 25vw" // Memberitahu browser ukuran gambar asli di tiap layar (menghemat bandwidth)
            className="group-hover:scale-105 transition-transform duration-500 object-cover" // Efek zoom kamu tetap aman di sini
          />

          {/* Badges & Hover Overlay tetap sama di bawahnya... */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 bg-accent-indigo text-white text-xs font-semibold rounded-full shadow-sm">
              Featured
            </span>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 text-lg font-semibold text-primary-900 group-hover:text-accent-indigo transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-sm text-slate-500 mt-1">{product.category.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.averageRating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">{product.averageRating} ({product.reviewCount})</span>
        </div>

        {/* Price and Cart Button */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-primary-900">${product.price}</span>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-accent-indigo text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-xs"
          >
            <span>Detail</span>
            {/* Trik mikro-interaksi: Panah bergeser sedikit ke kanan saat seluruh kartu di-hover */}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;