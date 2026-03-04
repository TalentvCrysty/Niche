'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

interface ServicesProps {
    config?: any;
}

export const Services = ({ config }: ServicesProps) => {

    const services = [
        {
            title: "Branding",
            items: [
                "Brand Strategy & Positioning",
                "Brand Identity Design",
                "Brand Naming & Messaging",
                "Brand Architecture",
                "Rebranding & Brand Transformation",
                "Employee Branding"
            ]
        },
        {
            title: "Design",
            highlight: true,
            items: [
                "UX Research & Experience Strategy",
                "UI Design Web & Mobile",
                "Design Systems (3+ Platforms)",
                "Marketing & Campaign Design",
                "Motion & Visual Storytelling",
                "Packaging & Print Design"
            ]
        },
        {
            title: "Development",
            items: [
                "Website Development",
                "Web Application Development",
                "Mobile App Development",
                "E-commerce Development",
                "CMS & Headless Solutions",
                "API & Integrations"
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <section id="services" className="w-full py-24 md:py-32 bg-[#050505] text-white relative overflow-hidden">
            {/* Particle Background Animation - Placed absolutely behind content */}
            <div className="absolute inset-0 z-0">
                <ParticleBackground
                    baseColor="59, 91, 247" // Updated to match the active blue #3B5BF7
                    particleCount={60}
                    connectionDistance={180}
                    className="opacity-40"
                />
            </div>

            <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#3B5BF7] font-bold tracking-[0.2em] text-xs uppercase mb-4"
                    >
                        SERVICES
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
                    >
                        Digital Product Design & <br className="hidden md:block" />
                        Development <span className="text-[#3B5BF7] italic">Services We Offer</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        Complete product development from concept to scale. Senior team, full ownership, blazing fast.
                    </motion.p>
                </div>

                {/* Services Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                            className={`
                                relative p-8 rounded-[32px] flex flex-col transition-all duration-300 min-h-[580px] group/card
                                ${service.highlight
                                    ? 'bg-[#030303] border border-[#3B5BF7] shadow-[0_0_50px_-12px_rgba(59,91,247,0.25)]'
                                    : 'bg-[#030303] border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-black'
                                }
                            `}
                        >
                            <div className="mb-4 relative z-10">
                                <h3 className={`text-[28px] font-bold mb-2 tracking-tight ${service.highlight ? 'text-white' : 'text-neutral-200'}`}>
                                    {service.title}
                                </h3>
                            </div>

                            {/* Divider line */}
                            <div className={`h-px w-full mb-8 relative z-10 ${service.highlight ? 'bg-gradient-to-r from-[#3B5BF7] to-transparent opacity-30' : 'bg-gradient-to-r from-white/10 to-transparent'}`} />

                            <ul className="space-y-2 flex-grow relative z-10">
                                {service.items.map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        variants={listItemVariants}
                                        className={`
                                            flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer group/item
                                            ${service.highlight
                                                ? 'hover:bg-[#3B5BF7]/10'
                                                : 'hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <span className={`
                                            flex-shrink-0 transition-all duration-300 transform group-hover/item:translate-x-1 group-hover/item:scale-110
                                            ${service.highlight ? 'text-[#3B5BF7]' : 'text-neutral-600 group-hover/item:text-white'}
                                        `}>
                                            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                                        </span>
                                        <span className={`
                                            text-[15px] font-medium leading-relaxed transition-all duration-300
                                            ${service.highlight
                                                ? 'text-neutral-300 group-hover/item:text-white group-hover/item:pl-1'
                                                : 'text-neutral-400 group-hover/item:text-white group-hover/item:pl-1'
                                            }
                                        `}>
                                            {item}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Subtle Ambient Glow for Center Card */}
                            {service.highlight && (
                                <div className="absolute inset-0 bg-gradient-to-b from-[#3B5BF7]/5 to-transparent rounded-[32px] pointer-events-none" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center justify-center mt-24 gap-6"
                >
                    <button className="group relative flex items-center justify-center gap-2 px-10 py-4.5 bg-[#3B5BF7] text-white rounded-full font-semibold text-sm transition-all hover:bg-[#2D4AD9] hover:shadow-[0_0_30px_-5px_rgba(59,91,247,0.5)] hover:scale-105 active:scale-95">
                        <span>What you get</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="text-sm text-neutral-500 font-medium tracking-wide">
                        <span className="text-[#3B5BF7]">100%</span> risk-free satisfaction guarantee
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
