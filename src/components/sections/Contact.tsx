"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import Field from "@/components/common/Field";
import { useLang, useT } from "@/lib/i18n";

export default function Contact() {
  const { t, lang } = useLang();
  const services = useT<[string, string][]>("services.items");
  const [sent, setSent] = useState(false);

  const isArabic = lang === "ar";

  return (
    <section id="contact" className="relative bg-navy py-14 text-white lg:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] grid-lines" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                {t("contact.eyebrow")}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-3 sm:mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {t("contact.title")}
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/70">
                {t("contact.subtitle")}
              </p>
            </Reveal>

            <div className="mt-6 space-y-3 sm:space-y-4">
              {[
                {
                  icon: MapPin,
                  label: t("contact.info.location"),
                  value: t("contact.info.address"),
                },
                {
                  icon: Clock,
                  label: t("contact.info.hours"),
                  value: t("contact.info.hoursValue"),
                  ltr: true,
                },
                {
                  icon: Phone,
                  label: t("contact.info.call"),
                  value: "+968 9190 9331",
                  href: "tel:+96891909331",
                  ltr: true,
                },
                {
                  icon: Mail,
                  label: t("contact.info.email"),
                  value: "baharalsuwaihara@gmail.com",
                  href: "mailto:baharalsuwaihara@gmail.com",
                  ltr: true,
                },
              ].map((c, i) => (
                <Reveal key={i} delay={220 + i * 60}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:border-orange/50 hover:bg-white/[0.08]"
                    >
                      <div className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-orange text-white transition-transform duration-300 group-hover:scale-105">
                        <c.icon className="h-5 w-5" />
                      </div>

                      <div
                        className={`min-w-0 flex-1 ${isArabic ? "text-right" : ""
                          }`}
                      >
                        <div className="text-[11px] uppercase tracking-wider text-white/50">
                          {c.label}
                        </div>

                        <div
                          className="truncate text-xs sm:text-sm font-semibold text-white transition-colors group-hover:text-orange"
                          {...(c.ltr
                            ? { dir: "ltr", lang: "en" }
                            : {})}
                        >
                          {c.value}
                        </div>
                      </div>

                      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange rtl:rotate-[-90deg]" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4 backdrop-blur-sm">
                      <div className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-orange text-white">
                        <c.icon className="h-5 w-5" />
                      </div>

                      <div
                        className={`min-w-0 ${isArabic ? "text-right" : ""
                          }`}
                      >
                        <div className="text-[11px] uppercase tracking-wider text-white/50">
                          {c.label}
                        </div>

                        <div
                          className="text-xs sm:text-sm font-semibold text-white"
                          {...(c.ltr
                            ? { dir: "ltr", lang: "en" }
                            : {})}
                        >
                          {c.value}
                        </div>
                      </div>
                    </div>
                  )}
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
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-8 backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("contact.form.name")} name="name" required />
                <Field label={t("contact.form.company")} name="company" />

                <Field
                  label={t("contact.form.email")}
                  name="email"
                  type="email"
                  required
                />

                <Field
                  label={t("contact.form.phone")}
                  name="phone"
                  type="tel"
                />

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
                    {t("contact.form.service")}
                  </label>

                  <select
                    name="service"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base sm:text-sm text-white outline-none transition-all focus:border-orange/60"
                    defaultValue=""
                  >
                    <option
                      value=""
                      disabled
                      className="bg-navy"
                    >
                      {t("contact.form.pickService")}
                    </option>

                    {services.map(([s]) => (
                      <option
                        key={s}
                        value={s}
                        className="bg-navy"
                      >
                        {s}
                      </option>
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
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base sm:text-sm text-white outline-none transition-all focus:border-orange/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_-15px_rgba(249,115,22,0.6)] transition-all hover:bg-orange/90 hover:translate-y-[-2px]"
              >
                {sent ? (
                  <>
                    <Check className="h-4 w-4" />
                    Sent — we&apos;ll be in touch
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