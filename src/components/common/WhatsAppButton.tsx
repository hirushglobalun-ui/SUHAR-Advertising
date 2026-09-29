"use client";

import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const { lang } = useLang();

  // Do not show floating button inside admin console
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isArabic = lang === "ar";
  const whatsappUrl = "https://wa.me/96891909331";


  return (
    <div
      className={`fixed bottom-6 z-50 flex items-center transition-all duration-300 ${
        isArabic ? "left-6 sm:left-8" : "right-6 sm:right-8"
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isArabic ? "تواصل معنا عبر واتساب" : "WhatsApp"}
        className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 hover:bg-[#20ba59] hover:shadow-xl hover:shadow-[#25D366]/50 active:scale-95"
      >
        {/* Subtle breathing pulse ring */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 sm:h-9 sm:w-9 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12.01 2.008c-5.518 0-9.998 4.48-9.998 9.998 0 1.763.459 3.479 1.332 5.006L2 22.008l5.129-1.313a9.96 9.96 0 0 0 4.881 1.311h.004c5.518 0 9.998-4.48 9.998-9.998 0-5.518-4.48-9.998-9.998-9.998zm0 18.283a8.28 8.28 0 0 1-4.223-1.155l-.303-.18-3.14.805.837-3.06-.198-.315a8.29 8.29 0 0 1-1.271-4.382c0-4.57 3.719-8.289 8.298-8.289 4.58 0 8.298 3.719 8.298 8.289 0 4.57-3.718 8.289-8.297 8.289zm4.542-6.208c-.249-.125-1.474-.727-1.703-.81-.228-.083-.395-.125-.561.125-.166.249-.644.81-.789.976-.145.166-.291.187-.54.062-.249-.125-1.052-.388-2.003-1.236-.74-.66-1.24-1.476-1.385-1.725-.145-.249-.016-.384.108-.508.112-.112.249-.291.374-.436.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.436-.062-.125-.561-1.35-.769-1.85-.202-.487-.407-.42-.561-.428-.145-.007-.311-.008-.477-.008-.166 0-.436.062-.664.311-.228.249-.872.852-.872 2.077 0 1.225.893 2.41 1.018 2.576.125.166 1.756 2.682 4.254 3.762.595.257 1.059.41 1.422.526.598.19 1.142.163 1.572.099.479-.072 1.474-.602 1.682-1.184.208-.582.208-1.08.145-1.184-.062-.104-.228-.166-.477-.291z" />
        </svg>
      </a>
    </div>
  );
}
