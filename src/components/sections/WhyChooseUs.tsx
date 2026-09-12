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
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([title, desc], i) => {
            const Icon = whyIcons[i % whyIcons.length];
            return (
              <Reveal key={title} delay={(i % 4) * 80}>
                <div className="group relative h-full rounded-2xl bg-gradient-to-br from-surface to-white p-6 ring-1 ring-navy/5 transition-all hover:ring-navy/20">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange/10 text-orange transition-all group-hover:bg-orange group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm text-navy/60">{desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
