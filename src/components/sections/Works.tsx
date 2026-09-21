"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang } from "@/lib/i18n";
import type { CMSProject, Category } from "@/types/cms";

export default function Portfolio() {
  const { t, lang } = useLang();

  const [cmsProjects, setCmsProjects] = useState<CMSProject[]>([]);
  const [cmsCategories, setCmsCategories] = useState<Category[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/works?published=true", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/categories", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([projs, cats]) => {
        if (Array.isArray(projs) && projs.length > 0) setCmsProjects(projs);
        if (Array.isArray(cats) && cats.length > 0) setCmsCategories(cats);
      })
      .catch(() => {});
  }, []);

  const isRtl = lang === "ar";

  const cats =
    cmsCategories.length > 0
      ? [isRtl ? "الكل" : "All", ...cmsCategories.map((c) => (isRtl ? c.name_ar : c.name_en))]
      : [];

  const allProjects = cmsProjects.map((p) => ({
    title: isRtl ? p.title_ar : p.title_en,
    subtitle: isRtl ? p.subtitle_ar : p.subtitle_en,
    category: p.category_slug,
    coverImage: p.cover_image,
    slug: p.slug,
    project: p,
  }));

  const filtered = allProjects
    .filter((p) => {
      if (active === 0) return true;
      const selectedCatSlug =
        cmsCategories.length > 0 && cmsCategories[active - 1]
          ? cmsCategories[active - 1].slug
          : cats[active];
      return p.category.toLowerCase() === selectedCatSlug.toLowerCase();
    })
    .slice(0, 6);

  return (
    <section id="works" className="bg-navy py-14 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                {t("portfolio.eyebrow")}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                {t("portfolio.title")}
              </h2>
            </Reveal>
          </div>

          {/* View Works Button */}
          <Reveal delay={150}>
            <Link
              href="/works"
              className="group inline-flex items-center gap-2 rounded-full border border-orange bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-navy"
            >
              {lang === "ar" ? "عرض جميع الأعمال" : "View All Works"}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* Categories */}
        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap gap-2">
            {cats.map((c, i) => (
              <button
                key={c + i}
                onClick={() => setActive(i)}
                className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all sm:px-4 sm:py-2 sm:text-xs ${
                  active === i
                    ? "border-orange bg-orange text-white shadow-md shadow-orange/30"
                    : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Portfolio Grid */}
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 py-16 text-center text-sm font-medium text-white/50">
            {lang === "ar" ? "لا توجد مشاريع مضافة حالياً." : "No projects added yet."}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
            <Reveal key={`${active}-${item.slug}-${i}`} delay={(i % 3) * 80} className="h-full">
              <Link
                href={`/works/${item.slug}`}
                className="group relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#06243d] p-5 sm:p-6 text-left shadow-xl shadow-navy/40 transition-all duration-500 hover:-translate-y-1.5 hover:border-orange/60 hover:shadow-2xl hover:shadow-orange/15 focus:outline-none focus:ring-2 focus:ring-orange rtl:text-right"
              >
                {/* Full-bleed Photo Background */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Multi-layered Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#041525] via-[#041525]/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#041525]/50 via-transparent to-transparent opacity-70" />

                {/* Top Floating Badge & Action Indicator */}
                <div className="relative z-10 flex w-full items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-navy/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:border-orange/40 group-hover:bg-navy/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
                    {item.category}
                  </span>

                  <div className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-orange group-hover:bg-orange group-hover:text-white group-hover:shadow-md group-hover:shadow-orange/30">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom Project Info */}
                <div className="relative z-10 mt-auto pt-6 text-left rtl:text-right">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white transition-colors duration-300 group-hover:text-orange line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-1 font-medium">
                    {item.subtitle}
                  </p>

                  <div className="mt-3.5 flex items-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm transition-all duration-300 group-hover:border-orange group-hover:bg-orange group-hover:text-white">
                      {lang === "ar" ? "عرض تفاصيل المشروع" : "View Project Details"}
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}