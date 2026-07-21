"use client";

import { FileSpreadsheet, Film, Video, Package, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { categories, categoryDescriptions } from '@/mock-data/products';
import { motion, Variants } from 'framer-motion';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Excel Templates": FileSpreadsheet,
  "After Effects": Film,
  "Video Assets": Video,
  "Creator Toolkits": Package,
};

// Next.js Link yang dibungkus Framer Motion untuk navigasi interaktif
const MotionLink = motion(Link);

// 1. Animasi Stagger saat Section Masuk Layar
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }
  }
};

const Categories = () => {
  return (
    <section id="categories" className="py-20 md:py-28 bg-slate-50/40 border-b border-slate-200/60 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16"
      >
        {/* --- HEADER BLOCK --- */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* Raised Emblem Badge */}
          <div className="inline-flex items-center gap-2 bg-accent-indigo/5 border border-accent-indigo/10 px-3.5 py-1.5 rounded-full text-accent-indigo text-[11px] font-black uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse By Category</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-900 tracking-tight">
            Explore Categories
          </h2>

          <p className="text-sm sm:text-base font-medium text-slate-500 max-w-lg mx-auto leading-relaxed">
            Find exactly what you need to accelerate your next creative or technical project.
          </p>
        </div>

        {/* --- CATEGORIES GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category] || Package;

            return (
              <MotionLink
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                variants={cardVariants}
                whileHover="hover"
                className="group bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md shadow-slate-200/30 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
              >
                <div>
                  {/* Embossed Tactile Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center mb-6 text-accent-indigo group-hover:bg-accent-indigo group-hover:text-white group-hover:border-accent-indigo group-hover:shadow-lg group-hover:shadow-accent-indigo/20 transition-all duration-300">
                    <IconComponent className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  </div>

                  {/* Category Title */}
                  <h3 className="text-base sm:text-lg font-bold text-primary-900 mb-2 group-hover:text-accent-indigo transition-colors duration-200">
                    {category}
                  </h3>

                  {/* Category Description */}
                  <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed line-clamp-2">
                    {categoryDescriptions[category]}
                  </p>
                </div>

                {/* Explore Action Link */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-accent-indigo pt-2">
                  <span>Explore Assets</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </MotionLink>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Categories;