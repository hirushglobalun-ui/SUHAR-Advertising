import { p1, p2, p3, p4, p5, p6 } from "./data";

export interface ProjectDetail {
  slug: string;
  title: {
    en: string;
    ar: string;
  };
  subtitle: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  client: {
    en: string;
    ar: string;
  };
  year: string;
  location: {
    en: string;
    ar: string;
  };
  deliverables: {
    en: string[];
    ar: string[];
  };
  overview: {
    en: string;
    ar: string;
  };
  challenge: {
    en: string;
    ar: string;
  };
  solution: {
    en: string;
    ar: string;
  };
  impact: {
    en: string[];
    ar: string[];
  };
  mainImage: any;
  gallery: any[];
}

export const projectsData: ProjectDetail[] = [
  {
    slug: "al-fanar-tower",
    title: {
      en: "Al-Fanar Tower",
      ar: "برج الفنار",
    },
    subtitle: {
      en: "Illuminated Facade Signage & Architectural Letters",
      ar: "لافتة واجهة مضيئة وحروف معمارية بارزة",
    },
    category: {
      en: "Signage",
      ar: "اللافتات",
    },
    client: {
      en: "Al-Fanar Real Estate & Commercial Complex",
      ar: "مجمع الفنار العقاري والتجاري",
    },
    year: "2024",
    location: {
      en: "Muscat, Sultanate of Oman",
      ar: "مسقط، سلطنة عُمان",
    },
    deliverables: {
      en: [
        "Architectural 3D Stainless Steel Lettering",
        "Weatherproof High-Output LED Modules",
        "High-Altitude Structural Installation",
        "Energy-Efficient Day/Night Auto Sensor",
      ],
      ar: [
        "حروف استانلس ستيل معمارية ثلاثية الأبعاد",
        "وحدات ليد عالية الكفاءة ومقاومة للطقس",
        "تركيب هندسي آمن على الارتفاعات العالية",
        "حساسات إضاءة ذكية وموفرة للطاقة ليل نهار",
      ],
    },
    overview: {
      en: "Suhar Advertising was commissioned to design, engineer, fabricate, and install a monumental illuminated facade signage system for Al-Fanar Tower. Situated along one of Muscat's busiest arterial thoroughfares, the project required bold visual prestige that remained crystal clear in direct sunlight and radiated brilliant illumination through the night.",
      ar: "تم تكليف شركة شهار للإعلان بتصميم وهندسة وتصنيع وتركيب نظام لافتات واجهة ضخم ومضيء لبرج الفنار. يقع البرج على أحد أكثر المحاور المرورية حيوية في مسقط، وتطلب المشروع حضوراً بصرياً فخماً يظهر بوضوح تحت أشعة الشمس المباشرة ويتألق بإضاءة ساطعة طوال الليل.",
    },
    challenge: {
      en: "Coastal humidity, intense solar heat, and high wind loads at tower elevation presented stringent durability and weight demands. The lettering required architectural-grade materials that would maintain lustrous polish without corrosion or color fading.",
      ar: "فرضت الرطوبة الساحلية والحرارة العالية والرياح على ارتفاعات البرج معايير صارمة للمتانة ومقاومة التآكل، وتطلبت الحروف خامات معمارية رفيعة المستوى تحافظ على بريقها وجمالها دون بهتان.",
    },
    solution: {
      en: "We utilized precision laser-cut marine-grade stainless steel with internal reinforced subframes and IP68-rated sealed LED clusters. Our certified installation team executed the mounting safely using precision crane rigs, ensuring seamless structural anchorage and flawless electrical routing.",
      ar: "استخدمنا الفولاذ المقاوم للصدأ البحري المقطوع بالليزر عالي الدقة مع هياكل داخلية مدعمة ووحدات ليد معزولة بمعيار IP68. قام فريق التركيب المعتمد بتنفيذ العمل بأعلى معايير السلامة لضمان التثبيت الهندسي المثالي.",
    },
    impact: {
      en: [
        "100% weather-tested resistance across extreme summer temperatures",
        "Visible from over 1.2 kilometers along the highway corridor",
        "Over 40% reduction in lighting energy consumption using custom LED drivers",
      ],
      ar: [
        "مقاومة 100% لاختبارات الطقس والحرارة الشديدة",
        "رؤية واضحة ومميزة من مسافة تزيد عن 1.2 كيلومتر",
        "توفير أكثر من 40% من استهلاك طاقة الإضاءة باستخدام محولات ذكية",
      ],
    },
    mainImage: p1,
    gallery: [p1, p6, p3],
  },
  {
    slug: "muscat-retail-group",
    title: {
      en: "Muscat Retail Group",
      ar: "مجموعة مسقط للتجزئة",
    },
    subtitle: {
      en: "Corporate Identity & Environmental Workspace Branding",
      ar: "الهوية المؤسسية وهوية المساحات وبيئات العمل",
    },
    category: {
      en: "Branding",
      ar: "الهوية",
    },
    client: {
      en: "Muscat Retail Holding",
      ar: "مجموعة مسقط القابضة للتجزئة",
    },
    year: "2024",
    location: {
      en: "Sohar & Muscat, Oman",
      ar: "صحار ومسقط، عُمان",
    },
    deliverables: {
      en: [
        "Comprehensive Brand Guidelines",
        "Executive Stationery & Foiled Collateral",
        "Interior Office Wayfinding & Acoustic Wall Graphics",
        "Retail Storefront Visual Identity",
      ],
      ar: [
        "دليل متكامل لمعايير الهوية البصرية",
        "مطبوعات مكتبية فاخرة وتقنيات البصمة الذهبية",
        "أنظمة إرشاد داخلية وجرافيك جداري",
        "هوية واجهات المتاجر وفروع التجزئة",
      ],
    },
    overview: {
      en: "Muscat Retail Group needed a unified, modern corporate identity that reflected their growth and commitment to premium customer experiences. Suhar Advertising delivered an end-to-end branding overhaul, harmonizing stationery, digital assets, interior workspace environments, and retail points of sale.",
      ar: "احتاجت مجموعة مسقط للتجزئة إلى هوية مؤسسية موحدة وعصرية تعكس نموها المستمر والتزامها بتقديم تجارب تسوق راقية. قدمت شهار للإعلان هوية متكاملة شملت المطبوعات، المساحات الداخلية، ونقاط البيع المختلفة.",
    },
    challenge: {
      en: "Aligning multiple sub-brands across disparate retail sectors under a single, coherent design system while preserving brand recall across physical and digital touchpoints.",
      ar: "توحيد عدة علامات تجارية فرعية تحت نظام تصميمي واحد ومتناسق مع الحفاظ على تميز كل قطاع في جميع نقاط الاتصال.",
    },
    solution: {
      en: "We developed a modular design language inspired by warm Omani geometry, executed across embossed print collateral, frosted privacy graphics, acrylic interior signage, and sleek executive merchandise.",
      ar: "قمنا بتطوير لغة تصميمية حديثة مستوحاة من التراث العُماني الأنيق، وطبقناها عبر مطبوعات بارزة، لافتات أكريليك داخلية، ومواد تسويقية فاخرة.",
    },
    impact: {
      en: [
        "Unified visual presence across 12 retail locations",
        "Brand recognition increased by 65% in post-launch consumer surveys",
        "Awarded best regional retail visual identity",
      ],
      ar: [
        "توحيد الهوية البصرية عبر 12 متجراً وفرعاً للتجزئة",
        "ارتفاع نسبة التعرف على العلامة بنسبة 65% في استطلاعات الرأي",
        "حصول الهوية على إشادة واسعة في قطاع التجزئة الإقليمي",
      ],
    },
    mainImage: p2,
    gallery: [p2, p6, p1],
  },
  {
    slug: "oman-expo-2025",
    title: {
      en: "Oman Expo 2025",
      ar: "إكسبو عُمان 2025",
    },
    subtitle: {
      en: "Outdoor LED Campaign & Dynamic Digital Displays",
      ar: "حملة شاشات LED خارجية وشاشات رقمية متحركة",
    },
    category: {
      en: "LED",
      ar: "LED",
    },
    client: {
      en: "Oman Tourism & Events Directorate",
      ar: "هيئة الفعاليات والسياحة العُمانية",
    },
    year: "2025",
    location: {
      en: "Muscat Expressway & Exhibition Centre",
      ar: "طريق مسقط السريع ومركز المؤتمرات",
    },
    deliverables: {
      en: [
        "P6 Ultra-Bright Outdoor LED Screen Systems",
        "Dynamic Content Automation & Scheduling",
        "Thermal Management & Weatherproof Enclosures",
        "Roadside Giant Billboard Calibration",
      ],
      ar: [
        "شاشات LED خارجية فائقة السطوع P6",
        "برمجة وجدولة المحتوى الرقمي الديناميكي",
        "أنظمة تبريد وحماية عازلة للغبار والرطوبة",
        "معايرة شاشات الطرق السريعة العملاقة",
      ],
    },
    overview: {
      en: "For the landmark Oman Expo 2025 promotional campaign, Suhar Advertising engineered and deployed large-scale outdoor LED digital screens that captured the attention of millions of commuters and visitors across Muscat's key transit hubs.",
      ar: "ضمن الحملة الترويجية الكبرى لإكسبو عُمان 2025، قامت شركة شهار للإعلان بتجهيز وتركيب شاشات LED رقمية عملاقة جذبت أنظار ملايين المسافرين والزوار عبر المحاور الرئيسية في مسقط.",
    },
    challenge: {
      en: "Ensuring 24/7 crystal-clear visibility under blinding midday Arabian sunlight and extreme ambient temperatures while maintaining fluid video playback and remote content synchronization.",
      ar: "ضمان وضوح الشاشات على مدار 24 ساعة تحت أشعة الشمس الساطعة والحرارة الشديدة، مع استقرار بث الفيديو والتحديث الفوري للمحتوى.",
    },
    solution: {
      en: "We deployed 7,500-nit high-refresh rate LED panels with automated ambient light sensors and dual-circuit climate cooling, controlled via secure cloud-based content servers.",
      ar: "استخدمنا لوحات ليد بسطوع 7,500 شمعة مع حساسات إضاءة محيطية وتبريد داخلي مزدوج يتم التحكم فيها سحابياً عن بُعد.",
    },
    impact: {
      en: [
        "Estimated 3.4M+ monthly visual impressions",
        "Zero downtime recorded throughout the 90-day peak launch period",
        "Dynamic scheduling permitted real-time event updates and multi-sponsor slots",
      ],
      ar: [
        "أكثر من 3.4 مليون مشاهدة وانطباع بصري شهرياً",
        "تشغيل متواصل بنسبة 100% دون أي توقف طوال فترة الإطلاق",
        "مرونة البث اللحظي للفعاليات والجهات الراعية",
      ],
    },
    mainImage: p3,
    gallery: [p3, p1, p5],
  },
  {
    slug: "nafith-logistics",
    title: {
      en: "Nafith Logistics",
      ar: "نافذ للوجستيات",
    },
    subtitle: {
      en: "Commercial Fleet Vehicle Wraps & Mobile Branding",
      ar: "تجليد أسطول المركبات وحلول الهوية المتحركة",
    },
    category: {
      en: "Vehicle",
      ar: "المركبات",
    },
    client: {
      en: "Nafith Logistics Oman",
      ar: "شركة نافذ للخدمات اللوجستية",
    },
    year: "2024",
    location: {
      en: "Sohar Industrial Port & National Fleet",
      ar: "ميناء صحار وأسطول الشاحنات الوطني",
    },
    deliverables: {
      en: [
        "Full Commercial Van Vinyl Wrapping",
        "UV-Resistant Protective Overlaminate",
        "High-Visibility Reflective Safety Markings",
        "Rapid Fleet Turnaround (35+ Vehicles)",
      ],
      ar: [
        "تجليد كامل لشاحنات وفانات النقل التجاري",
        "طبقة حماية عازلة للأشعة فوق البنفسجية والخدوش",
        "علامات فسفورية عاكسة للسلامة على الطرق",
        "تسليم قياسي سريع لأسطول يضم أكثر من 35 مركبة",
      ],
    },
    overview: {
      en: "Transforming everyday delivery vans and heavy haulers into mobile high-impact brand ambassadors. Nafith Logistics entrusted Suhar Advertising with the full branding of their cross-border fleet operating throughout the Sultanate.",
      ar: "تحويل أسطول النقل اليومي إلى سفراء متحركين للعلامة التجارية على كافة طرق السلطنة. وثقت شركة نافذ بشهار للإعلان لتجليد وحماية أسطولها الكامل بجودة عالية.",
    },
    challenge: {
      en: "Fleet vehicles are subjected to harsh desert sandstorms, highway stone chipping, and frequent industrial pressure washing, demanding an uncompromising bond and UV stability.",
      ar: "تتعرض مركبات الأسطول للعواصف الرملية وحصى الطرق والغسيل الصناعي المتكرر، مما تطلب فينيل عالي الجودة مع طبقات حماية فائقة الالتصاق.",
    },
    solution: {
      en: "We utilized premium cast vinyl with micro-air release technology and high-gloss cast overlaminate, applied in our climate-controlled application bays by master wrap technicians.",
      ar: "استخدمنا أفضل أنواع الفينيل المصبوب المخصص للسيارات مع قنوات تصريف الهواء وطبقة حماية لمعان عالية تم تطبيقها في ورشنا المتخصصة.",
    },
    impact: {
      en: [
        "35+ vehicles completed within tight 14-day operational schedule",
        "5-year color vibrancy and peel-free durability warranty",
        "Enhanced brand recall across all major logistics routes in Oman",
      ],
      ar: [
        "إنجاز أكثر من 35 مركبة في جدول زمني قياسي خلال 14 يوماً فقط",
        "ضمان شامل لمدة 5 سنوات لثبات الألوان وعدم التقشر",
        "حضور بصري قوي ومؤثر على جميع الطرق اللوجستية الرئيسية",
      ],
    },
    mainImage: p4,
    gallery: [p4, p1, p2],
  },
  {
    slug: "gulf-innovation-expo",
    title: {
      en: "Gulf Innovation Expo",
      ar: "معرض الخليج للابتكار",
    },
    subtitle: {
      en: "Bespoke Exhibition Stand & Custom Display Architecture",
      ar: "ستاند معرض مخصص وتصميم أجنحة عرض استثنائية",
    },
    category: {
      en: "Exhibition",
      ar: "المعارض",
    },
    client: {
      en: "Gulf Innovation Summit",
      ar: "قمة الابتكار الخليجي",
    },
    year: "2024",
    location: {
      en: "Oman Convention & Exhibition Centre (OCEC)",
      ar: "مركز عُمان للمؤتمرات والمعارض (OCEC)",
    },
    deliverables: {
      en: [
        "Custom 120m² Island Exhibition Stand Fabrication",
        "Backlit Tension Fabric Walls & 3D Dimensional Logo",
        "Interactive Product Display Podiums & Acrylic Vitrines",
        "Complete On-Site Assembly, Lighting & Tear-Down",
      ],
      ar: [
        "تصنيع جناح عرض مخصص بمساحة 120 متراً مربعاً",
        "جدران قماشية مضيئة وشعارات مجسمة 3D",
        "منصات تفاعلية لعرض المنتجات وفتارينات أكريليك",
        "تركيب وإضاءة احترافية وتفكيك سلس بعد انتهاء المعرض",
      ],
    },
    overview: {
      en: "An immersive, contemporary exhibition environment designed to stop trade show traffic and engage visiting dignitaries. Suhar Advertising handled 3D conceptualization, CNC carpentry, metal framing, graphic print production, and rapid overnight installation.",
      ar: "بيئة عرض تفاعلية ومبتكرة صُممت لتلفت أنظار رواد المعرض والوفود الرسمية. تولت شهار للإعلان التصميم ثلاثي الأبعاد، أعمال النجارة والحدادة بالـ CNC، الطباعة والتركيب الليلي السريع.",
    },
    challenge: {
      en: "Strict venue setup window of only 36 hours before VIP opening, requiring modular prefabricated components that assembled seamlessly without on-site cutting or delays.",
      ar: "مهلة تجهيز محددة بـ 36 ساعة فقط قبل الافتتاح الرسمي للوفود، مما تطلب تصنيعاً مسبقاً فائق الدقة يركب كقطع معيارية متكاملة.",
    },
    solution: {
      en: "Every modular wall and podium was pre-built and dry-fitted in our Suhar fabrication facility before transport to OCEC. Plug-and-play lighting and magnetic tension fabric enabled rapid, dust-free deployment.",
      ar: "تم تصنيع وتركيب الجناح تجريبياً بالكامل في مصنعنا بصحار قبل الشحن للمركز، مع نظام إضاءة ذكي وأقمشة مغناطيسية تم تركيبها بسرعة ونظافة تامة.",
    },
    impact: {
      en: [
        "Awarded 'Best Pavilion Design' at the 2024 Expo Awards",
        "Over 8,000 visitors welcomed during the 3-day exhibition",
        "Modular components cataloged for sustainable re-use at subsequent events",
      ],
      ar: [
        "الفوز بجائزة «أفضل تصميم جناح» في المعرض لعام 2024",
        "استقبال أكثر من 8,000 زائر خلال أيام المعرض الثلاثة",
        "هيكل معياري قابل لإعادة الاستخدام في الفعاليات القادمة",
      ],
    },
    mainImage: p5,
    gallery: [p5, p3, p4],
  },
  {
    slug: "suhar-corporate-print",
    title: {
      en: "Suhar Corporate Print",
      ar: "مطبوعات شهار المؤسسية",
    },
    subtitle: {
      en: "Large Format Printing, Precision Offset & Luxury Finishes",
      ar: "طباعة واسعة النطاق، أوفست عالي الدقة ولمسات فاخرة",
    },
    category: {
      en: "Printing",
      ar: "الطباعة",
    },
    client: {
      en: "Corporate & Government Entities",
      ar: "جهات حكومية ومؤسسات رائدة",
    },
    year: "2024",
    location: {
      en: "Sultanate of Oman",
      ar: "سلطنة عُمان",
    },
    deliverables: {
      en: [
        "Ultra-High Resolution Large Format Canvas & Banners",
        "Precision Offset Annual Reports & Profile Books",
        "Laser Engraving & Embossed Foil Accents",
        "Customized Luxury Presentation Boxes",
      ],
      ar: [
        "طباعة عريضة فائقة الدقة على الكانفاس والبنرات",
        "طباعة أوفست راقية للتقارير السنوية وبروفايل الشركات",
        "حفر بالليزر وبصمة ذهبية وفضية بارزة",
        "علب تقديم فاخرة مخصصة للمناسبات الرسمية",
      ],
    },
    overview: {
      en: "Highlighting Suhar Advertising's core heritage since 1996 in the printing arts. This showcase brings together master offset techniques, high-speed large-format digital roll-to-roll printing, laser etching, and handcrafted luxury binding for Oman's most prestigious organizations.",
      ar: "تجسيد لأصالة وخبرة شهار للإعلان الممتدة منذ عام 1996 في عالم الطباعة. يجمع هذا العمل بين تقنيات الأوفست الدقيقة، الطباعة الرقمية العملاقة، الحفر بالليزر، والتجليد الفاخر لأكبر المؤسسات في عُمان.",
    },
    challenge: {
      en: "Exact Pantone color matching across different substrates (heavy uncoated textured papers, translucent acrylics, metal foils, and vinyl fabrics) with zero color drift.",
      ar: "مطابقة درجات ألوان بانتون بدقة متناهية على خامات متباينة (أوراق قطنية فاخرة، أكريليك، رقائق معدنية، وأقمشة) دون أدنى تفاوت في درجات الألوان.",
    },
    solution: {
      en: "Using spectrophotometer-calibrated press runs and our Japanese high-precision 8-color printing presses, our master printmakers achieved flawless color fidelity and crisp typography.",
      ar: "باستخدام أحدث أجهزة المعايرة الطيفية وماكينات الطباعة اليابانية ثمانية الألوان، حقق خبراؤنا أعلى درجات الدقة اللونية وتفاصيل الطباعة المتقنة.",
    },
    impact: {
      en: [
        "Over 100,000 premium printed collateral pieces delivered with 100% QA pass",
        "Recognized by clients for flawless tactile luxury and durability",
        "Same-day proofing and express delivery capability",
      ],
      ar: [
        "تسليم أكثر من 100,000 مطبوع فاخر بنسبة جودة وضمان 100%",
        "إشادة العملاء باللمسات الفاخرة التي تعكس مكانة مؤسساتهم",
        "إمكانية إنتاج النماذج الأولية والتسليم السريع في نفس اليوم",
      ],
    },
    mainImage: p6,
    gallery: [p6, p2, p1],
  },
];

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projectsData.find((p) => p.slug === slug);
}

export function getAllProjects(): ProjectDetail[] {
  return projectsData;
}
