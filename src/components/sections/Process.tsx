"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const { t, lang } = useLang();
  const steps = useT<[string, string][]>("process.steps");

  const isArabic = lang === "ar";

  // Always render exactly 6 process steps
  const displaySteps: [string, string][] = [
    ...steps.slice(0, 5),
    steps[5] ??
    (isArabic
      ? ["الدعم", "صيانة مستمرة وتغطية ضمان."]
      : ["Support", "Ongoing maintenance and warranty coverage."]),
  ];

  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // =========================================================
  // ENGLISH - KEEP EXISTING SCROLLING
  // =========================================================
  useEffect(() => {
    if (isArabic) return;

    const section = sectionRef.current;
    const line = lineRef.current;

    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* --------------------------------
         Initial line state
      -------------------------------- */
      if (line) {
        gsap.set(line, {
          scaleX: 0,
          transformOrigin: isArabic
            ? "right center"
            : "left center",
        });
      }

      /* --------------------------------
         Reduced motion
      -------------------------------- */
      if (prefersReduced) {
        setReducedMotion(true);
        setScrollProgress(1);

        if (line) {
          gsap.set(line, {
            scaleX: 1,
          });
        }

        return;
      }

      setReducedMotion(false);

      /* --------------------------------
         Main scroll animation timeline
      -------------------------------- */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80px",
          end: "+=1600",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const progress = Math.min(
              1,
              Math.max(0, self.progress)
            );

            setScrollProgress(progress);
          },
        },
      });

      if (line) {
        tl.to(
          line,
          {
            scaleX: 1,
            ease: "none",
          },
          0
        );
      }
    }, section);

    /* --------------------------------
       Refresh after language/layout change
    -------------------------------- */
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [lang]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-surface py-10 sm:py-14 lg:py-20"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* ==============================
            HEADER
        ============================== */}
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel>
              {t("process.eyebrow")}
            </SectionLabel>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-navy sm:mt-4 sm:text-5xl">
              {t("process.title")}
            </h2>
          </Reveal>
        </div>

        {/* ==============================
            MOBILE PROCESS
        ============================== */}
        <div className="relative mt-8 lg:hidden">

          {/* Vertical line */}
          <div
            className="
              absolute
              bottom-4
              top-4
              left-6
              w-0.5
              bg-navy/15
              rtl:left-auto
              rtl:right-6
            "
          >
            <div
              className="
                h-full
                w-full
                origin-top
                rounded-full
                bg-gradient-to-b
                from-navy
                via-royal
                to-gold
                transition-transform
                duration-500
                ease-out
              "
              style={{
                transform: `scaleY(${reducedMotion ? 1 : scrollProgress
                  })`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-4">
            {steps.map(([title, desc], i) => {
              const threshold =
                i / Math.max(steps.length - 1, 1);

              const isActive =
                reducedMotion ||
                scrollProgress >= threshold;

              return (
                <div
                  key={title}
                  className={`
                    relative
                    flex
                    items-start
                    gap-4
                    pl-16
                    rtl:pl-0
                    rtl:pr-16
                    transition-all
                    duration-500
                    ease-out
                    ${isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-40"
                    }
                  `}
                >
                  {/* Number */}
                  <div
                    className={`
                      absolute
                      left-0
                      top-0.5
                      z-10
                      grid
                      h-12
                      w-12
                      place-items-center
                      rounded-2xl
                      bg-surface
                      ring-2
                      ring-[#102E50]
                      shadow-md
                      rtl:left-auto
                      rtl:right-0
                      transition-all
                      duration-500
                      ease-out
                      ${isActive
                        ? "scale-105 shadow-gold/40"
                        : ""
                      }
                    `}
                  >
                    <span
                      dir="ltr"
                      className="font-display text-sm font-extrabold text-gold"
                    >
                      0{i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`
                      flex-1
                      rounded-2xl
                      border
                      border-slate-200/80
                      bg-white/90
                      p-4
                      shadow-sm
                      backdrop-blur-sm
                      transition-all
                      duration-500
                      ease-out
                      ${isActive
                        ? "translate-x-0 opacity-100"
                        : "translate-x-3 opacity-60 rtl:-translate-x-3"
                      }
                    `}
                  >
                    <h3 className="font-display text-base font-bold text-navy">
                      {title}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-navy/75">
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==============================
            DESKTOP PROCESS
        ============================== */}
        <div
          className="relative mt-12 hidden lg:block"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {/* Horizontal background line */}
          <div className="absolute inset-x-6 top-12 h-0.5 bg-navy/15">
            <div
              ref={lineRef}
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-navy
                via-royal
                to-gold
                rtl:bg-gradient-to-l
              "
            />
          </div>

          {/* Six steps */}
          <div className="relative z-10 grid grid-cols-6 gap-6">
            {steps.map(([title, desc], i) => {
              const threshold =
                i / Math.max(steps.length - 1, 1);

              const isActive =
                reducedMotion ||
                scrollProgress >= threshold;

              return (
                <div
                  key={title}
                  className={`
                    relative
                    flex
                    flex-col
                    items-start
                    transition-all
                    duration-500
                    ease-out
                    ${isActive
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-3 scale-95 opacity-0"
                    }
                  `}
                >
                  {/* Number card */}
                  <div className="relative mb-5">
                    <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-md" />

                    {/* Number */}
                    <div
                      className={`
                        relative
                        z-10
                        grid
                        h-24
                        w-24
                        place-items-center
                        rounded-3xl
                        bg-surface
                        shadow-lg
                        ring-2
                        ring-[#102E50]
                        shadow-navy/15
                        transition-all
                        duration-500
                        ease-out
                        ${isActive
                          ? "scale-110 shadow-gold/40"
                          : ""
                        }
                      `}
                    >
                      <span
                        dir="ltr"
                        className="font-display text-3xl font-extrabold text-gold"
                      >
                        0{i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-lg font-bold text-navy">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-navy/75">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div> 
    </section>
  );
}