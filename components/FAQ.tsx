'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQProps {
  config?: any;
}

export const FAQ = ({ config }: FAQProps) => {
  const faqs = config?.items || [
    {
      id: "01",
      question: "Who is this for?",
      answer: "B2B and B2C companies that want measurable growth from SEO, paid media, content, email, and CRO."
    },
    // defaults...
  ];

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="w-full py-32 bg-[#0a0a0a] border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">
                {config?.headline || "Frequently Asked Questions"}
            </h2>
            <p className="text-neutral-400 text-lg">
                {config?.description || "Everything you need to know about our marketing services and how we can help grow your business."}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {faqs.map((faq: any) => (
                <div key={faq.id} className="border-b border-neutral-800">
                    <button 
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                        className="w-full py-8 flex items-start justify-between text-left group"
                    >
                        <div className="flex gap-6">
                            <span className="text-neutral-600 font-mono text-sm pt-1">{faq.id}</span>
                            <span className={`text-lg md:text-xl font-medium transition-colors ${openId === faq.id ? 'text-blue-500' : 'text-white group-hover:text-blue-400'}`}>
                                {faq.question}
                            </span>
                        </div>
                        <div className={`flex-shrink-0 ml-4 p-1 rounded-full border transition-all ${openId === faq.id ? 'bg-blue-600 border-blue-600 text-white' : 'border-neutral-700 text-neutral-500'}`}>
                            {openId === faq.id ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                    </button>
                    <AnimatePresence>
                        {openId === faq.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="pl-12 pb-8 text-neutral-400 leading-relaxed pr-8">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
