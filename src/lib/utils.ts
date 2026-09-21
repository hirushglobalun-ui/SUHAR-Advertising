import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProjectTimestamp(p: any): number {
  if (!p) return 0;
  const raw = p.createdAt ?? p.created_at ?? p.updated_at ?? p.updatedAt;
  if (!raw) return 0;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const t = Date.parse(raw);
    return isNaN(t) ? 0 : t;
  }
  if (raw instanceof Date) return raw.getTime();
  if (typeof raw.toMillis === "function") return raw.toMillis();
  if (typeof raw.toDate === "function") return raw.toDate().getTime();
  if (typeof raw.seconds === "number") return raw.seconds * 1000;
  if (typeof raw._seconds === "number") return raw._seconds * 1000;
  return 0;
}
