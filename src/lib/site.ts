import { adminOrigin } from "@/lib/hosts";

export const SITE = {
  name: "Valcron Motors Group, SRL",
  companyName: "Valcron Motors Group, SRL",
  shortName: "Valcron Motors",
  brand: "valcronMotors",
  legalName: "Valcron Motors Group, SRL",
  url: "https://valcronmotors.com",
  tagline: "Más opciones. Más cerca de ti.",
  heroEyebrow: "Valcron Motors Group",
  heroTitle: "Más opciones. Más cerca de ti.",
  heroSubtitle: "Encuentra tu próximo vehículo con Valcron Motors.",
  valueProposition:
    "Valcron Motors en Santo Domingo Este: vehículos disponibles, búsqueda personalizada, financiamiento con bancos locales y opciones de subasta e importación cuando aplica.",
  address: {
    street: "Av Principal 20",
    streetAddress: "Av Principal 20",
    sector: "Av Principal 20",
    city: "Santo Domingo Este",
    country: "República Dominicana",
    countryCode: "DO",
    full: "Av Principal 20, Santo Domingo Este, República Dominicana",
  },
  /** Public contact is WhatsApp-only. Office landline is not published on the website. */
  whatsapp: "(829) 321-1271",
  whatsappInternational: "+18293211271",
  whatsappDigits: "18293211271",
  whatsappDisplay: "(829) 321-1271",
  whatsappUrl: "https://wa.me/18293211271",
  instagramUrl: "https://www.instagram.com/valcronmotors/",
  instagramHandle: "@valcronmotors",
  facebookUrl: "https://www.facebook.com/people/Valcron-Motors-Group/61584457784163/",
  facebookDisplay: "Valcron Motors Group",
  newsletterEnabled: false,
  defaultWhatsappMessage:
    "Hola, quiero información sobre un vehículo con Valcron Motors.",
  maps: {
    query: "Valcron Motors Group, Av Principal 20, Santo Domingo Este, República Dominicana",
    embedTitle: "Ubicación de Valcron Motors Group en Santo Domingo Este",
    embedSrc:
      "https://maps.google.com/maps?hl=es&q=Valcron%20Motors%20Group%2C%20Av%20Principal%2020%2C%20Santo%20Domingo%20Este%2C%20Rep%C3%BAblica%20Dominicana&z=16&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Valcron%20Motors%20Group%2C%20Av%20Principal%2020%2C%20Santo%20Domingo%20Este%2C%20Rep%C3%BAblica%20Dominicana",
  },
  mapEmbedSrc:
    "https://maps.google.com/maps?hl=es&q=Valcron%20Motors%20Group%2C%20Av%20Principal%2020%2C%20Santo%20Domingo%20Este%2C%20Rep%C3%BAblica%20Dominicana&z=16&output=embed",
} as const;

export const companyConfig = SITE;

/** Customer-intent primary navigation (V6). */
export const PUBLIC_NAV_PRIMARY = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/comprar", label: "Comprar" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/subastas", label: "Subastas" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
] as const;

export const PUBLIC_NAV_CONTACT = { href: "/contacto", label: "Contacto" } as const;

export const PUBLIC_NAV = [...PUBLIC_NAV_PRIMARY, PUBLIC_NAV_CONTACT] as const;

export const RESOURCE_NAV = [
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guías" },
  { href: "/calculadoras", label: "Calculadoras" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
] as const;

export const MOBILE_NAV = [...PUBLIC_NAV_PRIMARY, ...RESOURCE_NAV, PUBLIC_NAV_CONTACT] as const;

export type MegaNavLink = { href: string; label: string };
export type MegaNavColumn = { title: string; links: readonly MegaNavLink[] };
export type MegaNavItem = {
  id: string;
  label: string;
  href: string;
  columns: readonly MegaNavColumn[];
  featured: { title: string; copy: string; href: string; cta: string };
};

/**
 * V20 mega menus — simplified customer journeys.
 * All hrefs map to existing public routes (no dead links).
 */
export const MEGA_NAV: readonly MegaNavItem[] = [
  {
    id: "vehiculos",
    label: "Vehículos",
    href: "/inventario",
    columns: [
      {
        title: "Catálogos",
        links: [
          { href: "/inventario", label: "Inventario Valcron" },
          { href: "/subastas", label: "Oportunidades de Subasta" },
        ],
      },
    ],
    featured: {
      title: "Inventario Valcron",
      copy: "Unidades publicadas en Santo Domingo Este.",
      href: "/inventario",
      cta: "Ver inventario",
    },
  },
  {
    id: "comprar",
    label: "Comprar",
    href: "/comprar",
    columns: [
      {
        title: "Compra",
        links: [
          { href: "/solicitar-vehiculo", label: "Solicitar vehículo" },
          { href: "/financiamiento", label: "Financiamiento" },
          { href: "/comprar", label: "Cómo comprar" },
          { href: "/calculadoras", label: "Cotizaciones" },
          { href: "/contacto?asunto=trade-in", label: "Entrega como parte de pago" },
        ],
      },
    ],
    featured: {
      title: "Solicita tu vehículo",
      copy: "Cuéntanos qué buscas y te orientamos en el proceso.",
      href: "/solicitar-vehiculo",
      cta: "Solicitar vehículo",
    },
  },
  {
    id: "servicios",
    label: "Servicios",
    href: "/servicios",
    columns: [
      {
        title: "Servicios Valcron",
        links: [
          { href: "/subastas", label: "Subastas" },
          { href: "/importacion", label: "Importación" },
          { href: "/financiamiento", label: "Financiamiento" },
          { href: "/comprar", label: "Asesoría de compra" },
        ],
      },
    ],
    featured: {
      title: "Servicios claros",
      copy: "Subastas, importación y financiamiento con información verificable.",
      href: "/servicios",
      cta: "Ver servicios",
    },
  },
  {
    id: "recursos",
    label: "Recursos",
    href: "/guias",
    columns: [
      {
        title: "Aprende y calcula",
        links: [
          { href: "/blog", label: "Blog" },
          { href: "/guias", label: "Guías" },
          { href: "/calculadoras", label: "Calculadoras" },
          { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
        ],
      },
    ],
    featured: {
      title: "Recursos útiles",
      copy: "Guías, calculadoras y respuestas antes de decidir.",
      href: "/guias",
      cta: "Ver guías",
    },
  },
];

/** Direct header links (no mega panel) — OEM-style secondary destinations. */
export const HEADER_DIRECT_LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const FOOTER_INVENTORY = [
  { href: "/inventario", label: "Vehículos disponibles" },
  { href: "/contacto", label: "Solicitar vehículo" },
  { href: "/comprar", label: "Cómo comprar" },
] as const;

export const FOOTER_SERVICES = [
  { href: "/inventario", label: "Compra de vehículos" },
  { href: "/contacto", label: "Búsqueda personalizada" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/subastas", label: "Subastas" },
  { href: "/importacion", label: "Importación" },
  { href: "/contacto?asunto=trade-in", label: "Trade-in" },
] as const;

export const FOOTER_CONTACT = [
  { href: "/contacto", label: "Visítanos" },
  { href: SITE.whatsappUrl, label: "WhatsApp" },
  { href: "/contacto", label: "Escribirnos" },
] as const;

export const FOOTER_RESOURCES = [
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guías" },
  { href: "/calculadoras", label: "Calculadoras" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
] as const;

export const FOOTER_COMPANY = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/comprar", label: "Cómo comprar" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const FOOTER_EXPLORE = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/subastas", label: "Subastas" },
  { href: "/financiamiento", label: "Financiamiento" },
] as const;

export const FOOTER_NAV = [
  ...FOOTER_EXPLORE,
  ...FOOTER_COMPANY,
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guías" },
] as const;

export const LEGAL_NAV = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/cookies", label: "Cookies" },
] as const;

export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/catalogo",
  "/inventario",
  "/importacion",
  "/subastas",
  "/servicios",
  "/financiamiento",
  "/contacto",
  "/blog",
  "/guias",
  "/nosotros",
  "/comprar",
  "/politicas",
  "/terminos",
  "/privacidad",
  "/cookies",
  "/como-funciona",
  "/solicitar-vehiculo",
  "/preguntas-frecuentes",
  "/calculadoras",
  "/mapa-del-sitio",
  "/robots.txt",
  "/sitemap.xml",
  "/api/public",
  "/vehiculos",
  "/repuestos",
  "/crm",
] as const;

const ADMIN_UNAUTH_PATHS = ["/login", "/api/public"] as const;

export function isPublicPath(pathname: string) {
  if (pathname === "/" || pathname.startsWith("/_next")) {
    return true;
  }

  return PUBLIC_PATHS.some(
    (path) => path !== "/" && (pathname === path || pathname.startsWith(`${path}/`)),
  );
}

export function usesMarketingChrome(pathname: string) {
  if (pathname === "/login" || pathname.startsWith("/login/") || pathname.startsWith("/api/")) {
    return false;
  }

  return isPublicPath(pathname);
}

export function isAdminPublicPath(pathname: string) {
  return ADMIN_UNAUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function safeNextPath(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/login") ||
    value.includes("://") ||
    value.includes("\\")
  ) {
    return "/admin";
  }

  return value;
}

export function adminEntryHref() {
  if (process.env.NODE_ENV === "production") {
    return adminOrigin();
  }

  return "/login";
}

/** @deprecated Public site uses WhatsApp only — prefer whatsappHref(). */
export function officeTelHref() {
  return whatsappHref();
}

export function whatsappHref(message?: string) {
  const text = message ?? SITE.defaultWhatsappMessage;
  if (!text) {
    return SITE.whatsappUrl;
  }
  return `${SITE.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function configuredSocialLinks() {
  return [
    SITE.instagramUrl
      ? {
          id: "instagram" as const,
          href: SITE.instagramUrl,
          label: "Instagram de Valcron Motors",
          display: SITE.instagramHandle,
        }
      : null,
    SITE.facebookUrl
      ? {
          id: "facebook" as const,
          href: SITE.facebookUrl,
          label: "Facebook de Valcron Motors",
          display: SITE.facebookDisplay,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function mapsDirectionsUrl() {
  return SITE.maps.directionsUrl;
}

export function autoDealerJsonLd() {
  const business = {
    "@type": ["Organization", "LocalBusiness", "AutoDealer"],
    "@id": `${SITE.url}/#business`,
    name: "Valcron Motors Group",
    legalName: SITE.legalName,
    alternateName: [SITE.shortName, SITE.brand],
    brand: {
      "@type": "Brand",
      name: SITE.shortName,
      alternateName: SITE.brand,
    },
    url: SITE.url,
    telephone: SITE.whatsappInternational,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.countryCode,
    },
    areaServed: {
      "@type": "Country",
      name: "República Dominicana",
    },
    sameAs: [SITE.instagramUrl, SITE.facebookUrl],
    hasMap: SITE.maps.directionsUrl,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.shortName,
        alternateName: SITE.brand,
        url: SITE.url,
        inLanguage: "es-DO",
        publisher: { "@id": `${SITE.url}/#business` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}/inventario?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}
