import React from "react";
export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getConfig } from "@/app/actions/config";
import { WorksGrid } from "./WorksGrid";

// Default works data
const DEFAULT_WORKS = [
  {
    title: "Scaling Fintech to $10M ARR",
    category: "Fintech • SEO & PPC",
    image: "/case-1.jpg",
    description: "How we helped a neobank reduce CAC by 40% while tripling monthly active users through targeted acquisition channels.",
    stat: "+210% Growth",
    link: "#"
  },
  {
    title: "E-commerce Revenue Surge",
    category: "Retail • Performance Marketing",
    image: "/case-2.jpg",
    description: "Transforming a traditional retailer into a digital powerhouse with a 300% increase in online sales.",
    stat: "+300% Revenue",
    link: "#"
  },
  {
    title: "SaaS Market Expansion",
    category: "SaaS • Brand Strategy",
    image: "/case-3.avif",
    description: "Helping a B2B SaaS company expand into new markets and increase their customer base by 150%.",
    stat: "+150% Customers",
    link: "#"
  },
  {
    title: "Healthcare Digital Transformation",
    category: "Healthcare • UX Design",
    image: "/case-4.jpg",
    description: "Redesigning patient experience to improve engagement and reduce appointment no-shows by 60%.",
    stat: "-60% No-shows",
    link: "#"
  },
];

export default async function WorksPage() {
  // Server-side data fetching
  const caseStudiesConfig = await getConfig("caseStudies");
  const works = caseStudiesConfig?.items && caseStudiesConfig.items.length > 0
    ? caseStudiesConfig.items
    : DEFAULT_WORKS;

  // Extract unique categories server-side
  const allCategories = works.map((item: any) => {
    const mainCategory = item.category?.split('•')[0]?.trim() || 'Other';
    return mainCategory;
  });
  const categories = ['All', ...Array.from(new Set(allCategories))] as string[];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
      <Navbar theme="dark" />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-12 md:pt-48 md:pb-16 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          <span className="block text-blue-500 font-medium tracking-wide uppercase text-sm mb-6">
            Our Works
          </span>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight mb-8">
            Proven Results <span className="text-neutral-500">& Impact.</span>
          </h1>

          <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
            Explore our portfolio of successful projects across diverse industries. Each project represents our commitment to delivering measurable results.
          </p>
        </div>
      </section>

      {/* --- WORKS GRID --- */}
      <WorksGrid works={works} categories={categories} />

      <Footer />
    </main>
  );
}
