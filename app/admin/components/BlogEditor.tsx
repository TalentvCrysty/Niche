"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogPost, createBlog, updateBlog } from "../../actions/blog";
import { Loader2, Save, ArrowLeft, Link as LinkIcon, Eye, Edit2, FileText } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "./ui/ImageUploader";
import ReactMarkdown from "react-markdown";

interface BlogEditorProps {
  initialData?: BlogPost;
  isNew?: boolean;
}

export default function BlogEditor({ initialData, isNew = false }: BlogEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState<BlogPost>(
    initialData || {
      slug: "",
      title: "",
      description: "",
      content: "",
      cover_image: "",
      category: "",
      read_time: "",
      published_date: new Date().toISOString().split("T")[0],
      redirect_url: "",
      seo_title: "",
      seo_description: "",
      is_featured: false,
    }
  );

  const handleChange = (field: keyof BlogPost, value: any) => {
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
        const result = await createBlog(formData);
        if (result.success) {
          router.push("/admin/blogs");
        } else {
          alert("Error: " + result.error);
        }
      } else {
        if (!formData.id) return;
        const result = await updateBlog(formData.id, formData);
        if (result.success) {
          router.push("/admin/blogs");
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

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-20">
      <div className="sticky top-0 z-20 bg-[#FAFAFA]/80 backdrop-blur-md py-6 flex items-center justify-between mb-8 border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blogs"
            className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500 hover:text-black"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {isNew ? "Create Post" : "Edit Post"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
            {!isNew && formData.slug && (
              <a
                href={`/blog/${formData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-600 hover:text-black hover:bg-zinc-100 px-4 py-2.5 rounded-xl font-medium transition-all"
                title="View Live"
              >
                <LinkIcon size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 bg-white text-zinc-600 border border-zinc-200 px-4 py-2.5 rounded-xl font-medium hover:bg-zinc-50 transition-all"
            >
              {isPreview ? <><Edit2 size={16} /> Edit</> : <><Eye size={16} /> Preview</>}
            </button>
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
                placeholder="Enter post title..."
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all min-h-[100px] resize-none"
                placeholder="Short description for list view..."
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Content</span>
                <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 flex items-center gap-1">
                   <FileText size={10} /> Markdown Supported
                </span>
              </label>
              
              {isPreview ? (
                <div className="w-full border border-zinc-200 rounded-xl px-6 py-6 min-h-[500px] bg-zinc-50/50">
                    <div className="markdown-content">
                        {formData.content ? (
                            <ReactMarkdown>{formData.content}</ReactMarkdown>
                        ) : (
                            <p className="text-zinc-400 italic">Nothing to preview yet...</p>
                        )}
                    </div>
                </div>
              ) : (
                <textarea
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all min-h-[500px] font-mono text-sm leading-relaxed"
                    placeholder="# Write your masterpiece..."
                />
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <LinkIcon size={18} />
              Redirects & Advanced
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Redirect URL</label>
                <p className="text-xs text-zinc-500 mb-2">If set, visiting this blog post will instantly redirect users to this URL.</p>
                <input
                  type="url"
                  value={formData.redirect_url || ""}
                  onChange={(e) => handleChange("redirect_url", e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Publishing</h3>
            
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
              <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => handleChange("published_date", e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-zinc-700 select-none cursor-pointer">
                Featured Post
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Metadata</h3>
            
            <ImageUploader 
                label="Cover Image" 
                value={formData.cover_image} 
                onChange={(val) => handleChange("cover_image", val)} 
            />

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                placeholder="e.g. Design, Branding"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Read Time</label>
              <input
                type="text"
                value={formData.read_time}
                onChange={(e) => handleChange("read_time", e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                placeholder="e.g. 5 min read"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">SEO</h3>
             <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={formData.seo_title || ""}
                onChange={(e) => handleChange("seo_title", e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                placeholder="Meta title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">SEO Description</label>
              <textarea
                value={formData.seo_description || ""}
                onChange={(e) => handleChange("seo_description", e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm resize-none"
                rows={3}
                placeholder="Meta description"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
