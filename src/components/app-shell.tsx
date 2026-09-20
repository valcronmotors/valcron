"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventario", label: "Vehículos" },
  { href: "/inventario", label: "Sitio público" },
  { href: "/admin/configuracion/usuarios", label: "Usuarios" },
];

export function AppShell({
  title,
  subtitle,
  actions,
  wide = false,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-full bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.22),_transparent_45%)]" />
      <div
        className={`relative mx-auto flex w-full flex-col gap-8 px-6 py-10 ${
          wide ? "max-w-[96rem]" : "max-w-7xl"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Valcron System
          </p>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-white/10 hover:text-slate-300"
              >
                Salir
              </button>
            </form>
          </nav>
        </div>
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </header>
        {children}
      </div>
    </div>
  );
}

const primaryButtonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60";
const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-white/5 px-5 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-white/10 disabled:opacity-60";

export function PrimaryButton({
  children,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`${primaryButtonClass} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`${secondaryButtonClass} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function PrimaryButtonLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={primaryButtonClass}>
      {children}
    </Link>
  );
}

export function SecondaryButtonLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={secondaryButtonClass}>
      {children}
    </Link>
  );
}
