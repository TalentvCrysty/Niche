"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ArrowLeft, Loader2, ExternalLink, ImageIcon, Github } from "lucide-react";
import { getProjects, deleteProject, PortfolioProject } from "@/app/actions/portfolio";
import { motion } from "framer-motion";

export default function PortfolioList() {
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setIsLoading(true);
        const data = await getProjects();
        setProjects(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        const result = await deleteProject(id);
        if (result.success) {
            loadProjects();
        } else {
            alert("Failed to delete project: " + result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Portfolio Projects</h1>
                            <p className="text-zinc-500 text-sm">Manage your case studies and projects</p>
                        </div>
                    </div>

                    <Link
                        href="/admin/portfolio/editor/new"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10"
                    >
                        <Plus size={16} />
                        Add New Project
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-zinc-400" size={32} />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center">
                        <p className="text-zinc-500">No projects found. Create your first one!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-6 flex-1 min-w-0 pr-8">
                                    {project.thumbnail_image ? (
                                        <div className="w-16 h-16 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100">
                                            <img src={project.thumbnail_image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                                            <ImageIcon className="text-zinc-300 w-6 h-6" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${project.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                                            <span>{project.completion_date}</span>
                                            {project.technologies.length > 0 && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-zinc-200" />
                                                    <span className="truncate max-w-[200px]">{project.technologies.join(", ")}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {project.live_url && (
                                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Live Site">
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                    {project.github_url && (
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors" title="Repo">
                                            <Github size={18} />
                                        </a>
                                    )}
                                    <Link
                                        href={`/admin/portfolio/editor/${project.id}`}
                                        className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => project.id && handleDelete(project.id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
