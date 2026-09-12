"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";

export default function FAQ() {
  const { t } = useLang();
  const items = useT<[string, string][]>("faq.items");
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-surface py-14 lg:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center">
          <Reveal><SectionLabel>{t("faq.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("faq.title")}
            </h2>
          </Reveal>
        </div>

        <div className="mt-8 space-y-3 lg:mt-10">
          {items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isOpen ? "border-orange/40 bg-white shadow-lg" : "border-navy/10 bg-white"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left rtl:text-right"
                  >
                    <span className="font-display text-base font-bold text-navy">{q}</span>
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all ${isOpen ? "bg-orange text-white rotate-180" : "bg-surface text-navy"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>
                  <div
                    className="grid transition-all duration-500"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-navy/70">{a}</p>
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
