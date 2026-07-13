import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Sparkles,
  Palette,
  Building2,
  Sun,
  Lightbulb,
  Car,
  Printer,
  FileText,
  Layers,
  Type,
  Square,
  PaintBucket,
  Presentation,
  Gift,
  Home,
  Compass,
  ShieldAlert,
  Wrench,
  Check,
  Zap,
  Users,
  Rocket,
  Cpu,
  Sliders,
  BadgeDollarSign,
  HeartHandshake,
  Plus,
  Minus,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  X,
  Globe,
} from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

import { useLang, useT, dict } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ---------- Small utilities ---------- */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({ children, delay = 0, as: As = "div", className = "" }: {
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

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
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
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-navy/70 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-orange" />
      {children}
    </div>
  );
}

/* ---------- Header ---------- */

function Header() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { href: "#services", label: t("nav.services") },
    { href: "#portfolio", label: t("nav.portfolio") },
    { href: "#about", label: t("nav.about") },
    { href: "#process", label: t("nav.process") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-navy">
            <div className="absolute inset-0 bg-gradient-to-br from-royal to-orange opacity-90" />
            <div className="absolute inset-[6px] rounded-lg border border-white/40" />
            <span className="absolute inset-0 grid place-items-center font-display text-lg font-extrabold text-white">
              S
            </span>
          </div>
          <div className="leading-none">
            <div className={`font-display text-lg font-extrabold tracking-tight ${scrolled ? "text-navy" : "text-white"}`}>
              SUHAR
            </div>
            <div className={`text-[10px] font-medium uppercase tracking-[0.28em] ${scrolled ? "text-navy/60" : "text-white/70"}`}>
              Advertising
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`relative text-sm font-medium transition-colors ${
                scrolled ? "text-navy/80 hover:text-navy" : "text-white/85 hover:text-white"
              } after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-orange after:transition-all hover:after:w-full`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              scrolled
                ? "border-navy/15 text-navy hover:border-navy/40"
                : "border-white/30 text-white hover:border-white/60"
            }`}
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "en" ? "AR" : "EN"}
          </button>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(249,115,22,0.6)] transition-all hover:bg-orange/90 hover:shadow-[0_16px_40px_-12px_rgba(249,115,22,0.7)]"
          >
            {t("nav.quote")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden ${scrolled ? "text-navy" : "text-white"}`}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy/95 px-6 py-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-white/90"
              >
                {n.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white"
              >
                {lang === "en" ? "AR" : "EN"}
              </button>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white"
              >
                {t("nav.quote")}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-navy text-white">
      {/* background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="SUHAR advertising showcase — illuminated corporate signage at dusk"
          className="h-full w-full object-cover opacity-60"
          width={1920}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />
      </div>

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[22%] h-32 w-32 rounded-3xl border border-white/10 backdrop-blur-sm animate-float-slow" />
        <div className="absolute right-[10%] top-[30%] h-24 w-24 rounded-full bg-orange/20 blur-2xl animate-pulse-glow" />
        <div className="absolute bottom-[18%] left-[45%] h-40 w-40 rounded-full bg-royal/25 blur-3xl animate-pulse-glow" />
        <div
          className="absolute right-[20%] bottom-[24%] h-16 w-16 rotate-12 border-2 border-orange/60 animate-float-slow"
          style={{ animationDelay: "1.4s" }}
        />
      </div>

      {/* subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] grid-lines" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32 pb-24 lg:px-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-orange" />
            {t("hero.eyebrow")}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {t("hero.title")}
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {t("hero.subtitle")}
          </p>
        </Reveal>

        <Reveal delay={340}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_-15px_rgba(249,115,22,0.7)] transition-all hover:bg-orange/90 hover:translate-y-[-2px]"
            >
              {t("hero.cta1")}
              <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
            </a>
            <a
              href="#portfolio"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {t("hero.cta2")}
            </a>
          </div>
        </Reveal>

        <Reveal delay={520}>
          <div className="mt-20 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-white/50">
            <div className="h-px w-10 bg-white/40" />
            {t("hero.scroll")}
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Intro ---------- */

function Intro() {
  const stats = useT<{ v: number; s: string; l: string }[]>("intro.stats");
  const { t } = useLang();
  return (
    <section id="about" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src={aboutImg}
                alt="SUHAR creative team reviewing branding work"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-navy/10 bg-white p-6 shadow-2xl lg:block rtl:-left-6 rtl:right-auto">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold text-navy">15+</div>
                  <div className="text-xs uppercase tracking-widest text-navy/60">Years of craft</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal>
            <SectionLabel>{t("intro.eyebrow")}</SectionLabel>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("intro.title")}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 text-base leading-relaxed text-navy/70">{t("intro.body")}</p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-10 grid grid-cols-2 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="rounded-2xl border border-navy/10 bg-surface p-5">
                  <div className="font-display text-4xl font-extrabold text-navy">
                    <Counter to={s.v} suffix={s.s} />
                  </div>
                  <div className="mt-1 text-sm text-navy/60">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */

const serviceIcons = [
  Palette, Type, Home, Sun, Lightbulb, Car, Printer, FileText,
  Layers, Building2, Square, PaintBucket, Presentation, Gift,
  Sparkles, Compass, ShieldAlert, Wrench,
];

function Services() {
  const { t } = useLang();
  const items = useT<[string, string][]>("services.items");
  return (
    <section id="services" className="relative overflow-hidden bg-surface py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-40 grid-lines" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("services.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("services.title")}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-4 text-lg text-navy/60">{t("services.subtitle")}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc], i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <Reveal key={title} delay={(i % 3) * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-navy/10 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-navy/20 hover:shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)]">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl p-[1px]">
                      <div
                        className="h-full w-full rounded-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.22 262 / 0.5), oklch(0.72 0.19 51 / 0.5))",
                          WebkitMask:
                            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          padding: 1,
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-white transition-all group-hover:bg-orange">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-navy">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/60">{desc}</p>
                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange opacity-0 transition-opacity group-hover:opacity-100">
                      {t("services.more")}
                      <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-[-90deg]" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why ---------- */

const whyIcons = [Sparkles, Users, Zap, Rocket, Cpu, Sliders, BadgeDollarSign, HeartHandshake];

function Why() {
  const { t } = useLang();
  const items = useT<[string, string][]>("why.items");
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("why.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("why.title")}
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([title, desc], i) => {
            const Icon = whyIcons[i % whyIcons.length];
            return (
              <Reveal key={title} delay={(i % 4) * 80}>
                <div className="group relative h-full rounded-2xl bg-gradient-to-br from-surface to-white p-6 ring-1 ring-navy/5 transition-all hover:ring-navy/20">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange/10 text-orange transition-all group-hover:bg-orange group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm text-navy/60">{desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Portfolio ---------- */

const portfolioImgs = [p1, p2, p3, p4, p5, p6];
const portfolioSpans = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];

function Portfolio() {
  const { t, lang } = useLang();
  const items = useT<[string, string, string][]>("portfolio.items");
  const cats = useT<string[]>("portfolio.cats");
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => active === 0 || it[2] === cats[active]);

  return (
    <section id="portfolio" className="bg-navy py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                {t("portfolio.eyebrow")}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                {t("portfolio.title")}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="flex flex-wrap gap-2">
              {cats.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setActive(i)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    active === i
                      ? "border-orange bg-orange text-white"
                      : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map(({ it, i }) => (
            <Reveal key={i} delay={(i % 3) * 80} className={portfolioSpans[i]}>
              <button
                onClick={() => setLightbox(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl"
              >
                <img
                  src={portfolioImgs[i]}
                  alt={it[0]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-left rtl:text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange">
                    {it[2]}
                  </div>
                  <div className="mt-2 font-display text-xl font-bold">{it[0]}</div>
                  <div className="mt-1 text-xs text-white/70">{it[1]}</div>
                </div>
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 transition-all group-hover:opacity-100 group-hover:bg-orange">
                  <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 p-6 backdrop-blur-xl"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl">
            <img src={portfolioImgs[lightbox]} alt={items[lightbox][0]} className="h-auto w-full" />
          </div>
          <div className="mt-4 text-center text-white">
            <div className="font-display text-xl font-bold">{items[lightbox][0]}</div>
            <div className="text-sm text-white/70">{items[lightbox][1]}</div>
          </div>
          {/* silence unused lang */}
          <span className="sr-only">{lang}</span>
        </div>
      )}
    </section>
  );
}

/* ---------- Process ---------- */

function Process() {
  const { t } = useLang();
  const steps = useT<[string, string][]>("process.steps");
  return (
    <section id="process" className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("process.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("process.title")}
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-16">
          <div className="absolute inset-x-6 top-12 hidden h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {steps.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="relative">
                  <div className="mb-6 grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-lg ring-1 ring-navy/10">
                    <span className="font-display text-3xl font-extrabold text-gradient">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Industries ---------- */

function Industries() {
  const { t } = useLang();
  const items = useT<string[]>("industries.items");
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal><SectionLabel>{t("industries.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("industries.title")}
            </h2>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((n, i) => (
            <Reveal key={n} delay={(i % 5) * 60}>
              <div className="group flex items-center gap-3 rounded-2xl border border-navy/10 bg-surface p-4 transition-all hover:border-orange/50 hover:bg-white hover:shadow-lg">
                <div className="h-2 w-2 rounded-full bg-orange" />
                <span className="text-sm font-semibold text-navy">{n}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Clients marquee ---------- */

function Clients() {
  const { t } = useLang();
  const brands = ["OMANTEL", "SHELL", "BANK MUSCAT", "AL MEERA", "NAWRAS", "OQ", "PDO", "MAJID", "LULU", "OOREDOO"];
  const list = [...brands, ...brands];
  return (
    <section className="border-y border-navy/10 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-navy/50">
          {t("clients.title")}
        </p>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="flex w-max animate-marquee gap-14">
          {list.map((b, i) => (
            <div key={i} className="font-display text-2xl font-extrabold tracking-tight text-navy/30 hover:text-navy transition-colors">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

function Testimonials() {
  const { t } = useLang();
  const items = useT<[string, string, string][]>("testimonials.items");
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-[oklch(0.22_0.05_265)] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              {t("testimonials.eyebrow")}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              {t("testimonials.title")}
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map(([name, role, quote], i) => (
            <Reveal key={name} delay={i * 100}>
              <div className="glass-dark h-full rounded-3xl p-8">
                <div className="flex gap-1 text-orange">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-6 text-base leading-relaxed text-white/85">"{quote}"</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-royal to-orange font-display text-sm font-bold">
                    {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-white/60">{role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats ---------- */

function Stats() {
  const { t } = useLang();
  const items = useT<[number, string, string][]>("stats.items");
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-extrabold text-navy sm:text-4xl">
            {t("stats.title")}
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map(([v, s, l], i) => (
            <Reveal key={l} delay={i * 80}>
              <div className="rounded-3xl border border-navy/10 bg-surface p-8 text-center transition-all hover:border-orange/40 hover:shadow-lg">
                <div className="font-display text-5xl font-extrabold text-gradient">
                  <Counter to={v} suffix={s} />
                </div>
                <div className="mt-2 text-sm font-medium text-navy/60">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

function FAQ() {
  const { t } = useLang();
  const items = useT<[string, string][]>("faq.items");
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center">
          <Reveal><SectionLabel>{t("faq.eyebrow")}</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              {t("faq.title")}
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 space-y-3">
          {items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isOpen ? "border-orange/40 bg-white shadow-lg" : "border-navy/10 bg-white"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left rtl:text-right"
                  >
                    <span className="font-display text-base font-bold text-navy">{q}</span>
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all ${isOpen ? "bg-orange text-white rotate-180" : "bg-surface text-navy"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>
                  <div
                    className="grid transition-all duration-500"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-navy/70">{a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */

function Contact() {
  const { t } = useLang();
  const services = useT<[string, string][]>("services.items");
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative bg-navy py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] grid-lines" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                {t("contact.eyebrow")}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                {t("contact.title")}
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-5 text-base text-white/70">{t("contact.subtitle")}</p>
            </Reveal>

            <div className="mt-10 space-y-4">
              {[
                { icon: MapPin, label: t("contact.info.location"), value: t("contact.info.address") },
                { icon: Clock, label: t("contact.info.hours"), value: t("contact.info.hoursValue") },
                { icon: Phone, label: t("contact.info.call"), value: "+968 2456 7890" },
                { icon: Mail, label: t("contact.info.email"), value: "hello@suhar.om" },
              ].map((c, i) => (
                <Reveal key={i} delay={220 + i * 60}>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange text-white">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/50">{c.label}</div>
                      <div className="text-sm font-semibold">{c.value}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={200}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("contact.form.name")} name="name" required />
                <Field label={t("contact.form.company")} name="company" />
                <Field label={t("contact.form.email")} name="email" type="email" required />
                <Field label={t("contact.form.phone")} name="phone" type="tel" />
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                    {t("contact.form.service")}
                  </label>
                  <select
                    name="service"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-orange/60"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-navy">{t("contact.form.pickService")}</option>
                    {services.map(([s]) => (
                      <option key={s} value={s} className="bg-navy">{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-orange/60"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_-15px_rgba(249,115,22,0.6)] transition-all hover:bg-orange/90 hover:translate-y-[-2px]"
              >
                {sent ? (
                  <>
                    <Check className="h-4 w-4" /> Sent — we'll be in touch
                  </>
                ) : (
                  <>
                    {t("contact.form.submit")}
                    <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
        {label}
        {required && <span className="text-orange"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-orange/60"
      />
    </div>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  const { lang, setLang, t } = useLang();
  const services = dict[lang].services.items.slice(0, 8);
  return (
    <footer className="bg-[oklch(0.14_0.04_265)] py-16 text-white/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-navy">
                <div className="absolute inset-0 bg-gradient-to-br from-royal to-orange opacity-90" />
                <span className="absolute inset-0 grid place-items-center font-display text-lg font-extrabold text-white">
                  S
                </span>
              </div>
              <div>
                <div className="font-display text-lg font-extrabold text-white">SUHAR</div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">Advertising</div>
              </div>
            </div>
            <p className="mt-5 text-sm">{t("footer.tagline")}</p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Linkedin].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-all hover:border-orange hover:bg-orange hover:text-white"
                  aria-label="Social"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              {t("footer.links")}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["#services", t("nav.services")],
                ["#portfolio", t("nav.portfolio")],
                ["#about", t("nav.about")],
                ["#process", t("nav.process")],
                ["#contact", t("nav.contact")],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="transition-colors hover:text-orange">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              {t("footer.services")}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map(([s]) => (
                <li key={s}>
                  <a href="#services" className="transition-colors hover:text-orange">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              {t("footer.contact")}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-orange" />Muscat, Oman</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange" />+968 2456 7890</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-orange" />hello@suhar.om</li>
            </ul>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-orange"
            >
              <Globe className="h-3.5 w-3.5" /> {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <div>© {new Date().getFullYear()} SUHAR Advertising. {t("footer.rights")}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-orange">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

function Landing() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Header />
      <Hero />
      <Intro />
      <Services />
      <Why />
      <Portfolio />
      <Process />
      <Industries />
      <Clients />
      <Testimonials />
      <Stats />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
