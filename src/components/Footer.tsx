import Link from "next/link";
import { BrandLogo } from "@/components/public/BrandLogo";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { FooterPartners } from "@/components/public/FooterPartners";
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

const headingClass = "mb-4 text-lg font-bold text-white md:text-xl";
const linkClass =
  "text-[0.9375rem] leading-7 text-white/75 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]";

export function Footer({ showCompactMap = false }: { showCompactMap?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative mt-auto overflow-hidden">
      <div
        className="relative mx-auto w-full max-w-[var(--content-wide)] py-14 md:py-16 lg:py-20"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="text-center md:text-left">
          <Link href="/" aria-label={SITE.brand} className="inline-flex origin-center md:origin-left">
            <BrandLogo size="footer" tone="onDark" variant="full" />
          </Link>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/55 md:mx-0">
            Dealer en Santo Domingo Este. Inventario local, búsqueda personalizada y
            financiamiento con bancos locales.
          </p>
        </div>

        <nav
          aria-label="Navegación del pie de página"
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-14 lg:grid-cols-4"
        >
          <FooterColumn title="Servicios" items={FOOTER_SERVICES.slice(0, 4)} />
          <FooterColumn
            title="Explorar"
            items={[
              { href: "/inventario", label: "Inventario" },
              { href: "/subastas", label: "Subastas" },
              { href: "/importacion", label: "Importación" },
              { href: "/financiamiento", label: "Financiamiento" },
            ]}
          />
          <FooterColumn title="Empresa" items={FOOTER_COMPANY} />
          <FooterColumn title="Recursos" items={FOOTER_RESOURCES} />
        </nav>

        <FooterPartners />

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <h2 className={headingClass}>Contacto</h2>
            <address className="not-italic text-[0.9375rem] leading-7 text-white/75">
              <p className="text-white">{SITE.address.street}</p>
              <p>
                {SITE.address.city}, {SITE.address.country}
              </p>
              <p className="mt-4">
                Oficina{" "}
                <a className="text-[#2b6cff] hover:underline" href={officeTelHref()}>
                  {SITE.officePhoneDisplay}
                </a>
              </p>
              <p>
                WhatsApp{" "}
                <a
                  className="text-[#2b6cff] hover:underline"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.whatsappDisplay}
                </a>
              </p>
            </address>
            <Link href="/solicitar-vehiculo" className="btn-ghost-accent mt-7">
              Solicitar vehículo
            </Link>
            <FooterSocialIcons className="mt-8" />
          </div>
          {showCompactMap ? <BusinessLocation variant="compact" tone="dark" /> : null}
        </div>
      </div>

      <div
        className="border-t border-white/10 py-6"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="mx-auto flex max-w-[var(--content-wide)] flex-col items-center gap-3 text-center text-xs text-white/45 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} {SITE.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="underline-offset-2 hover:text-white hover:underline">
                {item.label}
              </Link>
            ))}
            <p className="inline-flex items-center gap-2 uppercase tracking-[0.14em] text-white/55">
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
    <svg viewBox="0 0 18 12" className="h-3 w-[1.125rem]" aria-hidden="true">
      <rect width="18" height="12" fill="#002d62" />
      <rect width="9" height="6" fill="#ce1126" />
      <rect x="9" y="6" width="9" height="6" fill="#ce1126" />
      <rect x="7.4" width="3.2" height="12" fill="#fff" />
      <rect y="4.6" width="18" height="2.8" fill="#fff" />
    </svg>
  );
}
