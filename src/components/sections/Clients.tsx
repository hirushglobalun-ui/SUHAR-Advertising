"use client";

import { useLang } from "@/lib/i18n";
import { clientBrands } from "@/lib/data";

export default function Clients() {
  const { t } = useLang();
  const list = [...clientBrands, ...clientBrands];
  return (
    <section className="border-y border-navy/10 bg-white py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-navy/50">
          {t("clients.title")}
        </p>
      </div>
      <div className="mt-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-14">
          {list.map((b, i) => (
            <div key={i} className="font-display text-2xl font-extrabold tracking-tight text-navy/30 hover:text-navy transition-colors">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
