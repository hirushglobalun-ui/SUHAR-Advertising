import heroImg from "@/assets/Suharhero.webp";
import aboutImg from "@/assets/about.jpg";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

import {
  Palette,
  Type,
  Home,
  Sun,
  Lightbulb,
  Car,
  Printer,
  FileText,
  Layers,
  Building2,
  Square,
  PaintBucket,
  Presentation,
  Gift,
  Sparkles,
  Compass,
  ShieldAlert,
  Wrench,
  Users,
  Zap,
  Rocket,
  Cpu,
  Sliders,
  BadgeDollarSign,
  HeartHandshake,
} from "lucide-react";

export function getImgSrc(img: any): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img.src && typeof img.src === "string") return img.src;
  return String(img);
}

export { heroImg, aboutImg, p1, p2, p3, p4, p5, p6 };

export const portfolioImgs = [p1, p2, p3, p4, p5, p6];

export const portfolioSpans = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];

export const serviceIcons = [
  Printer, Building2, Type, Car, Layers, Zap, Palette,
  Sparkles, PaintBucket, Presentation, Gift, Compass, ShieldAlert, Wrench,
];

export const whyIcons = [
  Sparkles, Palette, Zap, Users, ShieldAlert, HeartHandshake,
];

export const clientBrands = [
  "OMANTEL", "SHELL", "BANK MUSCAT", "AL MEERA", "NAWRAS",
  "OQ", "PDO", "MAJID", "LULU", "OOREDOO",
];
