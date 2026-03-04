'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

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

// Placeholder images
const PLACEHOLDER_IMAGES = [
  "/case-1.jpg",
  "/case-2.jpg",
  "/case-3.avif",
  "/case-4.jpg",
];

interface WorkItem {
  title: string;
  category: string;
  image?: string;
  description: string;
  stat: string;
  link: string;
}

interface WorksGridProps {
  works: WorkItem[];
  categories: string[];
}

export function WorksGrid({ works, categories }: WorksGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter works based on selected category
  const filteredWorks = useMemo(() => {
    if (activeCategory === 'All') return works;
    return works.filter((item) => {
      const mainCategory = item.category?.split('•')[0]?.trim() || 'Other';
      return mainCategory === activeCategory;
    });
  }, [works, activeCategory]);

  return (
    <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
      {/* Category Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredWorks.map((item, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-300 shadow-lg shadow-black/20 overflow-hidden h-full"
          >
            <Link
              href={item.link || "#"}
              className="group cursor-pointer flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-800">
                {item.image ? (
                  <img
                    src={getMediaUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <Image
                    src={PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Overlay Stat Badge */}
                <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-100">
                  <span className="text-xs font-semibold text-white">{item.stat}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="w-6 h-6 rounded-full border border-neutral-600 flex items-center justify-center opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-white/5 flex-shrink-0">
                    <ArrowUpRight size={12} className="text-white" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white leading-snug group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
