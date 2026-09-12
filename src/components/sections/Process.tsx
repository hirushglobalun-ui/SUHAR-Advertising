"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const { t } = useLang();
  const steps = useT<[string, string][]>("process.steps");

  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;

    if (!section || !line) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Initial state for the line
      gsap.set(line, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      if (prefersReduced) {
        // Show final state instantly for reduced motion
        gsap.set(line, {
          scaleX: 1,
        });

        setReducedMotion(true);
        setScrollProgress(1);

        return;
      }

      // Update scroll progress
      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 70%",
            scrub: 1.5,
            onUpdate: (self) => {
              setScrollProgress(self.progress);
            },
          },
        }
      );

      // Animate process line
      const lineTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 70%",
          scrub: 1.5,
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-surface py-14 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel>
              {t("process.eyebrow")}
            </SectionLabel>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("process.title")}
            </h2>
          </Reveal>
        </div>

        {/* Process */}
        <div className="relative mt-10">
          {/* Background Line */}
          <div className="absolute inset-x-6 top-12 hidden h-0.5 bg-navy/15 lg:block">
            {/* Animated Line */}
            <div
              ref={lineRef}
              className="h-full origin-left rounded-full bg-gradient-to-r from-navy via-royal to-gold"
            />
          </div>

          {/* Steps */}
          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
            {steps.map(([title, desc], i) => {
              const isActive =
                scrollProgress >= i / (steps.length - 1);

              return (
                <div
                  key={title}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className={`relative flex flex-col items-start transition-opacity transition-transform duration-300 ${isActive
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-4 scale-95 opacity-0"
                    }`}
                >
                  {/* Badge */}
                  <div className="relative mb-5">
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gold/25 blur-md" />

                    {/* Number Box */}
                    <div
                      className={`badge relative z-10 grid h-24 w-24 place-items-center rounded-3xl bg-surface shadow-xl ring-2 ring-[#102E50] shadow-navy/20 ${isActive ? "scale-110 shadow-gold/50" : ""
                        }`}
                    >
                      <span className="font-display text-3xl font-extrabold text-gold">
                        0{i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-navy">
                    {title}
                  </h3>

                  {/* Description */}
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