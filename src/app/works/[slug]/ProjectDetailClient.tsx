"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
  Tag,
  User,
  X,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/common/Reveal";
import { useLang } from "@/lib/i18n";
import { getImgSrc } from "@/lib/data";
import { getAllProjects, ProjectDetail } from "@/lib/projects";

export default function ProjectDetailClient({
  project,
}: {
  project: ProjectDetail;
}) {
  const { lang } = useLang();
  const [lightboxImg, setLightboxImg] = useState<any | null>(null);

  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject =
    allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const title = project.title[lang] || project.title.en;
  const subtitle = project.subtitle[lang] || project.subtitle.en;
  const category = project.category[lang] || project.category.en;
  const client = project.client[lang] || project.client.en;
  const location = project.location[lang] || project.location.en;
  const overview = project.overview[lang] || project.overview.en;
  const challenge = project.challenge[lang] || project.challenge.en;
  const solution = project.solution[lang] || project.solution.en;
  const deliverables = project.deliverables[lang] || project.deliverables.en;
  const impact = project.impact[lang] || project.impact.en;

  const isRtl = lang === "ar";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy text-white pt-24 pb-16 lg:pt-28 lg:pb-24 overflow-x-hidden">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-orange/10 via-royal/10 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          {/* Back Navigation Bar */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/works"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-orange hover:bg-orange hover:text-white"
            >
              {isRtl ? (
                <>
                  <span>العودة إلى جميع الأعمال</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>Back to All Works</span>
                </>
              )}
            </Link>

            <span className="inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
              {category}
            </span>
          </div>

          {/* Project Header */}
          <div className="max-w-4xl">
            <Reveal>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] text-white tracking-tight">
                {title}
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-4 text-lg sm:text-xl text-white/80 font-medium leading-relaxed">
                {subtitle}
              </p>
            </Reveal>
          </div>

          {/* Key Metadata Pill Ribbon */}
          <Reveal delay={150}>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-orange">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    {isRtl ? "العميل" : "Client"}
                  </div>
                  <div className="truncate text-sm font-semibold text-white">
                    {client}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-orange">
                  <Tag className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    {isRtl ? "التصنيف" : "Category"}
                  </div>
                  <div className="truncate text-sm font-semibold text-white">
                    {category}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-orange">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    {isRtl ? "السنة" : "Year"}
                  </div>
                  <div className="truncate text-sm font-semibold text-white">
                    {project.year}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-orange">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    {isRtl ? "الموقع" : "Location"}
                  </div>
                  <div className="truncate text-sm font-semibold text-white">
                    {location}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Hero Showcase Image */}
          <Reveal delay={200}>
            <div className="mt-10 overflow-hidden rounded-3xl border border-white/15 bg-[#06243d] shadow-2xl shadow-navy/60 group relative aspect-[16/9]">
              <img
                src={getImgSrc(project.mainImage)}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
              <button
                onClick={() => setLightboxImg(project.mainImage)}
                className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-navy/80 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-orange hover:border-orange"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {isRtl ? "عرض الصورة كاملة" : "Expand Image"}
              </button>
            </div>
          </Reveal>

          {/* Deep Project Story: Overview, Challenge, Solution */}
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Left: 2 Columns Overview & Story */}
            <div className="space-y-10 lg:col-span-2">
              {/* Overview */}
              <Reveal delay={220}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange">
                    <Sparkles className="h-4 w-4" />
                    {isRtl ? "نظرة عامة على المشروع" : "Project Overview"}
                  </div>
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/90">
                    {overview}
                  </p>
                </div>
              </Reveal>

              {/* Challenge & Solution Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Reveal delay={260}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-orange">
                      {isRtl ? "التحدي الهندسي والإعلاني" : "The Challenge"}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/80">
                      {challenge}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={300}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-orange">
                      {isRtl ? "حلول شهار للإعلان" : "The Suhar Solution"}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/80">
                      {solution}
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Right: 1 Column Deliverables & Results */}
            <div className="space-y-8">
              {/* Deliverables Checklist */}
              <Reveal delay={240}>
                <div className="rounded-3xl border border-white/10 bg-[#06243d] p-6 sm:p-8 shadow-xl">
                  <h3 className="font-display text-lg font-bold text-white">
                    {isRtl ? "نطاق العمل والتسليمات" : "Scope & Deliverables"}
                  </h3>
                  <ul className="mt-5 space-y-3.5">
                    {deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-white/90">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-orange mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Impact / Key Results */}
              <Reveal delay={280}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md">
                  <h3 className="font-display text-lg font-bold text-white">
                    {isRtl ? "الأثر والنتائج المحققة" : "Impact & Results"}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {impact.map((res, idx) => (
                      <li
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs sm:text-sm text-white/85"
                      >
                        {res}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Project Showcase Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-16">
              <Reveal>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    {isRtl ? "معرض صور المشروع" : "Visual Showcase Gallery"}
                  </h2>
                  <span className="text-xs text-white/50 uppercase tracking-widest">
                    {project.gallery.length} {isRtl ? "لقطات" : "Angles"}
                  </span>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((img, idx) => (
                  <Reveal key={idx} delay={idx * 80}>
                    <button
                      onClick={() => setLightboxImg(img)}
                      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#06243d] shadow-lg transition-all duration-300 hover:border-orange/50 hover:-translate-y-1"
                    >
                      <img
                        src={getImgSrc(img)}
                        alt={`${title} angle ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-80" />
                      <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-orange text-white shadow-lg">
                          <ExternalLink className="h-5 w-5" />
                        </div>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Previous & Next Project Navigation */}
          <div className="mt-20 border-t border-white/10 pt-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Link
                href={`/works/${prevProject.slug}`}
                className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-orange/50 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors duration-300 group-hover:bg-orange group-hover:border-orange">
                    {isRtl ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                      {isRtl ? "المشروع السابق" : "Previous Project"}
                    </div>
                    <div className="font-display text-base sm:text-lg font-bold text-white group-hover:text-orange transition-colors">
                      {prevProject.title[lang] || prevProject.title.en}
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href={`/works/${nextProject.slug}`}
                className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-right rtl:text-left transition-all duration-300 hover:border-orange/50 hover:bg-white/[0.06]"
              >
                <div className="flex flex-1 flex-col items-end rtl:items-start">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    {isRtl ? "المشروع التالي" : "Next Project"}
                  </div>
                  <div className="font-display text-base sm:text-lg font-bold text-white group-hover:text-orange transition-colors">
                    {nextProject.title[lang] || nextProject.title.en}
                  </div>
                </div>
                <div className="ml-4 rtl:mr-4 rtl:ml-0 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors duration-300 group-hover:bg-orange group-hover:border-orange">
                  {isRtl ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                </div>
              </Link>
            </div>
          </div>

          {/* Direct Project Inquiry CTA Banner */}
          <div className="mt-14 overflow-hidden rounded-3xl border border-orange/40 bg-gradient-to-r from-[#0b2d47] via-navy to-[#06243d] p-6 sm:p-12 text-center shadow-2xl relative">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange/20 blur-2xl" />
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {isRtl
                ? "هل لديك مشروع مماثل ترغب في تنفيذه بجودة استثنائية؟"
                : "Have a similar project in mind for your brand?"}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-white/80 leading-relaxed">
              {isRtl
                ? "فريقنا المتخصص في التصميم والتصنيع والتركيب جاهز لتحويل فكرتك إلى أثر مرئي ملموس في كافة أنحاء عُمان."
                : "From 3D signage and vehicle fleet wraps to complete architectural branding — our craftsmen are ready to deliver."}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/#contact"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange/30 transition-all duration-300 hover:bg-white hover:text-navy hover:scale-105"
              >
                <span>{isRtl ? "اطلب عرض سعر للمشروع" : "Request Project Quote"}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
              </Link>
              <a
                href="tel:+96891909331"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <span>{isRtl ? "اتصل بنا: 9190 9331 968+" : "Call: +968 9190 9331"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 p-4 sm:p-6 backdrop-blur-xl"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute right-4 top-4 sm:right-6 sm:top-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={() => setLightboxImg(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImgSrc(lightboxImg)}
                alt={title}
                className="h-auto w-full max-h-[80vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
