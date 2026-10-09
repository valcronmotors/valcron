"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Search } from "lucide-react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  MEGA_NAV,
  MOBILE_NAV,
  SITE,
  usesMarketingChrome,
  whatsappHref,
  type MegaNavItem,
} from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function megaIsActive(pathname: string, item: MegaNavItem) {
  const hrefs = [item.href, item.featured.href, ...item.columns.flatMap((column) => column.links.map((link) => link.href))];
  return hrefs.some((href) => isActivePath(pathname, href));
}

const triggerClass =
  "relative inline-flex min-h-11 items-center gap-1 px-3 py-2 text-[15px] font-medium text-[#191919] transition-colors duration-180 hover:text-[#08090b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b6cff]";
const triggerActive =
  "text-[#08090b] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-[#08090b]";

export function Navbar() {
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [open, setOpen] = useState(false);
  const [megaId, setMegaId] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const menuId = useId();

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
    setMegaId(null);
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
    if (open) menuButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!megaRef.current?.contains(event.target as Node)) {
        setMegaId(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const current = megaId;
      setMegaId(null);
      setOpen(false);
      if (current) triggerRefs.current[current]?.focus();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [megaId]);

  if (!usesMarketingChrome(pathname)) {
    return null;
  }

  const activeMega = MEGA_NAV.find((item) => item.id === megaId) ?? null;

  return (
    <>
      <div
        ref={megaRef}
        onMouseLeave={() => {
          if (window.matchMedia("(min-width: 1024px)").matches) setMegaId(null);
        }}
      >
      <header className={`site-header sticky top-0 z-[80] ${compact ? "is-compact" : ""}`}>
        <div
          className="mx-auto flex h-full w-full max-w-[var(--content-wide)] items-center gap-6"
          style={{ paddingInline: "var(--page-gutter)" }}
        >
          <Link href="/" aria-label={SITE.brand} className="relative z-10 shrink-0" onClick={() => { setOpen(false); setMegaId(null); }}>
            <BrandLogo size="header" tone="onLight" variant="full" />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-visible lg:flex" aria-label="Principal">
            {MEGA_NAV.map((item) => {
              const expanded = megaId === item.id;
              const panelId = `${menuId}-${item.id}`;
              const active = megaIsActive(pathname, item);
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    triggerRefs.current[item.id] = node;
                  }}
                  type="button"
                  className={`${triggerClass} ${active || expanded ? triggerActive : ""}`}
                  aria-expanded={expanded}
                  aria-haspopup="true"
                  aria-controls={panelId}
                  onClick={() => setMegaId((value) => (value === item.id ? null : item.id))}
                  onMouseEnter={() => {
                    if (!window.matchMedia("(min-width: 1024px)").matches) return;
                    setMegaId((value) => (value ? item.id : value));
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden lg:block">
              <CurrencySwitch compact tone="light" />
            </div>
            <Link
              href="/inventario"
              aria-label="Buscar inventario"
              className="inline-flex h-11 w-11 items-center justify-center text-[#08090b] lg:hidden"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden="true" />
            </Link>
            <Link
              href="/inventario"
              className="hidden h-10 items-center rounded-full bg-[#08090b] px-4 text-sm font-semibold text-white transition-colors duration-180 hover:bg-[#191919] sm:inline-flex lg:h-11"
            >
              Ver inventario
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-[#08090b] lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              <span className="flex w-5 flex-col gap-[6px]" aria-hidden="true">
                <span className={`h-[1.5px] w-full bg-current transition-transform ${open ? "translate-y-[3.75px] rotate-45" : ""}`} />
                <span className={`h-[1.5px] w-full bg-current transition-transform ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

        {activeMega ? (
          <div
            id={`${menuId}-${activeMega.id}`}
            className="fixed inset-x-0 top-[var(--header-height)] z-[90] hidden border-t border-[#e5e5e5] bg-white shadow-[0_24px_48px_rgba(8,9,11,0.08)] lg:block"
          >
            <div
              className="mx-auto grid max-w-[var(--content-wide)] gap-10 py-10 lg:grid-cols-[1fr_1fr_minmax(16rem,20rem)] lg:gap-16"
              style={{ paddingInline: "var(--page-gutter)" }}
            >
              {activeMega.columns.map((column) => (
                <div key={column.title}>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8d91]">
                    {column.title}
                  </p>
                  <ul className="grid gap-1">
                    {column.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className={`block py-2 text-[15px] transition-colors hover:text-[#2b6cff] ${
                            isActivePath(pathname, link.href) ? "font-medium text-[#2b6cff]" : "text-[#191919]"
                          }`}
                          onClick={() => setMegaId(null)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="border-t border-[#e5e5e5] pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#08090b]">{activeMega.featured.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#676a70]">{activeMega.featured.copy}</p>
                <Link href={activeMega.featured.href} className="btn-primary mt-6 h-11 px-5 text-sm" onClick={() => setMegaId(null)}>
                  {activeMega.featured.cta}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {open ? (
        <div id="mobile-nav" className="fixed inset-0 z-[70] flex flex-col bg-white pt-[var(--header-height)] lg:hidden">
          <nav className="flex flex-1 flex-col overflow-y-auto px-5 pb-4" aria-label="Menú">
            {MEGA_NAV.map((item) => (
              <div key={item.id} className="border-b border-[#eef0f3] py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8d91]">{item.label}</p>
                <div className="mt-2">
                  {item.columns.flatMap((column) => column.links).map((link) => {
                    const active = isActivePath(pathname, link.href);
                    return (
                      <Link
                        key={`${item.id}-${link.href}-${link.label}`}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-12 items-center text-lg font-semibold tracking-tight ${
                          active ? "text-[#2b6cff]" : "text-[#08090b]"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            {MOBILE_NAV.filter((item) => item.href === "/").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-12 items-center border-b border-[#eef0f3] text-lg font-semibold text-[#08090b]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 border-t border-[#eef0f3] px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Link href="/inventario" className="btn-primary h-12 w-full" onClick={() => setOpen(false)}>
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
