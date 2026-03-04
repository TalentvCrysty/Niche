'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface FullFunnelMarketingProps {
  config?: any;
}

export const FullFunnelMarketing = ({ config }: FullFunnelMarketingProps) => {
  const cards = config?.cards || [
    {
      number: "1",
      title: "Acquire customers profitably",
      description: "Predictable acquisition through SEO, paid ads, high-converting landing pages, and robust tracking.",
      image: "/s1.webp",
      bgColor: "from-red-950/30 to-red-900/10",
      borderColor: "border-red-900/20",
      hoverBorderColor: "hover:border-red-700/40",
      accentColor: "text-red-500"
    },
    {
      number: "2",
      title: "Scale pipeline and revenue",
      description: "Systematic campaign testing and budget allocation to what works—at scale.",
      image: "/s2.webp",
      bgColor: "from-blue-950/30 to-blue-900/10",
      borderColor: "border-blue-900/20",
      hoverBorderColor: "hover:border-blue-700/40",
      accentColor: "text-blue-500"
    },
    {
      number: "3",
      title: "Compounding growth",
      description: "Content that ranks, assets that convert, and lists that nurture improving ROI month over month.",
      image: "/s3.webp",
      bgColor: "from-green-950/30 to-green-900/10",
      borderColor: "border-green-900/20",
      hoverBorderColor: "hover:border-green-700/40",
      accentColor: "text-green-500"
    },
    {
      number: "4",
      title: "Messaging that converts",
      description: "Positioning and creative tailored to your ICP so every click has a reason to become a customer.",
      image: "/s4.webp",
      bgColor: "from-purple-950/30 to-purple-900/10",
      borderColor: "border-purple-900/20",
      hoverBorderColor: "hover:border-purple-700/40",
      accentColor: "text-purple-500"
    }
  ];

  return (
    <section className="w-full py-12 md:py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            {config?.headline ? (
              <span dangerouslySetInnerHTML={{ __html: config.headline.replace(/\n/g, '<br/>') }} />
            ) : (
              <>
                Turn Attention Into Revenue<br />
                <span className="text-white/60">With Full-Funnel Marketing</span>
              </>
            )}
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {cards.map((card: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-gradient-to-br ${card.bgColor} border ${card.borderColor} ${card.hoverBorderColor} rounded-3xl overflow-hidden transition-all duration-500 group hover:shadow-2xl hover:shadow-white/5`}
            >
              {/* Card Content */}
              <div className="p-6 pb-4">
                <div className={`text-5xl font-bold ${card.accentColor} mb-4 opacity-80`}>
                  {card.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 leading-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Image */}
              <div className="px-4 pb-4 mt-4">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/30 group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
