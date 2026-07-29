import { ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './product-card';
import { getFeaturedProducts } from '@/lib/product';

const FeaturedProducts = async () => {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section id="products" className="py-20 md:py-28 bg-white relative border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">

        {/* --- HEADER BLOCK --- */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* Raised Emblem Badge */}
          <div className="inline-flex items-center gap-2 bg-accent-indigo/5 border border-accent-indigo/10 px-3.5 py-1.5 rounded-full text-accent-indigo text-[11px] font-black uppercase tracking-widest shadow-inner">
            {/* <Sparkles className="w-3.5 h-3.5" /> */}
            <span>Curated Collection</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-900 tracking-tight">
            Our Favorites
          </h2>

          <p className="text-sm sm:text-base font-medium text-slate-500 max-w-lg mx-auto leading-relaxed">
            Hand-picked premium assets crafted specifically to accelerate your digital creative workflow.
          </p>
        </div>

        {/* --- PRODUCTS GRID SECTION --- */}
        {featuredProducts.length === 0 ? (
          /* Tactile Fallback Empty State */
          <div className="text-center py-16 bg-slate-50/50 border border-slate-200/80 rounded-2xl shadow-inner max-w-md mx-auto p-8">
            <div className="flex justify-center mb-3">
              <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl text-slate-400 shadow-sm">
                <Layers className="w-6 h-6 stroke-[1.5]" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-primary-900 mb-1">Belum Ada Produk Unggulan</h3>
            <p className="text-xs font-medium text-slate-400">
              Produk pilihan akan segera ditampilkan di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* --- TACTILE VIEW ALL CTA --- */}
        <div className="flex justify-center pt-2">
          <Link
            href="/products"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-black text-primary-900 uppercase tracking-wider shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-slate-300 hover:text-accent-indigo hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent-indigo group-hover:translate-x-1 transition-all duration-200" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;