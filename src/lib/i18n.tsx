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
      portfolio: "Portfolio",
      about: "About",
      process: "Process",
      contact: "Contact",
      quote: "Request a Quote",
    },
    hero: {
      eyebrow: "Advertising · Branding · Signage · Print",
      title: "Creating Powerful Brand Experiences Across Oman",
      subtitle:
        "From corporate branding to large-format signage, digital printing and creative fabrication — we bring ideas to life.",
      cta1: "Request a Quote",
      cta2: "View Portfolio",
      scroll: "Scroll to explore",
    },
    intro: {
      eyebrow: "Our Story",
      title: "A creative studio built for ambitious brands.",
      body:
        "SUHAR Advertising is one of Oman's leading full-service brand and signage studios. For over 15 years we've partnered with governments, retailers and enterprises to craft identities that command attention — and stand the test of time.",
      cta: "Learn more about us",
      stats: [
        { v: 15, s: "+", l: "Years Experience" },
        { v: 500, s: "+", l: "Projects Completed" },
        { v: 200, s: "+", l: "Happy Clients" },
        { v: 25, s: "+", l: "Team Members" },
      ],
    },
    services: {
      eyebrow: "What We Do",
      title: "A complete brand & signage studio.",
      subtitle:
        "Eighteen tightly-integrated services under one roof — from concept to installation.",
      items: [
        ["Corporate Branding", "Identity systems that scale."],
        ["Logo Design", "Marks with meaning and longevity."],
        ["Indoor Signage", "Interior wayfinding & branding."],
        ["Outdoor Signage", "Weatherproof, high-impact displays."],
        ["LED Sign Boards", "Illuminated day-and-night."],
        ["Vehicle Branding", "Fleet wraps that move the brand."],
        ["Digital Printing", "Vivid, large-format output."],
        ["Offset Printing", "Premium finish, precise color."],
        ["Acrylic Signage", "Modern, dimensional signage."],
        ["Stainless Steel Letters", "Architectural-grade lettering."],
        ["Window Graphics", "Frosted, printed, one-way vision."],
        ["Wall Graphics", "Environmental branding at scale."],
        ["Exhibition Displays", "Stands that stop traffic."],
        ["Promotional Gifts", "Merchandise done right."],
        ["Interior Branding", "Immersive workspace identity."],
        ["Wayfinding Systems", "Guide with elegance."],
        ["Safety Signage", "Compliant, clear, durable."],
        ["Installation & Maintenance", "End-to-end delivery."],
      ] as [string, string][],
      more: "Learn more",
    },
    why: {
      eyebrow: "Why SUHAR",
      title: "Built on craft, delivered with care.",
      items: [
        ["Premium Quality", "Materials and finish that outlast the trend cycle."],
        ["Experienced Team", "Designers, fabricators and installers under one roof."],
        ["Fast Delivery", "Tight timelines without compromising standards."],
        ["Creative Solutions", "Ideas grounded in brand strategy."],
        ["Latest Technology", "State-of-the-art printing and fabrication."],
        ["Customized Designs", "Every project tailored to your brief."],
        ["Affordable Pricing", "Fair, transparent quotes — always."],
        ["Excellent Support", "Long-term partnership beyond installation."],
      ] as [string, string][],
    },
    portfolio: {
      eyebrow: "Selected Work",
      title: "Recent projects, across every medium.",
      cats: ["All", "Branding", "Signage", "Printing", "Vehicle", "Exhibition", "LED"],
      items: [
        ["Al-Fanar Tower", "Illuminated Facade Signage", "Signage"],
        ["Muscat Retail Group", "Corporate Identity", "Branding"],
        ["Oman Expo 2025", "Outdoor LED Campaign", "LED"],
        ["Nafith Logistics", "Fleet Vehicle Wrap", "Vehicle"],
        ["Gulf Innovation Expo", "Exhibition Stand", "Exhibition"],
        ["Serene Interiors", "Interior Wall Branding", "Branding"],
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
    stats: {
      title: "Numbers we're proud of.",
      items: [
        [500, "+", "Projects Delivered"],
        [200, "+", "Clients Served"],
        [15, "+", "Years in Oman"],
        [98, "%", "Client Satisfaction"],
      ] as [number, string, string][],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Answers to what clients ask most.",
      items: [
        [
          "Do you handle projects across all of Oman?",
          "Yes. Our teams deliver and install nationwide, from Muscat to Salalah and everywhere in between.",
        ],
        [
          "Can you manage design and fabrication together?",
          "Absolutely. Everything — from concept through installation — is handled in-house by our own teams.",
        ],
        [
          "What is your typical turnaround time?",
          "Most standard signage projects ship within 2–3 weeks. Larger campaigns are scoped during consultation.",
        ],
        [
          "Do you offer maintenance after installation?",
          "Yes. All installations include warranty coverage, and we offer annual maintenance contracts.",
        ],
        [
          "Can you work bilingually in Arabic and English?",
          "Yes — our design team is fully bilingual and produces branding in both scripts natively.",
        ],
      ] as [string, string][],
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
      eyebrow: "إعلان · هوية · لافتات · طباعة",
      title: "نصنع تجارب علامات تجارية مؤثرة في عُمان",
      subtitle:
        "من الهوية المؤسسية إلى اللافتات الكبيرة والطباعة الرقمية والتصنيع الإبداعي — نحوّل الأفكار إلى واقع ملموس.",
      cta1: "اطلب عرض سعر",
      cta2: "استعرض الأعمال",
      scroll: "مرّر للاستكشاف",
    },
    intro: {
      eyebrow: "قصتنا",
      title: "استوديو إبداعي مبني للعلامات الطموحة.",
      body:
        "شهار للإعلان أحد أبرز استوديوهات الهوية واللافتات في السلطنة. لأكثر من خمسة عشر عاماً، شاركنا الجهات الحكومية والشركات في صياغة هويات تلفت الأنظار وتصمد عبر الزمن.",
      cta: "تعرّف علينا أكثر",
      stats: [
        { v: 15, s: "+", l: "سنة خبرة" },
        { v: 500, s: "+", l: "مشروع منجز" },
        { v: 200, s: "+", l: "عميل سعيد" },
        { v: 25, s: "+", l: "عضو في الفريق" },
      ],
    },
    services: {
      eyebrow: "ما نقدّمه",
      title: "استوديو متكامل للعلامة واللافتات.",
      subtitle: "ثمانية عشر خدمة متكاملة تحت سقف واحد — من الفكرة إلى التركيب.",
      items: [
        ["الهوية المؤسسية", "أنظمة هوية قابلة للتوسّع."],
        ["تصميم الشعار", "شعارات ذات معنى وثبات."],
        ["لافتات داخلية", "إرشاد وهوية للمساحات الداخلية."],
        ["لافتات خارجية", "لافتات مقاومة للعوامل بتأثير عالٍ."],
        ["لوحات LED", "إضاءة نهاراً وليلاً."],
        ["هوية المركبات", "أساطيل تحمل العلامة أينما ذهبت."],
        ["طباعة رقمية", "طباعة كبيرة زاهية الألوان."],
        ["طباعة أوفست", "لمسات نهائية دقيقة وألوان راقية."],
        ["لافتات أكريليك", "لافتات عصرية ثلاثية الأبعاد."],
        ["حروف ستانلس ستيل", "حروف بجودة معمارية."],
        ["جرافيك النوافذ", "طباعة، تعتيم، ورؤية أحادية."],
        ["جرافيك الجدران", "هوية بيئية بمقاسات كبيرة."],
        ["ستاندات المعارض", "ستاندات تلفت الأنظار."],
        ["هدايا ترويجية", "منتجات دعائية بذوق."],
        ["الهوية الداخلية", "هوية غامرة لمساحات العمل."],
        ["أنظمة الإرشاد", "توجيه بلمسة أنيقة."],
        ["لافتات السلامة", "متوافقة وواضحة ومتينة."],
        ["التركيب والصيانة", "خدمة شاملة من البداية للنهاية."],
      ] as [string, string][],
      more: "المزيد",
    },
    why: {
      eyebrow: "لماذا شهار",
      title: "حرفية عالية وخدمة متأنية.",
      items: [
        ["جودة راقية", "خامات وتشطيبات تدوم طويلاً."],
        ["فريق خبير", "مصممون وفنّيون تحت سقف واحد."],
        ["تسليم سريع", "التزام بالمواعيد دون تنازل عن الجودة."],
        ["حلول إبداعية", "أفكار مبنية على استراتيجية العلامة."],
        ["أحدث التقنيات", "طباعة وتصنيع بأحدث الأجهزة."],
        ["تصاميم مخصّصة", "كل مشروع مفصّل لاحتياجك."],
        ["أسعار عادلة", "عروض شفافة وواضحة دائماً."],
        ["دعم متميّز", "شراكة طويلة بعد التسليم."],
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
        ["سيرين للتصميم الداخلي", "هوية جدارية داخلية", "الهوية"],
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
    stats: {
      title: "أرقام نفتخر بها.",
      items: [
        [500, "+", "مشروع منجز"],
        [200, "+", "عميل"],
        [15, "+", "سنة في عُمان"],
        [98, "%", "رضا العملاء"],
      ] as [number, string, string][],
    },
    faq: {
      eyebrow: "الأسئلة الشائعة",
      title: "أكثر ما يسأل عنه عملاؤنا.",
      items: [
        [
          "هل تعملون في جميع أنحاء عُمان؟",
          "نعم، نصل ونركّب في جميع محافظات السلطنة من مسقط إلى صلالة.",
        ],
        [
          "هل تتولّون التصميم والتصنيع معاً؟",
          "بالتأكيد — من الفكرة إلى التركيب، كل شيء يُنجز داخلياً بفرقنا.",
        ],
        [
          "ما هي المدة المعتادة للتسليم؟",
          "معظم مشاريع اللافتات القياسية تُسلَّم خلال أسبوعين إلى ثلاثة.",
        ],
        [
          "هل تقدّمون صيانة بعد التركيب؟",
          "نعم، جميع أعمالنا تشمل ضماناً، ونوفّر عقود صيانة سنوية.",
        ],
        [
          "هل تعملون بالعربية والإنجليزية معاً؟",
          "نعم — فريقنا ثنائي اللغة وينتج بالهويتين بشكل احترافي.",
        ],
      ] as [string, string][],
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
