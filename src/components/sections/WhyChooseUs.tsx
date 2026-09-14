"use client";

import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";
import { whyIcons } from "@/lib/data";

export default function WhyChooseUs() {
  const { t } = useLang();
  const items = useT<[string, string][]>("why.items");
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("why.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("why.title")}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-navy/70">
              {t("why.subtitle")}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc], i) => {
            const Icon = whyIcons[i % whyIcons.length];
            return (
              <Reveal key={title} delay={(i % 3) * 80} className="h-full">
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-navy/10 bg-gradient-to-br from-surface to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-lg">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange/10 text-orange transition-all duration-300 group-hover:bg-orange group-hover:text-white group-hover:scale-105">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-navy/20">0{i + 1}</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-navy group-hover:text-orange transition-colors">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/60">{desc}</p>
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
