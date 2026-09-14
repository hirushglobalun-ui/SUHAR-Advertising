import type { ReactNode } from "react";

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-navy/70 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-orange" />
      {children}
    </div>
  );
}
