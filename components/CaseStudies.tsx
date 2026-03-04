'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

interface OurWorksProps {
  config?: any;
}

export const OurWorks = ({ config }: OurWorksProps) => {
  const cases = config?.items || [
    {
      title: "Fusionhealth AI",
      category: "HealthTech",
      image: "/case-1.jpg",
      description: "FusionHealth AI is a HealthTech platform designed to optimize patient care through advanced data analytics.",
      link: "#"
    },
    {
      title: "Destiny Consulting Group",
      category: "Consulting",
      image: "/case-2.jpg",
      description: "Destiny Consulting Group partners with businesses to provide strategic financial foresight.",
      link: "#"
    },
    {
      title: "MyFitter",
      category: "E-commerce",
      image: "/case-4.jpg",
      description: "MyFitter is a luxury curtain brand bringing earthy tones and bold contrasts to modern homes.",
      link: "#"
    },
    {
      title: "Scaling Fintech to $10M ARR",
      category: "Fintech",
      image: "/case-3.avif",
      description: "How we helped a neobank reduce CAC by 40% while tripling monthly active users.",
      link: "#"
    },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="our-works" className="w-full py-24 bg-[#0a0a0a] border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header with Nav Buttons */}
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-white"
          >
            {config?.title || "Case Studies"}
          </motion.h2>

          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-10 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cases.map((item: any, index: number) => {
            // Generate slug from title if not present
            const itemSlug = item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const href = item.link && item.link !== "#" ? item.link : `/works/${itemSlug}`;

            return (
              <Link
                href={href}
                key={index}
                className="min-w-[85vw] md:min-w-[600px] snap-start"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex flex-col gap-6 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                    {item.image ? (
                      <img
                        src={getMediaUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-2 max-w-xl">
                      <h3 className="text-2xl font-bold text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-base text-neutral-400 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
