'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TeamProps {
    config?: any;
}

export const Team = ({ config }: TeamProps) => {
    const teamMembers = [
        {
            slug: "levan",
            name: "Levan",
            role: "Founder & CEO",
            image: "/levan.jpeg",
            blurb: "Visionary leader driving innovation and growth.",
        },
        {
            slug: "migre",
            name: "Migre",
            role: "Co-Founder & CTO",
            image: "/migre.jpeg",
            blurb: "Technical mastermind behind our scalable solutions.",
        },
        {
            slug: "sarah",
            name: "Sarah",
            role: "Head of Design",
            image: "/1.jpeg",
            blurb: "Crafting intuitive and beautiful user experiences.",
        },
        {
            slug: "david",
            name: "David",
            role: "Lead Developer",
            image: "/3.jpeg",
            blurb: "Architecting robust systems for global scale.",
        },
        {
            slug: "michael",
            name: "Michael",
            role: "Product Strategy",
            image: "/5.jpeg",
            blurb: "Aligning market needs with product vision.",
        },
    ];

    const displayMembers = config?.members?.length > 0 ? config.members : teamMembers;

    // Duplicate list for infinite scroll
    const marqueeMembers = [...displayMembers, ...displayMembers, ...displayMembers];

    return (
        <section className="w-full py-24 bg-black border-t border-neutral-900 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-950/20 rounded-full blur-3xl opacity-30 pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-3xl opacity-20 pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="w-full relative z-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6"
                    >
                        {config?.headline ? (
                            <span dangerouslySetInnerHTML={{ __html: config.headline.replace(/\*(.*?)\*/g, '<span class="text-blue-500">$1</span>') }} />
                        ) : (
                            <>Meet the <span className="text-blue-500">Minds</span></>
                        )}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light max-w-2xl mx-auto"
                    >
                        {config?.subheadline || "Thousands of projects successfully delivered thanks to the passion, precision, and dedication of our expert team."}
                    </motion.p>
                </div>

                {/* Marquee Track */}
                <div className="relative w-full overflow-hidden mask-fade-sides">
                    <style jsx>{`
                        .mask-fade-sides {
                            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                        }
                    `}</style>
                    <div className="flex">
                        <motion.div
                            className="flex gap-8 lg:gap-10 pl-8 lg:pl-10"
                            animate={{
                                x: ["0%", "-33.33%"],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 40, // Adjust speed: higher = slower
                                    ease: "linear",
                                },
                            }}
                        // whileHover={{ animationPlayState: "paused" }} // Note: Framer Motion pure animation doesn't pause with CSS hover easily, but let's try a hover variant if needed or rely on user interaction. 
                        // Actually, for simple pause on hover with framer motion loop, it's complex. 
                        // Let's stick to the continuous smooth loop which is sleekest.
                        >
                            {marqueeMembers.map((member, index) => (
                                <div
                                    key={index}
                                    className="group relative w-[320px] md:w-[380px] flex-shrink-0 bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 hover:bg-neutral-900/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10"
                                >
                                    {/* Image Container */}
                                    <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-neutral-800 border border-white/5 group-hover:border-blue-500/20 transition-colors duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-30 group-hover:opacity-10 transition-opacity duration-500" />
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3 text-center relative z-10">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                                                {member.role}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-100 transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-base text-neutral-400 font-normal leading-relaxed text-balance max-w-[90%] mx-auto">
                                            {member.blurb}
                                        </p>
                                        <div className="pt-2">
                                            <a
                                                href={`/experts/${member.slug || ""}`}
                                                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/15 hover:border-blue-500/30 transition-colors"
                                            >
                                                View Profile
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
