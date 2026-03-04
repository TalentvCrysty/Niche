'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ImpactProps {
  config?: any;
}

export const Impact = ({ config }: ImpactProps) => {
  const stats = config?.stats || [
    { value: "4.7", suffix: "/5", label: "Average Satisfaction Score", sublabel: "Based on 840+ verified reviews" },
    { value: "1.3k", suffix: "+", label: "Happy Customers", sublabel: "Scaling revenue globally" },
    { value: "97", suffix: "", label: "Countries", sublabel: "Global Reach" }
  ];

  return (
    <section className="w-full pt-0 md:pt-10 pb-10 md:pb-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-800">

          {stats.map((stat: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center text-center px-4 ${index > 0 ? 'pt-12 md:pt-0' : ''}`}
            >
              <div className="flex items-end gap-2 mb-2">
                <span className="text-7xl md:text-8xl font-light tracking-tighter text-white">{stat.value}</span>
                {stat.suffix && (
                  <span className={`text-2xl font-light mb-2 ${stat.suffix === '+' ? 'text-blue-500 text-4xl mb-4' : 'text-neutral-500'}`}>
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="text-neutral-400 font-medium mt-2">{stat.label}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.sublabel}</p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};
