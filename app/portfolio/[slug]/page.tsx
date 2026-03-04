import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, Github, Calendar, Layers } from "lucide-react";
import { getProjectBySlug, PortfolioProject } from "@/app/actions/portfolio";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

const SPECIAL_CATEGORIES = ["Ads", "SEO", "Video Editing"];

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project: PortfolioProject | null = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const isSpecial = project.category && SPECIAL_CATEGORIES.includes(project.category);
    const hasComparison = isSpecial && project.before_image && project.after_image;

    // Determine media assets
    // If hasComparison, display comparison as main hero element.
    // Else use thumbnail.
    // Gallery images are displayed below.

    return (
        <main className="min-h-screen bg-[#020202] text-white selection:bg-[#3B5BF7]/30 font-sans">
            <Navbar theme="dark" />

            <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[#3B5BF7] font-bold uppercase tracking-widest text-xs border border-[#3B5BF7]/30 px-3 py-1 rounded-full bg-[#3B5BF7]/5">
                            {project.category || "Project"}
                        </span>
                        <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {project.completion_date}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        {project.title}
                    </h1>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-3xl">
                        {project.short_description}
                    </p>
                </div>

                {/* Main Visual */}
                <div className="mb-16 w-full rounded-3xl overflow-hidden border border-white/5 bg-[#0A0A0A]">
                    {hasComparison ? (
                        <div className="aspect-[16/9] w-full relative">
                            <BeforeAfterSlider
                                beforeImage={project.before_image!}
                                afterImage={project.after_image!}
                                alt={project.title}
                            />
                        </div>
                    ) : project.thumbnail_image ? (
                        <div className="aspect-[16/9] w-full relative">
                            <Image
                                src={getMediaUrl(project.thumbnail_image)}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Content */}
                    <div className="lg:col-span-2">
                        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-400 prose-a:text-[#3B5BF7]">
                            <ReactMarkdown>{project.full_description || "No description provided."}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Technologies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white/5 rounded-md text-xs font-medium text-zinc-300 border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2">Links</h3>
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full p-3 rounded-xl bg-[#3B5BF7] text-white font-medium hover:bg-[#2F49C7] transition-all group"
                                >
                                    <span>Visit Live Site</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all border border-white/5"
                                >
                                    <span>View Source</span>
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                {project.gallery_images && project.gallery_images.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-3xl font-bold mb-8">Project Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.gallery_images.map((url, i) => {
                                const mediaUrl = getMediaUrl(url);
                                const isVideo = mediaUrl.match(/\.(mp4|webm|mov)$/i);

                                return (
                                    <div key={i} className="rounded-2xl overflow-hidden border border-white/5 bg-[#0A0A0A] relative aspect-video group">
                                        {isVideo ? (
                                            <video
                                                src={mediaUrl}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src={mediaUrl}
                                                alt={`${project.title} gallery ${i}`}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>

            <Footer />
        </main>
    );
}
