import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getConfig } from "@/app/actions/config";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const BACKEND_URL = "http://localhost:3005";

// Get full URL for media
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

export default async function CaseStudyPage({ params }: PageProps) {
    const { slug } = await params;

    const caseStudiesConfig = await getConfig("caseStudies");
    const works = caseStudiesConfig?.items || [];

    // Find work by slug or slugified title
    const work = works.find((w: any) => {
        if (w.slug && w.slug === slug) return true;
        const titleSlug = w.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return titleSlug === slug;
    });

    if (!work) {
        return (
            <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
                    <Link href="/works" className="text-blue-500 hover:underline">Back to Works</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
            <Navbar theme="dark" />

            <article className="pt-32 pb-24 md:pt-40 max-w-4xl mx-auto px-6">
                <Link href="/works" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Works
                </Link>

                <div className="mb-8">
                    <span className="text-blue-500 font-mono text-sm uppercase tracking-wider mb-3 block">
                        {work.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                        {work.title}
                    </h1>
                    <p className="text-xl text-neutral-400 leading-relaxed font-light border-l-2 border-blue-500/50 pl-6">
                        {work.description}
                    </p>
                </div>

                {work.image && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16 border border-white/10 shadow-2xl">
                        <img
                            src={getMediaUrl(work.image)}
                            alt={work.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-invert prose-lg max-w-none text-neutral-300">
                    {work.content ? (
                        <ReactMarkdown>{work.content}</ReactMarkdown>
                    ) : (
                        <div className="p-12 bg-neutral-900/50 rounded-2xl border border-neutral-800 text-center text-neutral-500 italic">
                            <p>Detailed case study content coming soon.</p>
                        </div>
                    )}
                </div>
            </article>

            <Footer />
        </main>
    );
}
