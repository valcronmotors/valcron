import Link from "next/link";
import { BrandLogo } from "@/components/public/BrandLogo";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { FooterPartners } from "@/components/public/FooterPartners";
import { FooterSocialIcons } from "@/components/shared/SocialLinks";
import {
  LEGAL_NAV,
  SITE,
  officeTelHref,
  whatsappHref,
} from "@/lib/site";

const headingClass =
  "mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/45";
const linkClass =
  "text-[0.875rem] leading-6 text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]";

const FOOTER_EXPLORE_V2 = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario" },
  { href: "/comprar", label: "Comprar" },
  { href: "/subastas", label: "Subastas" },
] as const;

const FOOTER_SERVICES_V2 = [
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/importacion", label: "Importación" },
  { href: "/servicios", label: "Servicios" },
] as const;

const FOOTER_COMPANY_V2 = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

const FOOTER_RESOURCES_V2 = [
  { href: "/blog", label: "Blog" },
  { href: "/guias", label: "Guías" },
  { href: "/calculadoras", label: "Calculadoras" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
] as const;

export function Footer({ showCompactMap = false }: { showCompactMap?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative mt-auto overflow-hidden">
      <div
        className="relative mx-auto w-full max-w-[var(--content-wide)] py-10 md:py-12 lg:py-14"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        {/* Main enterprise grid */}
        <div className="grid gap-9 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* A — Corporate brand */}
          <div className="text-center lg:col-span-3 lg:text-left">
            <Link
              href="/"
              aria-label={SITE.brand}
              className="inline-flex origin-center lg:origin-left"
            >
              <BrandLogo size="footer" tone="onDark" variant="full" />
            </Link>
            <p className="mx-auto mt-4 max-w-xs text-[0.875rem] leading-relaxed text-white/55 lg:mx-0 lg:max-w-[16.5rem]">
              Venta de vehículos, oportunidades de subasta e importación en República
              Dominicana.
            </p>
          </div>

          {/* B — Navigation */}
          <nav
            aria-label="Navegación del pie de página"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 lg:col-span-5 lg:grid-cols-2 xl:col-span-5"
          >
            <div className="grid gap-8 content-start">
              <FooterColumn title="Explorar" items={FOOTER_EXPLORE_V2} />
              <FooterColumn title="Servicios" items={FOOTER_SERVICES_V2} />
            </div>
            <div className="grid gap-8 content-start">
              <FooterColumn title="Empresa" items={FOOTER_COMPANY_V2} />
              <FooterColumn title="Recursos" items={FOOTER_RESOURCES_V2} />
            </div>
          </nav>

          {/* D + E — Contact + social */}
          <div className="lg:col-span-4 xl:col-span-4">
            <h2 className={headingClass}>Contacto</h2>
            <address className="not-italic text-[0.875rem] leading-6 text-white/70">
              <p className="text-white/90">{SITE.address.full}</p>
              <p className="mt-3">
                Oficina{" "}
                <a className="text-white hover:text-[#2b6cff]" href={officeTelHref()}>
                  {SITE.officePhoneDisplay}
                </a>
              </p>
              <p>
                WhatsApp{" "}
                <a
                  className="text-white hover:text-[#2b6cff]"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.whatsappDisplay}
                </a>
              </p>
              <p className="mt-3">
                <a
                  className="text-white/80 hover:text-white"
                  href={SITE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  valcronmotors.com
                </a>
              </p>
            </address>
            <FooterSocialIcons className="mt-5" />
            {showCompactMap ? (
              <div className="mt-6">
                <BusinessLocation variant="compact" tone="dark" />
              </div>
            ) : null}
          </div>
        </div>

        {/* C — Associations strip */}
        <div className="mt-9 md:mt-10">
          <FooterPartners />
        </div>
      </div>

      {/* F — Legal */}
      <div
        className="border-t border-white/10 py-4 md:py-5"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="mx-auto flex max-w-[var(--content-wide)] flex-col items-center gap-2.5 text-center text-[0.6875rem] leading-5 text-white/40 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} {SITE.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="underline-offset-2 hover:text-white/70 hover:underline"
              >
                {item.label}
              </Link>
            ))}
            <p className="inline-flex items-center gap-1.5 uppercase tracking-[0.12em] text-white/45">
              <DominicanFlag />
              República Dominicana
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className={headingClass}>{title}</h2>
      <ul className="grid gap-1.5">
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            {item.href.startsWith("http") ? (
              <a href={item.href} className={linkClass} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ) : (
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DominicanFlag() {
  return (
    <svg viewBox="0 0 18 12" className="h-2.5 w-[0.95rem]" aria-hidden="true">
      <rect width="18" height="12" fill="#002d62" />
      <rect width="9" height="6" fill="#ce1126" />
      <rect x="9" y="6" width="9" height="6" fill="#ce1126" />
      <rect x="7.4" width="3.2" height="12" fill="#fff" />
      <rect y="4.6" width="18" height="2.8" fill="#fff" />
    </svg>
  );
}
