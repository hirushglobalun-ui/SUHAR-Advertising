"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, Menu, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function Header() {
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
    { href: "/", label: "Home" },
    { href: "/#about", label: t("nav.about") },
    { href: "/#services", label: t("nav.services") },
    { href: "/#works", label: t("nav.portfolio") },
    { href: "/#process", label: t("nav.process") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)]"
        : "bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.06)]"
        }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo/Suharlogo.webp"
            alt="SUHAR Advertising"
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="relative text-sm font-semibold text-slate-800 transition-colors hover:text-navy after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy transition-all hover:border-gold hover:text-navy hover:bg-slate-100"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5 text-navy" />
            {lang === "en" ? "AR" : "EN"}
          </button>

          {/* Request to Quote */}
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy shadow-[0_4px_18px_-4px_rgba(253,184,19,0.6)] transition-all hover:bg-gold-hover hover:shadow-[0_8px_25px_-6px_rgba(253,184,19,0.8)]"
          >
            {t("nav.quote")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-navy transition-all hover:border-gold hover:text-gold lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-slate-200 bg-white/98 px-6 backdrop-blur-xl shadow-xl transition-all duration-300 lg:hidden ${open
          ? "max-h-[600px] py-6 opacity-100"
          : "max-h-0 py-0 opacity-0"
          }`}
      >
        <nav className="flex flex-col gap-5">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="text-base font-semibold text-slate-800 transition-colors hover:text-gold"
            >
              {n.label}
            </Link>
          ))}

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-navy transition-all hover:border-gold hover:text-gold"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "en" ? "AR" : "EN"}
            </button>

            {/* Request to Quote */}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy shadow-[0_4px_15px_-4px_rgba(253,184,19,0.5)] transition-all hover:bg-gold-hover"
            >
              {t("nav.quote")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}