import { adminOrigin } from "@/lib/hosts";

export const SITE = {
  name: "Valcron Motors Group, SRL",
  companyName: "Valcron Motors Group, SRL",
  shortName: "Valcron Motors",
  brand: "valcronMotors",
  legalName: "Valcron Motors Group, SRL",
  url: "https://valcronmotors.com",
  heroEyebrow: "Valcron Motors • República Dominicana",
  heroTitle: "Conectamos tus sueños sin fronteras.",
  heroSubtitle:
    "Compra, importa y encuentra tu próximo vehículo desde Estados Unidos hasta República Dominicana con una experiencia clara, profesional y personalizada.",
  valueProposition:
    "Valcron Motors: dealer en República Dominicana para compra, importación y venta de vehículos desde Estados Unidos, con inventario local y asesoría en todo el proceso.",
  address: {
    street: "Av Principal 20",
    streetAddress: "Av Principal 20",
    sector: "Av Principal 20",
    city: "Santo Domingo Este",
    country: "República Dominicana",
    countryCode: "DO",
    full: "Av Principal 20, Santo Domingo Este, República Dominicana",
  },
  phoneOffice: "(809) 623-9381",
  officePhoneDisplay: "(809) 623-9381",
  phoneOfficeInternational: "+18096239381",
  officePhoneInternational: "+18096239381",
  phoneOfficeDigits: "18096239381",
  whatsapp: "(829) 321-1271",
  whatsappInternational: "+18293211271",
  whatsappDigits: "18293211271",
  whatsappDisplay: "(829) 321-1271",
  whatsappUrl: "https://wa.me/18293211271",
  instagramUrl: "https://www.instagram.com/valcronmotors",
  instagramHandle: "@valcronmotors",
  facebookUrl: "https://www.facebook.com/people/Valcron-Motors-Group/61584457784163/",
  facebookDisplay: "Valcron Motors Group",
  newsletterEnabled: false,
  defaultWhatsappMessage:
    "Hola, estoy interesado en información sobre un vehículo de Valcron Motors.",
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

export const PUBLIC_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/subastas", label: "Subastas" },
  { href: "/importacion", label: "Importación" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const RESOURCE_NAV = [
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guías" },
  { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
  { href: "/calculadoras", label: "Calculadoras" },
] as const;

export const FOOTER_INVENTORY = [
  { href: "/inventario", label: "Vehículos disponibles" },
  { href: "/inventario", label: "Buscar vehículo" },
  { href: "/solicitar-vehiculo", label: "Solicitar vehículo" },
] as const;

export const FOOTER_SERVICES = [
  { href: "/importacion", label: "Importación" },
  { href: "/subastas", label: "Subastas USA" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/contacto", label: "Búsqueda personalizada" },
  { href: "/servicios", label: "Asesoría" },
] as const;

export const FOOTER_RESOURCES = [
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guías" },
  { href: "/calculadoras", label: "Calculadoras" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
] as const;

export const FOOTER_COMPANY = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const FOOTER_EXPLORE = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/importacion", label: "Importación" },
  { href: "/subastas", label: "Subastas" },
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
  "/politicas",
  "/terminos",
  "/privacidad",
  "/cookies",
  "/como-funciona",
  "/solicitar-vehiculo",
  "/preguntas-frecuentes",
  "/calculadoras",
  "/mapa-del-sitio",
  "/api/public",
  "/api/webhooks",
] as const;

const ADMIN_UNAUTH_PATHS = ["/login", "/api/public", "/api/webhooks"] as const;

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
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
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

export function officeTelHref() {
  return `tel:${SITE.phoneOfficeInternational}`;
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
    name: SITE.legalName,
    legalName: SITE.legalName,
    alternateName: [SITE.shortName, SITE.brand],
    brand: {
      "@type": "Brand",
      name: SITE.shortName,
      alternateName: SITE.brand,
    },
    url: SITE.url,
    telephone: "+1-809-623-9381",
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
