"use client";

import { useLang } from "@/lib/i18n";
import { clientBrands } from "@/lib/data";

export default function Clients() {
  const { t } = useLang();
  const list = [...clientBrands, ...clientBrands, ...clientBrands, ...clientBrands];
  return (
    <section className="relative border-y border-navy/10 bg-white py-10 lg:py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-navy/50">
          {t("clients.title")}
        </p>
      </div>
      <div className="relative mt-6 overflow-hidden" dir="ltr">
        {/* Left & Right gradient edge masks for seamless luxury appearance */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee gap-10 sm:gap-14">
          {list.map((b, i) => (
            <div
              key={i}
              className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-navy/30 hover:text-navy transition-colors select-none"
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
