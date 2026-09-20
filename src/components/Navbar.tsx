"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  PUBLIC_NAV,
  RESOURCE_NAV,
  SITE,
  usesMarketingChrome,
  whatsappHref,
} from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = pathname === "/";
  const glass = !home || scrolled;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (!usesMarketingChrome(pathname)) {
    return null;
  }

  const headerClass = glass
    ? "border-white/10 bg-[#050505]/86 backdrop-blur-xl"
    : "border-transparent bg-transparent";

  return (
    <>
      <header className={`sticky top-0 z-[70] border-b transition-colors duration-300 ${headerClass}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <Link
            href="/"
            aria-label={SITE.brand}
            className="relative z-10 min-w-0 shrink-0"
            onClick={() => setOpen(false)}
          >
            <BrandLogo size="header" tone="onDark" />
          </Link>

          <nav className="hidden items-center justify-center xl:flex" aria-label="Principal">
            {PUBLIC_NAV.slice(0, 7).map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-2 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition ${
                    active ? "text-white" : "text-white/62 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/62 hover:text-white"
                aria-expanded={resourcesOpen}
                onClick={() => setResourcesOpen((value) => !value)}
              >
                Recursos
                <ChevronDown className={`h-3 w-3 transition ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>
              {resourcesOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 min-w-[14rem] rounded-2xl border border-white/10 bg-[#0a0a0a] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                  {RESOURCE_NAV.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className="block rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                      onClick={() => setResourcesOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link
              href="/contacto"
              className={`px-2 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition ${
                isActivePath(pathname, "/contacto") ? "text-white" : "text-white/62 hover:text-white"
              }`}
            >
              Contacto
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/inventario"
              aria-label="Buscar vehículos"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/80 hover:text-white lg:inline-flex"
            >
              <Search className="h-4 w-4" />
            </Link>
            <div className="hidden sm:block">
              <CurrencySwitch compact />
            </div>
            <a
              href={whatsappHref(
                "Hola, quiero información sobre inventario, importación o una búsqueda personalizada con Valcron Motors.",
              )}
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full border border-white/12 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white/35 lg:inline-flex"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <Link
              href="/contacto"
              className="hidden h-10 items-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-white/90 xl:inline-flex"
            >
              Solicitar vehículo
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white xl:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div id="mobile-nav" className="fixed inset-0 z-[60] flex flex-col bg-[#050505] pt-[4.75rem] xl:hidden">
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6">
            {[...PUBLIC_NAV].map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b border-white/10 py-4 text-2xl font-semibold tracking-tight ${
                    active ? "text-white" : "text-white/70"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <p className="pt-6 text-[11px] uppercase tracking-[0.2em] text-white/35">Recursos</p>
            {RESOURCE_NAV.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="border-b border-white/10 py-4 text-xl text-white/70"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 border-t border-white/10 px-6 py-6">
            <CurrencySwitch />
            <Link href="/contacto" className="btn-primary w-full" onClick={() => setOpen(false)}>
              Solicitar vehículo
            </Link>
            <a
              href={whatsappHref(
                "Hola, quiero información sobre inventario, importación o una búsqueda personalizada con Valcron Motors.",
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
