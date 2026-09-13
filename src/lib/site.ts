import { adminOrigin } from "@/lib/hosts";

export const SITE = {
  name: "Valcron Motors Group SRL",
  shortName: "Valcron Motors",
  url: "https://valcronmotors.com",
  email: "info@valcronmotors.com",
  heroTitle: "Dealer · Importación · Financiamiento",
  heroSubtitle:
    "La experiencia definitiva en compra e importación de vehículos en República Dominicana.",
  valueProposition:
    "Dealer · Importación · Financiamiento | La experiencia definitiva en compra e importación de vehículos en República Dominicana.",
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
  googleReviews: {
    rating: "5.0",
    count: "+200",
  },
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
  { href: "/importacion", label: "Importación" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const FOOTER_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/importacion", label: "Importación" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const LEGAL_NAV = [
  { href: "/politicas", label: "Políticas de Uso" },
  { href: "/terminos", label: "Términos y Condiciones" },
  { href: "/privacidad", label: "Privacidad" },
] as const;

export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/catalogo",
  "/inventario",
  "/importacion",
  "/financiamiento",
  "/contacto",
  "/blog",
  "/nosotros",
  "/politicas",
  "/terminos",
  "/privacidad",
  "/api/public",
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
