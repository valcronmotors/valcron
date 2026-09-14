"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/public/BrandLogo";
import { CurrencySwitch } from "@/components/public/CurrencyProvider";
import { PUBLIC_NAV, SITE, usesMarketingChrome } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkClass = (active: boolean) =>
  `px-2.5 py-2 font-medium uppercase text-xs tracking-widest transition ${
    active ? "text-black" : "text-gray-800 hover:text-black"
  }`;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!usesMarketingChrome(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          href="/"
          aria-label={SITE.name}
          className="min-w-0"
          onClick={() => setOpen(false)}
        >
          <BrandLogo size="header" tone="onLight" />
        </Link>

        <nav className="hidden items-center justify-center gap-0.5 lg:flex">
          {PUBLIC_NAV.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3 lg:min-h-9">
          <div className="hidden sm:block">
            <CurrencySwitch compact />
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center border border-gray-100 px-3 font-medium uppercase text-xs tracking-widest text-gray-800 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-gray-100 bg-white px-5 py-4 lg:hidden">
          <nav className="grid gap-1">
            {PUBLIC_NAV.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={linkClass(active)}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 sm:hidden">
            <CurrencySwitch />
          </div>
        </div>
      ) : null}
    </header>
  );
}
