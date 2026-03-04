'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Code,
  Database,
  Layout,
  Server,
  Palette,
  PenTool,
  FileImage,
  BookOpen,
  Target,
  Search,
  Rocket,
  BarChart3
} from 'lucide-react';

interface WorkflowProps {
  config?: any;
}

export const Workflow = ({ config }: WorkflowProps) => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'development' | 'branding'>('marketing');

  const processData = {
    marketing: [
      {
        number: "1",
        title: "Goals & diagnostics",
        desc: "Clarify insights and audit tracking, offers, and channels to establish a baseline.",
        icon: Target,
        imageUrl: "/66f8845b6f7911f99d856721_process-1.svg",
        accentColor: "from-green-500/20 to-green-600/10",
        borderColor: "border-green-500/20",
        hoverBorderColor: "hover:border-green-500/40",
        glowColor: "group-hover:shadow-green-500/20",
        iconColor: "text-green-500"
      },
      {
        number: "2",
        title: "Market & ICP research",
        desc: "Map ICP pain‑points and competitive landscape to inform messaging and channel mix.",
        icon: Search,
        imageUrl: "/66f8845b6f7911f99d856722_process-2.svg",
        accentColor: "from-blue-500/20 to-blue-600/10",
        borderColor: "border-blue-500/20",
        hoverBorderColor: "hover:border-blue-500/40",
        glowColor: "group-hover:shadow-blue-500/20",
        iconColor: "text-blue-500"
      },
      {
        number: "3",
        title: "Launch & iterate",
        desc: "Stand‑up campaigns, creatives, and content. Test hypotheses and double down on winners.",
        icon: Rocket,
        imageUrl: "/66f8845b6f7911f99d856723_process-3.svg",
        accentColor: "from-amber-500/20 to-amber-600/10",
        borderColor: "border-amber-500/20",
        hoverBorderColor: "hover:border-amber-500/40",
        glowColor: "group-hover:shadow-amber-500/20",
        iconColor: "text-amber-500"
      },
      {
        number: "4",
        title: "Scale & systematize",
        desc: "Implement CAC/LTV­driven budget allocation, automated reporting, and expansion experiments.",
        icon: BarChart3,
        imageUrl: "/66f8845b6f7911f99d85670b_process-1.svg",
        accentColor: "from-purple-500/20 to-purple-600/10",
        borderColor: "border-purple-500/20",
        hoverBorderColor: "hover:border-purple-500/40",
        glowColor: "group-hover:shadow-purple-500/20",
        iconColor: "text-purple-500"
      }
    ],
    development: [
      {
        number: "1",
        title: "Discovery & Plan",
        desc: "We dive deep into your requirements, defining technical architecture and milestones.",
        icon: Layout,
        imageUrl: "/discovery-plan.png",
        accentColor: "from-cyan-500/20 to-cyan-600/10",
        borderColor: "border-cyan-500/20",
        hoverBorderColor: "hover:border-cyan-500/40",
        glowColor: "group-hover:shadow-cyan-500/20",
        iconColor: "text-cyan-500"
      },
      {
        number: "2",
        title: "Design & Prototype",
        desc: "Creating interactive prototypes and UI/UX designs to visualize the end product.",
        icon: FileImage,
        imageUrl: "/design-prototype.png",
        accentColor: "from-violet-500/20 to-violet-600/10",
        borderColor: "border-violet-500/20",
        hoverBorderColor: "hover:border-violet-500/40",
        glowColor: "group-hover:shadow-violet-500/20",
        iconColor: "text-violet-500"
      },
      {
        number: "3",
        title: "Development",
        desc: "Writing clean, scalable code with continuous integration and testing protocols.",
        icon: Code,
        imageUrl: "/development.png",
        accentColor: "from-indigo-500/20 to-indigo-600/10",
        borderColor: "border-indigo-500/20",
        hoverBorderColor: "hover:border-indigo-500/40",
        glowColor: "group-hover:shadow-indigo-500/20",
        iconColor: "text-indigo-500"
      },
      {
        number: "4",
        title: "Deploy & Maintain",
        desc: "Seamless deployment, performance monitoring, and ongoing support for stability.",
        icon: Server,
        imageUrl: "/deploy-maintain.png",
        accentColor: "from-sky-500/20 to-sky-600/10",
        borderColor: "border-sky-500/20",
        hoverBorderColor: "hover:border-sky-500/40",
        glowColor: "group-hover:shadow-sky-500/20",
        iconColor: "text-sky-500"
      }
    ],
    branding: [
      {
        number: "1",
        title: "Brand Strategy",
        desc: "Defining your core values, mission, and unique position in the market landscape.",
        icon: Target,
        imageUrl: "/brand-strategy.png",
        accentColor: "from-orange-500/20 to-orange-600/10",
        borderColor: "border-orange-500/20",
        hoverBorderColor: "hover:border-orange-500/40",
        glowColor: "group-hover:shadow-orange-500/20",
        iconColor: "text-orange-500"
      },
      {
        number: "2",
        title: "Visual Identity",
        desc: "Crafting logos, typography, and color palettes that resonate with your audience.",
        icon: Palette,
        imageUrl: "/visual-identity.png",
        accentColor: "from-rose-500/20 to-rose-600/10",
        borderColor: "border-rose-500/20",
        hoverBorderColor: "hover:border-rose-500/40",
        glowColor: "group-hover:shadow-rose-500/20",
        iconColor: "text-rose-500"
      },
      {
        number: "3",
        title: "Content Creation",
        desc: "Producing engaging assets and copy that effectively communicate your brand voice.",
        icon: PenTool,
        imageUrl: "/content-creation.png",
        accentColor: "from-pink-500/20 to-pink-600/10",
        borderColor: "border-pink-500/20",
        hoverBorderColor: "hover:border-pink-500/40",
        glowColor: "group-hover:shadow-pink-500/20",
        iconColor: "text-pink-500"
      },
      {
        number: "4",
        title: "Brand Guidelines",
        desc: "Documenting usage rules to ensure consistency across all touchpoints and media.",
        icon: BookOpen,
        imageUrl: "/brand-guidelines.png",
        accentColor: "from-fuchsia-500/20 to-fuchsia-600/10",
        borderColor: "border-fuchsia-500/20",
        hoverBorderColor: "hover:border-fuchsia-500/40",
        glowColor: "group-hover:shadow-fuchsia-500/20",
        iconColor: "text-fuchsia-500"
      }
    ]
  };

  const currentSteps = processData[activeTab];

  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6">
            Our {activeTab} process
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10">
            A systematic approach to building predictable results.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1 bg-white/5 backdrop-blur-sm rounded-full w-fit mx-auto border border-white/10">
            {Object.keys(processData).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 capitalize ${activeTab === tab
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-white'
                  }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode='popLayout'>
            {currentSteps.map((step: any, i) => {
              const Icon = step.icon || Target;
              return (
                <motion.div
                  key={`${activeTab}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative bg-gradient-to-br ${step.accentColor} backdrop-blur-sm border ${step.borderColor} ${step.hoverBorderColor} rounded-3xl overflow-hidden transition-all duration-500 group hover:shadow-2xl ${step.glowColor} hover:-translate-y-2`}
                >
                  {/* Image/Icon Section - Top Half */}
                  <div className="relative w-full aspect-square bg-black/20 group-hover:bg-black/30 transition-colors duration-500">
                    {step.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={step.imageUrl}
                          alt={step.title}
                          fill
                          className="object-cover filter brightness-110 group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center p-12">
                        <Icon
                          size={80}
                          className={`${step.iconColor} opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500`}
                          strokeWidth={1}
                        />
                      </div>
                    )}

                    {/* Step Number Overlay */}
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <span className="text-xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Text Section - Bottom Half */}
                  <div className="relative p-8 bg-black/30 backdrop-blur-sm">
                    <h3 className="text-2xl font-semibold text-white mb-4 leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-base text-neutral-400 leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
