"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
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
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

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

  const isRtl = lang === "ar";

  // Consolidate all project images (cover_image / mainImage + gallery photos) without duplicates
  let images: string[] = [];

  // 1. Add cover image first if available
  const coverSrc = getImgSrc((project as any).cover_image || project.mainImage);
  if (coverSrc && typeof coverSrc === "string" && coverSrc.trim().length > 0) {
    images.push(coverSrc.trim());
  }

  // 2. Add all gallery photos without duplicating the cover image
  if (Array.isArray(project.gallery)) {
    project.gallery.forEach((g) => {
      const src = getImgSrc(g);
      if (src && typeof src === "string" && src.trim().length > 0) {
        const cleanSrc = src.trim();
        if (!images.includes(cleanSrc)) {
          images.push(cleanSrc);
        }
      }
    });
  }

  // 3. Fallback to default asset if no images found
  if (images.length === 0) {
    images = ["/assets/portfolio-1.jpg"];
  }

  const handlePrev = () => {
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const selectImage = (idx: number) => {
    setActiveImgIndex(idx);
    if (thumbnailsRef.current) {
      const thumb = thumbnailsRef.current.children[idx] as HTMLElement | undefined;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") isRtl ? handleNext() : handlePrev();
      if (e.key === "ArrowRight") isRtl ? handlePrev() : handleNext();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImgIndex, isRtl]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF9F6] text-navy pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-x-hidden">
        {/* Subtle Ambient Decorative Glows */}
        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-orange/5 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-[#062D4F]/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          {/* Back Navigation Bar */}
          <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/works"
              className="group inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-navy shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-orange hover:bg-orange/5 hover:text-orange hover:shadow-sm"
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

            <span className="inline-flex items-center gap-2 rounded-full border border-orange/25 bg-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
              {category}
            </span>
          </div>

          {/* Project Header */}
          <div className="max-w-4xl">
            <Reveal>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.15] text-navy tracking-tight">
                {title}
              </h1>
            </Reveal>

            {subtitle && (
              <Reveal delay={100}>
                <p className="mt-3 text-base sm:text-lg lg:text-xl text-navy/70 font-medium leading-relaxed">
                  {subtitle}
                </p>
              </Reveal>
            )}
          </div>

          {/* Key Metadata Pill Ribbon */}
          <Reveal delay={150}>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-navy/10 bg-white p-4 sm:p-5 shadow-xs">
              {client && (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                      {isRtl ? "العميل" : "Client"}
                    </div>
                    <div className="truncate text-sm font-bold text-navy">
                      {client}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange">
                  <Tag className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                    {isRtl ? "التصنيف" : "Category"}
                  </div>
                  <div className="truncate text-sm font-bold text-navy">
                    {category}
                  </div>
                </div>
              </div>

              {project.year && (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                      {isRtl ? "السنة" : "Year"}
                    </div>
                    <div className="truncate text-sm font-bold text-navy">
                      {project.year}
                    </div>
                  </div>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                      {isRtl ? "الموقع" : "Location"}
                    </div>
                    <div className="truncate text-sm font-bold text-navy">
                      {location}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Interactive Multi-Image Gallery & Scroller (3, 4, or more images) */}
          <Reveal delay={200}>
            <div className="mt-8 sm:mt-10 space-y-4">
              {/* Main Photo Showcase */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-navy/10 bg-surface shadow-md group">
                <img
                  src={images[activeImgIndex]}
                  alt={`${title} - image ${activeImgIndex + 1}`}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                {/* Next & Previous Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={isRtl ? handleNext : handlePrev}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-navy/80 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-orange hover:border-orange cursor-pointer shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={isRtl ? handlePrev : handleNext}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-navy/80 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-orange hover:border-orange cursor-pointer shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Counter Badge */}
                    <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-navy/80 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-md">
                      {activeImgIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Expand Image Button */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-navy/80 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-orange hover:border-orange cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{isRtl ? "عرض مكبّر" : "Expand"}</span>
                </button>
              </div>

              {/* Horizontal Scrollable Thumbnail Strip (3, 4, or more images) */}
              {images.length > 1 && (
                <div
                  ref={thumbnailsRef}
                  className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-navy/20"
                >
                  {images.map((img, idx) => (
                    <button
                      key={`thumb-${idx}-${img}`}
                      type="button"
                      onClick={() => selectImage(idx)}
                      className={`relative aspect-[16/10] h-18 sm:h-22 shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                        activeImgIndex === idx
                          ? "border-orange ring-2 ring-orange/30 scale-105"
                          : "border-navy/10 opacity-70 hover:opacity-100 hover:border-navy/30"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Project Description & Overview */}
          {overview && (
            <Reveal delay={240}>
              <div className="mt-10 rounded-3xl border border-navy/10 bg-white p-6 sm:p-10 shadow-xs space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange">
                  <Sparkles className="h-4 w-4" />
                  <span>{isRtl ? "نبذة عن المشروع والتفاصيل" : "Project Overview & Description"}</span>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-navy/85 whitespace-pre-line">
                  {overview}
                </p>
              </div>
            </Reveal>
          )}

          {/* Direct Project Inquiry CTA Banner */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-br from-[#062D4F] via-[#093e6c] to-[#041d33] p-7 sm:p-10 text-center text-white shadow-xl relative">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange/20 blur-2xl" />
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {isRtl
                ? "هل ترغب في تنفيذ مشروع مماثل لهويتك التجارية؟"
                : "Looking to execute a similar signage or branding project?"}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-white/80 leading-relaxed">
              {isRtl
                ? "فريقنا المتخصص جاهز لتحويل رؤيتك إلى واقع ملموس بأعلى معايير الدقة والجمال في كافة أنحاء عُمان."
                : "Our craftsmen and engineers deliver high-precision signage, vehicle branding, and visual marketing across Oman."}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/#contact"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-orange px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange/30 transition-all duration-300 hover:bg-white hover:text-navy hover:scale-105"
              >
                <span>{isRtl ? "اطلب عرض سعر للمشروع" : "Request Project Quote"}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
              </Link>
              <a
                href="tel:+96891909331"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                <span>{isRtl ? "اتصل بنا: 9190 9331 968+" : "Call: +968 9190 9331"}</span>
              </a>
            </div>
          </div>

          {/* Previous & Next Project Navigation */}
          <div className="mt-12 border-t border-navy/10 pt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href={`/works/${prevProject.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-navy/10 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-orange/50 hover:bg-orange/5 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-navy/10 bg-orange/10 text-orange transition-colors duration-300 group-hover:bg-orange group-hover:text-white">
                    {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                      {isRtl ? "المشروع السابق" : "Previous Project"}
                    </div>
                    <div className="font-display text-sm sm:text-base font-bold text-navy group-hover:text-orange transition-colors line-clamp-1">
                      {prevProject.title[lang] || prevProject.title.en}
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href={`/works/${nextProject.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-navy/10 bg-white p-4 sm:p-5 text-right rtl:text-left shadow-xs transition-all duration-300 hover:border-orange/50 hover:bg-orange/5 hover:shadow-sm"
              >
                <div className="flex flex-1 flex-col items-end rtl:items-start">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                    {isRtl ? "المشروع التالي" : "Next Project"}
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-navy group-hover:text-orange transition-colors line-clamp-1">
                    {nextProject.title[lang] || nextProject.title.en}
                  </div>
                </div>
                <div className="ml-3 rtl:mr-3 rtl:ml-0 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-navy/10 bg-orange/10 text-orange transition-colors duration-300 group-hover:bg-orange group-hover:text-white">
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 p-4 sm:p-6 backdrop-blur-xl"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute right-4 top-4 sm:right-6 sm:top-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeImgIndex]}
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
