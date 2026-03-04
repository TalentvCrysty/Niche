"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Layout } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getProjects, PortfolioProject } from "@/app/actions/portfolio";
import { ParticleBackground } from "@/components/ParticleBackground";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

// Helper to get media URL
const BACKEND_URL = "http://localhost:3005";
const getMediaUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    if (url.startsWith('/uploads')) {
        return `${BACKEND_URL}${url}`;
    }
    return url;
};

const CATEGORIES = [
    "All",
    "UI/UX Design",
    "Branding",
    "Motion Design",
    "Ads",
    "SEO",
    "Apps",
    "Video Editing",
    "Our All Website"
];

const SPECIAL_CATEGORIES = ["Ads", "SEO", "Video Editing"];

export default function PortfolioPage() {
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await getProjects();
                const published = data.filter((p: PortfolioProject) => p.status === 'published');
                setProjects(published);
                setFilteredProjects(published);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProjects();
    }, []);

    useEffect(() => {
        if (activeFilter === "All") {
            setFilteredProjects(projects);
        } else {
            // Filter by category field or technology fallback if needed, but primary is category
            setFilteredProjects(projects.filter(p =>
                p.category === activeFilter ||
                (activeFilter === "Our All Website" && true) // Assuming "Our All Website" means show everything? Or is it a category "Website"? Interpreting as a category named "Our All Website" if users select it, but mostly likely it acts as 'Websites'. 
                // Actually the user listed "our all website" as a category name.
            ));
        }
    }, [activeFilter, projects]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen bg-[#020202] text-white selection:bg-[#3B5BF7]/30 font-sans relative">
            <Navbar theme="dark" />

            {/* --- BACKGROUND --- */}
            <div className="fixed inset-0 z-0 bg-[#020202]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-40" />
                <ParticleBackground
                    baseColor="255, 255, 255"
                    particleCount={50}
                    connectionDistance={120}
                    className="opacity-20"
                />
            </div>

            <div className="relative z-10">
                {/* --- HERO CONTENT --- */}
                <section className="pt-40 pb-16 px-6 md:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">
                            Portfolio
                        </h1>
                        <p className="text-lg md:text-xl text-blue-200/70 max-w-2xl mx-auto leading-relaxed font-light">
                            Production-ready products shipped on time. From MVPs to scaling platforms, see what we've built.
                        </p>
                    </motion.div>
                </section>

                {/* --- FILTER BAR --- */}
                <section className="px-6 max-w-7xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-2 md:gap-3"
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`
                                    px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                                    ${activeFilter === cat
                                        ? 'bg-[#3B5BF7] border-[#3B5BF7] text-white shadow-[0_0_20px_-5px_rgba(59,91,247,0.5)]'
                                        : 'bg-[#0f1115] border-white/5 text-neutral-400 hover:border-white/10 hover:text-white hover:bg-[#161b22]'
                                    }
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </section>

                {/* --- PORTFOLIO GRID --- */}
                <section className="px-6 md:px-12 max-w-[1800px] mx-auto pb-40">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="bg-[#0A0A0A] rounded-[2rem] h-[500px] animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProjects.map((project) => {
                                    const isSpecial = project.category && SPECIAL_CATEGORIES.includes(project.category);
                                    const hasComparison = isSpecial && project.before_image && project.after_image;

                                    return (
                                        <motion.div
                                            key={project.id || project.slug}
                                            layout
                                            variants={item}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -5 }}
                                            transition={{ duration: 0.4 }}
                                            className={`h-full ${hasComparison ? 'md:col-span-2' : 'col-span-1'}`}
                                        >
                                            <Link
                                                href={`/portfolio/${project.slug}`}
                                                className="group block h-full bg-[#0A0A0A] border border-white/5 rounded-[32px] p-5 flex flex-col transition-all duration-300 hover:border-[#3B5BF7]/40 hover:shadow-[0_0_40px_-10px_rgba(59,91,247,0.15)] overflow-hidden"
                                            >
                                                {/* Header Info */}
                                                <div className="mb-6 px-1 flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#3B5BF7]">
                                                                {project.category || "PROJECT"}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-[#3B5BF7] transition-colors">
                                                            {project.title}
                                                        </h3>
                                                    </div>
                                                    <div className="bg-white/5 p-2 rounded-full group-hover:bg-[#3B5BF7] group-hover:text-white transition-all">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* Content Area */}
                                                <div className={`relative w-full rounded-2xl overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors mb-4 flex-grow ${hasComparison ? 'min-h-[400px]' : 'aspect-[4/3]'}`}>
                                                    {hasComparison ? (
                                                        <div className="h-full w-full absolute inset-0">
                                                            <BeforeAfterSlider
                                                                beforeImage={project.before_image!} // Asserted by hasComparison
                                                                afterImage={project.after_image!}
                                                                alt={project.title}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {project.thumbnail_image ? (
                                                                <Image
                                                                    src={getMediaUrl(project.thumbnail_image)}
                                                                    alt={project.title}
                                                                    fill
                                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 gap-3">
                                                                    <div className="p-4 rounded-full bg-white/5">
                                                                        <Layout className="w-8 h-8 opacity-40" />
                                                                    </div>
                                                                    <span className="text-xs font-medium uppercase tracking-wider opacity-60">No Image</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-[#3B5BF7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                        </>
                                                    )}
                                                </div>

                                                {/* Footer Info */}
                                                <div className="mt-auto px-1">
                                                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 font-light mb-4">
                                                        {project.short_description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {project.technologies?.slice(0, 3).map((tech, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2.5 py-1.5 rounded-md bg-[#161616] border border-white/5 text-[10px] uppercase tracking-wider font-semibold text-neutral-500 group-hover:border-[#3B5BF7]/20 group-hover:text-neutral-300 transition-colors"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}
