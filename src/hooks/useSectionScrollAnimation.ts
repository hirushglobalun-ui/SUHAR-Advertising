import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to apply a premium scroll‑linked fade/translate/scale animation to a section.
 *
 * - Opacity: 0 → 1
 * - Y offset: ~50px (desktop) / ~35px (tablet) / ~25px (mobile)
 * - Scale: 0.98 → 1
 * - Uses scrub so the animation follows scroll position.
 * - Respects prefers‑reduced‑motion.
 */
export function useSectionScrollAnimation<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    // Determine responsive Y offset
    const vw = window.innerWidth;
    const yOffset = vw >= 1024 ? 50 : vw >= 640 ? 35 : 25;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: yOffset, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [ref]);
}
