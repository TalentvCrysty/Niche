'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface WhyUsProps {
  config?: any;
}

export const WhyUs = ({ config }: WhyUsProps) => {
  const [activeHover, setActiveHover] = useState<number | null>(null);

  const features = config?.features || [
    {
      id: "01",
      title: "Top 1% Global Talent",
      description: "We don't outsource to juniors. Your growth is managed by battle-tested strategists who have scaled unicorns."
    },
    {
      id: "02",
      title: "Launch Fast, Iterate Faster",
      description: "Speed is our unfair advantage. We launch full-funnel campaigns in days, not months, and optimize daily."
    },
    {
      id: "03",
      title: "Unbeatable ROI & Transparency",
      description: "No black boxes. You get a live dashboard with real-time attribution, so you know exactly where every dollar goes."
    }
  ];

  return (
    <section id="why-us" className="w-full pt-10 pb-32 bg-[#080808] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header - Split Layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-light tracking-tight leading-[1.1] max-w-4xl"
          >
            <span className="text-neutral-500 line-through decoration-neutral-700 decoration-2">
              {config?.headline_prefix || "Not another one‑channel shop."}
            </span>
            <br />
            <span className="text-white">
              {config?.headline_suffix || "We’re your full‑funnel growth partner."}
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block mb-4"
          >
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center animate-spin-slow">
              <ArrowUpRight size={24} className="text-blue-400" />
            </div>
          </motion.div>
        </div>

        {/* Interactive List */}
        <div className="flex flex-col border-t border-white/10">
          {features.map((feature: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setActiveHover(index)}
              onMouseLeave={() => setActiveHover(null)}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 md:py-16 border-b border-white/10 cursor-default transition-colors hover:bg-white/5 px-4 md:px-8 -mx-4 md:-mx-8 rounded-2xl md:rounded-3xl"
            >
              <div className="flex items-baseline gap-8 md:gap-16">
                <span className="text-sm font-mono text-blue-500 font-medium">
                  /{feature.id}
                </span>
                <h3 className="text-3xl md:text-6xl font-light text-neutral-400 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>

              <div className="mt-6 md:mt-0 md:max-w-md pl-12 md:pl-0">
                <p className="text-lg text-neutral-500 group-hover:text-white/80 transition-colors duration-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Indicator */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-blue-500 transition-all duration-300 ${activeHover === index ? 'h-24' : ''}`} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
