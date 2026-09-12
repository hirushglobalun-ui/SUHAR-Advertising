"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

export default function Reveal({
  children,
  delay = 0,
  as: As = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Comp = As as "div";
  return (
    <Comp
      ref={ref as never}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Comp>
  );
}
