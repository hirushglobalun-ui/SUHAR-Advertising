"use client";

import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";

export default function Process() {
  const { t } = useLang();
  const steps = useT<[string, string][]>("process.steps");
  return (
    <section id="process" className="bg-surface py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("process.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("process.title")}
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-10">
          <div className="absolute inset-x-6 top-12 hidden h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {steps.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="relative">
                  <div className="mb-6 grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-lg ring-1 ring-navy/10">
                    <span className="font-display text-3xl font-extrabold text-gradient">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
