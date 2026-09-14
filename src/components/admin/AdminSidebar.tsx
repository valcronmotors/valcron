"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronsLeft, Globe, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { ADMIN_NAV_ICONS } from "@/components/admin/admin-icons";
import { BrandLogo } from "@/components/public/BrandLogo";
import {
  ADMIN_NAV,
  isAdminNavChildActive,
  sectionHasActiveChild,
  type AdminNavSection,
} from "@/lib/admin-nav";
import { ADMIN_NAV_TONE } from "@/lib/admin-theme";

export type AdminShellUser = {
  name: string;
  email: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "VM";
}

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
      className={`flex h-full flex-col border-r border-gray-200 bg-white ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex border-b border-gray-100 ${
          collapsed
            ? "flex-col items-center gap-2 px-1 py-3"
            : "items-center justify-between gap-2 px-3 py-4"
        }`}
      >
        <Link
          href="/admin"
          onClick={onNavigate}
          className="min-w-0"
          aria-label="Valcron ERP"
        >
          {collapsed ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B0C10] text-xs font-semibold tracking-wide text-white">
              VM
            </span>
          ) : (
            <span className="block">
              <BrandLogo size="header" tone="onLight" />
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.22em] text-gray-400">
                ERP / CRM System
              </span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-600 ${
            collapsed ? "" : "hidden lg:inline-flex"
          }`}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <ChevronsLeft
            className={`h-4 w-4 transition ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
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

      <div className={`border-t border-gray-100 ${collapsed ? "p-2" : "p-3"}`}>
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-[#0B0C10] text-[11px] font-semibold text-white shadow-sm">
            {initials(user.name)}
          </span>
          {collapsed ? null : (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#0B0C10]">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
          )}
        </div>
        <div className="mt-3 grid gap-1">
          <Link
            href="/"
            onClick={onNavigate}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-medium text-gray-500 transition-all duration-200 hover:bg-cyan-50/70 hover:text-cyan-700 ${
              collapsed ? "w-full px-0" : "px-3"
            }`}
            title="Sitio web público"
          >
            <Globe className="h-4 w-4 text-cyan-500" />
            {collapsed ? null : "Sitio web público"}
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-medium text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700 ${
                collapsed ? "px-0" : "px-3"
              }`}
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4 text-red-400" />
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
  const tone = ADMIN_NAV_TONE[section.icon];
  const active = sectionHasActiveChild(pathname, section);
  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  const iconMark = (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.wrap}`}
    >
      <Icon className={`h-4 w-4 ${tone.icon}`} strokeWidth={2.25} />
    </span>
  );

  if (section.href) {
    return (
      <li>
        <Link
          href={section.href}
          onClick={onNavigate}
          title={section.label}
          className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-all duration-200 ${
            active ? tone.active : `text-gray-600 ${tone.hover}`
          } ${collapsed ? "justify-center px-0" : ""}`}
        >
          {iconMark}
          {collapsed ? null : (
            <span className="font-medium">{section.label}</span>
          )}
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
          className={`flex items-center justify-center rounded-lg py-1.5 text-sm transition-all duration-200 ${
            active ? tone.active : `text-gray-600 ${tone.hover}`
          }`}
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
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-all duration-200 ${
          active ? tone.active : `text-gray-600 ${tone.hover}`
        }`}
      >
        {iconMark}
        <span className="flex-1 font-medium">{section.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <ul className="mt-1 ml-[1.35rem] space-y-0.5 border-l border-gray-100 py-1 pl-5">
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
                  className={`block rounded-md px-2.5 py-1.5 text-[13px] leading-5 transition-all duration-200 ${
                    childActive
                      ? tone.childActive
                      : `text-gray-500 ${tone.childHover}`
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
