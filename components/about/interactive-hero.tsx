"use client";

import { motion } from 'framer-motion';

export default function InteractiveHero() {
    return (
        <>
            {/* Ambient Glow - Kenyalan Interaktif */}
            <motion.div
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.9}
                dragSnapToOrigin
                whileDrag={{ scale: 1.2, opacity: 0.2 }}
                className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl cursor-grab active:cursor-grabbing z-0"
            />
            <motion.div
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.9}
                dragSnapToOrigin
                whileDrag={{ scale: 1.2, opacity: 0.3 }}
                className="absolute bottom-0 left-0 w-96 h-96 bg-accent-indigo/20 rounded-full blur-3xl cursor-grab active:cursor-grabbing z-0"
            />
        </>
    );
}