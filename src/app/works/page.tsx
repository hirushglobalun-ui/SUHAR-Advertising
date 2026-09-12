"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang, useT } from "@/lib/i18n";
import { getImgSrc, portfolioImgs } from "@/lib/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function WorksPage() {
  const { t, lang } = useLang();
  const items = Array.isArray(useT("portfolio.items")) ? useT<[string, string, string][]>("portfolio.items") : [];
  const cats = Array.isArray(useT("portfolio.cats")) ? useT<string[]>("portfolio.cats") : [];

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => active === 0 || it[2] === cats[active]);

  return (
    <>
      <Header />
      <main>
        <section className="bg-navy text-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {/* Back to Home */}
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors hover:text-orange">
                ← Back to Home
              </Link>
            </div>

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
                  <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{t("portfolio.title")}</h2>
                </Reveal>
              </div>
            </div>

            {/* Categories */}
            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap gap-2">
                {cats.map((c, i) => (
                  <button key={c} onClick={() => setActive(i)} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${active === i ? "border-orange bg-orange text-white" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"}`}> {c} </button>
                ))}
              </div>
            </Reveal>

            {/* Portfolio Grid */}
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(({ it, i }) => (
                <Reveal key={i} delay={(i % 3) * 80}>
                  <button onClick={() => setLightbox(i)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl text-left">
                    <img src={getImgSrc(portfolioImgs[i])} alt={it[0]} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange">{it[2]}</div>
                      <div className="mt-2 font-display text-xl font-bold">{it[0]}</div>
                      <div className="mt-1 text-xs text-white/70">{it[1]}</div>
                      <div className="mt-3 inline-flex translate-y-2 items-center gap-1 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        View Work
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                    <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:bg-orange group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
              <div className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 p-6 backdrop-blur-xl" onClick={() => setLightbox(null)}>
                <button className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" onClick={() => setLightbox(null)} aria-label="Close"><X className="h-5 w-5" /></button>
                <div className="max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
                  <img src={getImgSrc(portfolioImgs[lightbox])} alt={items[lightbox][0]} className="h-auto w-full" />
                </div>
                <div className="absolute bottom-6 left-1/2 w-full -translate-x-1/2 px-6 text-center text-white"><div className="font-display text-xl font-bold">{items[lightbox][0]}</div><div className="mt-1 text-sm text-white/70">{items[lightbox][1]}</div></div>
                <span className="sr-only">{lang}</span>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
