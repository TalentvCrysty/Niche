"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortfolioProject, createProject, updateProject } from "../../actions/portfolio";
import { Loader2, Save, ArrowLeft, Link as LinkIcon, X, Plus } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "./ui/ImageUploader";

interface PortfolioEditorProps {
    initialData?: PortfolioProject;
    isNew?: boolean;
}

const CATEGORIES = [
    "UI/UX Design",
    "Branding",
    "Motion Design",
    "Ads",
    "SEO",
    "Apps",
    "Video Editing",
    "Our All Website"
];

const COMPARISON_CATEGORIES = ["Ads", "SEO", "Video Editing"];

export default function PortfolioEditor({ initialData, isNew = false }: PortfolioEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<PortfolioProject>(
        initialData || {
            slug: "",
            title: "",
            short_description: "",
            full_description: "",
            thumbnail_image: "",
            gallery_images: [],
            technologies: [],
            live_url: "",
            github_url: "",
            completion_date: new Date().toISOString().split("T")[0],
            status: "draft",
            category: "UI/UX Design",
            before_image: "",
            after_image: ""
        }
    );

    const handleChange = (field: keyof PortfolioProject, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        handleChange("slug", slug);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isNew) {
                const result = await createProject(formData);
                if (result.success) {
                    router.push("/admin/portfolio");
                } else {
                    alert("Error: " + result.error);
                }
            } else {
                if (!formData.id) return;
                const result = await updateProject(formData.id, formData);
                if (result.success) {
                    router.push("/admin/portfolio");
                } else {
                    alert("Error: " + result.error);
                }
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Technologies Helper
    const addTechnology = () => {
        const tech = prompt("Enter technology name:");
        if (tech) {
            handleChange("technologies", [...formData.technologies, tech]);
        }
    };

    const removeTechnology = (index: number) => {
        const newTechs = [...formData.technologies];
        newTechs.splice(index, 1);
        handleChange("technologies", newTechs);
    };

    // Gallery Helper
    const addGalleryItem = () => {
        handleChange("gallery_images", [...formData.gallery_images, ""]);
    };

    const updateGalleryItem = (index: number, value: string) => {
        const newGallery = [...formData.gallery_images];
        newGallery[index] = value;
        handleChange("gallery_images", newGallery);
    };

    const removeGalleryItem = (index: number) => {
        const newGallery = [...formData.gallery_images];
        newGallery.splice(index, 1);
        handleChange("gallery_images", newGallery);
    };

    const isComparisonCategory = formData.category && COMPARISON_CATEGORIES.includes(formData.category);

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-20">
            <div className="sticky top-0 z-20 bg-[#FAFAFA]/80 backdrop-blur-md py-6 flex items-center justify-between mb-8 border-b border-zinc-200">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/portfolio"
                        className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500 hover:text-black"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isNew ? "Create Project" : "Edit Project"}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    {!isNew && formData.slug && (
                        <a
                            href={`/portfolio/${formData.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-zinc-600 hover:text-black hover:bg-zinc-100 px-4 py-2.5 rounded-xl font-medium transition-all"
                            title="View Live"
                        >
                            <LinkIcon size={16} />
                        </a>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                onBlur={() => !formData.slug && generateSlug()}
                                className="w-full text-3xl font-bold border-0 border-b border-zinc-200 px-0 py-2 focus:ring-0 focus:border-black placeholder:text-zinc-300 transition-colors bg-transparent"
                                placeholder="Project Title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Short Description</label>
                            <textarea
                                value={formData.short_description}
                                onChange={(e) => handleChange("short_description", e.target.value)}
                                className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all min-h-[100px] resize-none"
                                placeholder="Brief summary for the portfolio grid..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Full Description (Markdown)</label>
                            <textarea
                                value={formData.full_description}
                                onChange={(e) => handleChange("full_description", e.target.value)}
                                className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all min-h-[300px] font-mono text-sm"
                                placeholder="## Project Details..."
                            />
                        </div>
                    </div>

                    {/* Comparison Images for Specific Categories */}
                    {isComparisonCategory && (
                        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Before / After Comparison</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageUploader
                                    label="Before Image"
                                    value={formData.before_image}
                                    onChange={(val) => handleChange("before_image", val)}
                                />
                                <ImageUploader
                                    label="After Image"
                                    value={formData.after_image}
                                    onChange={(val) => handleChange("after_image", val)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Gallery */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Gallery & Content</h3>
                            <button type="button" onClick={addGalleryItem} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                                <Plus size={16} /> Add Media
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.gallery_images.map((url, index) => (
                                <div key={index} className="relative">
                                    <ImageUploader
                                        label={`Gallery Item ${index + 1}`}
                                        value={url}
                                        onChange={(val) => updateGalleryItem(index, val)}
                                        accept="image/*,video/*"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryItem(index)}
                                        className="absolute top-0 right-0 p-2 text-red-500 hover:text-red-700 z-10"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                            {formData.gallery_images.length === 0 && (
                                <p className="text-zinc-400 text-sm italic py-4 text-center border-2 border-dashed border-zinc-100 rounded-xl">
                                    No gallery items added.
                                </p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Project Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none bg-white"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange("status", e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none bg-white"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleChange("slug", e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-mono text-sm text-zinc-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Completion Date</label>
                            <input
                                type="date"
                                value={formData.completion_date}
                                onChange={(e) => handleChange("completion_date", e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Thumbnail</h3>
                        <ImageUploader
                            label="Thumbnail Image"
                            value={formData.thumbnail_image}
                            onChange={(val) => handleChange("thumbnail_image", val)}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Tech Stack</h3>
                        <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.technologies.map((tech, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                                        {tech}
                                        <button type="button" onClick={() => removeTechnology(idx)} className="text-zinc-400 hover:text-red-500">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <button type="button" onClick={addTechnology} className="w-full py-2 border border-dashed border-zinc-300 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-50 hover:border-zinc-400 text-xs font-medium transition-all">
                                + Add Technology
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Links</h3>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Live URL</label>
                            <input
                                type="url"
                                value={formData.live_url || ""}
                                onChange={(e) => handleChange("live_url", e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">GitHub URL</label>
                            <input
                                type="url"
                                value={formData.github_url || ""}
                                onChange={(e) => handleChange("github_url", e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
