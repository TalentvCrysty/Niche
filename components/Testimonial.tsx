'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const Testimonial = () => {
  return (
    <section className="w-full py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            
            {/* Image Section - Clean & Minimal */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-w-md mx-auto md:mx-0"
            >
                <div className="relative w-full h-full overflow-hidden">
                    <Image
                        src="https://cdn.prod.website-files.com/66f8845b6f7911f99d856648/680fa5e2a65f3ae26b5d5cd2_fa8237ecf784808a9f152899537c5b55_paul-photo.avif"
                        alt="Paul Darmas"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                </div>
            </motion.div>

            {/* Content Section - Editorial Style */}
            <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="w-12 h-0.5 bg-black/20" />
                    
                    <h2 className="text-3xl md:text-5xl font-light leading-tight text-neutral-900 tracking-tight">
                        "Niche unlocked <span className="text-black font-medium">predictable growth</span> for us, more qualified leads, lower CAC. No fluff, just execution."
                    </h2>
                    
                    <div className="pt-4">
                        <p className="text-lg font-medium text-black">Paul Darmas</p>
                        <p className="text-neutral-500">Founder, Digitality</p>
                    </div>
                </motion.div>
            </div>

        </div>
      </div>
    </section>
  );
};
