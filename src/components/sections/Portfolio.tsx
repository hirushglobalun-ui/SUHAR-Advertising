"use client";

import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang, useT } from "@/lib/i18n";
import { getImgSrc, portfolioImgs, portfolioSpans } from "@/lib/data";

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
    <section id="portfolio" className="bg-navy py-14 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
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
          <Reveal delay={200}>
            <div className="flex flex-wrap gap-2">
              {cats.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setActive(i)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    active === i
                      ? "border-orange bg-orange text-white"
                      : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map(({ it, i }) => (
            <Reveal key={i} delay={(i % 3) * 80} className={portfolioSpans[i]}>
              <button
                onClick={() => setLightbox(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl"
              >
                <img
                  src={getImgSrc(portfolioImgs[i])}
                  alt={it[0]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left rtl:text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange">
                    {it[2]}
                  </div>
                  <div className="mt-2 font-display text-xl font-bold">{it[0]}</div>
                  <div className="mt-1 text-xs text-white/70">{it[1]}</div>
                </div>
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 transition-all group-hover:opacity-100 group-hover:bg-orange">
                  <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 p-6 backdrop-blur-xl"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl">
            <img src={getImgSrc(portfolioImgs[lightbox])} alt={items[lightbox][0]} className="h-auto w-full" />
          </div>
          <div className="mt-4 text-center text-white">
            <div className="font-display text-xl font-bold">{items[lightbox][0]}</div>
            <div className="text-sm text-white/70">{items[lightbox][1]}</div>
          </div>
          <span className="sr-only">{lang}</span>
        </div>
      )}
    </section>
  );
}
