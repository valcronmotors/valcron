import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { BusinessLocation } from "@/components/public/BusinessLocation";
import { FooterSocialIcons } from "@/components/shared/SocialLinks";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  FOOTER_COMPANY,
  FOOTER_CONTACT,
  FOOTER_INVENTORY,
  FOOTER_RESOURCES,
  FOOTER_SERVICES,
  LEGAL_NAV,
  SITE,
  mapsDirectionsUrl,
  officeTelHref,
} from "@/lib/site";

const headingClass =
  "mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white";
const linkClass =
  "text-[#D4D4D4] transition duration-200 hover:translate-x-0.5 hover:text-white hover:underline motion-reduce:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function Footer({ showCompactMap = false }: { showCompactMap?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative mt-auto overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_16%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C7A96B]/35 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <Link href="/" aria-label={SITE.brand} className="inline-flex">
            <BrandLogo size="footer" tone="onDark" />
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.28em] text-[#D4D4D4]">
            Vehículos · Inventario · Financiamiento
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#A3A3A3]">
            Dealer en Santo Domingo Este. Inventario local, financiamiento con bancos locales y
            búsqueda mediante subasta.
          </p>
          <FooterSocialIcons className="mt-8" />
          <nav aria-label="Enlaces principales" className="mt-8 grid gap-3 text-sm md:hidden">
            <Link href="/inventario" className={linkClass}>Inventario</Link>
            <Link href="/financiamiento" className={linkClass}>Financiamiento</Link>
            <Link href="/subastas" className={linkClass}>Subastas</Link>
            <Link href="/solicitar-vehiculo" className={linkClass}>Solicitar vehículo</Link>
            <Link href="/contacto" className={linkClass}>Contacto</Link>
          </nav>
        </div>

        <nav
          aria-label="Navegación del pie de página"
          className="mt-10 hidden grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 md:grid lg:grid-cols-3 xl:grid-cols-5"
        >
          <FooterColumn title="Inventario" items={FOOTER_INVENTORY} />
          <FooterColumn title="Servicios" items={FOOTER_SERVICES} />
          <FooterColumn title="Recursos" items={FOOTER_RESOURCES} />
          <FooterColumn title="Empresa" items={FOOTER_COMPANY} />
          <FooterColumn title="Contacto" items={FOOTER_CONTACT} />
        </nav>

        <section
          className={`mt-14 grid min-w-0 gap-8 border-t border-white/10 pt-10 ${
            showCompactMap ? "md:grid-cols-2 md:items-start lg:max-w-[44rem]" : "max-w-md"
          }`}
        >
          <div className="min-w-0 max-w-md">
          <h2 className={headingClass}>Contacto</h2>
          <address className="not-italic">
            <p className="flex gap-3 text-sm leading-relaxed text-[#D4D4D4]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C7A96B]" aria-hidden="true" />
              <span>
                <span className="block font-medium text-white">{SITE.facebookDisplay}</span>
                {SITE.address.street},
                <br />
                {SITE.address.city},
                <br />
                {SITE.address.country}
              </span>
            </p>
            <p className="mt-5 flex gap-3 text-sm">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#C7A96B]" aria-hidden="true" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                  Oficina
                </span>
                <a className={`${linkClass} mt-1 inline-block`} href={officeTelHref()}>
                  {SITE.officePhoneDisplay}
                </a>
              </span>
            </p>
            <p className="mt-5 flex gap-3 text-sm">
              <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                  WhatsApp
                </span>
                <a
                  className={`${linkClass} mt-1 inline-block`}
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.whatsappDisplay}
                </a>
              </span>
            </p>
            {!showCompactMap ? (
              <p className="mt-5">
                <a
                  className={linkClass}
                  href={mapsDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cómo llegar
                </a>
              </p>
            ) : null}
          </address>
          </div>
          {showCompactMap ? <BusinessLocation variant="compact" tone="dark" /> : null}
        </section>
      </div>

      <div className="relative border-t border-white/10 px-5 py-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C7A96B]/25 to-transparent" />
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center text-xs text-[#A3A3A3] sm:flex-row sm:justify-between sm:text-left lg:px-8">
          <p>
            © {year} {SITE.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white hover:underline">
                {item.label}
              </Link>
            ))}
            <p className="inline-flex items-center gap-2 uppercase tracking-[0.16em] text-[#D4D4D4]">
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
      <ul className="grid gap-3 text-sm">
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
