"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang, useT } from "@/lib/i18n";
import type { CMSTestimonial } from "@/types/cms";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function Testimonials() {
  const { t, lang } = useLang();

  const staticItems =
    useT<[string, string, string][]>("testimonials.items") || [];

  const [cmsTestimonials, setCmsTestimonials] = useState<CMSTestimonial[]>(
    []
  );

  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const isRtl = lang === "ar";

  // =========================================================
  // FETCH CMS TESTIMONIALS
  // =========================================================
  useEffect(() => {
    fetch("/api/admin/testimonials?published=true")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.testimonials;

        if (Array.isArray(list) && list.length > 0) {
          setCmsTestimonials(list);
        }
      })
      .catch(() => { });
  }, []);

  // =========================================================
  // TESTIMONIAL DATA
  // =========================================================
  const displayList = useMemo(() => {
    if (cmsTestimonials.length > 0) {
      return cmsTestimonials.map((item) => ({
        name:
          isRtl && item.person_name_ar
            ? item.person_name_ar
            : item.person_name_en,

        role: `${isRtl && item.designation_ar
            ? item.designation_ar
            : item.designation_en
          }, ${isRtl && item.company_ar
            ? item.company_ar
            : item.company_en
          }`,

        quote:
          isRtl && item.text_ar
            ? item.text_ar
            : item.text_en,

        rating: item.rating || 5,
      }));
    }

    return (Array.isArray(staticItems) ? staticItems : []).map(
      ([name, role, quote]) => ({
        name,
        role,
        quote,
        rating: 5,
      })
    );
  }, [cmsTestimonials, staticItems, isRtl]);

  // =========================================================
  // CREATE ENOUGH DUPLICATES
  // =========================================================
  const carouselItems = useMemo(() => {
    if (displayList.length === 0) return [];

    // Repeat the complete list many times so there is
    // always another card available without blank space.
    return Array.from({ length: 12 }, () => displayList).flat();
  }, [displayList]);

  // =========================================================
  // CAROUSEL BUTTON STATE
  // =========================================================
  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateButtons();

    api.on("select", updateButtons);
    api.on("reInit", updateButtons);

    return () => {
      api.off("select", updateButtons);
      api.off("reInit", updateButtons);
    };
  }, [api]);

  // =========================================================
  // AUTO SCROLL
  // =========================================================
  useEffect(() => {
    if (!api || displayList.length <= 1) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api, displayList.length]);

  return (
    <section className="relative overflow-hidden bg-white py-14 text-navy lg:py-20">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-navy/80">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                {t("testimonials.eyebrow")}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
                {t("testimonials.title")}
              </h2>
            </Reveal>
          </div>

          {/* ===================================================
              CONTROLS
          =================================================== */}
          <Reveal delay={150}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-navy/15 bg-white text-navy shadow-xs transition-all duration-300 hover:border-orange hover:bg-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-navy/15 disabled:hover:bg-white disabled:hover:text-navy"
                aria-label="Previous testimonial"
              >
                <ChevronLeft
                  className={`h-5 w-5 ${isRtl ? "rotate-180" : ""
                    }`}
                />
              </button>

              <button
                type="button"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-navy/15 bg-white text-navy shadow-xs transition-all duration-300 hover:border-orange hover:bg-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-navy/15 disabled:hover:bg-white disabled:hover:text-navy"
                aria-label="Next testimonial"
              >
                <ChevronRight
                  className={`h-5 w-5 ${isRtl ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>
          </Reveal>
        </div>

        {/* =====================================================
            TESTIMONIAL CAROUSEL
        ===================================================== */}
        <div className="mt-10">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,

              // English -> normal direction
              // Arabic  -> Right to Left
              direction: isRtl ? "rtl" : "ltr",

              // Prevent the carousel from stopping because of
              // insufficient scrollable content.
              containScroll: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {carouselItems.map((item, i) => (
                <CarouselItem
                  key={`${item.name}-${i}`}
                  className="basis-full pl-4 sm:basis-1/2 sm:pl-6 lg:basis-1/3"
                >
                  <Reveal
                    delay={(i % 3) * 100}
                    className="h-full"
                  >
                    <div className="flex h-full flex-col justify-between rounded-3xl bg-[#062D4F] p-8 text-white shadow-xl shadow-navy/10 transition-transform duration-300 hover:-translate-y-1">

                      {/* Rating + Quote */}
                      <div>
                        <div className="flex gap-1 text-orange">
                          {Array.from({
                            length: item.rating,
                          }).map((_, k) => (
                            <Star
                              key={k}
                              className="h-4 w-4 fill-current"
                            />
                          ))}
                        </div>

                        <p className="mt-6 text-base leading-relaxed text-white/85">
                          &quot;{item.quote}&quot;
                        </p>
                      </div>

                      {/* Person Details */}
                      <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-royal to-orange font-display text-sm font-bold text-white shadow-sm">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div className="overflow-hidden">
                          <div className="truncate text-sm font-semibold text-white">
                            {item.name}
                          </div>

                          <div className="truncate text-xs text-white/60">
                            {item.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}