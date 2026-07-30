'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Product', href: '/products' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
];

export const NavLinks = () => {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${isActive ? 'text-white' : 'text-slate-600 hover:text-primary-900'
                            }`}
                    >
                        <span className="relative z-10">{link.name}</span>
                        {isActive && (
                            <motion.span
                                layoutId="activeNavbarPill"
                                className="absolute inset-0 bg-primary-900 rounded-xl shadow-xl shadow-primary-900/20 border border-primary-800 border-t-white/20"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};