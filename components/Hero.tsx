'use client';

import React, { useState, useEffect } from 'react';
import { Send, Play, Users, Zap, Cpu, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

interface HeroProps {
  config?: any;
}

// Image sequence for animation
// Loaded dynamically from public/animation.json

export const Hero = ({ config }: HeroProps) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/animation.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Failed to load animation:", error));
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden bg-black">

      {/* Main Content Container */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20 lg:py-0 relative">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* Left Side - Text Content */}
          <div className="flex-1 relative z-10 max-w-none lg:max-w-[65%] xl:max-w-[70%]">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8"
            >
              <span className="text-sm text-zinc-300">
                {config?.badge || "Hey there 👋"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] text-white"
            >
              {config?.headline ? (
                <span dangerouslySetInnerHTML={{
                  __html: config.headline
                    .replace(/\n/g, '<br/>')
                    .replace(/\*(.*?)\*/g, '<span class="text-[#3B5BF7]">$1</span>')
                    .replace(/Built end to end/g, '<span class="text-[#3B5BF7]">Built end to end</span>')
                }} />
              ) : (
                <>
                  <span className="text-[#3B5BF7]">Built end to end</span>
                </>
              )}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed"
            >
              {config?.subheadline || "A full-service Digital Agency that can meet all of your online needs. We're called A.I.O. (All-in-One) for a reason."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link href={config?.ctaLink || "/#contact"}>
                <button className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3B5BF7] text-white rounded-full font-medium text-sm transition-all hover:bg-[#2D4AD9] hover:shadow-lg hover:shadow-blue-500/25">
                  <Send size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span>{config?.ctaText || "Book a Call"}</span>
                </button>
              </Link>
              {(config?.secondaryCtaText || !config?.ctaText) && (
                <Link href={config?.secondaryCtaLink === "/#contact" ? "/#contact" : (config?.secondaryCtaLink || "/services")}>
                  <button className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3B5BF7] text-white rounded-full font-medium text-sm transition-all hover:bg-[#2D4AD9] hover:shadow-lg hover:shadow-blue-500/25">
                    <Play size={14} className="fill-current" />
                    <span>{config?.secondaryCtaText || "Services"}</span>
                  </button>
                </Link>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-zinc-400"
            >
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#3B5BF7]" />
                <span>10k+ customers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#f26522]">Y</span>
                <span>Combinator</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" className="w-5 h-auto rounded-[2px] shadow-sm">
                  <path fill="#00732f" d="M0 0h1200v200H0z" />
                  <path fill="#fff" d="M0 200h1200v200H0z" />
                  <path fill="#000" d="M0 400h1200v200H0z" />
                  <path fill="#f00" d="M0 0h300v600H0z" />
                </svg>
                <span>Registered in Dubai</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-[#3B5BF7]" />
                <span>No AI</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/partners/change-media.png"
                  alt="Change Media"
                  className="h-5 w-auto object-contain"
                />
                <span>Change Media</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/partners/entrepreneur-georgia.png"
                  alt="Entrepreneur Georgia"
                  className="h-5 w-auto object-contain rounded-sm"
                />
                <span>Entrepreneur Georgia</span>
              </div>
            </motion.div>

            {/* Reviews & Awards Section */}
            {/* Reviews & Awards Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 pt-8 w-full flex flex-col sm:flex-row items-center gap-8 sm:gap-16 border-t border-white/5"
            >
              {/* Google Reviews */}
              <div className="flex items-center gap-5">
                <div className="p-3 bg-white rounded-xl shadow-lg shadow-blue-900/10">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-white tracking-tight">4.9/5</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-base text-zinc-400 font-medium tracking-wide">Google Reviews</p>
                </div>
              </div>

              {/* Slanted Separator */}
              <div className="hidden sm:block h-12 w-[1px] bg-zinc-800 -skew-x-12 rotate-[15deg]" />

              {/* Award */}
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-white uppercase tracking-widest mb-2">Best Digital Agency of 2025</p>
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-zinc-200 tracking-tight leading-none">
                    Change Media
                  </h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Animated Image (120% larger, no container) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1 flex justify-center w-full lg:absolute lg:right-0 lg:translate-x-1/4 lg:top-1/2 lg:-translate-y-1/2 lg:w-auto pointer-events-none lg:pointer-events-auto"
          >
            <div className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] lg:w-[750px] lg:h-[750px] xl:w-[900px] xl:h-[900px]">
              {animationData && (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="w-full h-full"
                  style={{ filter: "invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.5)" }}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
