'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface ComparisonProps {
  config?: any;
}

export const Comparison = ({ config }: ComparisonProps) => {
  return (
    <section className="w-full py-32 bg-[#0a0a0a] border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                {config?.headline ? (
                     <span dangerouslySetInnerHTML={{ __html: config.headline.replace(/\n/g, '<br/>') }} />
                ) : (
                    <>Why invest in a <br /> performance marketing partner?</>
                )}
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Niche Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-900/30 z-10 flex flex-col h-full"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium tracking-wide">
                    RECOMMENDED
                </div>
                <h3 className="text-2xl font-medium mb-8">{config?.niche?.title || "With Niche"}</h3>
                <ul className="space-y-6 flex-grow">
                    {(config?.niche?.items || [
                        "Full‑funnel growth: SEO, paid media, content, email, and CRO working together.",
                        "Fast launch, continuous optimization, measurable ROI.",
                        "Transparent reporting and compounding results."
                    ]).map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-4">
                            <div className="mt-1 min-w-[20px] h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Check size={12} className="text-white" />
                            </div>
                            <span className="text-white/90 leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Freelancers Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-3xl bg-[#111111] border border-neutral-800 text-neutral-400 flex flex-col h-full"
            >
                <h3 className="text-2xl font-medium mb-8 text-white">{config?.competitor1?.title || "Freelancers / Agencies"}</h3>
                <ul className="space-y-6 flex-grow">
                    {(config?.competitor1?.items || [
                        "Unpredictable, high-cost agencies.",
                        "Unreliable freelancers and poor communication, often bad designs.",
                        "Slow work, can take weeks to get the work done."
                    ]).map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-4">
                             <div className="mt-1 min-w-[20px] h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                <X size={12} className="text-red-400" />
                            </div>
                            <span className="leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* DIY Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-3xl bg-[#111111] border border-neutral-800 text-neutral-400 flex flex-col h-full"
            >
                <h3 className="text-2xl font-medium mb-8 text-white">{config?.competitor2?.title || "DIY Tools"}</h3>
                <ul className="space-y-6 flex-grow">
                    {(config?.competitor2?.items || [
                        "Limited control and data; no strategic direction.",
                        "Poor quality, no customer trust, and you’ll come second to your competitors.",
                        "You lose time you could be putting into your business."
                    ]).map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-4">
                             <div className="mt-1 min-w-[20px] h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                <X size={12} className="text-red-400" />
                            </div>
                            <span className="leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

        </div>
      </div>
    </section>
  );
};
