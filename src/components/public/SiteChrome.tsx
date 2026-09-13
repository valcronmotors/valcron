"use client";

import Link from "next/link";
import { useState } from "react";
import { LEGAL_NAV, PUBLIC_NAV, SITE, officeTelHref, whatsappHref } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0C10]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link href="/" className="min-w-0" onClick={() => setOpen(false)}>
          <span className="block font-display text-[11px] font-semibold uppercase tracking-[0.34em] text-[#D4AF37]">
            Valcron
          </span>
          <span className="block truncate text-sm font-semibold text-[#F4F5F7]">
            {SITE.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-[#F4F5F7]/80 transition hover:text-[#FFD700]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 inline-flex h-10 items-center rounded-full bg-[#FF5500] px-4 text-xs font-semibold tracking-wide text-white shadow-[0_0_24px_rgba(255,85,0,0.35)] transition hover:bg-[#ff6a1a]"
          >
            Acceso ERP/CRM
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 items-center rounded-full border border-white/10 px-4 text-xs font-semibold text-[#F4F5F7] xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#12141C] px-5 py-4 xl:hidden">
          <nav className="grid gap-1">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-[#F4F5F7]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#FF5500] px-4 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Acceso ERP/CRM
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0C10]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
            {SITE.shortName}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#8A909A]">{SITE.valueProposition}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD700]">Contacto</p>
          <address className="mt-4 not-italic text-sm leading-7 text-[#F4F5F7]/85">
            {SITE.address.full}
          </address>
          <p className="mt-4 text-sm text-[#8A909A]">
            Oficina comercial:{" "}
            <a className="text-[#F4F5F7] hover:text-[#FFD700]" href={officeTelHref()}>
              {SITE.phoneOffice}
            </a>
          </p>
          <p className="text-sm text-[#8A909A]">
            WhatsApp:{" "}
            <a className="text-[#F4F5F7] hover:text-[#FFD700]" href={whatsappHref()}>
              {SITE.whatsapp}
            </a>
          </p>
          <p className="text-sm text-[#8A909A]">
            Correo:{" "}
            <a className="text-[#F4F5F7] hover:text-[#FFD700]" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD700]">
            Enlaces rápidos
          </p>
          <nav className="mt-4 grid gap-2 text-sm">
            {PUBLIC_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-[#8A909A] hover:text-[#FFD700]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD700]">
            Políticas y legal
          </p>
          <nav className="mt-4 grid gap-2 text-sm">
            {LEGAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-[#8A909A] hover:text-[#FFD700]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <p className="border-t border-white/10 px-5 py-5 text-center text-xs text-[#8A909A]">
        © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref(
        "Hola, quiero información sobre venta local, financiamiento o importación directa con Valcron Motors.",
      )}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-[#FF5500] px-5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,85,0,0.45)] transition hover:bg-[#ff6a1a]"
    >
      WhatsApp
    </a>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[#0B0C10] text-[#F4F5F7]">
      <SiteHeader />
      {children}
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
