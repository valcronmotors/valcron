import Link from "next/link";
import { BrandLogo } from "@/components/public/BrandLogo";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { FooterPartners } from "@/components/public/FooterPartners";
import { FooterSocialIcons } from "@/components/shared/SocialLinks";
import {
  LEGAL_NAV,
  SITE,
  whatsappHref,
} from "@/lib/site";

const headingClass =
  "mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#6b7280]";
const linkClass =
  "text-[0.875rem] leading-6 text-[#3B3B3B] transition-colors duration-200 hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]";

const FOOTER_EXPLORE_V2 = [
  { href: "/", label: "Inicio" },
  { href: "/inventario", label: "Inventario Valcron" },
  { href: "/subastas", label: "Oportunidades de Subasta" },
  { href: "/comprar", label: "Comprar" },
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
    <footer className="site-footer relative mt-auto border-t border-[#E5E7EB] bg-[#F5F5F5]">
      <div
        className="relative mx-auto w-full max-w-[var(--content-wide)] py-10 md:py-12"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
          <div className="sm:col-span-2 lg:col-span-3">
            <Link href="/" aria-label={SITE.brand} className="inline-flex">
              <BrandLogo size="footer" tone="onLight" variant="full" />
            </Link>
            <p className="mt-3 max-w-[16rem] text-[0.8125rem] leading-relaxed text-[#3B3B3B]">
              Valcron Motors Group, SRL — vehículos, subastas e importación en República
              Dominicana.
            </p>
            <FooterSocialIcons className="mt-4" />
          </div>

          <nav
            aria-label="Navegación del pie de página"
            className="grid grid-cols-2 gap-x-6 gap-y-7 sm:col-span-2 sm:grid-cols-4 lg:col-span-6 lg:gap-x-6"
          >
            <FooterColumn title="Explorar" items={FOOTER_EXPLORE_V2} />
            <FooterColumn title="Servicios" items={FOOTER_SERVICES_V2} />
            <FooterColumn title="Empresa" items={FOOTER_COMPANY_V2} />
            <FooterColumn title="Recursos" items={FOOTER_RESOURCES_V2} />
          </nav>

          <div className="sm:col-span-2 lg:col-span-3">
            <h2 className={headingClass}>Contacto</h2>
            <address className="not-italic text-[0.875rem] leading-6 text-[#3d4148]">
              <p>{SITE.address.full}</p>
              <p className="mt-3">
                WhatsApp{" "}
                <a
                  className="font-medium text-[#111111] hover:text-[var(--brand-orange,#e85d04)]"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.whatsappDisplay}
                </a>
              </p>
              <p className="mt-3">
                <a className="hover:text-[#08090b]" href={SITE.url}>
                  valcronmotors.com
                </a>
              </p>
            </address>
            {showCompactMap ? (
              <div className="mt-5">
                <BusinessLocation variant="compact" tone="light" />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 border-t border-[#e6e8eb] pt-5">
          <FooterPartners />
        </div>
      </div>

      <div
        className="border-t border-[#e6e8eb] bg-white py-3.5"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="mx-auto flex max-w-[var(--content-wide)] flex-col items-center gap-2 text-center text-[0.6875rem] leading-5 text-[#6b7280] sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} {SITE.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="underline-offset-2 hover:text-[#08090b] hover:underline"
              >
                {item.label}
              </Link>
            ))}
            <p className="inline-flex items-center gap-1.5 uppercase tracking-[0.12em] text-[#5c6370]">
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
      <ul className="grid gap-1">
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
