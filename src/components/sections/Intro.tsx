"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "@/components/common/Reveal";
import Counter from "@/components/common/Counter";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";
import { getImgSrc, aboutImg } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const stats = useT<{ v: number; s: string; l: string }[]>("intro.stats");
  const { t, lang } = useLang();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(section, { opacity: 1, x: 0, scale: 1 });
      return;
    }

    const vw = window.innerWidth;
    const xOffset = vw >= 1024 ? 60 : vw >= 640 ? 40 : 25;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          x: xOffset,
          scale: 0.98,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden bg-white py-14 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:gap-14 lg:px-10">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg">
              <img
                src={getImgSrc(aboutImg)}
                alt="SUHAR creative team reviewing branding work"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-navy/10 bg-white p-6 shadow-2xl lg:block rtl:-left-6 rtl:right-auto">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold text-navy" lang="en" dir="ltr" style={{ unicodeBidi: "isolate" }}>1996</div>
                  <div className="text-xs uppercase tracking-widest text-navy/60">
                    {lang === "ar" ? (
                      <>
                        تأسست ·{" "}
                        <span lang="en" dir="ltr" style={{ unicodeBidi: "isolate" }}>28+</span>
                        {" "}عاماً
                      </>
                    ) : "Established · 28+ Yrs"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal>
            <SectionLabel>{t("intro.eyebrow")}</SectionLabel>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-3 sm:mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-navy">
              {t("intro.title")}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-navy/75">{t("intro.body")}</p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6">
              {stats.map((s, i) => (
                <div key={i} className="rounded-2xl border border-navy/10 bg-surface p-3.5 sm:p-5">
                  <div className="font-display text-2xl sm:text-4xl font-extrabold text-navy">
                    <Counter to={s.v} suffix={s.s} />
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-navy/60 leading-snug">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
