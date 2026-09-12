"use client";

import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";
import { serviceIcons } from "@/lib/data";

export default function Services() {
  const { t } = useLang();
  const items = useT<[string, string][]>("services.items");
  return (
    <section id="services" className="relative overflow-hidden bg-surface py-14 lg:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-40 grid-lines" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("services.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("services.title")}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-3 text-lg text-navy/60">{t("services.subtitle")}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc], i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <Reveal key={title} delay={(i % 3) * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-navy/10 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-navy/20 hover:shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)]">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl p-[1px]">
                      <div
                        className="h-full w-full rounded-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.22 262 / 0.5), oklch(0.72 0.19 51 / 0.5))",
                          WebkitMask:
                            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          padding: 1,
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-white transition-all group-hover:bg-orange">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-navy">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/60">{desc}</p>
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange opacity-0 transition-opacity group-hover:opacity-100">
                      {t("services.more")}
                      <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-[-90deg]" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
