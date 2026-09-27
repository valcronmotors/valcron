"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronsLeft, Globe, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { ADMIN_NAV_ICONS } from "@/components/admin/admin-icons";
import { BrandLogo } from "@/components/public/BrandLogo";
import { adminInitials } from "@/lib/admin-copy";
import {
  ADMIN_NAV,
  isAdminNavChildActive,
  sectionHasActiveChild,
  type AdminNavSection,
} from "@/lib/admin-nav";

export type AdminShellUser = {
  name: string;
  email: string;
};

export function AdminSidebar({
  user,
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: {
  user: AdminShellUser;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full flex-col bg-[var(--admin-nav)] text-[var(--admin-nav-text)] ${
        collapsed ? "w-[72px]" : "w-[264px]"
      }`}
    >
      <div
        className={`flex border-b border-white/8 ${
          collapsed
            ? "flex-col items-center gap-2 px-2 py-4"
            : "items-start justify-between gap-2 px-4 py-5"
        }`}
      >
        <Link
          href="/admin"
          onClick={onNavigate}
          className="min-w-0"
          aria-label="Website Admin"
        >
          {collapsed ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 text-[11px] font-semibold tracking-[0.12em] text-[var(--admin-brand)]">
              VM
            </span>
          ) : (
            <span className="block">
              <BrandLogo size="header" tone="onDark" />
              <span className="mt-2 block text-[11px] font-medium tracking-[0.14em] text-[var(--admin-nav-muted)]">
                Website Admin
              </span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--admin-nav-muted)] transition duration-200 hover:bg-white/6 hover:text-white ${
            collapsed ? "" : "hidden lg:inline-flex"
          }`}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <ChevronsLeft className={`h-4 w-4 transition ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-0.5">
          {ADMIN_NAV.map((section) => (
            <NavSection
              key={section.id}
              section={section}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      <div className={`border-t border-white/8 ${collapsed ? "p-2" : "p-3"}`}>
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-1"}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
            {adminInitials(user.name)}
          </span>
          {collapsed ? null : (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-[var(--admin-nav-muted)]">{user.email}</p>
            </div>
          )}
        </div>
        <div className="mt-3 grid gap-0.5">
          <Link
            href="/"
            onClick={onNavigate}
            className={`inline-flex h-10 items-center gap-2 rounded-md text-[13px] text-[var(--admin-nav-muted)] transition duration-200 hover:bg-white/6 hover:text-white ${
              collapsed ? "w-full justify-center px-0" : "px-3"
            }`}
            title="Ver website"
          >
            <Globe className="h-4 w-4" />
            {collapsed ? null : "Ver website"}
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className={`inline-flex h-10 w-full items-center gap-2 rounded-md text-[13px] text-[var(--admin-nav-muted)] transition duration-200 hover:bg-white/6 hover:text-white ${
                collapsed ? "justify-center px-0" : "px-3"
              }`}
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              {collapsed ? null : "Cerrar sesión"}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

function NavSection({
  section,
  pathname,
  collapsed,
  onNavigate,
}: {
  section: AdminNavSection;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = ADMIN_NAV_ICONS[section.icon];
  const active = sectionHasActiveChild(pathname, section);
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const open = userOpen ?? active;

  const itemClass = `group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13.5px] transition duration-200 ${
    active
      ? "bg-white/7 text-white"
      : "text-[var(--admin-nav-muted)] hover:bg-white/5 hover:text-white"
  } ${collapsed ? "justify-center px-0" : ""}`;

  const iconMark = (
    <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
      {active && !collapsed ? (
        <span className="absolute -left-[11px] h-4 w-[2px] rounded-full bg-[var(--admin-brand)]" />
      ) : null}
      <Icon
        className={`h-4 w-4 ${active ? "text-[var(--admin-brand)]" : "text-current"}`}
        strokeWidth={1.9}
      />
    </span>
  );

  if (section.href) {
    return (
      <li>
        <Link
          href={section.href}
          onClick={onNavigate}
          title={section.label}
          aria-current={active ? "page" : undefined}
          className={itemClass}
        >
          {iconMark}
          {collapsed ? null : <span className="font-medium">{section.label}</span>}
        </Link>
      </li>
    );
  }

  if (collapsed) {
    const first = section.children?.[0];
    return (
      <li>
        <Link
          href={first?.href ?? "/admin"}
          onClick={onNavigate}
          title={section.label}
          className={itemClass}
        >
          {iconMark}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setUserOpen((value) => !(value ?? active))}
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-left text-[13.5px] transition duration-200 ${
          active
            ? "bg-white/7 text-white"
            : "text-[var(--admin-nav-muted)] hover:bg-white/5 hover:text-white"
        }`}
      >
        {iconMark}
        <span className="flex-1 font-medium">{section.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul className="mt-1 ml-5 space-y-0.5 border-l border-white/10 py-1 pl-3">
          {section.children?.map((child) => {
            const childActive = isAdminNavChildActive(
              pathname,
              child.href,
              section.children ?? [],
            );
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={childActive ? "page" : undefined}
                  className={`block rounded-md px-2.5 py-1.5 text-[13px] leading-5 transition duration-200 ${
                    childActive
                      ? "text-white"
                      : "text-[var(--admin-nav-muted)] hover:text-white"
                  }`}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}
