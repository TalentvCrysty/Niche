import React from "react";
export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getConfig } from "@/app/actions/config";
import ExpertsClient from "./ExpertsClient";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default async function ExpertsPage() {
  const teamConfig = (await getConfig("team")) || {};
  const navbarConfig = (await getConfig("navbar")) || {};
  const footerConfig = (await getConfig("footer")) || {};

  const members = Array.isArray(teamConfig.members) ? teamConfig.members : [];

  const normalized = members
    .map((m: any) => {
      const name = typeof m?.name === "string" ? m.name : "";
      const role = typeof m?.role === "string" ? m.role : "";
      const image = typeof m?.image === "string" ? m.image : "";
      const blurb = typeof m?.blurb === "string" ? m.blurb : "";
      const slug = typeof m?.slug === "string" && m.slug.trim() ? m.slug : slugify(name);

      const tags = Array.isArray(m?.tags)
        ? m.tags.filter((t: any) => typeof t === "string" && t.trim()).map((t: string) => t.trim())
        : [];

      const highlights = Array.isArray(m?.highlights)
        ? m.highlights.filter((h: any) => typeof h === "string" && h.trim()).map((h: string) => h.trim())
        : [];

      const bio = typeof m?.bio === "string" ? m.bio : "";
      const rateType = typeof m?.rateType === "string" ? m.rateType : "";
      const rateValue = typeof m?.rateValue === "string" || typeof m?.rateValue === "number" ? String(m.rateValue) : "";
      const rateCurrency = typeof m?.rateCurrency === "string" ? m.rateCurrency : "";
      const rateNote = typeof m?.rateNote === "string" ? m.rateNote : "";
      const hireLabel = typeof m?.hireLabel === "string" ? m.hireLabel : "Hire";
      const hireLink = typeof m?.hireLink === "string" ? m.hireLink : "/#contact";

      return {
        slug,
        name,
        role,
        image,
        blurb,
        bio,
        tags,
        highlights,
        rateType,
        rateValue,
        rateCurrency,
        rateNote,
        hireLabel,
        hireLink,
      };
    })
    .filter((m: any) => m.name && m.slug);

  const allTags = Array.from(new Set(normalized.flatMap((m: any) => m.tags))).sort((a: any, b: any) => a.localeCompare(b));

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
      <Navbar theme="dark" config={navbarConfig} />

      <section className="pt-32 pb-12 md:pt-48 md:pb-16 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          <span className="block text-blue-500 font-medium tracking-wide uppercase text-sm mb-6">
            Hire Our Experts
          </span>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight mb-8">
            Team Marketplace <span className="text-neutral-500">& Specialists.</span>
          </h1>
          <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
            Browse our talent, filter by skill, and hire the perfect expert for your project.
          </p>
        </div>
      </section>

      <ExpertsClient members={normalized as any} tags={allTags as any} />

      <Footer config={footerConfig} />
    </main>
  );
}

