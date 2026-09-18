"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang, useT } from "@/lib/i18n";
import { getImgSrc, portfolioImgs } from "@/lib/data";
import { projectsData } from "@/lib/projects";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { CMSProject, Category } from "@/types/cms";

export default function PortfolioPage() {
  const { t, lang } = useLang();
  const staticItems = Array.isArray(useT("portfolio.items")) ? useT<[string, string, string][]>("portfolio.items") : [];
  const staticCats = Array.isArray(useT("portfolio.cats")) ? useT<string[]>("portfolio.cats") : [];

  const [cmsProjects, setCmsProjects] = useState<CMSProject[]>([]);
  const [cmsCategories, setCmsCategories] = useState<Category[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/works?published=true").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([projs, cats]) => {
        if (Array.isArray(projs) && projs.length > 0) setCmsProjects(projs);
        if (Array.isArray(cats) && cats.length > 0) setCmsCategories(cats);
      })
      .catch(() => {});
  }, []);

  const isRtl = lang === "ar";

  // Categories list
  const cats =
    cmsCategories.length > 0
      ? [isRtl ? "الكل" : "All", ...cmsCategories.map((c) => (isRtl ? c.name_ar : c.name_en))]
      : staticCats;

  // Normalized list of projects
  const allProjects =
    cmsProjects.length > 0
      ? cmsProjects.map((p) => ({
          title: isRtl ? p.title_ar : p.title_en,
          subtitle: isRtl ? p.subtitle_ar : p.subtitle_en,
          category: p.category_slug,
          coverImage: p.cover_image,
          slug: p.slug,
          client: isRtl ? p.client_ar : p.client_en,
          location: isRtl ? p.location_ar : p.location_en,
          project: p,
        }))
      : staticItems.map((it, i) => {
          const project = projectsData[i % projectsData.length];
          return {
            title: it[0],
            subtitle: it[1],
            category: it[2],
            coverImage: getImgSrc(portfolioImgs[i % portfolioImgs.length]),
            slug: project?.slug || "al-fanar-tower",
            client: project?.client?.[lang] || "Corporate Client",
            location: project?.location?.[lang] || "Oman",
            project: project,
          };
        });

  // Filtered by selected tab
  const filtered = allProjects.filter((p) => {
    if (active === 0) return true;
    const selectedCatSlug =
      cmsCategories.length > 0 && cmsCategories[active - 1]
        ? cmsCategories[active - 1].slug
        : cats[active];
    return p.category.toLowerCase() === selectedCatSlug.toLowerCase();
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF9F6]">
        {/* Subtle decorative background gradients */}
        <div className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange/5 blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-[#062D4F]/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            {/* Back to Home Breadcrumb */}
            <Reveal>
              <div className="mb-6 sm:mb-8">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-navy shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-orange hover:bg-orange/5 hover:text-orange hover:shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180" />
                  <span>{isRtl ? "العودة إلى الرئيسية" : "Back to Home"}</span>
                </Link>
              </div>
            </Reveal>

            {/* Header Title Section */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-orange">
                    <Sparkles className="h-3.5 w-3.5 text-orange" />
                    <span>{t("portfolio.eyebrow")}</span>
                  </div>
                </Reveal>

                <Reveal delay={100}>
                  <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.15] text-navy sm:text-5xl lg:text-6xl">
                    {t("portfolio.title")}
                  </h1>
                </Reveal>

                <Reveal delay={160}>
                  <p className="mt-3 text-sm leading-relaxed text-navy/70 sm:text-base lg:text-lg">
                    {isRtl
                      ? "استكشف مجموعة مختارة من أحدث مشاريعنا في الهوية المؤسسية واللافتات والطباعة والحلول الإعلانية عبر سلطنة عُمان."
                      : "Explore a curated showcase of our latest visual communication, signage, branding, and production projects executed across the Sultanate of Oman."}
                  </p>
                </Reveal>
              </div>

              {/* Total Projects Counter */}
              <Reveal delay={200}>
                <div className="inline-flex items-center gap-3 rounded-2xl border border-navy/10 bg-white px-5 py-3 shadow-xs">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange/10 font-display text-base font-bold text-orange">
                    {allProjects.length}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-navy/50">
                      {isRtl ? "المشاريع المعروضة" : "Featured Projects"}
                    </div>
                    <div className="text-sm font-bold text-navy">
                      {isRtl ? "أعمال معتمدة" : "Verified Case Studies"}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Category Filter Pills */}
            <Reveal delay={220}>
              <div className="mt-8 flex flex-wrap items-center gap-2 sm:mt-10 sm:gap-2.5">
                {cats.map((c, i) => {
                  const isCurrent = active === i;
                  const count =
                    i === 0
                      ? allProjects.length
                      : allProjects.filter((it) => {
                          const slug =
                            cmsCategories.length > 0 && cmsCategories[i - 1]
                              ? cmsCategories[i - 1].slug
                              : c;
                          return it.category.toLowerCase() === slug.toLowerCase();
                        }).length;

                  return (
                    <button
                      key={c + i}
                      onClick={() => setActive(i)}
                      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                        isCurrent
                          ? "border-orange bg-gradient-to-r from-orange to-[#f5841f] text-white shadow-md shadow-orange/25 scale-[1.02]"
                          : "border-navy/10 bg-white text-navy/70 hover:border-orange/40 hover:bg-white hover:text-navy shadow-2xs"
                      }`}
                    >
                      <span>{c}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                          isCurrent
                            ? "bg-white/25 text-white"
                            : "bg-navy/5 text-navy/50 group-hover:bg-orange/10 group-hover:text-orange"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Portfolio Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <Reveal key={`${active}-${item.slug}-${i}`} delay={(i % 3) * 80} className="h-full">
                  <Link
                    href={`/works/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white p-3.5 sm:p-4 text-left shadow-xs transition-all duration-500 hover:-translate-y-1.5 hover:border-orange/50 hover:shadow-xl hover:shadow-navy/10 focus:outline-none focus:ring-2 focus:ring-orange rtl:text-right"
                  >
                    {/* Photo Thumbnail Container */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-surface">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Top Overlay Badge & Action Button */}
                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-navy/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:bg-navy">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
                          {item.category}
                        </span>

                        <div className="grid h-8 w-8 place-items-center rounded-full border border-white/40 bg-white/90 text-navy shadow-sm backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-orange group-hover:bg-orange group-hover:text-white group-hover:shadow-md group-hover:shadow-orange/30">
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col justify-between pt-4 pb-1">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-orange">
                          {item.location}
                        </div>
                        <h3 className="mt-1 font-display text-lg font-bold text-navy transition-colors duration-300 group-hover:text-orange sm:text-xl line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-navy/65 line-clamp-2 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Card Footer Link */}
                      <div className="mt-4 flex items-center justify-between border-t border-navy/5 pt-3">
                        <span className="text-xs font-medium text-navy/50 truncate max-w-[55%]">
                          {item.client}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                          {isRtl ? "عرض التفاصيل" : "View Project"}
                          <ArrowUpRight className="h-3 w-3 rtl:rotate-[-90deg]" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
