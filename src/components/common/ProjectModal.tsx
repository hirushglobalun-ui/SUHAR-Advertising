"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Building2,
  Tag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getImgSrc } from "@/lib/data";

export interface ProjectModalItem {
  id?: string;
  slug: string;
  title_en?: string;
  title_ar?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  category_slug?: string;
  category_name?: string;
  client_en?: string;
  client_ar?: string;
  year?: string;
  location_en?: string;
  location_ar?: string;
  overview_en?: string;
  overview_ar?: string;
  challenge_en?: string;
  challenge_ar?: string;
  solution_en?: string;
  solution_ar?: string;
  deliverables_en?: string[];
  deliverables_ar?: string[];
  cover_image?: string;
  gallery?: string[];
  // Support static fallback structure
  title?: { en: string; ar: string } | string;
  subtitle?: { en: string; ar: string } | string;
  category?: { en: string; ar: string } | string;
  client?: { en: string; ar: string } | string;
  location?: { en: string; ar: string } | string;
  overview?: { en: string; ar: string } | string;
  mainImage?: any;
}

interface ProjectModalProps {
  project: ProjectModalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Reset image index when project changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [project?.slug]);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        isRtl ? handleNext() : handlePrev();
      }
      if (e.key === "ArrowRight") {
        isRtl ? handlePrev() : handleNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, activeImgIndex]);

  if (!isOpen || !project) return null;

  // Normalize project fields
  const title =
    (isRtl ? project.title_ar : project.title_en) ||
    (typeof project.title === "object" ? (isRtl ? project.title.ar : project.title.en) : project.title) ||
    "Project Details";

  const subtitle =
    (isRtl ? project.subtitle_ar : project.subtitle_en) ||
    (typeof project.subtitle === "object" ? (isRtl ? project.subtitle.ar : project.subtitle.en) : project.subtitle) ||
    "";

  const category =
    project.category_slug ||
    project.category_name ||
    (typeof project.category === "object" ? (isRtl ? project.category.ar : project.category.en) : project.category) ||
    "Signage";

  const client =
    (isRtl ? project.client_ar : project.client_en) ||
    (typeof project.client === "object" ? (isRtl ? project.client.ar : project.client.en) : project.client) ||
    "";

  const location =
    (isRtl ? project.location_ar : project.location_en) ||
    (typeof project.location === "object" ? (isRtl ? project.location.ar : project.location.en) : project.location) ||
    "Muscat, Oman";

  const year = project.year || "2024";

  const description =
    (isRtl ? project.overview_ar : project.overview_en) ||
    (typeof project.overview === "object" ? (isRtl ? project.overview.ar : project.overview.en) : project.overview) ||
    "";

  const deliverables = (isRtl ? project.deliverables_ar : project.deliverables_en) || [];

  // Extract all images for the slider
  let images: string[] = [];
  if (Array.isArray(project.gallery) && project.gallery.length > 0) {
    images = project.gallery.map((img) => getImgSrc(img)).filter(Boolean);
  }
  if (images.length === 0 && project.cover_image) {
    images = [getImgSrc(project.cover_image)];
  }
  if (images.length === 0 && project.mainImage) {
    images = [getImgSrc(project.mainImage)];
  }
  if (images.length === 0) {
    images = ["/assets/portfolio-1.jpg"];
  }

  const handlePrev = () => {
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const selectImage = (index: number) => {
    setActiveImgIndex(index);
    if (thumbnailsRef.current) {
      const thumb = thumbnailsRef.current.children[index] as HTMLElement | undefined;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 lg:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#020d18]/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#06243D] text-white shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 ${
          isRtl ? "text-right font-tajawal" : "text-left font-sans"
        }`}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6 bg-[#041B2E]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange/40 bg-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
              {category}
            </span>
            {client && (
              <span className="hidden sm:inline-block text-xs text-white/60 truncate max-w-xs">
                {client}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all duration-200 hover:border-orange hover:bg-orange hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7 space-y-6">
          {/* Main Photo Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#031524]">
              <img
                src={images[activeImgIndex]}
                alt={`${title} - image ${activeImgIndex + 1}`}
                className="h-full w-full object-cover transition-opacity duration-300"
              />

              {/* Multi-image Navigation Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={isRtl ? handleNext : handlePrev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-navy/80 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-orange hover:bg-orange cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={isRtl ? handlePrev : handleNext}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-navy/80 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-orange hover:bg-orange cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Counter Badge */}
                  <div className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-navy/80 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md shadow-md">
                    {activeImgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Horizontal Scrollable Thumbnails (3, 4, or more images) */}
            {images.length > 1 && (
              <div
                ref={thumbnailsRef}
                className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/20"
              >
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => selectImage(idx)}
                    className={`relative aspect-[4/3] h-16 sm:h-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      activeImgIndex === idx
                        ? "border-orange ring-2 ring-orange/30 scale-105"
                        : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
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

          {/* Project Header Info */}
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-orange font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Meta Information Pills */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs">
            {client && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white/80">
                <Building2 className="h-3.5 w-3.5 text-orange shrink-0" />
                <span className="font-semibold text-white/50">{isRtl ? "العميل:" : "Client:"}</span>
                <span className="font-medium text-white">{client}</span>
              </div>
            )}
            {location && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white/80">
                <MapPin className="h-3.5 w-3.5 text-orange shrink-0" />
                <span className="font-semibold text-white/50">{isRtl ? "الموقع:" : "Location:"}</span>
                <span className="font-medium text-white">{location}</span>
              </div>
            )}
            {year && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white/80">
                <Calendar className="h-3.5 w-3.5 text-orange shrink-0" />
                <span className="font-semibold text-white/50">{isRtl ? "السنة:" : "Year:"}</span>
                <span className="font-medium text-white">{year}</span>
              </div>
            )}
          </div>

          {/* Project Description / Overview */}
          {description && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isRtl ? "نبذة عن المشروع" : "Project Overview & Description"}</span>
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-white/85 whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Deliverables Tags if available */}
          {deliverables.length > 0 && deliverables.some((d) => d.trim().length > 0) && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-white/60">
                {isRtl ? "المخرجات والتنفيذ:" : "Deliverables & Scope:"}
              </div>
              <div className="flex flex-wrap gap-2">
                {deliverables
                  .filter((d) => d.trim().length > 0)
                  .map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90"
                    >
                      <Tag className="h-3 w-3 text-orange" />
                      {item}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Inquire Footer Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div className="text-xs text-white/60">
              {isRtl
                ? "هل ترغب في تنفيذ مشروع مماثل لهويتك التجارية؟"
                : "Looking to execute a similar signage or branding project?"}
            </div>

            <a
              href="#contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange/20 transition-all hover:bg-[#e05807] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{isRtl ? "تواصل معنا لمشروعك" : "Start Your Project"}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
