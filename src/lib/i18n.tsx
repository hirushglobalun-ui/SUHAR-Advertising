"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (path: string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export const dict = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      portfolio: "Works",
      about: "About",
      process: "Process",
      contact: "Contact",
      quote: "Request a Quote",
    },
    hero: {
      eyebrow: "ESTABLISHED 1996 · BAHAR AL-SUWAIHARA",
      title: "Turning Ideas Into Visible Impact",
      subtitle:
        "Combining creativity, craftsmanship, and modern technology since 1996 to deliver high-standard branding, signage, printing, and visual communication solutions across Oman.",
      cta1: "Request a Quote",
      cta2: "View Works",
      scroll: "Scroll to explore",
      motto: "“We Provide the Best”",
    },
    intro: {
      eyebrow: "About Suhar Advertising",
      title: "Craftsmanship, technology, and coastal heritage since 1996.",
      body:
        "Established in 1996, Suhar Advertising has grown from a printing-focused business into a comprehensive advertising and visual communication company. Inspired by the coastal character of Bahar Al-Suwaihara, the company combines creativity, craftsmanship, technology, and professional service to deliver impactful branding and advertising solutions. With decades of experience and a team of skilled professionals, we work closely with businesses, organizations, and institutions to transform ideas into high-quality visual experiences.",
      cta: "Learn more about us",
      vision:
        "To be a trusted and innovative advertising partner, continuously developing our capabilities and using modern technologies to provide creative, competitive and high-quality visual communication solutions.",
      stats: [
        { v: 1996, s: "", l: "Year Established" },
        { v: 28, s: "+", l: "Years of Craft" },
        { v: 1500, s: "+", l: "Projects Completed" },
        { v: 30, s: "+", l: "Skilled Specialists" },
      ],
    },
    services: {
      eyebrow: "What We Do",
      title: "Comprehensive visual communication & production.",
      subtitle:
        "From high-precision digital printing to architectural 3D signage and laser engraving — executed in-house with modern technology.",
      items: [
        ["Printing & Digital Printing", "Business materials, promotional products, branded merchandise and customized printing."],
        ["Indoor & Outdoor Signage", "Professional signs, building signage, directional signs, advertising boards and displays."],
        ["3D Lettering", "Custom 3D letters, illuminated lettering, stainless steel and premium brand signage."],
        ["Vehicle Graphics", "Vehicle branding, fleet wraps and mobile road advertising solutions."],
        ["Sticker Works", "Frosted glass stickers, promotional stickers, die-cut labels and customized vinyl."],
        ["Laser Engraving & Acrylic Works", "Precision laser cutting, acrylic awards, display cases, nameplates and bespoke items."],
        ["Advertising & Branding", "Complete visual branding systems that help businesses become recognized and memorable."],
      ] as [string, string][],
      more: "Learn more",
    },
    why: {
      eyebrow: "Our Philosophy & Approach",
      title: "“We Provide the Best”",
      subtitle:
        "We believe successful advertising is more than simply producing a design. It is about creating a clear connection between an idea, a brand, and its audience.",
      items: [
        ["Quality", "High-standard materials and professional finishing that withstand the elements."],
        ["Creativity", "Fresh and distinctive visual solutions grounded in brand strategy."],
        ["Innovation", "Modern technology, laser precision, and advanced production techniques."],
        ["Teamwork", "Collaborative execution from initial concept to safe, clean installation."],
        ["Reliability", "Consistent professional service and dependable delivery on tight deadlines."],
        ["Customer Focus", "Tailored solutions engineered specifically to every client's requirements."],
      ] as [string, string][],
    },
    portfolio: {
      eyebrow: "Works",
      title: "Recent projects, across every medium.",
      cats: ["All", "Branding", "Signage", "Printing", "Vehicle", "Exhibition", "LED"],
      items: [
        ["Al-Fanar Tower", "Illuminated Facade Signage", "Signage"],
        ["Muscat Retail Group", "Corporate Identity", "Branding"],
        ["Oman Expo 2025", "Outdoor LED Campaign", "LED"],
        ["Nafith Logistics", "Fleet Vehicle Wrap", "Vehicle"],
        ["Gulf Innovation Expo", "Exhibition Stand", "Exhibition"],
        ["Suhar Corporate Print", "Large Format & Offset Print", "Printing"],
      ] as [string, string, string][],
    },
    process: {
      eyebrow: "How We Work",
      title: "A proven six-step process.",
      steps: [
        ["Consultation", "We listen, ask the right questions, and align on goals."],
        ["Design", "Concepts, mockups and material specs."],
        ["Approval", "Refine together until every detail is right."],
        ["Production", "In-house fabrication and printing."],
        ["Installation", "Certified teams handle safe, clean installation."],
        ["Support", "Ongoing maintenance and warranty coverage."],
      ] as [string, string][],
    },
    industries: {
      eyebrow: "Industries",
      title: "Trusted across every sector.",
      items: [
        "Government",
        "Retail",
        "Healthcare",
        "Hospitality",
        "Education",
        "Corporate",
        "Construction",
        "Manufacturing",
        "Shopping Malls",
        "Restaurants",
      ],
    },
    clients: { title: "Trusted by leading organizations across Oman" },
    testimonials: {
      eyebrow: "Client Voices",
      title: "What our partners say.",
      items: [
        [
          "Ahmed Al-Balushi",
          "Marketing Director, Muscat Retail Group",
          "SUHAR reimagined our entire retail identity — every store now feels unmistakably ours. Craftsmanship is world-class.",
        ],
        [
          "Sara Al-Habsi",
          "CEO, Nafith Logistics",
          "From concept to fleet-wide rollout, the team delivered ahead of schedule. Our vehicles are our best billboards now.",
        ],
        [
          "Khalid Al-Rawahi",
          "GM, Gulf Innovation Expo",
          "Their exhibition build was the talk of the show. Precision, lighting, presence — everything we hoped for.",
        ],
      ] as [string, string, string][],
    },

    contact: {
      eyebrow: "Get in Touch",
      title: "Let's build something remarkable.",
      subtitle:
        "Share a brief and we'll respond within one business day with a proposal and estimate.",
      form: {
        name: "Full name",
        company: "Company",
        email: "Email",
        phone: "Phone",
        service: "Service of interest",
        message: "Tell us about your project",
        submit: "Send Enquiry",
        pickService: "Select a service",
      },
      info: {
        location: "Office Location",
        address: "Muscat, Sultanate of Oman",
        hours: "Business Hours",
        hoursValue: "Sat – Thu · 8:00 AM – 6:00 PM",
        call: "Call us",
        email: "Email us",
        whatsapp: "WhatsApp",
      },
    },
    footer: {
      tagline: "Powerful brand experiences across Oman.",
      links: "Quick Links",
      services: "Services",
      contact: "Contact",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      services: "الخدمات",
      portfolio: "أعمالنا",
      about: "من نحن",
      process: "منهجيتنا",
      contact: "تواصل",
      quote: "اطلب عرض سعر",
    },
    hero: {
      eyebrow: "تأسست عام 1996 · بحر الصويحرة",
      title: "نحوّل الأفكار إلى أثر مرئي ملموس",
      subtitle:
        "منذ عام 1996، نجمع بين الإبداع والحرفية والتكنولوجيا الحديثة لتقديم حلول إعلانية وهوية بصرية متكاملة تترك أثراً مستداماً عبر سلطنة عُمان.",
      cta1: "اطلب عرض سعر",
      cta2: "استعرض الأعمال",
      scroll: "مرّر للاستكشاف",
      motto: "«نقدم الأفضل دائماً»",
    },
    intro: {
      eyebrow: "عن شهار للإعلان",
      title: "حرفية وإبداع وتكنولوجيا متطورة منذ عام 1996.",
      body:
        "تأسست شهار للإعلان عام 1996، وتطورت من نشاط يركز على الطباعة إلى شركة شاملة للدعاية والإعلان والتواصل البصري. مستلهمة من الطابع الساحلي العريق لبحر الصويحرة، تجمع الشركة بين الإبداع والحرفية والتكنولوجيا الحديثة لتقديم حلول إعلانية تصنع فارقاً حقيقياً. نعمل جنباً إلى جنب مع الشركات والمؤسسات لتحويل الأفكار إلى تجارب بصرية رفيعة المستوى.",
      cta: "تعرّف علينا أكثر",
      vision:
        "أن نكون الشريك الإعلاني الأكثر موثوقية وابتكاراً، عبر التطوير المستمر لقدراتنا واستخدام أحدث التقنيات لتقديم حلول تواصل بصري إبداعية وتنافسية وعالية الجودة.",
      stats: [
        { v: 1996, s: "", l: "سنة التأسيس" },
        { v: 28, s: "+", l: "عاماً من الحرفية" },
        { v: 1500, s: "+", l: "مشروع منجز" },
        { v: 30, s: "+", l: "فريق خبير ومتخصص" },
      ],
    },
    services: {
      eyebrow: "ما نقدّمه",
      title: "حلول تواصل بصري وإنتاج إعلاني متكامل.",
      subtitle:
        "من الطباعة الرقمية واللافتات ثلاثية الأبعاد إلى الحفر بالليزر — تصنيع وتنفيذ احترافي بأحدث التقنيات.",
      items: [
        ["الطباعة والطباعة الرقمية", "المطبوعات التجارية، المنتجات الترويجية، والهدايا الدعائية المخصصة."],
        ["اللافتات الداخلية والخارجية", "لوحات المباني، اللافتات الإرشادية، اللوحات الإعلانية وشاشات العرض."],
        ["الحروف ثلاثية الأبعاد 3D", "حروف بارزة مخصصة، إضاءات ليد، وحروف استانلس ستيل معمارية."],
        ["رسومات وتجليد المركبات", "تجليد أساطيل الشركات وحلول الإعلانات المتحركة على الطرق."],
        ["أعمال الاستيكر", "استيكر رملي ومثلج للمكاتب، ملصقات دعائية، وتطبيقات فينيل مخصصة."],
        ["الحفر بالليزر وأعمال الأكريليك", "حفر ونقش فائق الدقة، دروع تكريمية، لوحات أسماء، ومجسمات مخصصة."],
        ["الدعاية والإعلان والهوية", "حلول هوية بصرية شاملة تعزز مكانة علامتك التجارية وتزيد تميزها."],
      ] as [string, string][],
      more: "المزيد",
    },
    why: {
      eyebrow: "فلسفتنا ومنهجيتنا",
      title: "«نقدم الأفضل دائماً»",
      subtitle:
        "نؤمن بأن الإعلان الناجح ليس مجرد تنفيذ تصميم؛ بل هو صناعة صلة ورابط واضح بين الفكرة والعلامة التجارية وجمهورها.",
      items: [
        ["الجودة", "خامات عالية المعايير وتشطيبات احترافية تدوم وتقاوم العوامل الجوية."],
        ["الإبداع", "حلول بصرية مبتكرة ومتميزة مبنية على استراتيجية واضحة للعلامة."],
        ["الابتكار", "أحدث تقنيات الطباعة والحفر بالليزر ومعدات الإنتاج المتطورة."],
        ["العمل الجماعي", "تنفيذ تشاركي متقن من وضع الفكرة والتصميم وحتى التركيب النهائي."],
        ["الموثوقية", "التزام صارم بالمواعيد وخدمة احترافية يُعتمد عليها دائماً."],
        ["التركيز على العميل", "حلول مخصصة تُصمم بدقة لتلائم متطلبات وأهداف كل عميل."],
      ] as [string, string][],
    },
    portfolio: {
      eyebrow: "مختارات من أعمالنا",
      title: "مشاريع حديثة عبر كل الوسائط.",
      cats: ["الكل", "الهوية", "اللافتات", "الطباعة", "المركبات", "المعارض", "LED"],
      items: [
        ["برج الفنار", "لافتة واجهة مضيئة", "اللافتات"],
        ["مجموعة مسقط للتجزئة", "الهوية المؤسسية", "الهوية"],
        ["إكسبو عُمان 2025", "حملة LED خارجية", "LED"],
        ["نافذ للوجستيات", "هوية أسطول المركبات", "المركبات"],
        ["معرض الخليج للابتكار", "ستاند معرض", "المعارض"],
        ["مطبوعات شهار المؤسسية", "طباعة أوفست وطباعة واسعة النطاق", "الطباعة"],
      ] as [string, string, string][],
    },
    process: {
      eyebrow: "منهجيتنا",
      title: "ست خطوات مجرّبة.",
      steps: [
        ["الاستشارة", "نصغي، نسأل، ونتوافق على الأهداف."],
        ["التصميم", "مفاهيم ونماذج ومواصفات المواد."],
        ["الاعتماد", "نصقل معاً حتى تُضبط كل التفاصيل."],
        ["الإنتاج", "تصنيع وطباعة داخل مصانعنا."],
        ["التركيب", "فرق معتمدة للتركيب الآمن والنظيف."],
        ["الدعم", "صيانة مستمرة وتغطية ضمان."],
      ] as [string, string][],
    },
    industries: {
      eyebrow: "القطاعات",
      title: "شركاء موثوقون لكل قطاع.",
      items: [
        "الحكومي",
        "التجزئة",
        "الرعاية الصحية",
        "الضيافة",
        "التعليم",
        "الشركات",
        "الإنشاءات",
        "التصنيع",
        "المجمعات التجارية",
        "المطاعم",
      ],
    },
    clients: { title: "موثوق به من كبرى المؤسسات في السلطنة" },
    testimonials: {
      eyebrow: "آراء عملائنا",
      title: "ماذا يقول شركاؤنا.",
      items: [
        [
          "أحمد البلوشي",
          "مدير التسويق، مجموعة مسقط للتجزئة",
          "أعاد شهار تخيّل هويتنا بالكامل — كل فرع أصبح يعبّر عنّا بوضوح. حرفية عالمية المستوى.",
        ],
        [
          "سارة الحبسية",
          "الرئيس التنفيذي، نافذ للوجستيات",
          "من الفكرة إلى تجهيز الأسطول، سلّم الفريق قبل الموعد. مركباتنا أصبحت أفضل لوحاتنا.",
        ],
        [
          "خالد الرواحي",
          "المدير العام، معرض الخليج للابتكار",
          "ستاندنا كان حديث المعرض. دقّة وإضاءة وحضور — تماماً كما تمنّينا.",
        ],
      ] as [string, string, string][],
    },

    contact: {
      eyebrow: "تواصل معنا",
      title: "لنصنع شيئاً استثنائياً معاً.",
      subtitle: "شاركنا موجزاً وسنعود إليك خلال يوم عمل بعرض ومقترح.",
      form: {
        name: "الاسم الكامل",
        company: "الشركة",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        service: "الخدمة المطلوبة",
        message: "أخبرنا عن مشروعك",
        submit: "إرسال الطلب",
        pickService: "اختر خدمة",
      },
      info: {
        location: "موقع المكتب",
        address: "مسقط، سلطنة عُمان",
        hours: "أوقات العمل",
        hoursValue: "السبت – الخميس · 8:00 صباحاً – 6:00 مساءً",
        call: "اتصل بنا",
        email: "راسلنا",
        whatsapp: "واتساب",
      },
    },
    footer: {
      tagline: "تجارب علامات تجارية مؤثرة في عُمان.",
      links: "روابط سريعة",
      services: "الخدمات",
      contact: "التواصل",
      rights: "جميع الحقوق محفوظة.",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
    },
  },
} as const;

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value: Ctx = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    setLang: setLangState,
    t: (path: string) => {
      const parts = path.split(".");
      let cur: unknown = dict[lang];
      for (const p of parts) {
        if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
          cur = (cur as Record<string, unknown>)[p];
        } else return path;
      }
      return typeof cur === "string" ? cur : path;
    },
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang outside provider");
  return ctx;
}

export function useT<T = unknown>(path: string): T {
  const { lang } = useLang();
  const parts = path.split(".");
  let cur: unknown = dict[lang];
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else return path as T;
  }
  return cur as T;
}
