"use client";

import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { dict, useLang } from "@/lib/i18n";

export default function Footer() {
  const { lang, setLang, t } = useLang();
  const services = dict[lang].services.items.slice(0, 8);

  return (
    <footer className="bg-[#F7F5EF] py-12 lg:py-14 text-[#062D4F]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <img
                src="/logo/Suharlogo.webp"
                alt="SUHAR Advertising"
                className="h-16 w-auto object-contain"
              />
            </div>

            <p className="mt-5 text-sm">{t("footer.tagline")}</p>

            <div className="mt-6 flex gap-3">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/baharalsuwaihara/", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/15 text-[#062D4F] transition-all hover:border-orange hover:bg-orange hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#062D4F]/60">
              {t("footer.links")}
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["/#services", t("nav.services")],
                ["/#works", t("nav.portfolio")],
                ["/#about", t("nav.about")],
                ["/#process", t("nav.process")],
                ["/#contact", t("nav.contact")],
              ].map(([h, l]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="transition-colors hover:text-orange"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#062D4F]/60">
              {t("footer.services")}
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              {services.map(([s]: [string, string]) => (
                <li key={s}>
                  <a
                    href="/#services"
                    className="transition-colors hover:text-orange"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#062D4F]/60">
              {t("footer.contact")}
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-orange" />
                Muscat, Oman
              </li>

              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange shrink-0" />
                <a
                  href="tel:+96891909331"
                  dir="ltr"
                  style={{ unicodeBidi: "isolate" }}
                  className="transition-colors hover:text-orange"
                >
                  +968 9190 9331
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange shrink-0" />
                <a href="mailto:baharalsuwaihara@gmail.com" className="break-all transition-colors hover:text-orange">
                  baharalsuwaihara@gmail.com
                </a>
              </li>
            </ul>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:border-orange"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-black sm:flex-row">
          <div>
            © {new Date().getFullYear()} SUHAR Advertising.{" "}
            {t("footer.rights")}
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-orange">
              {t("footer.privacy")}
            </a>

            <a href="#" className="hover:text-orange">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}