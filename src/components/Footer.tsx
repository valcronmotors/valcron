"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/public/BrandLogo";
import {
  FOOTER_COMPANY,
  FOOTER_INVENTORY,
  FOOTER_RESOURCES,
  FOOTER_SERVICES,
  LEGAL_NAV,
  SITE,
  mailtoHref,
  officeTelHref,
  usesMarketingChrome,
  whatsappHref,
} from "@/lib/site";

const headingClass =
  "mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50";
const bodyClass = "text-sm font-normal leading-relaxed text-white/42";
const linkClass = "text-white/42 transition hover:text-white";

export function Footer() {
  const pathname = usePathname();

  if (!usesMarketingChrome(pathname)) {
    return null;
  }

  return (
    <footer className="mt-auto bg-[#050505] text-white/42">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <BrandLogo size="footer" tone="onDark" />
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.28em] text-white/55">
              Importación • Subastas • Vehículos
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/40">
            Valcron Motors Group, SRL. Experiencia automotriz para comprar, importar y gestionar
            vehículos hacia República Dominicana.
          </p>
        </div>

        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <p className={headingClass}>Inventario</p>
            <nav className="grid gap-2.5 text-sm">
              {FOOTER_INVENTORY.map((item) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className={headingClass}>Servicios</p>
            <nav className="grid gap-2.5 text-sm">
              {FOOTER_SERVICES.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className={headingClass}>Recursos</p>
            <nav className="grid gap-2.5 text-sm">
              {FOOTER_RESOURCES.map((item) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className={headingClass}>Empresa</p>
            <nav className="grid gap-2.5 text-sm">
              {FOOTER_COMPANY.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className={headingClass}>Legal</p>
            <nav className="grid gap-2.5 text-sm">
              {LEGAL_NAV.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className={headingClass}>Contacto</p>
            <address className={`not-italic ${bodyClass}`}>{SITE.address.full}</address>
            <div className={`mt-4 grid gap-2 ${bodyClass}`}>
              <a className={linkClass} href={officeTelHref()}>
                {SITE.phoneOffice}
              </a>
              <a className={linkClass} href={whatsappHref()}>
                {SITE.whatsappDisplay}
              </a>
              <a className={linkClass} href={mailtoHref()}>
                {SITE.email}
              </a>
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-white/35">
              República Dominicana
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-xs text-white/32">© {SITE.legalName}. Todos los derechos reservados.</p>
          <Link href="/login" className={`text-xs uppercase tracking-widest ${linkClass}`}>
            Acceso Administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
