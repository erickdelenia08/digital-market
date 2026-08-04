"use client"
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

import { AnimatePresence, motion, Variants } from "motion/react";
import AnimatedCounter from '../animated-counter';
import { useEffect, useState } from 'react';

// 1. Definisikan animasi di luar komponen biar rapi
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Jeda antar elemen muncul (0.15 detik)
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Muncul dari bawah ke atas sedikit
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
} as const;

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
  },
} as const;

const MotionLink = motion.create(Link);

// 1. Daftarkan daftar kata yang ingin dirotasi secara berkala
const rotatingWords = ["Creative Workflow", "Design Speed", "Video Projects", "Digital Assets"];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);

  // 2. Setup interval untuk mengganti kata setiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden h-[calc(100svh-80px)] flex items-center">
      {/* 2. Beri variants ke pembungkus utama */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">

            {/* Cukup panggil variants="itemVariants" di tiap anak */}
            <motion.div variants={itemVariants} className="shadow-lg inline-flex items-center gap-2 px-4 py-2 bg-accent-indigo/10 text-accent-indigo text-sm font-medium rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-indigo animate-pulse" />
              Premium Digital Assets
            </motion.div>

            {/* Animated H1 Headline */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-900 leading-tight tracking-tight">
              Elevate Your
              {/* Kontainer relatif dengan tinggi tetap agar transisi smooth dan tidak merusak layout */}
              <span className="block mt-2 relative h-[1.2em] overflow-hidden min-w-[300px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 30, opacity: 0 }}       // Muncul meluncur dari bawah
                    animate={{ y: 0, opacity: 1 }}        // Menetap di tengah
                    exit={{ y: -30, opacity: 0 }}         // Menghilang meluncur ke atas
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute left-0 right-0 lg:text-left text-center bg-linear-to-r from-accent-indigo to-accent-cyan bg-clip-text text-transparent block truncate"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Professional-grade templates, video assets, and creator toolkits designed for modern professionals who demand excellence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8 w-full sm:w-auto"
            >
              {/* Tombol Utama: Shop Now */}
              <MotionLink
                href="/products"
                whileHover={{ scale: 1.03, y: -2 }} // Terangkat dan membesar sedikit saat di-hover
                whileTap={{ scale: 0.97 }} // Efek membal ke dalam saat diklik (klik elastis)
                transition={{ type: "spring", stiffness: 400, damping: 15 }} // Fisika pegas biar kerasa organik
                className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary-900 hover:bg-accent-indigo text-white font-semibold rounded-xl transition-colors duration-300 shadow-lg shadow-primary-900/10 hover:shadow-xl hover:shadow-accent-indigo/20"
              >
                <span>Shop Now</span>
                {/* Mikro-interaksi: Panah bergeser ke kanan saat tombol di-hover */}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </MotionLink>

              {/* Tombol Sekunder: Learn More */}
              <MotionLink
                href="/about"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="shadow-xl group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-primary-900 font-semibold rounded-xl  hover:text-accent-indigo transition-all duration-300 hover:shadow-lg hover:shadow-slate-100"
              >
                {/* Mikro-interaksi: Ikon Play membesar dan berputar sedikit saat tombol di-hover */}
                <Play className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span>Learn More</span>
              </MotionLink>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-slate-200">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary-900">
                  <AnimatedCounter value={50} prefix="" suffix="+" />
                </p>
                <p className="text-sm text-slate-500">Happy Customers</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary-900"><AnimatedCounter value={500} prefix="" suffix="+" /></p>
                <p className="text-sm text-slate-500">Digital Products</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary-900">4.9</p>
                <p className="text-sm text-slate-500">Average Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            variants={imageVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative hidden lg:block select-none group"
          >
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Glow Background Effect */}
              <div className="absolute inset-4 rounded-3xl bg-linear-to-br from-accent-indigo via-accent-cyan to-accent-indigo opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />

              <div className="relative h-full rounded-3xl bg-linear-to-br from-accent-indigo to-accent-cyan overflow-hidden shadow-2xl">
                <div className="absolute inset-0 p-8">
                  <div className="grid grid-cols-3 gap-3 h-full">

                    {/* Kartu 1 (Kiri Atas) */}
                    <motion.div
                      drag
                      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                      dragElastic={0.5}
                      dragSnapToOrigin
                      whileHover={{ y: -4 }}
                      whileDrag={{ scale: 1.02, zIndex: 50 }} // Naik ke atas layer lain pas ditarik
                      className="hover:bg-white/15 col-span-2 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-6 flex flex-col justify-between transition-colors duration-200 cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-xl" />
                      <div className="space-y-2">
                        <div className="h-3 w-3/4 bg-white/20 rounded" />
                        <div className="h-3 w-1/2 bg-white/20 rounded" />
                      </div>
                    </motion.div>

                    {/* Kartu 2 (Kanan Atas) */}
                    <motion.div
                      drag
                      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                      dragElastic={0.6} // Dibedain elastisitasnya biar seru
                      dragSnapToOrigin
                      whileHover={{ y: -4 }}
                      whileDrag={{ scale: 1.02, zIndex: 50 }}
                      className="hover:bg-white/15 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-4 transition-colors duration-200 cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-lg mx-auto" />
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full bg-white/20 rounded" />
                        <div className="h-2 w-3/4 bg-white/20 rounded" />
                      </div>
                    </motion.div>

                    {/* Kartu 3 (Kiri Bawah) */}
                    <motion.div
                      drag
                      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                      dragElastic={0.55}
                      dragSnapToOrigin
                      whileHover={{ y: -4 }}
                      whileDrag={{ scale: 1.02, zIndex: 50 }}
                      className="hover:bg-white/15 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-4 transition-colors duration-200 cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-lg" />
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full bg-white/20 rounded" />
                        <div className="h-2 w-2/3 bg-white/20 rounded" />
                      </div>
                    </motion.div>

                    {/* Kartu 4 (Kanan Bawah) */}
                    <motion.div
                      drag
                      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                      dragElastic={0.45}
                      dragSnapToOrigin
                      whileHover={{ y: -4 }}
                      whileDrag={{ scale: 1.02, zIndex: 50 }}
                      className="hover:bg-white/15 col-span-2 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-4 flex items-center gap-4 transition-colors duration-200 cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-16 h-16 bg-white/30 rounded-xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-full bg-white/20 rounded" />
                        <div className="h-3 w-3/4 bg-white/20 rounded" />
                        <div className="h-3 w-1/2 bg-white/20 rounded" />
                      </div>
                    </motion.div>

                  </div>
                </div>
              </div>

              {/* Floating Ornamen Kotak Amber (Kuning) */}
              <motion.div
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} // Kunci titik pusat awal
                dragElastic={0.7} // Seberapa melar pas ditarik ke luar
                dragSnapToOrigin={true} // Wajib: Bikin otomatis mental balik pas dilepas
                whileDrag={{ scale: 1.1, zIndex: 50 }}
                // SOLUSI: Ditambahkan z-35 secara default agar tidak tertutup elemen atas
                className="absolute -top-4 -right-4 w-24 h-24 cursor-grab active:cursor-grabbing z-35 select-none"
              >
                {/* Layer Dalam: Tetap mengurus animasi melayang mandiri */}
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [12, 16, 12] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="w-full h-full bg-amber-400 rounded-2xl opacity-80 shadow-lg"
                />
              </motion.div>

              {/* Floating Ornamen Kotak Cyan (Biru) */}
              <motion.div
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.7}
                dragSnapToOrigin={true} // Wajib: Bikin otomatis mental balik pas dilepas
                whileDrag={{ scale: 1.1, zIndex: 50 }}
                className="absolute -bottom-4 -left-4 w-20 h-20 cursor-grab active:cursor-grabbing z-35 select-none"
              >
                {/* Layer Dalam: Tetap mengurus animasi melayang mandiri */}
                <motion.div
                  animate={{ y: [0, 12, 0], rotate: [-6, -2, -6] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                  className="w-full h-full bg-accent-cyan rounded-xl opacity-80 shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Background Decorations */}
      {/* <div className="absolute top-0 right-0 w-96 h-96 bg-accent-indigo/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" /> */}
    </section>
  );
};

export default Hero;