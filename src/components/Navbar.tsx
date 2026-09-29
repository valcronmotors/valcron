"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  MOBILE_NAV,
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
  "relative shrink-0 whitespace-nowrap px-2 py-2 text-[14px] font-medium text-[#3a3d42] transition-colors duration-180 hover:text-[#08090b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff] 2xl:px-2.5";
const navActiveClass =
  "text-[#08090b] after:absolute after:bottom-1 after:left-2 after:right-2 after:h-px after:bg-[#2b6cff]";

/** Full horizontal nav needs room; logo already covers Inicio. */
const DESKTOP_NAV_PRIMARY = PUBLIC_NAV_PRIMARY.filter((item) => item.href !== "/");

export function Navbar() {
  const pathname = usePathname();
  const resourcesRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
    // Match when the horizontal nav is visible (xl+).
    const desktop = window.matchMedia("(min-width: 1280px)");
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
    if (open) {
      menuButtonRef.current?.focus();
    }
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
        <div
          className="mx-auto flex h-full w-full max-w-[var(--content-wide)] items-center gap-4"
          style={{ paddingInline: "var(--page-gutter)" }}
        >
          <Link href="/" aria-label={SITE.brand} className="relative z-10 shrink-0" onClick={() => setOpen(false)}>
            <BrandLogo size="header" tone="onLight" />
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden xl:flex"
            aria-label="Principal"
          >
            {DESKTOP_NAV_PRIMARY.map((item) => {
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
                className={`${navLinkClass} inline-flex min-h-11 items-center gap-1 ${resourcesActive ? navActiveClass : ""}`}
                aria-expanded={resourcesOpen}
                aria-haspopup="menu"
                aria-controls={menuId}
                onClick={() => setResourcesOpen((value) => !value)}
              >
                Recursos
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#676a70] transition-transform duration-180 ${resourcesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {resourcesOpen ? (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-2 min-w-[12.5rem] border border-[#e4e6ea] bg-white p-1.5 shadow-[0_16px_40px_rgba(8,9,11,0.1)]"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  {RESOURCE_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className={`block min-h-11 rounded-[0.75rem] px-3 py-2.5 text-sm transition-colors duration-180 hover:bg-[#f5f6f7] ${
                        isActivePath(pathname, item.href) ? "text-[#2b6cff]" : "text-[#08090b]"
                      }`}
                      onClick={() => setResourcesOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Link
              href={PUBLIC_NAV_CONTACT.href}
              aria-current={isActivePath(pathname, PUBLIC_NAV_CONTACT.href) ? "page" : undefined}
              className={`${navLinkClass} ${isActivePath(pathname, PUBLIC_NAV_CONTACT.href) ? navActiveClass : ""}`}
            >
              {PUBLIC_NAV_CONTACT.label}
            </Link>
          </nav>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden xl:block">
              <CurrencySwitch compact tone="light" />
            </div>
            <Link
              href="/inventario"
              aria-label="Buscar inventario"
              className="inline-flex h-11 w-11 items-center justify-center text-[#08090b] xl:hidden"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden="true" />
            </Link>
            <Link
              href="/inventario"
              className="hidden h-10 items-center rounded-full bg-[#08090b] px-3.5 text-sm font-semibold text-white transition-colors duration-180 hover:bg-[#12141a] sm:inline-flex xl:h-11 xl:px-4 2xl:px-5"
            >
              Ver inventario
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-[#08090b] xl:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              <span className="flex w-5 flex-col gap-[6px]" aria-hidden="true">
                <span
                  className={`h-[1.5px] w-full bg-current transition-transform ${
                    open ? "translate-y-[3.75px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-[1.5px] w-full bg-current transition-transform ${
                    open ? "-translate-y-[3.75px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[70] flex flex-col bg-white pt-[var(--header-height)] xl:hidden"
        >
          <nav className="flex flex-1 flex-col overflow-y-auto px-5 pb-4" aria-label="Menú">
            {MOBILE_NAV.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-14 items-center border-b border-[#eef0f3] font-display text-xl font-semibold tracking-tight ${
                    active ? "text-[#2b6cff]" : "text-[#08090b]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="grid gap-3 border-t border-[#eef0f3] px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Link
              href="/inventario"
              className="btn-primary h-12 w-full"
              onClick={() => setOpen(false)}
            >
              Ver inventario
            </Link>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp h-12 w-full"
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
