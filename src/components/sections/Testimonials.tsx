"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import { useLang, useT } from "@/lib/i18n";
import type { CMSTestimonial } from "@/types/cms";

export default function Testimonials() {
  const { t, lang } = useLang();
  const staticItems = useT<[string, string, string][]>("testimonials.items") || [];
  const [cmsTestimonials, setCmsTestimonials] = useState<CMSTestimonial[]>([]);

  useEffect(() => {
    fetch("/api/admin/testimonials?published=true")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.testimonials;
        if (Array.isArray(list) && list.length > 0) {
          setCmsTestimonials(list);
        }
      })
      .catch(() => {});
  }, []);

  const isRtl = lang === "ar";

  const displayList =
    cmsTestimonials.length > 0
      ? cmsTestimonials.map((item) => ({
          name: isRtl && item.person_name_ar ? item.person_name_ar : item.person_name_en,
          role: `${isRtl && item.designation_ar ? item.designation_ar : item.designation_en}, ${
            isRtl && item.company_ar ? item.company_ar : item.company_en
          }`,
          quote: isRtl && item.text_ar ? item.text_ar : item.text_en,
          rating: item.rating || 5,
        }))
      : (Array.isArray(staticItems) ? staticItems : []).map(([name, role, quote]) => ({
          name,
          role,
          quote,
          rating: 5,
        }));

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
          {displayList.map((item, i) => (
            <Reveal key={item.name + i} delay={i * 100}>
              <div className="h-full rounded-3xl bg-[#062D4F] p-8 text-white">
                <div className="flex gap-1 text-orange">
                  {Array.from({ length: item.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-6 text-base leading-relaxed text-white/85">&quot;{item.quote}&quot;</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-royal to-orange font-display text-sm font-bold">
                    {item.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-white/60">{item.role}</div>
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
