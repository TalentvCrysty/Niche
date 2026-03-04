'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = "http://localhost:3005";

// Get full URL for media
const getMediaUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    if (url.startsWith('/uploads')) {
        return `${BACKEND_URL}${url}`;
    }
    return url;
};

interface NavbarProps {
    theme?: 'dark' | 'light';
    config?: any;
    alwaysSolid?: boolean;
}

export const Navbar = ({ theme = 'dark', config, alwaysSolid = false }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const menuItems = config?.links || [
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Services", href: "/#services" },
        { label: "Careers", href: "/careers" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "Testimonials", href: "/#testimonials" },
        { label: "Hire Us", href: "/team" },
        { label: "Store", href: "/store" },
        { label: "Contact", href: "/contact" },
        { label: "Creators", href: "/creator" },
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/#faq" },
    ];

    const isLight = theme === 'light';

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300 ${scrolled || isOpen || alwaysSolid
                    ? (isLight ? 'bg-white/80 backdrop-blur-md' : 'bg-black backdrop-blur-md')
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 flex items-center gap-2">
                        <div className="relative w-32 h-10 md:w-40 md:h-12 flex items-center">
                            {config?.logo ? (
                                <img
                                    src={getMediaUrl(config.logo)}
                                    alt={config?.title || "Logo"}
                                    className="h-full w-auto object-contain object-left"
                                />
                            ) : (
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            )}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={`hidden lg:flex items-center gap-1 p-1.5 rounded-full backdrop-blur-xl shadow-sm border ${isLight ? 'bg-white/80 border-black/5 text-black/70' : 'bg-white/5 border-white/10 text-white/80'
                        }`}>
                        {menuItems.map((item: any) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`px-5 py-2 text-sm rounded-full transition-all duration-300 nav-link-underline ${isLight
                                    ? 'hover:text-black hover:bg-black/5'
                                    : 'hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Action */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href={config?.bookingLink || "/#contact"}
                            className="group relative flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm overflow-hidden transition-all hover:pr-4 hover:shadow-lg bg-[#3B5BF7] text-white hover:bg-[#2D4AD9] hover:shadow-blue-500/25">
                            <span className="relative z-10">{config?.bookingText || "Book a call"}</span>
                            <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-45 bg-white/20 text-white">
                                <ArrowRight size={12} />
                            </div>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`lg:hidden relative z-50 w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center active:scale-95 transition-all ${isLight
                            ? 'bg-black/5 border-black/5 text-black'
                            : 'bg-white/10 border-white/10 text-white'
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed inset-0 z-40 lg:hidden flex flex-col justify-center overflow-y-auto ${isLight ? 'bg-white/95 text-black' : 'bg-black/95 text-white'
                            } backdrop-blur-3xl`}
                    >
                        <div className="w-full max-w-md mx-auto px-6 py-20 flex flex-col min-h-screen justify-center">
                            <div className="flex flex-col gap-4">
                                {menuItems.map((item: any, idx: number) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.1, type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center justify-between text-2xl font-light py-3 border-b transition-colors ${isLight
                                                ? 'text-black/90 hover:text-black border-black/5'
                                                : 'text-white/90 hover:text-white border-white/5'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                            <ChevronRight className={`opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 ${isLight ? 'text-black/50' : 'text-white/50'
                                                }`} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col gap-4 mt-8"
                            >
                                <Link
                                    href={config?.bookingLink || "/#contact"}
                                    onClick={() => setIsOpen(false)}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-full font-semibold text-lg transition-colors ${isLight
                                        ? 'bg-black text-white hover:bg-black/90'
                                        : 'bg-white text-black hover:bg-gray-100'
                                        }`}>
                                    {config?.bookingText || "Book a call"}
                                    <ArrowRight size={20} />
                                </Link>
                                <p className={`text-center text-sm ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                                    © 2026 {config?.title || "Niche"}. All rights reserved.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
