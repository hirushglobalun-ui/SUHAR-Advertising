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
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      if (line) {
        gsap.set(line, {
          scaleX: 0,
          transformOrigin: "left center",
        });
      }

      if (prefersReduced) {
        if (line) {
          gsap.set(line, {
            scaleX: 1,
          });
        }

        setReducedMotion(true);
        setScrollProgress(1);

        return;
      }

      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 70%",
            scrub: 12,
            onUpdate: (self) => {
              setScrollProgress(self.progress);
            },
          },
        }
      );

      if (line) {
        const lineTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 70%",
            scrub: 12,
          },
        });

        lineTl.to(
          line,
          {
            scaleX: 1,
            ease: "none",
            duration: 1,
          },
          0
        );
      }
    }, section);

    return () => ctx.revert();
  }, [isArabic]);

  // =========================================================
  // ARABIC MOBILE
  // SAME ACTIVE / FADE EFFECT AS ENGLISH MOBILE
  // =========================================================
  useEffect(() => {
    if (!isArabic) return;

    const section = sectionRef.current;

    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 1023px)", () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        setReducedMotion(true);
        setScrollProgress(1);

        return;
      }

      setReducedMotion(false);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom 70%",
        scrub: 12,

        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [isArabic]);

  // =========================================================
  // ARABIC DESKTOP
  // RIGHT -> LEFT
  // 01 -> 02 -> 03 -> 04 -> 05 -> 06
  // 06 FULLY VISIBLE BEFORE NEXT SECTION
  // =========================================================
  useEffect(() => {
    if (!isArabic) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const line = lineRef.current;

    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const getScrollDistance = () => {
        const lastStep = track.lastElementChild as HTMLElement | null;

        if (!lastStep) return 0;

        const lastStepRect = lastStep.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();

        return Math.max(
          0,
          lastStepRect.right - sectionRect.right
        );
      };

      gsap.set(track, {
        x: 0,
      });

      if (line) {
        gsap.set(line, {
          scaleX: 0,
          transformOrigin: "right center",
        });
      }

      const scrollTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "top top",

          end: () => {
            const distance = getScrollDistance();
            const extraHold = window.innerHeight * 2;

            return `+=${distance + extraHold}`;
          },

          scrub: 15,

          pin: true,
          pinSpacing: true,

          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            setScrollProgress(self.progress);

            if (line) {
              gsap.set(line, {
                scaleX: self.progress,
                transformOrigin: "right center",
              });
            }
          },
        },
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      const refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        window.clearTimeout(refreshTimer);
        scrollTween.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [isArabic, displaySteps.length]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-surface py-10 sm:py-14 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel>{t("process.eyebrow")}</SectionLabel>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-navy sm:mt-4 sm:text-5xl">
              {t("process.title")}
            </h2>
          </Reveal>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="relative mt-8 lg:hidden">
          <div className="absolute bottom-4 left-6 top-4 w-0.5 bg-navy/15 rtl:left-auto rtl:right-6">
            <div
              className="h-full w-full origin-top rounded-full bg-gradient-to-b from-navy via-royal to-gold transition-transform duration-1000 ease-out"
              style={{
                transform: `scaleY(${reducedMotion ? 1 : scrollProgress
                  })`,
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            {displaySteps.map(([title, desc], i) => {
              const isActive =
                reducedMotion ||
                scrollProgress >=
                i / Math.max(displaySteps.length - 1, 1);

              return (
                <div
                  key={`${title}-${i}`}
                  className={`relative flex items-start gap-4 pl-16 transition-all duration-1000 ease-out rtl:pl-0 rtl:pr-16 ${isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-40"
                    }`}
                >
                  <div
                    className={`absolute left-0 top-0.5 z-10 grid h-12 w-12 place-items-center rounded-2xl bg-surface shadow-md ring-2 ring-[#102E50] transition-all duration-1000 ease-out rtl:left-auto rtl:right-0 ${isActive
                        ? "scale-105 shadow-gold/40"
                        : ""
                      }`}
                  >
                    <span
                      className="font-display text-sm font-extrabold text-gold"
                      lang="en"
                      dir="ltr"
                      style={{ unicodeBidi: "isolate" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div
                    className={`flex-1 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-1000 ease-out ${isActive
                        ? "translate-x-0 opacity-100"
                        : "translate-x-3 opacity-60 rtl:-translate-x-3"
                      }`}
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

        {/* Desktop Horizontal Timeline */}
        <div className="relative mt-12 hidden lg:block">
          {/* Progress Line */}
          <div className="absolute inset-x-6 top-12 h-0.5 bg-navy/15">
            <div
              ref={lineRef}
              className={`h-full rounded-full bg-gradient-to-r from-navy via-royal to-gold ${isArabic
                  ? "origin-right bg-gradient-to-l"
                  : "origin-left"
                }`}
            />
          </div>

          {/* Track */}
          <div
            ref={trackRef}
            className={
              isArabic
                ? "relative z-10 flex w-max min-w-full flex-row gap-2"
                : "relative z-10 grid grid-cols-6 gap-6"
            }
          >
            {displaySteps.map(([title, desc], i) => {
              const isActive =
                reducedMotion ||
                scrollProgress >=
                i / Math.max(displaySteps.length - 1, 1);

              return (
                <div
                  key={`${title}-${i}`}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className={`relative flex flex-col items-start transition-all duration-1000 ease-out ${isArabic
                      ? "w-[220px] min-w-[220px] shrink-0"
                      : ""
                    } ${isActive
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-3 scale-95 opacity-0"
                    }`}
                >
                  {/* Number */}
                  <div className="relative mb-5">
                    <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-md" />

                    <div
                      className={`relative z-10 grid h-24 w-24 place-items-center rounded-3xl bg-surface shadow-lg ring-2 ring-[#102E50] shadow-navy/15 transition-all duration-1000 ease-out ${isActive
                          ? "scale-110 shadow-gold/40"
                          : ""
                        }`}
                    >
                      <span
                        className="font-display text-3xl font-extrabold text-gold"
                        lang="en"
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                      >
                        {String(i + 1).padStart(2, "0")}
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