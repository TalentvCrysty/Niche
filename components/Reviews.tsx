'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ReviewsProps {
  config?: any;
}

export const Reviews = ({ config }: ReviewsProps) => {
  const reviews = config?.items || [
    { name: "thomasvgilst", date: "March 18, 2025", rating: 5, text: "I recommend Niche to everyone!" },
    // defaults...
  ];

  const featured = config?.featured || {
    text: "Niche became our growth arm. They rebuilt tracking, launched paid and SEO the right way, and cut our CAC while increasing qualified demos. If you want a partner obsessed with results, work with Niche.",
    author: "John Danes",
    role: "Marketing Agency Founder - USA",
    rating: 5
  };

  return (
    <section id="testimonials" className="w-full py-32 bg-[#0a0a0a] border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20">
             <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                {config?.headline || "Testimonials"}
             </h2>
        </div>
       
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Featured Review */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 flex flex-col gap-8 p-10 bg-blue-600 text-white rounded-3xl"
            >
                <div className="flex gap-1 text-white">
                    {[...Array(featured.rating || 5)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                </div>
                <blockquote className="text-2xl font-light leading-relaxed">
                    “{featured.text}”
                </blockquote>
                <div className="mt-auto pt-8 border-t border-white/20">
                    <div className="font-semibold text-lg">{featured.author}</div>
                    <div className="text-white/70 text-sm">{featured.role}</div>
                </div>
            </motion.div>

            {/* Review Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review: any, i: number) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col gap-4 p-6 bg-[#111111] rounded-2xl border border-neutral-800"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-white">{review.name}</span>
                            <span className="text-xs text-neutral-500">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 text-blue-400">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} className="fill-current" />)}
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-4">
                            {review.text}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};
