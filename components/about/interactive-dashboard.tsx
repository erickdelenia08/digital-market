"use client";

import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';

export default function InteractiveDashboard() {
    return (
        <div className="relative">
            <div className="aspect-4/3 bg-linear-to-br from-slate-100 to-slate-200/60 rounded-3xl overflow-hidden relative border border-slate-200 p-8 shadow-inner">
                <div className="grid grid-cols-2 gap-4 h-full relative">

                    {/* Card Stat 1 (Bisa di-drag & Membal) */}
                    <motion.div
                        drag
                        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        dragElastic={0.5}
                        dragSnapToOrigin
                        whileHover={{ y: -4 }}
                        whileDrag={{ scale: 1.05, zIndex: 40 }}
                        className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
                    >
                        <div className="w-10 h-10 bg-accent-indigo/10 rounded-xl flex items-center justify-center mb-2">
                            <Users className="w-5 h-5 text-accent-indigo" />
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-primary-900 tracking-tight">50K+</div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">Happy Customers</div>
                        </div>
                    </motion.div>

                    {/* Card Stat 2 */}
                    <motion.div
                        drag
                        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        dragElastic={0.6}
                        dragSnapToOrigin
                        whileHover={{ y: -4 }}
                        whileDrag={{ scale: 1.05, zIndex: 40 }}
                        className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
                    >
                        <div className="w-10 h-10 bg-accent-cyan/10 rounded-xl flex items-center justify-center mb-2">
                            <Sparkles className="w-5 h-5 text-accent-cyan" />
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-primary-900 tracking-tight">500+</div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">Digital Products</div>
                        </div>
                    </motion.div>

                    {/* Card Banner Bawah */}
                    <motion.div
                        drag
                        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        dragElastic={0.4}
                        dragSnapToOrigin
                        whileHover={{ y: -4 }}
                        whileDrag={{ scale: 1.03, zIndex: 40 }}
                        className="col-span-2 bg-linear-to-r from-accent-indigo to-accent-cyan rounded-2xl p-6 text-white shadow-lg shadow-accent-indigo/10 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
                    >
                        <div className="text-sm font-semibold tracking-wider uppercase opacity-90">Global Network</div>
                        <div className="mt-4">
                            <div className="text-3xl font-black tracking-tight">150+ Countries</div>
                            <div className="text-xs opacity-80 mt-1">Trusted by developers and creators worldwide</div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Elastic Floating Ornament */}
            <motion.div
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.8}
                dragSnapToOrigin
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-indigo/10 rounded-3xl -z-10 blur-xs cursor-grab active:cursor-grabbing"
            />
        </div>
    );
}