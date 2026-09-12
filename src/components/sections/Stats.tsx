"use client";

import Reveal from "@/components/common/Reveal";
import Counter from "@/components/common/Counter";
import { useLang, useT } from "@/lib/i18n";

export default function Stats() {
  const { t } = useLang();
  const items = useT<[number, string, string][]>("stats.items");
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-extrabold text-navy sm:text-4xl">
            {t("stats.title")}
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map(([v, s, l], i) => (
            <Reveal key={l} delay={i * 80}>
              <div className="rounded-3xl border border-navy/10 bg-surface p-8 text-center transition-all hover:border-orange/40 hover:shadow-lg">
                <div className="font-display text-5xl font-extrabold text-gradient">
                  <Counter to={v} suffix={s} />
                </div>
                <div className="mt-2 text-sm font-medium text-navy/60">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
