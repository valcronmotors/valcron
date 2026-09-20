"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const PRIMARY_NAV = PUBLIC_NAV.filter((item) => item.href !== "/");

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-white/12 text-[#EDEDED] transition hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const navLinkClass =
  "relative shrink-0 whitespace-nowrap px-1.5 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[#EDEDED] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[1536px]:px-2 min-[1536px]:text-[11px] min-[1536px]:tracking-[0.12em]";
const navActiveClass =
  "text-white after:absolute after:bottom-1 after:left-1.5 after:right-1.5 after:h-px after:bg-[#C7A96B]";

export function Navbar() {
  const pathname = usePathname();
  const resourcesRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
    setResourcesOpen(false);
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1440px)");
    function applyOverflow() {
      document.body.style.overflow = open && !desktop.matches ? "hidden" : "";
    }
    applyOverflow();
    desktop.addEventListener("change", applyOverflow);
    return () => {
      desktop.removeEventListener("change", applyOverflow);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!resourcesRef.current?.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setResourcesOpen(false);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!usesMarketingChrome(pathname)) {
    return null;
  }

  return (
    <>
      <header className="site-header sticky top-0 z-[80]">
        <div className="mx-auto flex h-full w-full max-w-[1680px] items-center gap-2 px-3 sm:gap-3 sm:px-5 min-[1440px]:gap-6 lg:px-8">
          <Link
            href="/"
            aria-label={SITE.brand}
            className="relative z-10 shrink-0"
            onClick={() => setOpen(false)}
          >
            <BrandLogo size="header" tone="onDark" />
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 min-[1440px]:flex min-[1536px]:gap-1"
            aria-label="Principal"
          >
            {PRIMARY_NAV.map((item) => {
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
            <div className="relative shrink-0" ref={resourcesRef}>
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
                aria-expanded={resourcesOpen}
                aria-haspopup="menu"
                aria-controls="resources-menu"
                onClick={() => setResourcesOpen((value) => !value)}
              >
                Recursos
                <ChevronDown className={`h-3 w-3 shrink-0 text-[#A3A3A3] transition ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>
              {resourcesOpen ? (
                <div
                  id="resources-menu"
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-2 min-w-[14rem] rounded-2xl border border-white/12 bg-[#050608] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                >
                  {RESOURCE_NAV.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      role="menuitem"
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

          <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <Link href="/inventario" aria-label="Buscar vehículos" className={iconButtonClass}>
              <Search className="h-4 w-4" />
            </Link>
            <div className="hidden sm:block">
              <CurrencySwitch compact />
            </div>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconButtonClass} min-[1536px]:w-auto min-[1536px]:gap-2 min-[1536px]:px-3`}
              aria-label="WhatsApp de Valcron Motors"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              <span className="hidden text-xs font-semibold uppercase tracking-[0.12em] min-[1536px]:inline">
                WhatsApp
              </span>
            </a>
            <Link
              href="/solicitar-vehiculo"
              className="hidden h-10 shrink-0 items-center rounded-[0.9rem] bg-[#F5F5F5] px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#111111] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[1440px]:inline-flex min-[1536px]:px-4 min-[1536px]:text-xs min-[1536px]:tracking-[0.12em]"
            >
              Solicitar vehículo
            </Link>
            <button
              type="button"
              className={`${iconButtonClass} min-[1440px]:hidden`}
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
        <div id="mobile-nav" className="fixed inset-0 z-[70] flex flex-col bg-[#050608] pt-[72px] min-[1440px]:hidden lg:pt-20">
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6" aria-label="Menú">
            {PUBLIC_NAV.map((item) => {
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
            <div className="sm:hidden">
              <CurrencySwitch />
            </div>
            <Link
              href="/solicitar-vehiculo"
              className="inline-flex h-11 w-full items-center justify-center rounded-[0.9rem] bg-[#F5F5F5] text-sm font-semibold text-[#111111]"
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
