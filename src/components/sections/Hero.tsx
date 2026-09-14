"use client";

import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useSectionScrollAnimation } from "@/hooks/useSectionScrollAnimation";
import Reveal from "@/components/common/Reveal";
import { useLang } from "@/lib/i18n";
import { getImgSrc, heroImg } from "@/lib/data";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useSectionScrollAnimation(sectionRef);
  const { t } = useLang();
  return (
    <section ref={sectionRef} id="top" className="relative min-h-screen overflow-hidden bg-navy text-white">
      {/* background */}
      <div className="absolute inset-0">
        <img
          src={getImgSrc(heroImg)}
          alt="SUHAR advertising showcase — illuminated corporate signage at dusk"
          className="h-full w-full object-cover opacity-100"
          width={1920}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
      </div>

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[22%] h-32 w-32 rounded-3xl border border-white/10 backdrop-blur-sm animate-float-slow" />
        <div className="absolute right-[10%] top-[30%] h-28 w-28 rounded-full bg-gold/20 blur-2xl animate-pulse-glow" />
        <div className="absolute bottom-[18%] left-[45%] h-44 w-44 rounded-full bg-royal/40 blur-3xl animate-pulse-glow" />
        <div
          className="absolute right-[20%] bottom-[24%] h-16 w-16 rotate-12 border-2 border-gold/50 animate-float-slow"
          style={{ animationDelay: "1.4s" }}
        />
      </div>

      {/* subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] grid-lines" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-20 pb-12 lg:px-10 lg:pt-28 lg:pb-12">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-navy/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/95 backdrop-blur-md shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {t("hero.eyebrow")}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-5 sm:mt-6 max-w-4xl font-display text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
            {t("hero.title")}
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-white/90">
            {t("hero.subtitle")}
          </p>
        </Reveal>

        <Reveal delay={340}>
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-bold text-navy shadow-[0_20px_50px_-15px_rgba(253,184,19,0.6)] transition-all hover:bg-gold-hover hover:shadow-[0_25px_60px_-12px_rgba(253,184,19,0.7)] hover:translate-y-[-2px]"
            >
              <span>{t("hero.cta1")}</span>
              <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
            </a>
            <a
              href="/#works"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gold/40"
            >
              <span>{t("hero.cta2")}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={520}>
          <div className="mt-12 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-white/60 lg:mt-16">
            <div className="h-px w-10 bg-gold/50" />
            {t("hero.scroll")}
            <ChevronDown className="h-4 w-4 text-gold animate-bounce" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
