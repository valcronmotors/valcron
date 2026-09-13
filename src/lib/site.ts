export const SITE = {
  name: "Valcron Motors Group SRL",
  shortName: "Valcron Motors Group",
  url: "https://valcronmotors.com",
  email: "info@valcronmotors.com",
  heroTitle: "Dealer · Importación · Financiamiento",
  heroSubtitle:
    "Vendemos, importamos y financiamos vehículos de marcas confiables en toda República Dominicana, con un servicio personalizado de principio a fin.",
  valueProposition:
    "Dealer · Importación · Financiamiento | Vendemos, importamos y financiamos vehículos de marcas confiables en toda República Dominicana, con un servicio personalizado de principio a fin.",
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
} as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/#inventario", label: "Inventario" },
  { href: "/#importacion", label: "Importación" },
  { href: "/#financiamiento", label: "Financiamiento" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
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
  "/blog",
  "/nosotros",
  "/politicas",
  "/terminos",
  "/privacidad",
  "/api/public",
] as const;

export function isPublicPath(pathname: string) {
  if (pathname === "/" || pathname.startsWith("/_next")) {
    return true;
  }

  return PUBLIC_PATHS.some(
    (path) => path !== "/" && (pathname === path || pathname.startsWith(`${path}/`)),
  );
}

export function safeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
    return "/admin";
  }

  return value;
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
