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

const navLinkClass =
  "relative px-1.5 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#EDEDED] transition hover:text-white 2xl:px-2 2xl:text-[11px] 2xl:tracking-[0.14em]";
const navActiveClass =
  "text-white after:absolute after:bottom-1 after:left-2 after:right-2 after:h-px after:bg-[#C7A96B]";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!usesMarketingChrome(pathname)) {
    return null;
  }

  return (
    <>
      <header className="site-header sticky top-0 z-[80]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link
            href="/"
            aria-label={SITE.brand}
            className="relative z-10 min-w-0 shrink-0"
            onClick={() => setOpen(false)}
          >
            <BrandLogo size="header" tone="onDark" />
          </Link>

          <nav className="hidden min-w-0 items-center justify-center xl:flex" aria-label="Principal">
            {PUBLIC_NAV.filter((item) => item.href !== "/").map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLinkClass} ${active ? navActiveClass : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="relative">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
                aria-expanded={resourcesOpen}
                onClick={() => setResourcesOpen((value) => !value)}
              >
                Recursos
                <ChevronDown className={`h-3 w-3 text-[#A3A3A3] transition ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>
              {resourcesOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 min-w-[14rem] rounded-2xl border border-white/12 bg-[#050608] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                  {RESOURCE_NAV.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className="block rounded-xl px-3 py-2.5 text-sm text-[#EDEDED] hover:bg-white/5 hover:text-white"
                      onClick={() => setResourcesOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/inventario"
              aria-label="Buscar vehículos"
              className="hidden h-10 w-10 items-center justify-center rounded-[0.9rem] border border-white/12 text-[#EDEDED] hover:text-white 2xl:inline-flex"
            >
              <Search className="h-4 w-4" />
            </Link>
            <div className="hidden sm:block">
              <CurrencySwitch compact />
            </div>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-[0.9rem] border border-white/12 bg-white/5 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#EDEDED] transition hover:border-white/25 hover:text-white"
              aria-label="WhatsApp de Valcron Motors"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              <span className="hidden 2xl:inline">WhatsApp</span>
            </a>
            <Link
              href="/contacto"
              className="hidden h-10 items-center rounded-[0.9rem] bg-[#F5F5F5] px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] transition hover:bg-white 2xl:inline-flex"
            >
              Solicitar vehículo
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-white/12 text-[#EDEDED] xl:hidden"
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
        <div id="mobile-nav" className="fixed inset-0 z-[70] flex flex-col bg-[#050608] pt-[72px] xl:hidden">
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6">
            {[...PUBLIC_NAV].map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b border-white/10 py-4 text-2xl font-semibold tracking-tight ${
                    active ? "text-white" : "text-[#EDEDED]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <p className="pt-6 text-[11px] uppercase tracking-[0.2em] text-[#A3A3A3]">Recursos</p>
            {RESOURCE_NAV.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="border-b border-white/10 py-4 text-xl text-[#EDEDED]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 border-t border-white/10 px-6 py-6">
            <div className="grid gap-2 text-sm text-[#EDEDED]">
              <a href={`tel:${SITE.phoneOfficeInternational}`} className="hover:text-white">
                Oficina {SITE.officePhoneDisplay}
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp {SITE.whatsappDisplay}
              </a>
            </div>
            <CurrencySwitch />
            <Link
              href="/contacto"
              className="inline-flex h-[2.85rem] w-full items-center justify-center rounded-[0.9rem] bg-[#F5F5F5] text-sm font-semibold text-[#111111]"
              onClick={() => setOpen(false)}
            >
              Solicitar vehículo
            </Link>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
