"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap,
    Globe,
    TrendingUp,
    Clock,
    Shield,
    Briefcase
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import Image from "next/image";

// Animation Variants
const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export function CareersContent({ headline, subheadline, heroButtonText, heroButtonLink, checklist, benefits, process, cta, navbarConfig, footerConfig }: any) {

    // Default data overrides to match the specific "Marketing Team" narrative if config is generic
    const heroTitle = "Join Our Marketing Team";
    const heroSubtitle = "Marketing Experts?";
    const heroDesc = "We hire and train exceptional marketing talent to become industry leaders.";

    const heroCards = [
        { title: "Gain experience", icon: Zap, color: "bg-red-500/10 text-red-500 border-red-500/20" },
        { title: "Learn to drive results for global brands", icon: Globe, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
        { title: "Refine your skills", icon: Sparkles, color: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20" },
        { title: "Become a top marketing professional", icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
        { title: "Earn up to 3x more than average", icon: DollarSignIcon, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
    ];

    const benefitsList = [
        { title: "Work on your terms", desc: "Choose the amount of projects, work or take holidays whenever you want." },
        { title: "Earn More", desc: "Marketing specialists at our agency earn up to $9k/month." },
        { title: "Income Guaranteed", desc: "Don't worry about getting clients, simply focus on what you love doing—driving marketing results." },
        { title: "Marketing, Only.", desc: "Don't worry about dealing with customers, communication, we handle it all." }
    ];

    const steps = [
        { step: "Step 1", title: "Apply by completing the short form", icon: "/icons/form.svg" }, // Fallback to text if icon missing
        { step: "Step 2", title: "If you're selected, you will get a paid marketing campaign test", icon: "/icons/test.svg" },
        { step: "Step 3", title: "We'll get on a short call to discuss payments and schedule", icon: "/icons/call.svg" },
        { step: "Step 4", title: "Start earning", icon: "/icons/rocket.svg" }
    ];

    return (
        <main className="min-h-screen bg-[#020202] text-white font-sans selection:bg-[#3B5BF7]/30 selection:text-white overflow-hidden">
            <Navbar theme="dark" config={navbarConfig} />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-32 px-6">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <ParticleBackground baseColor="255, 255, 255" particleCount={40} className="opacity-30" />
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#3B5BF7] opacity-[0.1] blur-[150px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-2 text-white">
                            {heroTitle}
                        </h1>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#90A5F9] to-[#3B5BF7] pb-4">
                            {heroSubtitle}
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 font-light"
                    >
                        {heroDesc}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center mb-24"
                    >
                        <a
                            href={heroButtonLink || "/#apply"}
                            className="group relative px-10 py-4 bg-[#3B5BF7] text-white rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,91,247,0.5)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {heroButtonText || "Apply now"} <ArrowRight size={20} />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </motion.div>

                    {/* Hero Grid Cards - Redesigned 1:1 match */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto"
                    >
                        {heroCards.map((card, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                className={`
                                    relative overflow-hidden rounded-[2rem] 
                                    flex flex-col items-center justify-center p-8 md:p-10
                                    transition-all duration-300 hover:scale-[1.02]
                                    ${i < 3 ? 'md:col-span-2' : 'md:col-span-3'} 
                                    min-h-[200px]
                                `}
                                style={{
                                    backgroundColor: i === 0 ? '#1f1212' : // Red/Brown
                                        i === 1 ? '#151221' : // Purple
                                            i === 2 ? '#081025' : // Facebook Blue Darkened
                                                i === 3 ? '#0B1221' : // Deep Navy
                                                    '#221810'   // Amber/Brown
                                }}
                            >
                                {/* Subtle Checkmark Icon Background */}
                                <div className="mb-6 relative">
                                    <div className="p-1.5 rounded-full bg-[#1877F2]/10 text-white shadow-[0_0_15px_-5px_#1877F2]">
                                        <CheckCircle2 size={20} fill="#1877F2" className="text-white" />
                                    </div>
                                    {/* Particles effect simulation (dots) */}
                                    <div className="absolute -top-4 -right-8 w-1 h-1 bg-white/20 rounded-full blur-[1px]" />
                                    <div className="absolute top-6 -left-6 w-1 h-1 bg-white/10 rounded-full blur-[1px]" />
                                </div>

                                <h3 className="text-xl md:text-2xl font-medium text-center text-white/90 leading-tight max-w-[280px]">
                                    {card.title}
                                </h3>

                                {/* Background glow for depth */}
                                <div className={`absolute inset-0 opacity-20 bg-gradient-to-b from-white/5 to-transparent pointer-events-none`} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- BENEFITS SECTION --- */}
            <section className="py-32 bg-[#050505] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B5BF7]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-5">
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-bold leading-tight mb-8"
                            >
                                The Benefits Of <span className="text-white relative inline-block">
                                    Freelancing
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#3B5BF7]" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                    </svg>
                                </span>,<br />
                                Without All The <span className="text-neutral-500 line-through decoration-red-500/50">Negatives</span>.
                            </motion.h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                We've created the perfect environment for marketers to excel, reach their best performance, and earn what they deserve without the administrative headaches.
                            </p>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {benefitsList.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                        {b.title}
                                    </h3>
                                    <p className="text-neutral-500 text-sm leading-relaxed">
                                        {b.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STEPS SECTION --- */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="text-center relative"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                    {s.step}
                                </div>
                                {/* Connector Line (Desktop) */}
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-6 left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B5BF7]/30 to-transparent -z-10"
                                        style={{ transform: 'translateX(50%)' }}
                                    />
                                )}

                                <div className="min-h-[80px] flex items-center justify-center mb-4">
                                    <Sparkles className="text-[#3B5BF7] w-8 h-8 opacity-50" /> {/* Placeholder for icon */}
                                </div>

                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-[200px] mx-auto">
                                    {s.title}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA CARD --- */}
            <section className="pb-32 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto bg-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight">
                            Take Your Career To The Next Level
                        </h2>
                        <p className="text-neutral-600 text-lg mb-10 max-w-2xl mx-auto">
                            Start earning $1000-$9000+ consistently, working on marketing campaigns and strategies, on your own terms.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm font-medium text-neutral-800">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-500" /> Work when you want
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-500" /> Stable income
                            </span>
                        </div>

                        <a
                            href={heroButtonLink || "/#apply"}
                            className="group relative inline-block px-12 py-5 bg-[#3B5BF7] text-white rounded-full font-bold text-lg overflow-hidden transition-all shadow-xl hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,91,247,0.5)]"
                        >
                            <span className="relative z-10">
                                Apply now →
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>

                    {/* Light decorations */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-neutral-50 z-0" />
                </motion.div>
            </section>

            <Footer config={footerConfig} />
        </main>
    );
}

// Simple Icon Component for the grid
function DollarSignIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
