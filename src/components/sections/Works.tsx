"use client";

import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang, useT } from "@/lib/i18n";
import { getImgSrc, portfolioImgs } from "@/lib/data";

export default function Portfolio() {
  const { t, lang } = useLang();
  const items = useT<[string, string, string][]>("portfolio.items");
  const cats = useT<string[]>("portfolio.cats");

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => active === 0 || it[2] === cats[active]);

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
            <a
              href="/works"
              className="group inline-flex items-center gap-2 rounded-full border border-orange bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-navy"
            >
              View Works
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        {/* Categories */}
        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap gap-2">
            {cats.map((c, i) => (
              <button
                key={c}
                onClick={() => setActive(i)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all sm:px-4 sm:py-2 sm:text-xs ${active === i
                    ? "border-orange bg-orange text-white"
                    : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Portfolio Grid Container (Stable Section Height Matching ALL Filter Baseline) */}
        <div className="mt-8 grid min-h-[1776px] content-start sm:min-h-[1100px] lg:min-h-[880px] grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ it, i }) => {
            const imgSrc = getImgSrc(portfolioImgs[i % portfolioImgs.length]);

            return (
              <Reveal key={`${active}-${i}`} delay={(i % 3) * 80} className="h-full">
                <button
                  onClick={() => setLightbox(i)}
                  className="group relative flex h-[240px] sm:h-[260px] lg:h-[280px] w-full flex-col overflow-hidden rounded-2xl bg-[#06243d] text-left border border-white/10 shadow-lg shadow-navy/20 transition-all duration-300 hover:border-orange/30"
                >
                  {/* Fixed Compact Media Area Container */}
                  <div className="relative h-[130px] sm:h-[140px] lg:h-[150px] w-full overflow-hidden bg-[#0b2d47]">
                    <img
                      src={imgSrc}
                      alt={it[0]}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06243d] via-navy/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                    {/* Arrow Indicator on Hover */}
                    <div className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:bg-orange group-hover:opacity-100">
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Compact Content Section */}
                  <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 bg-[#06243d]">
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.24em] text-orange">
                        {it[2]}
                      </div>

                      <div className="mt-1 font-display text-base sm:text-lg font-bold text-white line-clamp-1">
                        {it[0]}
                      </div>

                      <div className="mt-0.5 text-[11px] sm:text-xs text-white/70 line-clamp-1">
                        {it[1]}
                      </div>
                    </div>

                    {/* View Work Button */}
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 group-hover:border-orange group-hover:bg-orange group-hover:text-white">
                        View Work
                        <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 p-6 backdrop-blur-xl"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImgSrc(portfolioImgs[lightbox])}
              alt={items[lightbox][0]}
              className="h-auto w-full"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 w-full -translate-x-1/2 px-6 text-center text-white">
            <div className="font-display text-xl font-bold">
              {items[lightbox][0]}
            </div>

            <div className="mt-1 text-sm text-white/70">
              {items[lightbox][1]}
            </div>
          </div>

          <span className="sr-only">{lang}</span>
        </div>
      )}
    </section>
  );
}