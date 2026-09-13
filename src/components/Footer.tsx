"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/public/BrandLogo";
import {
  FOOTER_NAV,
  LEGAL_NAV,
  SITE,
  officeTelHref,
  usesMarketingChrome,
  whatsappHref,
} from "@/lib/site";

const headingClass =
  "mb-4 text-xs font-semibold uppercase tracking-widest text-gray-200";
const bodyClass = "text-sm font-normal leading-relaxed text-gray-400";
const linkClass = "text-gray-400 transition hover:text-white";

export function Footer() {
  const pathname = usePathname();

  if (!usesMarketingChrome(pathname)) {
    return null;
  }

  return (
    <footer className="mt-auto bg-[#0B0C10] text-gray-400">
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <BrandLogo size="footer" tone="onDark" />
          <p className={`mt-5 ${bodyClass}`}>
            La experiencia definitiva en venta, importación y financiamiento de vehículos en
            República Dominicana.
          </p>
        </div>

        <div>
          <p className={headingClass}>Contacto Directo</p>
          <p className={`mb-1 font-medium text-gray-300`}>Oficina Comercial</p>
          <address className={`not-italic ${bodyClass}`}>
            Av. Principal No. 20, Sector Brisa Oriental, Santo Domingo Este, RD.
          </address>
          <div className={`mt-4 grid gap-2 ${bodyClass}`}>
            <p>
              Teléfono:{" "}
              <a className={linkClass} href={officeTelHref()}>
                +1 (809) 623-9381
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              <a className={linkClass} href={whatsappHref()}>
                +1 (829) 321-1271
              </a>
            </p>
            <p>
              Email:{" "}
              <a className={linkClass} href={`mailto:${SITE.email}`}>
                info@valcronmotors.com
              </a>
            </p>
          </div>
          <p className={`mt-4 ${bodyClass}`}>
            Lunes a Viernes (9:00 AM - 7:00 PM) | Sábados (10:00 AM - 4:00 PM)
          </p>
        </div>

        <div>
          <p className={headingClass}>Enlaces Rápidos</p>
          <nav className="grid gap-2.5 text-sm font-medium">
            {FOOTER_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className={headingClass}>Legal</p>
          <nav className="grid gap-2.5 text-sm font-medium">
            {LEGAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className={headingClass}>Ubicación</p>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <iframe
              title="Valcron Motors Group SRL en Santo Domingo Este"
              src={SITE.mapEmbedSrc}
              className="h-48 w-full grayscale contrast-125"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-xs font-normal text-gray-400">
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
          </p>
          <Link href="/login" className={`text-xs font-medium tracking-widest uppercase ${linkClass}`}>
            Acceso Administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
