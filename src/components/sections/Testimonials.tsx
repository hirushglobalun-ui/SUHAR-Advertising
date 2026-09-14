"use client";

import { Star } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang, useT } from "@/lib/i18n";

export default function Testimonials() {
  const { t } = useLang();
  const items = useT<[string, string, string][]>("testimonials.items");
  return (
    <section className="relative overflow-hidden bg-white py-14 text-navy lg:py-20">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-navy/80">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              {t("testimonials.eyebrow")}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("testimonials.title")}
            </h2>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map(([name, role, quote], i) => (
            <Reveal key={name} delay={i * 100}>
              <div className="h-full rounded-3xl bg-[#062D4F] p-8 text-white">
                <div className="flex gap-1 text-orange">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-6 text-base leading-relaxed text-white/85">&quot;{quote}&quot;</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-royal to-orange font-display text-sm font-bold">
                    {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-white/60">{role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
