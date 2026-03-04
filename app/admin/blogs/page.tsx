"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { getBlogs, deleteBlog, BlogPost } from "../../actions/blog";
import { motion } from "framer-motion";

export default function BlogsList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    const data = await getBlogs();
    setBlogs(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    const result = await deleteBlog(id);
    if (result.success) {
      loadBlogs();
    } else {
      alert("Failed to delete blog: " + result.error);
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
              <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
              <p className="text-zinc-500 text-sm">Manage your blog content</p>
            </div>
          </div>
          
          <Link
            href="/admin/blogs/editor/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10"
          >
            <Plus size={16} />
            Create New Post
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center">
            <p className="text-zinc-500">No blog posts found. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">{blog.title}</h3>
                    {blog.is_featured && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    {blog.redirect_url && (
                       <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                         Redirect <ExternalLink size={8} />
                       </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                    <span>{blog.published_date}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-200" />
                    <span>{blog.category}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-200" />
                    <span>{blog.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/blogs/editor/${blog.slug}`} // Using slug or ID? Editor will prefer slug or ID. Let's use ID for editing stability.
                    // Actually, let's use ID for editing route to be safe if slug changes.
                  >
                    {/* Wait, the href needs to match the file structure. I'll use ID. */}
                  </Link>
                  <Link
                    href={`/admin/blogs/editor/${blog.id}`}
                    className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => blog.id && handleDelete(blog.id)}
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
