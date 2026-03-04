"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getBlogs, BlogPost } from "@/app/actions/blog";

// Placeholder images from the public folder
const PLACEHOLDER_IMAGES = [
  "/case-1.jpg",
  "/case-2.jpg",
  "/case-3.avif",
  "/case-4.jpg",
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const data = await getBlogs();
      // Filter out future posts
      const now = new Date();
      const published = data.filter((post: BlogPost) => {
        if (!post.published_date) return false;
        return new Date(post.published_date) <= now;
      });
      setPosts(published);
      setIsLoading(false);
    }
    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
      <Navbar theme="dark" />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
            <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="block text-blue-500 font-medium tracking-wide uppercase text-sm mb-6"
            >
                Our Journal
            </motion.span>
            
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight mb-8"
            >
                Insights & <span className="text-neutral-500">Perspectives.</span>
            </motion.h1>
            
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed"
            >
                Deep dives into strategy, design, and the future of digital experiences.
            </motion.p>
        </div>
      </section>

      {/* --- BLOG GRID --- */}
      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {[1, 2, 3, 4, 5, 6].map((i) => (
               <div key={i} className="space-y-4">
                  <div className="aspect-[16/10] bg-neutral-900 rounded-lg animate-pulse" />
                  <div className="h-4 bg-neutral-900 rounded w-1/3 animate-pulse" />
                  <div className="h-8 bg-neutral-900 rounded w-3/4 animate-pulse" />
               </div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col h-full"
              >
                <Link 
                    href={post.redirect_url ? post.redirect_url : `/blog/${post.slug}`} 
                    target={post.redirect_url ? "_blank" : undefined}
                    className="block h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] mb-8 overflow-hidden rounded-lg bg-neutral-900 border border-white/5">
                    <Image
                      src={post.cover_image || PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length]}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {post.category && (
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-white">
                            {post.category}
                        </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
                      <span>{post.published_date}</span>
                      {post.read_time && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                            <span>{post.read_time}</span>
                          </>
                      )}
                    </div>

                    <h3 className="text-2xl font-semibold mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-neutral-400 text-base leading-relaxed line-clamp-2 mb-6 font-light">
                      {post.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-sm font-medium text-white group-hover:text-blue-500 transition-colors">
                      Read Article
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
