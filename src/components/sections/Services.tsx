"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import SectionLabel from "@/components/common/SectionLabel";
import { useLang, useT } from "@/lib/i18n";
import { serviceIcons } from "@/lib/data";

export default function Services() {
  const { t } = useLang();
  const items = useT<[string, string][]>("services.items");

  const [showAll, setShowAll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const hasMore = items.length > 6;

  /*
   * Continuous auto-scroll
   */
  useEffect(() => {
    if (showAll) return;

    const container = scrollRef.current;
    if (!container) return;

    let lastTime = performance.now();

    const speed = 35; // pixels per second

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!isPaused) {
        container.scrollLeft += (speed * delta) / 1000;

        /*
         * When reaching the end, smoothly return
         * to the beginning and continue.
         */
        if (
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth - 1
        ) {
          container.scrollLeft = 0;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showAll, isPaused]);

  /*
   * Service Card
   */
  const ServiceCard = ({
    title,
    desc,
    index,
  }: {
    title: string;
    desc: string;
    index: number;
  }) => {
    const Icon = serviceIcons[index % serviceIcons.length];

    return (
      <div className="group relative h-full min-h-[145px] min-w-[260px] shrink-0 overflow-hidden rounded-2xl border border-navy/10 bg-white p-4 transition-all duration-500 hover:-translate-y-1 hover:border-navy/20 hover:shadow-[0_20px_40px_-25px_rgba(15,23,42,0.3)] sm:min-w-[280px] lg:min-w-[calc((100%-36px)/4)]">
        {/* Number + Icon */}
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-navy/20 transition-colors duration-300 group-hover:text-orange">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/10 text-navy transition-all duration-300 group-hover:border-orange group-hover:bg-orange group-hover:text-white">
            <Icon className="h-4 w-4" strokeWidth={1.8} />
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="font-display text-lg font-bold leading-tight text-navy transition-transform duration-300 group-hover:translate-x-1">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-navy/50">
            {desc}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-3 flex items-center justify-between">
          <span className="h-px flex-1 bg-navy/10 transition-colors duration-300 group-hover:bg-orange/40" />

          <div className="ml-3 flex h-7 w-7 items-center justify-center rounded-full text-navy/30 transition-all duration-300 group-hover:bg-navy group-hover:text-white">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Hover accent */}
        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange transition-all duration-500 group-hover:w-full" />
      </div>
    );
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-10 lg:py-14"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-7">
          <Reveal>
            <SectionLabel>{t("services.eyebrow")}</SectionLabel>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-5xl">
                {t("services.title")}
              </h2>

              <p className="max-w-md text-sm leading-relaxed text-navy/50">
                {t("services.subtitle")}
              </p>
            </div>
          </Reveal>
        </div>

        {/* View All Services Button */}
        {!showAll && hasMore && (
          <Reveal delay={150}>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="group inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-navy transition-all duration-300 hover:border-orange hover:bg-orange hover:text-white"
              >
                View All Services

                <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          </Reveal>
        )}

        {/* Auto Scrolling Services Row */}
        {!showAll && (
          <Reveal delay={200}>
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {items.map(([title, desc], i) => (
                <ServiceCard
                  key={`${title}-${i}`}
                  title={title}
                  desc={desc}
                  index={i}
                />
              ))}
            </div>
          </Reveal>
        )}

        {/* Expanded Services */}
        {showAll && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(([title, desc], i) => {
                const Icon = serviceIcons[i % serviceIcons.length];

                return (
                  <Reveal key={`${title}-${i}`} delay={(i % 3) * 70}>
                    <div className="group relative h-full min-h-[145px] overflow-hidden rounded-2xl border border-navy/10 bg-white p-4 transition-all duration-500 hover:-translate-y-1 hover:border-navy/20 hover:shadow-[0_20px_40px_-25px_rgba(15,23,42,0.3)]">
                      {/* Number + Icon */}
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-navy/20 transition-colors duration-300 group-hover:text-orange">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/10 text-navy transition-all duration-300 group-hover:border-orange group-hover:bg-orange group-hover:text-white">
                          <Icon
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-4">
                        <h3 className="font-display text-lg font-bold leading-tight text-navy transition-transform duration-300 group-hover:translate-x-1">
                          {title}
                        </h3>

                        <p className="mt-1 text-xs leading-relaxed text-navy/50">
                          {desc}
                        </p>
                      </div>

                      {/* Bottom */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="h-px flex-1 bg-navy/10 transition-colors duration-300 group-hover:bg-orange/40" />

                        <div className="ml-3 flex h-7 w-7 items-center justify-center rounded-full text-navy/30 transition-all duration-300 group-hover:bg-navy group-hover:text-white">
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      {/* Hover accent */}
                      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange transition-all duration-500 group-hover:w-full" />
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Show Less */}
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="group inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-navy transition-all duration-300 hover:border-orange hover:bg-orange hover:text-white"
              >
                <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                Show Less
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}