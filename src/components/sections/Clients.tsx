"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { CMSClientLogo } from "@/types/cms";

const DEFAULT_CLIENTS: CMSClientLogo[] = [
  {
    id: "client-omantel",
    name_en: "Omantel",
    name_ar: "عمانتل",
    logo_url: "/clients/omantel.svg",
    display_order: 1,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
  {
    id: "client-bank-muscat",
    name_en: "Bank Muscat",
    name_ar: "بنك مسقط",
    logo_url: "/clients/bank-muscat.svg",
    display_order: 2,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
  {
    id: "client-oq",
    name_en: "OQ",
    name_ar: "أوكيو",
    logo_url: "/clients/oq.svg",
    display_order: 3,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
  {
    id: "client-shell",
    name_en: "Shell Oman",
    name_ar: "شل عُمان",
    logo_url: "/clients/shell.svg",
    display_order: 4,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
  {
    id: "client-lulu",
    name_en: "LuLu Hypermarket",
    name_ar: "لولو هايبرماركت",
    logo_url: "/clients/lulu.svg",
    display_order: 5,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
  {
    id: "client-al-fanar",
    name_en: "Al Fanar",
    name_ar: "الفنار",
    logo_url: "/clients/al-fanar.svg",
    display_order: 6,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
  {
    id: "client-ooredoo",
    name_en: "Ooredoo",
    name_ar: "أوريدو",
    logo_url: "/clients/ooredoo.svg",
    display_order: 7,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
  {
    id: "client-nafith",
    name_en: "Nafith Logistics",
    name_ar: "نافذ للوجستيات",
    logo_url: "/clients/nafith.svg",
    display_order: 8,
    is_active: true,
    updated_at: "2026-09-29T05:30:00.000Z",
  },
];

export default function Clients() {
  const { lang, t } = useLang();
  const isAr = lang === "ar";
  const [cmsClients, setCmsClients] = useState<CMSClientLogo[]>(DEFAULT_CLIENTS);

  useEffect(() => {
    fetch("/api/admin/clients?active=true", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCmsClients(data);
        }
      })
      .catch(() => {});
  }, []);

  const brands = cmsClients.map((c) => ({
    name: isAr ? (c.name_ar || c.name_en) : (c.name_en || c.name_ar),
    logo: c.logo_url,
  }));

  if (brands.length === 0) {
    return null;
  }

  const list = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="relative border-y border-navy/10 bg-white py-10 lg:py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-navy/50">
          {t("clients.title")}
        </p>
      </div>
      <div className="relative mt-6 overflow-hidden py-4" dir="ltr">
        {/* Left & Right gradient edge masks for seamless luxury appearance */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16 py-4 hover:[animation-play-state:paused]">
          {list.map((b, i) => (
            <div
              key={i}
              className="group/item relative flex items-center justify-center select-none px-4 py-2 transition-transform duration-300 hover:z-30 cursor-pointer"
              title={b.name}
            >
              {b.logo ? (
                <img
                  src={b.logo}
                  alt={b.name}
                  className="h-10 sm:h-12 w-auto max-w-[140px] sm:max-w-[170px] object-contain opacity-75 grayscale transition-all duration-300 ease-out group-hover/item:scale-115 group-hover/item:opacity-100 group-hover/item:grayscale-0 group-hover/item:drop-shadow-sm"
                />
              ) : (
                <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-navy transition-all duration-300 ease-out group-hover/item:scale-110 group-hover/item:text-gold">
                  {b.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
