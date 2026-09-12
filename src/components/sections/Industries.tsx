"use client";

import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";

export default function Industries() {
  const { t } = useLang();
  const items = useT<string[]>("industries.items");
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("industries.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("industries.title")}
            </h2>
          </Reveal>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((n, i) => (
            <Reveal key={n} delay={(i % 5) * 60}>
              <div className="group flex items-center gap-3 rounded-2xl border border-navy/10 bg-surface p-4 transition-all hover:border-orange/50 hover:bg-white hover:shadow-lg">
                <div className="h-2 w-2 rounded-full bg-orange" />
                <span className="text-sm font-semibold text-navy">{n}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
