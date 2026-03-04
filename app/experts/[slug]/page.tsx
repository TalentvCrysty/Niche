import React from "react";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getConfig } from "@/app/actions/config";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const formatRate = (m: any) => {
  const value = typeof m?.rateValue === "number" ? String(m.rateValue) : (m?.rateValue || "").toString();
  if (!value.trim()) return "";
  const currency = (m?.rateCurrency || "").toString().trim();
  const type = (m?.rateType || "").toString().trim();
  const suffix = type ? `/${type}` : "";
  return `${currency}${value}${suffix}`.trim();
};

export default async function ExpertProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teamConfig = (await getConfig("team")) || {};
  const navbarConfig = (await getConfig("navbar")) || {};
  const footerConfig = (await getConfig("footer")) || {};

  const members = Array.isArray(teamConfig.members) ? teamConfig.members : [];
  const enriched = members.map((m: any) => {
    const name = typeof m?.name === "string" ? m.name : "";
    const s = typeof m?.slug === "string" && m.slug.trim() ? m.slug : slugify(name);
    return { ...m, slug: s, name };
  });

  const member = enriched.find((m: any) => m.slug === slug);
  if (!member) notFound();

  const tags = Array.isArray(member?.tags)
    ? member.tags.filter((t: any) => typeof t === "string" && t.trim()).map((t: string) => t.trim())
    : [];

  const highlights = Array.isArray(member?.highlights)
    ? member.highlights.filter((h: any) => typeof h === "string" && h.trim()).map((h: string) => h.trim())
    : [];

  const rate = formatRate(member);
  const hireLabel = typeof member?.hireLabel === "string" && member.hireLabel.trim() ? member.hireLabel : "Hire";
  const hireLink = typeof member?.hireLink === "string" && member.hireLink.trim() ? member.hireLink : "/#contact";
  const externalHire = hireLink.startsWith("http");

  const bio = typeof member?.bio === "string" && member.bio.trim() ? member.bio : "";
  const blurb = typeof member?.blurb === "string" ? member.blurb : "";

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
      <Navbar theme="dark" config={navbarConfig} />

      <section className="pt-28 md:pt-40 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Link
          href="/experts"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Experts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/35 border border-white/10 rounded-3xl overflow-hidden">
              <div className="relative aspect-[4/5] bg-neutral-900">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-sm">
                    No photo
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-2xl font-semibold text-white">{member.name}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-300/80">{member.role}</div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    Rate
                  </div>
                  <div className="text-lg font-semibold text-white">{rate || "Rate on request"}</div>
                  {member.rateNote ? <div className="text-xs text-neutral-500 mt-1">{member.rateNote}</div> : null}
                </div>

                <a
                  href={hireLink}
                  target={externalHire ? "_blank" : undefined}
                  rel={externalHire ? "noopener noreferrer" : undefined}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-400 transition-colors"
                >
                  {hireLabel}
                  <ArrowRight className="w-4 h-4" />
                </a>

                {tags.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((t: string) => (
                        <Link
                          key={t}
                          href={`/experts`}
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:border-blue-500/30 hover:text-white transition-colors inline-flex items-center gap-2"
                        >
                          <Tag className="w-3 h-3 opacity-70" />
                          {t}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="bg-neutral-900/35 border border-white/10 rounded-3xl p-8">
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Overview</div>
              <p className="text-neutral-300 text-lg leading-relaxed font-light">{blurb}</p>
            </div>

            {bio ? (
              <div className="bg-neutral-900/35 border border-white/10 rounded-3xl p-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Bio</div>
                <div className="prose prose-invert prose-lg max-w-none text-neutral-300">
                  <ReactMarkdown>{bio}</ReactMarkdown>
                </div>
              </div>
            ) : null}

            {highlights.length > 0 ? (
              <div className="bg-neutral-900/35 border border-white/10 rounded-3xl p-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-5">
                  Portfolio Highlights
                </div>
                <ul className="space-y-3">
                  {highlights.map((h: string, i: number) => (
                    <li key={i} className="flex gap-3 text-neutral-300">
                      <span className="mt-2 w-2 h-2 rounded-full bg-blue-500/70 shrink-0" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Footer config={footerConfig} />
    </main>
  );
}

