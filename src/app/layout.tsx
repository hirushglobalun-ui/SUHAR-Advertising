import type { Metadata } from "next";
import { ReactNode } from "react";
import "../styles.css";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "SUHAR Advertising — Branding, Signage & Print in Oman",
  description: "SUHAR Advertising is a premium branding, signage, printing and fabrication studio serving leading brands across the Sultanate of Oman.",
  openGraph: {
    title: "SUHAR Advertising — Branding & Signage in Oman",
    description: "Corporate branding, LED signage, digital printing and creative fabrication — bringing brands to life across Oman.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=Tajawal:wght@400;500;700;800&family=Cairo:wght@500;700;800&display=swap"
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
