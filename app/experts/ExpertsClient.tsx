"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Tag, ArrowRight, Filter, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type Member = {
  slug: string;
  name: string;
  role: string;
  image: string;
  blurb: string;
  bio?: string;
  tags: string[];
  highlights: string[];
  rateType?: string;
  rateValue?: string;
  rateCurrency?: string;
  rateNote?: string;
  hireLabel?: string;
  hireLink?: string;
};

function formatRate(m: Member) {
  const value = (m.rateValue || "").trim();
  if (!value) return "";
  const currency = (m.rateCurrency || "").trim();
  const type = (m.rateType || "").trim();
  const suffix = type ? `/${type}` : "";
  return `${currency}${value}${suffix}`.trim();
}

export default function ExpertsClient({ members, tags }: { members: Member[]; tags: string[] }) {
  const [q, setQ] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTag = (searchParams.get("tag") || "All").trim() || "All";
  const [activeTag, setActiveTag] = useState<string>(initialTag);
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return members.filter((m) => {
      const matchesQuery =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        (m.blurb || "").toLowerCase().includes(query) ||
        (m.bio || "").toLowerCase().includes(query) ||
        m.tags.some((t) => t.toLowerCase().includes(query)) ||
        m.highlights.some((h) => h.toLowerCase().includes(query));

      const matchesTag = activeTag === "All" ? true : m.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [members, q, activeTag]);

  const pills = useMemo(() => ["All", ...tags], [tags]);

  return (
    <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-28">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-10">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, role, skills, or highlights..."
              className="w-full bg-neutral-900/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900/40 border border-white/10 text-neutral-200 text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
            {pills.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTag(t);
                  const url = t === "All" ? "/experts" : `/experts?tag=${encodeURIComponent(t)}`;
                  router.replace(url, { scroll: false });
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  activeTag === t
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-200"
                    : "bg-neutral-900/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Tag className="w-3 h-3 opacity-70" />
                  {t}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mb-8 bg-neutral-900/40 border border-white/10 rounded-3xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-white">Tags</div>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {pills.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTag(t);
                    setFiltersOpen(false);
                    const url = t === "All" ? "/experts" : `/experts?tag=${encodeURIComponent(t)}`;
                    router.replace(url, { scroll: false });
                  }}
                  className={`px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                    activeTag === t
                      ? "bg-blue-500/20 border-blue-500/40 text-blue-200"
                      : "bg-neutral-900/30 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-10 text-center text-neutral-400">
          No experts found. Try a different search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m, idx) => {
            const rate = formatRate(m);
            return (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="group"
              >
                <div className="h-full bg-neutral-900/35 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-colors">
                  <Link href={`/experts/${m.slug}`} className="block">
                    <div className="relative w-full aspect-[16/11] bg-neutral-900 border-b border-white/10">
                      {m.image ? (
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-sm">
                          No photo
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-lg font-semibold text-white truncate">{m.name}</div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-blue-300/80 truncate">
                              {m.role}
                            </div>
                          </div>
                          <div className="shrink-0 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/80">
                            View
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col gap-4">
                    <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">{m.blurb}</p>

                    {m.highlights?.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                          Portfolio highlights
                        </div>
                        <ul className="space-y-2">
                          {m.highlights.slice(0, 3).map((h, i) => (
                            <li key={i} className="text-xs text-neutral-300 flex gap-2">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500/70 shrink-0" />
                              <span className="line-clamp-2">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {m.tags?.slice(0, 4).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setActiveTag(t);
                            const url = `/experts?tag=${encodeURIComponent(t)}`;
                            router.replace(url, { scroll: false });
                          }}
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300 hover:border-blue-500/30 hover:text-white transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                      <div className="min-w-0">
                        {rate ? (
                          <div className="text-sm font-semibold text-white truncate">{rate}</div>
                        ) : (
                          <div className="text-sm font-semibold text-white truncate">Rate on request</div>
                        )}
                        {m.rateNote ? (
                          <div className="text-xs text-neutral-500 truncate">{m.rateNote}</div>
                        ) : (
                          <div className="text-xs text-neutral-500 truncate">Project-based or hourly</div>
                        )}
                      </div>

                      <a
                        href={m.hireLink || "/#contact"}
                        target={(m.hireLink || "").startsWith("http") ? "_blank" : undefined}
                        rel={(m.hireLink || "").startsWith("http") ? "noopener noreferrer" : undefined}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-400 transition-colors"
                      >
                        {m.hireLabel || "Hire"}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

