"use client";

import React from 'react';
import { Zap, Award, Shield, RefreshCw } from 'lucide-react';
import { valuePropositions } from '@/mock-data/products';
import { motion, Variants } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Award,
  Shield,
  RefreshCw,
};

// 1. Animasi Stagger saat Section Masuk Layar
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
  },
};

// 2. Mikro-Animasi Ikon Khusus
const iconAnimations: Record<string, Variants> = {
  Zap: {
    hover: { scale: 1.15, rotate: 12 }
  },
  Award: {
    hover: { scale: 1.2, y: -2, transition: { type: "spring", stiffness: 350 } }
  },
  Shield: {
    hover: { scale: 1.1, rotate: [0, -8, 8, -4, 4, 0], transition: { duration: 0.4 } }
  },
  RefreshCw: {
    hover: { rotate: 180, transition: { duration: 0.6, ease: "easeInOut" } }
  }
};

const ValuePropositions = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50/40 border-y border-slate-200/60 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {valuePropositions.map((prop) => {
            const IconComponent = iconMap[prop.icon];
            const currentIconVariant = iconAnimations[prop.icon] || { hover: { scale: 1.1 } };

            return (
              <motion.div
                key={prop.id}
                variants={cardVariants}
                whileHover="hover"
                className="group bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
              >
                <div>
                  {/* Embossed / Tactile Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center mb-6 text-accent-indigo group-hover:bg-accent-indigo group-hover:text-white group-hover:border-accent-indigo group-hover:shadow-lg group-hover:shadow-accent-indigo/20 transition-all duration-300">
                    {IconComponent && (
                      <motion.div variants={currentIconVariant}>
                        <IconComponent className="w-5 h-5 stroke-[2.2]" />
                      </motion.div>
                    )}
                  </div>

                  {/* Judul Prop */}
                  <h3 className="text-base font-bold text-primary-900 mb-2 group-hover:text-accent-indigo transition-colors duration-200">
                    {prop.title}
                  </h3>

                  {/* Deskripsi Ringkas */}
                  <p className="text-xs md:text-sm font-medium text-slate-500 leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default ValuePropositions;