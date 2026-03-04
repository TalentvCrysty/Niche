'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Acquire customers profitably",
      description: "Predictable acquisition through SEO, paid ads, high‑converting landing pages, and robust tracking."
    },
    {
      number: "02",
      title: "Scale pipeline and revenue",
      description: "Systematic campaign testing and budget allocation to what works at scale."
    },
    {
      number: "03",
      title: "Compounding growth",
      description: "Content that ranks, assets that convert, and lists that nurture improving ROI month over month."
    },
    {
      number: "04",
      title: "Messaging that converts",
      description: "Positioning and creative tailored to your ICP so every click has a reason to become a customer."
    }
  ];

  return (
    <section className="w-full py-32 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="max-w-4xl mb-24">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]"
            >
                Turn attention into revenue with <br className="hidden md:block" /> <span className="font-medium border-b-2 border-emerald-500/50 pb-1">full‑funnel marketing</span>
            </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-24">
            {steps.map((step, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-start group"
                >
                    <div className="text-xs font-mono font-medium text-emerald-600 mb-6 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        Step {step.number}
                    </div>
                    <h3 className="text-3xl font-medium text-neutral-900 mb-4 group-hover:text-emerald-700 transition-colors">
                        {step.title}
                    </h3>
                    <p className="text-lg text-neutral-500 leading-relaxed max-w-lg">
                        {step.description}
                    </p>
                </motion.div>
            ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 pt-12 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8"
        >
            <p className="text-xl text-neutral-400 font-light">
                Ready to scale your revenue?
            </p>
            <button className="group flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-neutral-800 transition-all hover:pr-8 hover:shadow-2xl hover:shadow-neutral-200">
                View our packages
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>

      </div>
    </section>
  );
};
