import Link from "next/link";
import { BrandLogo } from "@/components/public/BrandLogo";
import { FooterSocialIcons } from "@/components/shared/SocialLinks";
import {
  FOOTER_COMPANY,
  FOOTER_RESOURCES,
  FOOTER_SERVICES,
  LEGAL_NAV,
  SITE,
  officeTelHref,
  whatsappHref,
} from "@/lib/site";

const headingClass =
  "mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8d91]";
const linkClass =
  "text-[13px] leading-7 text-[#191919] transition-colors duration-200 hover:text-[#2b6cff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]";

export function Footer({ showCompactMap = false }: { showCompactMap?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative mt-auto">
      <div
        className="relative mx-auto w-full max-w-[var(--content-wide)] py-14 md:py-16"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <nav aria-label="Navegación del pie de página" className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          <FooterColumn title="Guía de compras" items={FOOTER_SERVICES.slice(0, 5)} />
          <FooterColumn
            title="Vehículos"
            items={[
              { href: "/inventario", label: "Inventario Valcron" },
              { href: "/subastas", label: "Subastas" },
              { href: "/solicitar-vehiculo", label: "Solicitar vehículo" },
              { href: "/importacion", label: "Importación" },
            ]}
          />
          <FooterColumn title="Empresa" items={FOOTER_COMPANY} />
          <FooterColumn title="Recursos" items={FOOTER_RESOURCES} />
          <div>
            <h2 className={headingClass}>Contacto</h2>
            <address className="not-italic text-[13px] leading-7 text-[#191919]">
              <p>{SITE.address.street}</p>
              <p>
                {SITE.address.city}, {SITE.address.country}
              </p>
              <p className="mt-3">
                <a className={linkClass} href={officeTelHref()}>
                  {SITE.officePhoneDisplay}
                </a>
              </p>
              <p>
                <a className={linkClass} href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {SITE.whatsappDisplay}
                </a>
              </p>
            </address>
            {showCompactMap ? (
              <p className="mt-3 text-[13px] text-[#676a70]">Av Principal 20, Santo Domingo Este.</p>
            ) : null}
          </div>
        </nav>

        <div className="mt-14 flex flex-col items-center gap-6 border-t border-[#e5e5e5] pt-10">
          <Link href="/" aria-label={SITE.brand}>
            <BrandLogo size="footer" tone="onLight" />
          </Link>
          <FooterSocialIcons className="text-[#191919]" />
          <div className="flex flex-col items-center gap-3 text-center text-[12px] text-[#8a8d91] sm:flex-row sm:flex-wrap sm:justify-center">
            <p>
              © {year} {SITE.legalName}. Todos los derechos reservados.
            </p>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            {LEGAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="underline-offset-2 hover:text-[#191919] hover:underline">
                {item.label}
              </Link>
            ))}
            <p className="inline-flex items-center gap-2 uppercase tracking-[0.14em]">
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
      <ul className="grid gap-0.5">
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
    <svg viewBox="0 0 18 12" className="h-3 w-[1.125rem]" aria-hidden="true">
      <rect width="18" height="12" fill="#002d62" />
      <rect width="9" height="6" fill="#ce1126" />
      <rect x="9" y="6" width="9" height="6" fill="#ce1126" />
      <rect x="7.4" width="3.2" height="12" fill="#fff" />
      <rect y="4.6" width="18" height="2.8" fill="#fff" />
    </svg>
  );
}
