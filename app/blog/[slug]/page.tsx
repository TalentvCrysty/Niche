import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getBlogBySlug, getBlogs } from "@/app/actions/blog";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  if (post.redirect_url) {
    redirect(post.redirect_url);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <Navbar theme="dark" />

      <article className="pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white mb-16 transition-colors text-sm uppercase tracking-wider font-medium group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Insights
        </Link>

        {/* Header */}
        <header className="max-w-5xl mx-auto mb-20">
          <div className="flex items-center gap-4 text-sm font-mono text-blue-500 uppercase tracking-widest mb-8">
            {post.category && <span>{post.category}</span>}
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400">{post.published_date}</span>
            <span className="text-neutral-700">/</span>
            <span className="text-neutral-400">{post.read_time}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-12">
            {post.title}
          </h1>

          <p className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-w-3xl border-l border-white/20 pl-8">
            {post.description}
          </p>
        </header>

        {/* Hero Image */}
        {post.cover_image && (
          <div className="relative w-full aspect-[21/9] bg-[#111] border border-white/5 mb-24 overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover opacity-90"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-p:text-neutral-400 prose-p:font-light prose-p:leading-relaxed prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-blockquote:border-l-blue-500 prose-blockquote:text-white prose-blockquote:font-normal prose-blockquote:not-italic prose-li:text-neutral-400">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
