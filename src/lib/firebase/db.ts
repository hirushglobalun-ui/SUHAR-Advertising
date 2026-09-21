import fs from "fs";
import path from "path";
import { isFirebaseConfigured, firestore } from "./config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import type {
  CMSProject,
  Category,
  CMSTestimonial,
  CMSClientLogo,
  CMSSettings,
} from "@/types/cms";
import { translateEnglishToArabic } from "@/lib/translate";
import { getProjectTimestamp } from "@/lib/utils";

// Initial seed data from existing projects and data
const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", slug: "Signage", name_en: "Signage", name_ar: "اللافتات", display_order: 1 },
  { id: "cat-2", slug: "Branding", name_en: "Branding", name_ar: "الهوية", display_order: 2 },
  { id: "cat-3", slug: "LED", name_en: "LED Displays", name_ar: "شاشات LED", display_order: 3 },
  { id: "cat-4", slug: "Vehicle", name_en: "Vehicle Branding", name_ar: "المركبات", display_order: 4 },
  { id: "cat-5", slug: "Exhibition", name_en: "Exhibition & Events", name_ar: "المعارض", display_order: 5 },
  { id: "cat-6", slug: "Printing", name_en: "Printing", name_ar: "الطباعة", display_order: 6 },
  { id: "cat-7", slug: "Acrylic", name_en: "Laser & Acrylic", name_ar: "الأكريليك والليزر", display_order: 7 },
];

const INITIAL_PROJECTS: CMSProject[] = [
  {
    id: "proj-1",
    slug: "al-fanar-tower",
    title_en: "Al-Fanar Tower",
    title_ar: "برج الفنار",
    subtitle_en: "Illuminated Facade Signage & Architectural Letters",
    subtitle_ar: "لافتة واجهة مضيئة وحروف معمارية بارزة",
    category_slug: "Signage",
    client_en: "Al-Fanar Real Estate & Commercial Complex",
    client_ar: "مجمع الفنار العقاري والتجاري",
    year: "2024",
    location_en: "Muscat, Sultanate of Oman",
    location_ar: "مسقط، سلطنة عُمان",
    overview_en:
      "Suhar Advertising was commissioned to design, engineer, fabricate, and install a monumental illuminated facade signage system for Al-Fanar Tower. Situated along one of Muscat's busiest arterial thoroughfares, the project required bold visual prestige that remained crystal clear in direct sunlight and radiated brilliant illumination through the night.",
    overview_ar:
      "تم تكليف شركة شهار للإعلان بتصميم وهندسة وتصنيع وتركيب نظام لافتات واجهة ضخم ومضيء لبرج الفنار. يقع البرج على أحد أكثر المحاور المرورية حيوية في مسقط، وتطلب المشروع حضوراً بصرياً فخماً يظهر بوضوح تحت أشعة الشمس المباشرة ويتألق بإضاءة ساطعة طوال الليل.",
    challenge_en:
      "Coastal humidity, intense solar heat, and high wind loads at tower elevation presented stringent durability and weight demands. The lettering required architectural-grade materials that would maintain lustrous polish without corrosion or color fading.",
    challenge_ar:
      "فرضت الرطوبة الساحلية والحرارة العالية والرياح على ارتفاعات البرج معايير صارمة للمتانة ومقاومة التآكل، وتطلبت الحروف خامات معمارية رفيعة المستوى تحافظ على بريقها وجمالها دون بهتان.",
    solution_en:
      "We utilized precision laser-cut marine-grade stainless steel with internal reinforced subframes and IP68-rated sealed LED clusters. Our certified installation team executed the mounting safely using precision crane rigs, ensuring seamless structural anchorage and flawless electrical routing.",
    solution_ar:
      "استخدمنا الفولاذ المقاوم للصدأ البحري المقطوع بالليزر عالي الدقة مع هياكل داخلية مدعمة ووحدات ليد معزولة بمعيار IP68. قام فريق التركيب المعتمد بتنفيذ العمل بأعلى معايير السلامة لضمان التثبيت الهندسي المثالي.",
    deliverables_en: [
      "Architectural 3D Stainless Steel Lettering",
      "Weatherproof High-Output LED Modules",
      "High-Altitude Structural Installation",
      "Energy-Efficient Day/Night Auto Sensor",
    ],
    deliverables_ar: [
      "حروف استانلس ستيل معمارية ثلاثية الأبعاد",
      "وحدات ليد عالية الكفاءة ومقاومة للطقس",
      "تركيب هندسي آمن على الارتفاعات العالية",
      "حساسات إضاءة ذكية وموفرة للطاقة ليل نهار",
    ],
    impact_en: [
      "100% weather-tested resistance across extreme summer temperatures",
      "Visible from over 1.2 kilometers along the highway corridor",
      "Over 40% reduction in lighting energy consumption using custom LED drivers",
    ],
    impact_ar: [
      "مقاومة 100% لاختبارات الطقس والحرارة الشديدة",
      "رؤية واضحة ومميزة من مسافة تزيد عن 1.2 كيلومتر",
      "توفير أكثر من 40% من استهلاك طاقة الإضاءة باستخدام محولات ذكية",
    ],
    cover_image: "/assets/portfolio-1.jpg",
    gallery: ["/assets/portfolio-1.jpg", "/assets/portfolio-6.jpg", "/assets/portfolio-3.jpg"],
    is_published: true,
    is_featured: true,
    display_order: 1,
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-2",
    slug: "muscat-retail-group",
    title_en: "Muscat Retail Group",
    title_ar: "مجموعة مسقط للتجزئة",
    subtitle_en: "Corporate Identity & Environmental Workspace Branding",
    subtitle_ar: "الهوية المؤسسية وهوية المساحات وبيئات العمل",
    category_slug: "Branding",
    client_en: "Muscat Retail Holding",
    client_ar: "مجموعة مسقط القابضة للتجزئة",
    year: "2024",
    location_en: "Sohar & Muscat, Oman",
    location_ar: "صحار ومسقط، عُمان",
    overview_en:
      "Muscat Retail Group needed a unified, modern corporate identity that reflected their growth and commitment to premium customer experiences. Suhar Advertising delivered an end-to-end branding overhaul, harmonizing stationery, digital assets, interior workspace environments, and retail points of sale.",
    overview_ar:
      "احتاجت مجموعة مسقط للتجزئة إلى هوية مؤسسية موحدة وعصرية تعكس نموها المستمر والتزامها بتقديم تجارب تسوق راقية. قدمت شهار للإعلان هوية متكاملة شملت المطبوعات، المساحات الداخلية، ونقاط البيع المختلفة.",
    challenge_en:
      "Aligning multiple sub-brands across disparate retail sectors under a single, coherent design system while preserving brand recall across physical and digital touchpoints.",
    challenge_ar:
      "توحيد عدة علامات تجارية فرعية تحت نظام تصميمي واحد ومتناسق مع الحفاظ على تميز كل قطاع في جميع نقاط الاتصال.",
    solution_en:
      "We developed a modular design language inspired by warm Omani geometry, executed across embossed print collateral, frosted privacy graphics, acrylic interior signage, and sleek executive merchandise.",
    solution_ar:
      "قمنا بتطوير لغة تصميمية حديثة مستوحاة من التراث العُماني الأنيق، وطبقناها عبر مطبوعات بارزة، لافتات أكريليك داخلية، ومواد تسويقية فاخرة.",
    deliverables_en: [
      "Comprehensive Brand Guidelines",
      "Executive Stationery & Foiled Collateral",
      "Interior Office Wayfinding & Acoustic Wall Graphics",
      "Retail Storefront Visual Identity",
    ],
    deliverables_ar: [
      "دليل متكامل لمعايير الهوية البصرية",
      "مطبوعات مكتبية فاخرة وتقنيات البصمة الذهبية",
      "أنظمة إرشاد داخلية وجرافيك جداري",
      "هوية واجهات المتاجر وفروع التجزئة",
    ],
    impact_en: [
      "Unified visual presence across 12 retail locations",
      "Brand recognition increased by 65% in post-launch consumer surveys",
      "Awarded best regional retail visual identity",
    ],
    impact_ar: [
      "توحيد الهوية البصرية عبر 12 متجراً وفرعاً للتجزئة",
      "ارتفاع نسبة التعرف على العلامة بنسبة 65% في استطلاعات الرأي",
      "حصول الهوية على إشادة واسعة في قطاع التجزئة الإقليمي",
    ],
    cover_image: "/assets/portfolio-2.jpg",
    gallery: ["/assets/portfolio-2.jpg", "/assets/portfolio-6.jpg", "/assets/portfolio-1.jpg"],
    is_published: true,
    is_featured: true,
    display_order: 2,
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-3",
    slug: "oman-expo-2025",
    title_en: "Oman Expo 2025",
    title_ar: "إكسبو عُمان 2025",
    subtitle_en: "Outdoor LED Campaign & Dynamic Digital Displays",
    subtitle_ar: "حملة شاشات LED خارجية وشاشات رقمية متحركة",
    category_slug: "LED",
    client_en: "Oman Tourism & Events Directorate",
    client_ar: "هيئة الفعاليات والسياحة العُمانية",
    year: "2025",
    location_en: "Muscat Expressway & Exhibition Centre",
    location_ar: "طريق مسقط السريع ومركز المؤتمرات",
    overview_en:
      "For the landmark Oman Expo 2025 promotional campaign, Suhar Advertising engineered and deployed large-scale outdoor LED digital screens that captured the attention of millions of commuters and visitors across Muscat's key transit hubs.",
    overview_ar:
      "ضمن الحملة الترويجية الكبرى لإكسبو عُمان 2025، قامت شركة شهار للإعلان بتجهيز وتركيب شاشات LED رقمية عملاقة جذبت أنظار ملايين المسافرين والزوار عبر المحاور الرئيسية في مسقط.",
    challenge_en:
      "Ensuring 24/7 crystal-clear visibility under blinding midday Arabian sunlight and extreme ambient temperatures while maintaining fluid video playback and remote content synchronization.",
    challenge_ar:
      "ضمان وضوح الشاشات على مدار 24 ساعة تحت أشعة الشمس الساطعة والحرارة الشديدة، مع استقرار بث الفيديو والتحديث الفوري للمحتوى.",
    solution_en:
      "We deployed 7,500-nit high-refresh rate LED panels with automated ambient light sensors and dual-circuit climate cooling, controlled via secure cloud-based content servers.",
    solution_ar:
      "استخدمنا لوحات ليد بسطوع 7,500 شمعة مع حساسات إضاءة محيطية وتبريد داخلي مزدوج يتم التحكم فيها سحابياً عن بُعد.",
    deliverables_en: [
      "P6 Ultra-Bright Outdoor LED Screen Systems",
      "Dynamic Content Automation & Scheduling",
      "Thermal Management & Weatherproof Enclosures",
      "Roadside Giant Billboard Calibration",
    ],
    deliverables_ar: [
      "شاشات LED خارجية فائقة السطوع P6",
      "برمجة وجدولة المحتوى الرقمي الديناميكي",
      "أنظمة تبريد وحماية عازلة للغبار والرطوبة",
      "معايرة شاشات الطرق السريعة العملاقة",
    ],
    impact_en: [
      "Estimated 3.4M+ monthly visual impressions",
      "Zero downtime recorded throughout the 90-day peak launch period",
      "Dynamic scheduling permitted real-time event updates and multi-sponsor slots",
    ],
    impact_ar: [
      "أكثر من 3.4 مليون مشاهدة وانطباع بصري شهرياً",
      "تشغيل متواصل بنسبة 100% دون أي توقف طوال فترة الإطلاق",
      "مرونة البث اللحظي للفعاليات والجهات الراعية",
    ],
    cover_image: "/assets/portfolio-3.jpg",
    gallery: ["/assets/portfolio-3.jpg", "/assets/portfolio-1.jpg", "/assets/portfolio-5.jpg"],
    is_published: true,
    is_featured: true,
    display_order: 3,
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-4",
    slug: "nafith-logistics",
    title_en: "Nafith Logistics",
    title_ar: "نافذ للوجستيات",
    subtitle_en: "Commercial Fleet Vehicle Wraps & Mobile Branding",
    subtitle_ar: "تجليد أسطول المركبات التجارية والهوية الإعلانية المتحركة",
    category_slug: "Vehicle",
    client_en: "Nafith Transportation Solutions",
    client_ar: "حلول نافذ للنقل والخدمات اللوجستية",
    year: "2024",
    location_en: "Sultanate of Oman (Nationwide)",
    location_ar: "سلطنة عُمان (كافة المحافظات)",
    overview_en:
      "Transforming a fleet of over 60 commercial transport vehicles into mobile brand beacons across Oman's national highway network.",
    overview_ar:
      "تحويل أسطول يضم أكثر من 60 مركبة نقل تجارية إلى واجهات إعلانية متنقلة تجوب كافة محافظات سلطنة عُمان.",
    challenge_en:
      "High UV exposure and highway gravel impact required ultra-durable vinyl films and precise contour wrapping.",
    challenge_ar:
      "تطلبت الظروف الصحراوية والحرارة الشديدة استخدام أفلام فينيل فائقة المقاومة وعوازل متطورة للأشعة فوق البنفسجية.",
    solution_en:
      "Cast vinyl graphics with ultra-durable matte laminate, applied in dust-controlled bays.",
    solution_ar:
      "تنفيذ تجليد احترافي باستخدام فينيل مصبوب عالي الجودة مع طبقة حماية مطفية مقاومة للخدوش في ورش معزولة.",
    deliverables_en: [
      "Full & Partial Cast Fleet Wraps",
      "Reflective Highway Safety Markings",
      "Scratch-Resistant UV Overlaminate",
    ],
    deliverables_ar: [
      "تجليد كامل وجزئي عالي المتانة",
      "ملصقات فسفورية عاكسة للسلامة",
      "طبقات حماية شفافة عازلة للأشعة",
    ],
    impact_en: [
      "Fleet rollout completed in 18 days",
      "Estimated 120,000 daily road impressions",
    ],
    impact_ar: [
      "إنجاز الأسطول بالكامل خلال 18 يوماً",
      "أكثر من 120 ألف مشاهدة يومية",
    ],
    cover_image: "/assets/portfolio-4.jpg",
    gallery: ["/assets/portfolio-4.jpg", "/assets/portfolio-1.jpg"],
    is_published: true,
    is_featured: false,
    display_order: 4,
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-5",
    slug: "gulf-innovation-expo",
    title_en: "Gulf Innovation Expo",
    title_ar: "معرض الخليج للابتكار",
    subtitle_en: "Interactive Exhibition Pavilion & Illuminated Structures",
    subtitle_ar: "جناح معرض تفاعلي ومجسمات مضيئة مخصصة",
    category_slug: "Exhibition",
    client_en: "Gulf Commerce Council",
    client_ar: "مجلس التجارة الخليجي",
    year: "2024",
    location_en: "Oman Convention & Exhibition Centre (OCEC)",
    location_ar: "مركز عُمان للمؤتمرات والمعارض (OCEC)",
    overview_en:
      "Design, turnkey fabrication, and lighting engineering for a 350 sq. meter flagship pavilion at OCEC.",
    overview_ar:
      "تصميم وتصنيع وتنفيذ جناح متكامل بمساحة 350 متراً مربعاً بأحدث أنظمة الإضاءة والمجسمات ثلاثية الأبعاد.",
    challenge_en:
      "Tight 48-hour build window inside the exhibition hall with complex electrical rigging.",
    challenge_ar:
      "فترة تركيب قصيرة لا تتجاوز 48 ساعة داخل قاعة المعرض مع متطلبات إضاءة وهياكل معقدة.",
    solution_en:
      "Modular CNC-pre-fabricated structural components engineered for rapid assembly and seamless finish.",
    solution_ar:
      "تصنيع هياكل مسبقة التجهيز بتقنيات CNC لضمان سرعة التركيب والدقة المطلقة دون أي فواصل.",
    deliverables_en: [
      "Custom Architectural Pavilion",
      "RGB Dynamic Ambient Illumination",
      "Acrylic Showcase Display Units",
    ],
    deliverables_ar: [
      "جناح معماري فاخر مخصص",
      "إضاءة RGB ديناميكية تفاعلية",
      "منصات عرض أكريليك مخصصة",
    ],
    impact_en: [
      "Rated most visited pavilion of the exhibition",
      "100% on-time delivery before VIP inauguration",
    ],
    impact_ar: [
      "الجناح الأكثر زيارة خلال فترة المعرض",
      "تسليم كامل قبل موعد الافتتاح الرسمي",
    ],
    cover_image: "/assets/portfolio-5.jpg",
    gallery: ["/assets/portfolio-5.jpg", "/assets/portfolio-2.jpg"],
    is_published: true,
    is_featured: false,
    display_order: 5,
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-6",
    slug: "suhar-corporate-print",
    title_en: "Suhar Corporate Print",
    title_ar: "مطبوعات شهار المؤسسية",
    subtitle_en: "High-Volume Precision Offset & Luxury Marketing Collateral",
    subtitle_ar: "طباعة أوفست تجارية ومطبوعات تسويقية فاخرة",
    category_slug: "Printing",
    client_en: "Oman Industrial Consortium",
    client_ar: "المجمع الصناعي العُماني",
    year: "2024",
    location_en: "Sohar Industrial City & Muscat",
    location_ar: "مدينة صحار الصناعية ومسقط",
    overview_en:
      "Delivering over 250,000 units of annual marketing reports, executive brochures, and customized branded stationery.",
    overview_ar:
      "إنتاج أكثر من 250 ألف مطبوعة سنوية تشمل التقارير المالية والكتيبات الفاخرة والمطبوعات المؤسسية.",
    challenge_en:
      "Strict CMYK brand color fidelity across different textured stocks and luxury foiling techniques.",
    challenge_ar:
      "مطابقة درجات الألوان بدقة متناهية عبر خامات ورقية متنوعة مع تقنيات البصمة الذهبية والحرارية.",
    solution_en:
      "Computer-to-plate Heidelberg offset printing with spectrophotometric density control and soft-touch lamination.",
    solution_ar:
      "طباعة أوفست متطورة بنظام ضبط الكثافة اللونية مع طبقات لمس ناعمة وبصمة ذهبية بارزة.",
    deliverables_en: [
      "Executive Annual Report Books",
      "Foil-Stamped Corporate Presentation Kits",
      "Luxury Packaging Boxes",
    ],
    deliverables_ar: [
      "تقارير سنوية مجلدة فاخرة",
      "أطقم تقديم مكتبية بالبصمة الذهبية",
      "علب هدايا وتغليف فاخر",
    ],
    impact_en: [
      "Zero rejection rate across 250,000 units",
      "Delivery completed in phased tranches ahead of schedule",
    ],
    impact_ar: [
      "دقة طباعة 100% دون أي هدر",
      "تسليم كافة الشحنات قبل المواعيد المحددة",
    ],
    cover_image: "/assets/portfolio-6.jpg",
    gallery: ["/assets/portfolio-6.jpg", "/assets/portfolio-1.jpg"],
    is_published: true,
    is_featured: false,
    display_order: 6,
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_TESTIMONIALS: CMSTestimonial[] = [
  {
    id: "test-1",
    person_name_en: "Ahmed Al-Balushi",
    person_name_ar: "أحمد البلوشي",
    designation_en: "Marketing Director",
    designation_ar: "مدير التسويق",
    company_en: "Muscat Retail Group",
    company_ar: "مجموعة مسقط للتجزئة",
    text_en:
      "SUHAR reimagined our entire retail identity — every store now feels unmistakably ours. Craftsmanship is world-class.",
    text_ar:
      "أعاد شهار تخيّل هويتنا بالكامل — كل فرع أصبح يعبّر عنّا بوضوح. حرفية عالمية المستوى.",
    rating: 5,
    is_published: true,
    display_order: 1,
    updated_at: new Date().toISOString(),
  },
  {
    id: "test-2",
    person_name_en: "Sara Al-Habsi",
    person_name_ar: "سارة الحبسية",
    designation_en: "CEO",
    designation_ar: "الرئيس التنفيذي",
    company_en: "Nafith Logistics",
    company_ar: "نافذ للوجستيات",
    text_en:
      "From concept to fleet-wide rollout, the team delivered ahead of schedule. Our vehicles are our best billboards now.",
    text_ar:
      "من الفكرة إلى تجهيز الأسطول، سلّم الفريق قبل الموعد. مركباتنا أصبحت أفضل لوحاتنا.",
    rating: 5,
    is_published: true,
    display_order: 2,
    updated_at: new Date().toISOString(),
  },
  {
    id: "test-3",
    person_name_en: "Khalid Al-Rawahi",
    person_name_ar: "خالد الرواحي",
    designation_en: "General Manager",
    designation_ar: "المدير العام",
    company_en: "Gulf Innovation Expo",
    company_ar: "معرض الخليج للابتكار",
    text_en:
      "Their exhibition build was the talk of the show. Precision, lighting, presence — everything we hoped for.",
    text_ar:
      "ستاندنا كان حديث المعرض. دقّة وإضاءة وحضور — تماماً كما تمنّينا.",
    rating: 5,
    is_published: true,
    display_order: 3,
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_CLIENTS: CMSClientLogo[] = [
  { id: "c-1", name_en: "OMANTEL", name_ar: "عمانتل", logo_url: "", display_order: 1, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-2", name_en: "SHELL", name_ar: "شل", logo_url: "", display_order: 2, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-3", name_en: "BANK MUSCAT", name_ar: "بنك مسقط", logo_url: "", display_order: 3, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-4", name_en: "AL MEERA", name_ar: "الميرة", logo_url: "", display_order: 4, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-5", name_en: "NAWRAS", name_ar: "نورس", logo_url: "", display_order: 5, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-6", name_en: "OQ", name_ar: "أوكيو", logo_url: "", display_order: 6, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-7", name_en: "PDO", name_ar: "شركة تنمية نفط عُمان", logo_url: "", display_order: 7, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-8", name_en: "MAJID", name_ar: "ماجد الفطيم", logo_url: "", display_order: 8, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-9", name_en: "LULU", name_ar: "لولو هايبرماركت", logo_url: "", display_order: 9, is_active: true, updated_at: new Date().toISOString() },
  { id: "c-10", name_en: "OOREDOO", name_ar: "أوريدو", logo_url: "", display_order: 10, is_active: true, updated_at: new Date().toISOString() },
];

interface CMSStoreData {
  categories: Category[];
  projects: CMSProject[];
  testimonials: CMSTestimonial[];
  clients: CMSClientLogo[];
  settings?: CMSSettings;
  deleted_category_ids?: string[];
  deleted_project_ids?: string[];
  deleted_testimonial_ids?: string[];
  deleted_client_ids?: string[];
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "cms-store.json");

function getLocalStore(): CMSStoreData {
  try {
    if (!fs.existsSync(path.dirname(DATA_FILE_PATH))) {
      fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE_PATH)) {
      const initialStore: CMSStoreData = {
        categories: INITIAL_CATEGORIES,
        projects: INITIAL_PROJECTS,
        testimonials: INITIAL_TESTIMONIALS,
        clients: INITIAL_CLIENTS,
        settings: { testimonial_display_count: 3 },
      };

      fs.writeFileSync(
        DATA_FILE_PATH,
        JSON.stringify(initialStore, null, 2),
        "utf8"
      );

      return initialStore;
    }

    const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as CMSStoreData;

    if (!parsed.settings) {
      parsed.settings = { testimonial_display_count: 3 };
    }

    return parsed;
  } catch (err) {
    console.error("Local store error:", err);

    return {
      categories: INITIAL_CATEGORIES,
      projects: INITIAL_PROJECTS,
      testimonials: INITIAL_TESTIMONIALS,
      clients: INITIAL_CLIENTS,
      settings: { testimonial_display_count: 3 },
    };
  }
}

function saveLocalStore(store: CMSStoreData) {
  try {
    if (!fs.existsSync(path.dirname(DATA_FILE_PATH))) {
      fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true });
    }

    fs.writeFileSync(
      DATA_FILE_PATH,
      JSON.stringify(store, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error saving local store:", err);
  }
}

// -------------------------------------------------------------
// PROJECTS / WORKS API
// -------------------------------------------------------------

export async function getCMSProjects(options?: {
  onlyPublished?: boolean;
  categorySlug?: string;
  sortBy?: "display_order" | "newest";
}): Promise<CMSProject[]> {
  const store = getLocalStore();
  const deletedSet = new Set(store.deleted_project_ids || []);
  const map = new Map<string, CMSProject>();

  // 1. Local store items
  for (const p of store.projects) {
    if (
      p &&
      p.id &&
      !deletedSet.has(p.id) &&
      !deletedSet.has(p.slug)
    ) {
      map.set(p.id, p);
    }
  }

  // 2. Merge with Firestore
  if (isFirebaseConfigured() && firestore) {
    try {
      const q = query(
        collection(firestore, "projects"),
        orderBy("display_order", "asc")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        for (const firestoreDoc of snapshot.docs) {
          const remoteP = {
            id: firestoreDoc.id,
            ...firestoreDoc.data(),
          } as CMSProject;

          if (
            !deletedSet.has(remoteP.id) &&
            !deletedSet.has(remoteP.slug)
          ) {
            const localP = map.get(remoteP.id);

            map.set(
              remoteP.id,
              localP ? { ...localP, ...remoteP } : remoteP
            );
          }
        }
      }
    } catch (e) {
      console.warn(
        "Firestore query failed, using local store:",
        e
      );
    }
  }

  let list: CMSProject[] = Array.from(map.values()).map((p) => {
    const ts = getProjectTimestamp(p);

    const isoDate =
      ts > 0
        ? new Date(ts).toISOString()
        : new Date().toISOString();

    return {
      ...p,
      created_at:
        p.created_at ||
        (p as any).createdAt ||
        isoDate,
    };
  });

  // "newest" = created_at DESC
  // default = display_order ASC
  if (options?.sortBy === "newest") {
    list.sort((a, b) => {
      const ta = getProjectTimestamp(a);
      const tb = getProjectTimestamp(b);

      if (tb !== ta) {
        return tb - ta;
      }

      return (
        (a.display_order ?? 999) -
        (b.display_order ?? 999)
      );
    });
  } else {
    list.sort(
      (a, b) =>
        (a.display_order ?? 0) -
        (b.display_order ?? 0)
    );
  }

  if (options?.onlyPublished) {
    list = list.filter((p) => p.is_published);
  }

  if (
    options?.categorySlug &&
    options.categorySlug !== "All" &&
    options.categorySlug !== "الكل"
  ) {
    list = list.filter(
      (p) => p.category_slug === options.categorySlug
    );
  }

  return list;
}

export async function getCMSProjectBySlug(
  slug: string
): Promise<CMSProject | null> {
  const projects = await getCMSProjects();

  return projects.find((p) => p.slug === slug) || null;
}

export async function getCMSProjectById(
  id: string
): Promise<CMSProject | null> {
  const projects = await getCMSProjects();

  return projects.find((p) => p.id === id) || null;
}

export async function saveCMSProject(
  data: Partial<CMSProject> & { id?: string }
): Promise<CMSProject> {
  const store = getLocalStore();
  const now = new Date().toISOString();
  const id = data.id || `proj-${Date.now()}`;

  let existing: CMSProject | undefined = store.projects.find(
    (p) => p.id === id
  );

  if (!existing && isFirebaseConfigured() && firestore) {
    try {
      const snap = await getDoc(
        doc(firestore, "projects", id)
      );

      if (snap.exists()) {
        existing = {
          id: snap.id,
          ...snap.data(),
        } as CMSProject;
      }
    } catch { }
  }

  // Preserve existing slug when editing
  // or generate URL-safe collision-free slug for new project
  let slug = data.slug?.trim() || existing?.slug;

  if (!slug) {
    const baseSlug = (data.title_en || "project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    slug = baseSlug || `project-${id}`;

    const otherProjects = store.projects.filter(
      (p) => p.id !== id
    );

    if (otherProjects.some((p) => p.slug === slug)) {
      slug = `${slug}-${Date.now()
        .toString()
        .slice(-4)}`;
    }
  }

  // Auto-translate only if Arabic was not provided
  // and did not exist previously
  const title_en =
    data.title_en?.trim() ||
    existing?.title_en ||
    "Untitled Project";

  const title_ar =
    data.title_ar?.trim() &&
      data.title_ar !== "مشروع جديد"
      ? data.title_ar
      : existing?.title_ar ||
      (await translateEnglishToArabic(title_en));

  const subtitle_en =
    data.subtitle_en !== undefined
      ? data.subtitle_en.trim()
      : existing?.subtitle_en || "";

  const subtitle_ar =
    data.subtitle_ar?.trim()
      ? data.subtitle_ar
      : existing?.subtitle_ar ||
      (subtitle_en
        ? await translateEnglishToArabic(subtitle_en)
        : "");

  const client_en =
    data.client_en !== undefined
      ? data.client_en.trim()
      : existing?.client_en || "Client";

  const client_ar =
    data.client_ar?.trim() &&
      data.client_ar !== "العميل"
      ? data.client_ar
      : existing?.client_ar ||
      (await translateEnglishToArabic(client_en));

  const location_en =
    data.location_en !== undefined
      ? data.location_en.trim()
      : existing?.location_en || "Muscat, Oman";

  const location_ar =
    data.location_ar?.trim() &&
      data.location_ar !== "مسقط، عُمان"
      ? data.location_ar
      : existing?.location_ar ||
      (await translateEnglishToArabic(location_en));

  const overview_en =
    data.overview_en !== undefined
      ? data.overview_en.trim()
      : existing?.overview_en || "";

  const overview_ar =
    data.overview_ar?.trim()
      ? data.overview_ar
      : existing?.overview_ar ||
      (overview_en
        ? await translateEnglishToArabic(overview_en)
        : "");

  const challenge_en =
    data.challenge_en !== undefined
      ? data.challenge_en.trim()
      : existing?.challenge_en || "";

  const challenge_ar =
    data.challenge_ar?.trim()
      ? data.challenge_ar
      : existing?.challenge_ar ||
      (challenge_en
        ? await translateEnglishToArabic(challenge_en)
        : "");

  const solution_en =
    data.solution_en !== undefined
      ? data.solution_en.trim()
      : existing?.solution_en || "";

  const solution_ar =
    data.solution_ar?.trim()
      ? data.solution_ar
      : existing?.solution_ar ||
      (solution_en
        ? await translateEnglishToArabic(solution_en)
        : "");

  let deliverables_en = Array.isArray(data.deliverables_en)
    ? data.deliverables_en
    : existing?.deliverables_en || [];

  let deliverables_ar =
    Array.isArray(data.deliverables_ar) &&
      data.deliverables_ar.length > 0
      ? data.deliverables_ar
      : existing?.deliverables_ar || [];

  if (
    deliverables_ar.length === 0 &&
    deliverables_en.length > 0
  ) {
    deliverables_ar = await Promise.all(
      deliverables_en.map((d) =>
        translateEnglishToArabic(d)
      )
    );
  }

  let impact_en = Array.isArray(data.impact_en)
    ? data.impact_en
    : existing?.impact_en || [];

  let impact_ar =
    Array.isArray(data.impact_ar) &&
      data.impact_ar.length > 0
      ? data.impact_ar
      : existing?.impact_ar || [];

  if (impact_ar.length === 0 && impact_en.length > 0) {
    impact_ar = await Promise.all(
      impact_en.map((d) =>
        translateEnglishToArabic(d)
      )
    );
  }

  const category_slug =
    data.category_slug ||
    data.category ||
    existing?.category_slug ||
    existing?.category ||
    "Signage";

  const project: CMSProject = {
    id,
    slug,
    title_en,
    title_ar,
    subtitle_en,
    subtitle_ar,
    category_slug,
    category: category_slug,
    client_en,
    client_ar,
    year:
      data.year ||
      existing?.year ||
      new Date().getFullYear().toString(),
    location_en,
    location_ar,
    overview_en,
    overview_ar,
    challenge_en,
    challenge_ar,
    solution_en,
    solution_ar,
    deliverables_en,
    deliverables_ar,
    impact_en,
    impact_ar,
    cover_image:
      data.cover_image ||
      existing?.cover_image ||
      "/assets/portfolio-1.jpg",

    gallery:
      Array.isArray(data.gallery) &&
        data.gallery.length > 0
        ? data.gallery.filter(
          (g) =>
            typeof g === "string" &&
            g.trim().length > 0
        )
        : existing?.gallery &&
          existing.gallery.length > 0
          ? existing.gallery
          : [
            data.cover_image ||
            existing?.cover_image ||
            "/assets/portfolio-1.jpg",
          ],

    is_published:
      data.is_published ??
      existing?.is_published ??
      true,

    is_featured:
      data.is_featured ??
      existing?.is_featured ??
      false,

    display_order:
      data.display_order ??
      existing?.display_order ??
      store.projects.length + 1,

    // IMPORTANT:
    // CMSProject uses created_at.
    // Existing legacy createdAt data is still supported as fallback.
    created_at:
      existing?.created_at ||
      (existing as any)?.createdAt ||
      now,

    updated_at: now,
  };

  if (store.deleted_project_ids) {
    store.deleted_project_ids =
      store.deleted_project_ids.filter(
        (item) =>
          item !== id &&
          item !== slug
      );
  }

  const existingIdx = store.projects.findIndex(
    (p) => p.id === id
  );

  if (existingIdx >= 0) {
    store.projects[existingIdx] = project;
  } else {
    store.projects.push(project);
  }

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await setDoc(
        doc(firestore, "projects", id),
        project,
        { merge: true }
      );
    } catch (err) {
      console.warn(
        "Firestore save error:",
        err
      );
    }
  }

  return project;
}

export async function deleteCMSProject(
  id: string
): Promise<boolean> {
  const store = getLocalStore();

  if (!store.deleted_project_ids) {
    store.deleted_project_ids = [];
  }

  if (!store.deleted_project_ids.includes(id)) {
    store.deleted_project_ids.push(id);
  }

  store.projects = store.projects.filter(
    (p) => p.id !== id && p.slug !== id
  );

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await deleteDoc(
        doc(firestore, "projects", id)
      );
    } catch (e) {
      console.warn(
        "Firestore delete failed:",
        e
      );
    }
  }

  return true;
}

// -------------------------------------------------------------
// CATEGORIES API
// -------------------------------------------------------------

export async function getCMSCategories(): Promise<Category[]> {
  const store = getLocalStore();
  const deletedSet = new Set(
    store.deleted_category_ids || []
  );
  const map = new Map<string, Category>();

  for (const c of store.categories) {
    if (
      c &&
      c.id &&
      !deletedSet.has(c.id) &&
      !deletedSet.has(c.slug)
    ) {
      map.set(c.id, c);
    }
  }

  if (isFirebaseConfigured() && firestore) {
    try {
      const q = query(
        collection(firestore, "categories"),
        orderBy("display_order", "asc")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        for (const d of snapshot.docs) {
          const remoteCat = {
            id: d.id,
            ...d.data(),
          } as Category;

          if (
            !deletedSet.has(remoteCat.id) &&
            !deletedSet.has(remoteCat.slug)
          ) {
            if (!map.has(remoteCat.id)) {
              map.set(remoteCat.id, remoteCat);
            }
          }
        }
      }
    } catch (err) {
      console.warn(
        "Firestore categories error:",
        err
      );
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      (a.display_order ?? 0) -
      (b.display_order ?? 0)
  );
}

export async function saveCMSCategory(
  data: Partial<Category> & { id?: string }
): Promise<Category> {
  const store = getLocalStore();
  const id = data.id || `cat-${Date.now()}`;

  const existing = store.categories.find(
    (c) => c.id === id
  );

  const name_en =
    data.name_en?.trim() ||
    existing?.name_en ||
    "New Category";

  let name_ar = data.name_ar?.trim();

  if (
    !name_ar ||
    name_ar === "تصنيف جديد"
  ) {
    if (
      existing?.name_ar &&
      (!data.name_en ||
        data.name_en === existing.name_en)
    ) {
      name_ar = existing.name_ar;
    } else {
      name_ar =
        await translateEnglishToArabic(name_en);
    }
  }

  const slug =
    data.slug?.trim() ||
    existing?.slug ||
    (name_en
      ? name_en.trim()
      : `category-${id}`);

  const category: Category = {
    id,
    slug,
    name_en,
    name_ar,
    display_order:
      data.display_order ??
      existing?.display_order ??
      store.categories.length + 1,
  };

  if (
    existing &&
    existing.slug &&
    existing.slug !== slug
  ) {
    store.projects.forEach((p) => {
      if (
        p.category_slug === existing.slug ||
        p.category === existing.slug ||
        p.category === existing.id
      ) {
        p.category_slug = slug;
        p.category = slug;
      }
    });
  }

  if (store.deleted_category_ids) {
    store.deleted_category_ids =
      store.deleted_category_ids.filter(
        (item) =>
          item !== id &&
          item !== slug
      );
  }

  const idx = store.categories.findIndex(
    (c) => c.id === id
  );

  if (idx >= 0) {
    store.categories[idx] = category;
  } else {
    store.categories.push(category);
  }

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await setDoc(
        doc(firestore, "categories", id),
        category,
        { merge: true }
      );
    } catch (e) {
      console.warn(
        "Firestore save category error:",
        e
      );
    }
  }

  return category;
}

export async function deleteCMSCategory(
  id: string
): Promise<boolean> {
  const store = getLocalStore();

  if (!store.deleted_category_ids) {
    store.deleted_category_ids = [];
  }

  if (!store.deleted_category_ids.includes(id)) {
    store.deleted_category_ids.push(id);
  }

  store.categories = store.categories.filter(
    (c) => c.id !== id && c.slug !== id
  );

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await deleteDoc(
        doc(firestore, "categories", id)
      );
    } catch (e) {
      console.warn(
        "Firestore delete category error:",
        e
      );
    }
  }

  return true;
}

// -------------------------------------------------------------
// SETTINGS API
// -------------------------------------------------------------

export async function getCMSSettings(): Promise<CMSSettings> {
  if (isFirebaseConfigured() && firestore) {
    try {
      const snap = await getDoc(
        doc(firestore, "settings", "website")
      );

      if (snap.exists()) {
        const data =
          snap.data() as CMSSettings;

        return {
          testimonial_display_count:
            data.testimonial_display_count ?? 3,
        };
      }
    } catch (e) {
      console.warn(
        "Firestore settings error:",
        e
      );
    }
  }

  const store = getLocalStore();

  return (
    store.settings || {
      testimonial_display_count: 3,
    }
  );
}

export async function saveCMSSettings(
  data: Partial<CMSSettings>
): Promise<CMSSettings> {
  const store = getLocalStore();

  const settings: CMSSettings = {
    ...(store.settings || {
      testimonial_display_count: 3,
    }),
    ...data,
  };

  if (isFirebaseConfigured() && firestore) {
    try {
      await setDoc(
        doc(firestore, "settings", "website"),
        settings,
        { merge: true }
      );
    } catch (e) {
      console.warn(
        "Firestore save settings error:",
        e
      );
    }
  }

  store.settings = settings;
  saveLocalStore(store);

  return settings;
}

// -------------------------------------------------------------
// TESTIMONIALS API
// -------------------------------------------------------------

export async function getCMSTestimonials(
  onlyPublished = false,
  limitCount?: number
): Promise<CMSTestimonial[]> {
  const store = getLocalStore();

  const deletedSet = new Set(
    store.deleted_testimonial_ids || []
  );

  const map = new Map<
    string,
    CMSTestimonial
  >();

  for (const t of store.testimonials) {
    if (
      t &&
      t.id &&
      !deletedSet.has(t.id)
    ) {
      map.set(t.id, t);
    }
  }

  if (isFirebaseConfigured() && firestore) {
    try {
      const q = query(
        collection(firestore, "testimonials"),
        orderBy("display_order", "asc")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        for (const firestoreDoc of snapshot.docs) {
          const remoteT = {
            id: firestoreDoc.id,
            ...firestoreDoc.data(),
          } as CMSTestimonial;

          if (!deletedSet.has(remoteT.id)) {
            if (!map.has(remoteT.id)) {
              map.set(remoteT.id, remoteT);
            }
          }
        }
      }
    } catch (err) {
      console.warn(
        "Firestore testimonials error:",
        err
      );
    }
  }

  let list = Array.from(map.values());

  if (onlyPublished) {
    list = list.filter(
      (t) => t.is_published
    );
  }

  list.sort((a, b) => {
    const diff =
      (a.display_order ?? 999) -
      (b.display_order ?? 999);

    if (diff !== 0) {
      return diff;
    }

    return (a.id || "").localeCompare(
      b.id || ""
    );
  });

  if (
    limitCount !== undefined &&
    limitCount > 0
  ) {
    list = list.slice(0, limitCount);
  }

  return list;
}

export async function saveCMSTestimonial(
  data: Partial<CMSTestimonial> & { id?: string }
): Promise<CMSTestimonial> {
  const store = getLocalStore();
  const id =
    data.id || `test-${Date.now()}`;
  const now = new Date().toISOString();

  let existing: CMSTestimonial | undefined =
    store.testimonials.find(
      (t) => t.id === id
    );

  if (
    !existing &&
    isFirebaseConfigured() &&
    firestore
  ) {
    try {
      const snap = await getDoc(
        doc(firestore, "testimonials", id)
      );

      if (snap.exists()) {
        existing = {
          id: snap.id,
          ...snap.data(),
        } as CMSTestimonial;
      }
    } catch { }
  }

  const person_name_en =
    data.person_name_en !== undefined
      ? data.person_name_en.trim()
      : existing?.person_name_en ||
      "Client Name";

  const person_name_ar =
    data.person_name_ar?.trim() &&
      data.person_name_ar !== "اسم العميل"
      ? data.person_name_ar
      : existing?.person_name_ar ||
      (await translateEnglishToArabic(
        person_name_en
      ));

  const designation_en =
    data.designation_en !== undefined
      ? data.designation_en.trim()
      : existing?.designation_en ||
      "Manager";

  const designation_ar =
    data.designation_ar?.trim() &&
      data.designation_ar !== "المنصب"
      ? data.designation_ar
      : existing?.designation_ar ||
      (await translateEnglishToArabic(
        designation_en
      ));

  const company_en =
    data.company_en !== undefined
      ? data.company_en.trim()
      : existing?.company_en ||
      "Company";

  const company_ar =
    data.company_ar?.trim() &&
      data.company_ar !== "الشركة"
      ? data.company_ar
      : existing?.company_ar ||
      (await translateEnglishToArabic(
        company_en
      ));

  const text_en =
    data.text_en !== undefined
      ? data.text_en.trim()
      : existing?.text_en || "";

  const text_ar =
    data.text_ar?.trim()
      ? data.text_ar
      : existing?.text_ar ||
      (text_en
        ? await translateEnglishToArabic(
          text_en
        )
        : "");

  const testimonial: CMSTestimonial = {
    id,
    person_name_en,
    person_name_ar,
    designation_en,
    designation_ar,
    company_en,
    company_ar,
    text_en,
    text_ar,
    rating:
      data.rating ??
      existing?.rating ??
      5,
    photo_url:
      data.photo_url ??
      existing?.photo_url ??
      "",
    is_published:
      data.is_published ??
      existing?.is_published ??
      true,
    display_order:
      data.display_order ??
      existing?.display_order ??
      store.testimonials.length + 1,
    updated_at: now,
  };

  if (store.deleted_testimonial_ids) {
    store.deleted_testimonial_ids =
      store.deleted_testimonial_ids.filter(
        (item) => item !== id
      );
  }

  const idx = store.testimonials.findIndex(
    (t) => t.id === id
  );

  if (idx >= 0) {
    store.testimonials[idx] =
      testimonial;
  } else {
    store.testimonials.push(testimonial);
  }

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await setDoc(
        doc(firestore, "testimonials", id),
        testimonial,
        { merge: true }
      );
    } catch (e) {
      console.warn(
        "Firestore save testimonial error:",
        e
      );
    }
  }

  return testimonial;
}

export async function deleteCMSTestimonial(
  id: string
): Promise<boolean> {
  const store = getLocalStore();

  if (!store.deleted_testimonial_ids) {
    store.deleted_testimonial_ids = [];
  }

  if (!store.deleted_testimonial_ids.includes(id)) {
    store.deleted_testimonial_ids.push(id);
  }

  store.testimonials =
    store.testimonials.filter(
      (t) => t.id !== id
    );

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await deleteDoc(
        doc(firestore, "testimonials", id)
      );
    } catch (e) {
      console.warn(
        "Firestore delete testimonial error:",
        e
      );
    }
  }

  return true;
}

// -------------------------------------------------------------
// CLIENT LOGOS API
// -------------------------------------------------------------

export async function getCMSClients(
  onlyActive = false
): Promise<CMSClientLogo[]> {
  const store = getLocalStore();

  const deletedSet = new Set(
    store.deleted_client_ids || []
  );

  const map = new Map<
    string,
    CMSClientLogo
  >();

  for (const c of store.clients) {
    if (
      c &&
      c.id &&
      !deletedSet.has(c.id)
    ) {
      map.set(c.id, c);
    }
  }

  if (isFirebaseConfigured() && firestore) {
    try {
      const q = query(
        collection(firestore, "clients"),
        orderBy("display_order", "asc")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        for (const firestoreDoc of snapshot.docs) {
          const remoteC = {
            id: firestoreDoc.id,
            ...firestoreDoc.data(),
          } as CMSClientLogo;

          if (!deletedSet.has(remoteC.id)) {
            if (!map.has(remoteC.id)) {
              map.set(remoteC.id, remoteC);
            }
          }
        }
      }
    } catch (err) {
      console.warn(
        "Firestore clients error:",
        err
      );
    }
  }

  let list = Array.from(
    map.values()
  ).sort(
    (a, b) =>
      (a.display_order ?? 0) -
      (b.display_order ?? 0)
  );

  if (onlyActive) {
    list = list.filter(
      (c) => c.is_active
    );
  }

  return list;
}

export async function saveCMSClient(
  data: Partial<CMSClientLogo> & { id?: string }
): Promise<CMSClientLogo> {
  const store = getLocalStore();
  const id =
    data.id || `client-${Date.now()}`;
  const now = new Date().toISOString();

  const name_en =
    data.name_en?.trim() ||
    "Client Brand";

  const name_ar =
    data.name_ar?.trim() &&
      data.name_ar !== "اسم الشركة"
      ? data.name_ar
      : await translateEnglishToArabic(
        name_en
      );

  const client: CMSClientLogo = {
    id,
    name_en,
    name_ar,
    logo_url: data.logo_url || "",
    website_url:
      data.website_url || "",
    display_order:
      data.display_order ??
      store.clients.length + 1,
    is_active:
      data.is_active ?? true,
    updated_at: now,
  };

  if (store.deleted_client_ids) {
    store.deleted_client_ids =
      store.deleted_client_ids.filter(
        (item) => item !== id
      );
  }

  const idx = store.clients.findIndex(
    (c) => c.id === id
  );

  if (idx >= 0) {
    store.clients[idx] = client;
  } else {
    store.clients.push(client);
  }

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await setDoc(
        doc(firestore, "clients", id),
        client,
        { merge: true }
      );
    } catch (e) {
      console.warn(
        "Firestore save client error:",
        e
      );
    }
  }

  return client;
}

export async function deleteCMSClient(
  id: string
): Promise<boolean> {
  const store = getLocalStore();

  if (!store.deleted_client_ids) {
    store.deleted_client_ids = [];
  }

  if (!store.deleted_client_ids.includes(id)) {
    store.deleted_client_ids.push(id);
  }

  store.clients = store.clients.filter(
    (c) => c.id !== id
  );

  saveLocalStore(store);

  if (isFirebaseConfigured() && firestore) {
    try {
      await deleteDoc(
        doc(firestore, "clients", id)
      );
    } catch (e) {
      console.warn(
        "Firestore delete client error:",
        e
      );
    }
  }

  return true;
}

// -------------------------------------------------------------
// SEED LIVE FIRESTORE
// -------------------------------------------------------------

export async function seedFirestoreWithInitialData(): Promise<{
  success: boolean;
  counts: Record<string, number>;
}> {
  if (!isFirebaseConfigured() || !firestore) {
    throw new Error(
      "Firebase is not configured"
    );
  }

  const store = getLocalStore();

  const counts = {
    categories: 0,
    projects: 0,
    testimonials: 0,
    clients: 0,
  };

  for (const cat of store.categories) {
    await setDoc(
      doc(firestore, "categories", cat.id),
      cat,
      { merge: true }
    );
    counts.categories++;
  }

  for (const proj of store.projects) {
    await setDoc(
      doc(firestore, "projects", proj.id),
      proj,
      { merge: true }
    );
    counts.projects++;
  }

  for (const test of store.testimonials) {
    await setDoc(
      doc(firestore, "testimonials", test.id),
      test,
      { merge: true }
    );
    counts.testimonials++;
  }

  for (const client of store.clients) {
    await setDoc(
      doc(firestore, "clients", client.id),
      client,
      { merge: true }
    );
    counts.clients++;
  }

  return {
    success: true,
    counts,
  };
}