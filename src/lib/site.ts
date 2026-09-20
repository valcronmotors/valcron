import { adminOrigin } from "@/lib/hosts";

export const SITE = {
  name: "Valcron Motors Group SRL",
  shortName: "Valcron Motors",
  brand: "valcronMotors",
  legalName: "Valcron Motors Group, SRL",
  url: "https://valcronmotors.com",
  email: "info@valcronmotors.com",
  heroEyebrow: "Valcron Motors • República Dominicana",
  heroTitle: "Conectamos tus sueños sin fronteras.",
  heroSubtitle:
    "Compra, importa y encuentra tu próximo vehículo desde Estados Unidos hasta República Dominicana con una experiencia clara, profesional y personalizada.",
  valueProposition:
    "Valcron Motors: dealer en República Dominicana para compra, importación y venta de vehículos desde Estados Unidos, con inventario local y asesoría en todo el proceso.",
  address: {
    street: "Avenida Principal No 20",
    sector: "Sector Brisa Oriental",
    city: "Santo Domingo Este",
    country: "República Dominicana",
    full: "Avenida Principal No 20, Sector Brisa Oriental, Santo Domingo Este, República Dominicana",
  },
  phoneOffice: "809-623-9381",
  phoneOfficeDigits: "18096239381",
  whatsapp: "829-321-1271",
  whatsappDigits: "18293211271",
  whatsappDisplay: "+1 (829) 321-1271",
  mapEmbedSrc:
    "https://maps.google.com/maps?q=Avenida%20Principal%20No%2020%2C%20Sector%20Brisa%20Oriental%2C%20Santo%20Domingo%20Este%2C%20Rep%C3%BAblica%20Dominicana&z=16&output=embed",
  hours: {
    weekdays: "Lunes a Viernes 9:00 - 19:00",
    saturday: "Sábados 10:00 - 16:00",
  },
} as const;

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
  { href: "/blog", label: "Guías" },
  { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
  { href: "/calculadoras", label: "Calculadoras" },
] as const;

export const FOOTER_INVENTORY = [
  { href: "/inventario", label: "Vehículos" },
  { href: "/inventario", label: "Buscar" },
  { href: "/contacto", label: "Solicitar vehículo" },
] as const;

export const FOOTER_SERVICES = [
  { href: "/importacion", label: "Importación" },
  { href: "/subastas", label: "Subastas" },
  { href: "/financiamiento", label: "Financiamiento" },
] as const;

export const FOOTER_RESOURCES = [
  { href: "/blog", label: "Blog" },
  { href: "/blog", label: "Guías" },
  { href: "/calculadoras", label: "Calculadoras" },
  { href: "/preguntas-frecuentes", label: "FAQ" },
] as const;

export const FOOTER_COMPANY = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
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
] as const;

export const LEGAL_NAV = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/politicas", label: "Cookies" },
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
  "/nosotros",
  "/politicas",
  "/terminos",
  "/privacidad",
  "/preguntas-frecuentes",
  "/calculadoras",
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
  return `tel:+${SITE.phoneOfficeDigits}`;
}

export function mailtoHref() {
  return `mailto:${SITE.email}`;
}

export function whatsappHref(message?: string) {
  if (!message) {
    return `https://wa.me/${SITE.whatsappDigits}`;
  }

  return `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function autoDealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE.name,
    alternateName: SITE.brand,
    url: SITE.url,
    email: SITE.email,
    telephone: [`+${SITE.phoneOfficeDigits}`, `+${SITE.whatsappDigits}`],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.street}, ${SITE.address.sector}`,
      addressLocality: SITE.address.city,
      addressCountry: "DO",
    },
    areaServed: {
      "@type": "Country",
      name: "República Dominicana",
    },
    priceRange: "$$",
  };
}
