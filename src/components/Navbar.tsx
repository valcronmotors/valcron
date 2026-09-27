"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  PUBLIC_NAV_CONTACT,
  PUBLIC_NAV_PRIMARY,
  RESOURCE_NAV,
  SITE,
  usesMarketingChrome,
  whatsappHref,
} from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navLinkClass =
  "relative shrink-0 whitespace-nowrap px-2 py-2 text-[13px] font-medium text-[#E8E8E8] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white xl:px-2.5";
const navActiveClass = "text-white after:absolute after:bottom-1 after:left-2 after:right-2 after:h-px after:bg-[#C7A96B]";

export function Navbar() {
  const pathname = usePathname();
  const resourcesRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const menuId = useId();

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
    setResourcesOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setCompact(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
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

  const resourcesActive = RESOURCE_NAV.some((item) => isActivePath(pathname, item.href));

  return (
    <>
      <header className={`site-header sticky top-0 z-[80] ${compact ? "is-compact" : ""}`}>
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center gap-3 px-4 lg:px-6 xl:px-8">
          <Link href="/" aria-label={SITE.brand} className="relative z-10 shrink-0" onClick={() => setOpen(false)}>
            <BrandLogo size="header" tone="onDark" />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex" aria-label="Principal">
            {PUBLIC_NAV_PRIMARY.map((item) => {
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
                className={`${navLinkClass} inline-flex items-center gap-1 ${resourcesActive ? navActiveClass : ""}`}
                aria-expanded={resourcesOpen}
                aria-haspopup="menu"
                aria-controls={menuId}
                onClick={() => setResourcesOpen((value) => !value)}
              >
                Recursos
                <ChevronDown className={`h-3.5 w-3.5 text-[#A3A3A3] transition ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>
              {resourcesOpen ? (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-2 min-w-[12.5rem] rounded-xl border border-white/12 bg-[#0b0c0e] p-1.5 shadow-[0_20px_48px_rgba(0,0,0,0.4)]"
                >
                  {RESOURCE_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className={`block rounded-lg px-3 py-2.5 text-sm hover:bg-white/6 hover:text-white ${
                        isActivePath(pathname, item.href) ? "text-white" : "text-[#E8E8E8]"
                      }`}
                      onClick={() => setResourcesOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            {(() => {
              const active = isActivePath(pathname, PUBLIC_NAV_CONTACT.href);
              return (
                <Link
                  href={PUBLIC_NAV_CONTACT.href}
                  aria-current={active ? "page" : undefined}
                  className={`${navLinkClass} ${active ? navActiveClass : ""}`}
                >
                  {PUBLIC_NAV_CONTACT.label}
                </Link>
              );
            })()}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de Valcron Motors"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-[#E8E8E8] transition hover:border-white/30 hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <div className="hidden sm:block">
              <CurrencySwitch compact />
            </div>
            <Link
              href="/inventario"
              className="hidden h-10 items-center rounded-lg bg-white px-4 text-sm font-semibold text-[#111] transition hover:bg-[#ececec] sm:inline-flex"
            >
              Ver inventario
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white lg:hidden"
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
        <div id="mobile-nav" className="fixed inset-0 z-[70] flex flex-col bg-[#0b0c0e] pt-[68px] lg:hidden">
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-5" aria-label="Menú">
            {PUBLIC_NAV_PRIMARY.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`min-h-11 border-b border-white/10 py-3 text-lg font-medium ${
                    active ? "text-white" : "text-[#E8E8E8]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <p className="pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A3A3A3]">Recursos</p>
            {RESOURCE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-11 border-b border-white/10 py-3 text-base ${
                  isActivePath(pathname, item.href) ? "text-white" : "text-[#E8E8E8]"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={PUBLIC_NAV_CONTACT.href}
              aria-current={isActivePath(pathname, PUBLIC_NAV_CONTACT.href) ? "page" : undefined}
              className={`min-h-11 border-b border-white/10 py-3 text-lg font-medium ${
                isActivePath(pathname, PUBLIC_NAV_CONTACT.href) ? "text-white" : "text-[#E8E8E8]"
              }`}
              onClick={() => setOpen(false)}
            >
              {PUBLIC_NAV_CONTACT.label}
            </Link>
          </nav>
          <div className="grid gap-3 border-t border-white/10 px-5 py-5">
            <div className="sm:hidden">
              <CurrencySwitch />
            </div>
            <Link
              href="/inventario"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#111]"
              onClick={() => setOpen(false)}
            >
              Ver inventario
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/20 text-sm text-white"
              onClick={() => setOpen(false)}
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
