"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useLang } from "@/lib/i18n";

export default function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  const { lang } = useLang();
  const isAr = lang === "ar";

  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    // In Arabic (RTL), dir="ltr" + inline-block isolates the counter so the
    // suffix stays to the RIGHT of the number, matching the English layout (1500+).
    <span
      ref={ref}
      dir={isAr ? "ltr" : undefined}
      style={isAr ? { display: "inline-block" } : undefined}
    >
      {n}
      {suffix}
    </span>
  );
}
