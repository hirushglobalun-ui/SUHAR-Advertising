"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";
import { serviceIcons } from "@/lib/data";

export default function Services() {
  const { t, lang } = useLang();
  const items = useT<[string, string][]>("services.items");

  return (
    <section id="services" className="relative overflow-hidden bg-[#FBFBFA] py-16 lg:py-24">
      {/* Background Decorative Accents */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] grid-lines" />
      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <SectionLabel>{t("services.eyebrow")}</SectionLabel>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-3 sm:mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-navy">
                {t("services.title")}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-navy/70">
              {t("services.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Bento Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc], i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            const isFeatured = i === 0 || i === items.length - 1;

            return (
              <Reveal
                key={title}
                delay={(i % 3) * 70}
                className={isFeatured ? "col-span-1 sm:col-span-2 lg:col-span-2" : "col-span-1"}
              >
                <div
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-xl hover:shadow-navy/5 ${
                    isFeatured
                      ? "bg-gradient-to-br from-white via-white to-amber-50/30"
                      : ""
                  }`}
                >
                  {/* Top Metadata: Index & Floating Icon */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 text-gold-dark ring-1 ring-gold/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy group-hover:shadow-md group-hover:shadow-gold/30">
                          <Icon className="h-6 w-6" strokeWidth={2} />
                        </div>
                        {isFeatured && (
                          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">
                            <Sparkles className="h-3 w-3 text-gold" />
                            {lang === "ar" ? "خدمة رئيسية" : "Flagship Service"}
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-sm font-bold tracking-widest text-slate-300 transition-colors duration-300 group-hover:text-gold" lang="en" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-6">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-navy transition-colors duration-300 group-hover:text-gold">
                        {title}
                      </h3>

                      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action / Inquiry Link */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy transition-colors duration-300 group-hover:text-gold"
                    >
                      {lang === "ar" ? "طلب تسعير واستشارة" : "Request Quote"}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 rtl:rotate-[-90deg]" />
                    </a>

                    <div className="h-8 w-8 rounded-full bg-slate-50 grid place-items-center text-slate-400 transition-all duration-300 group-hover:bg-gold group-hover:text-navy group-hover:scale-105">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
                    </div>
                  </div>

                  {/* Bottom Accent Line */}
                  <span className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}