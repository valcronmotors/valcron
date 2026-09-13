"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Car,
  ChevronDown,
  ChevronsLeft,
  CircleDollarSign,
  CreditCard,
  Globe,
  LayoutDashboard,
  LineChart,
  LogOut,
  Scale,
  Settings,
  Ship,
  Users,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { BrandLogo } from "@/components/public/BrandLogo";
import {
  ADMIN_NAV,
  sectionHasActiveChild,
  type AdminNavIcon,
  type AdminNavSection,
} from "@/lib/admin-nav";

const ICONS: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  inventory: Car,
  imports: Ship,
  finance: CreditCard,
  legal: Scale,
  accounting: CircleDollarSign,
  clients: Users,
  reports: LineChart,
  settings: Settings,
};

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
        collapsed ? "w-[4.75rem]" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-4">
        <Link
          href="/admin"
          onClick={onNavigate}
          className={`min-w-0 ${collapsed ? "mx-auto" : ""}`}
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
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-[#0B0C10] lg:inline-flex"
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

      <div className="border-t border-gray-100 p-3">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B0C10] text-[11px] font-semibold text-white">
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
        <div className={`mt-3 grid gap-1 ${collapsed ? "" : ""}`}>
          <Link
            href="/"
            onClick={onNavigate}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-[#0B0C10]"
            title="Sitio web público"
          >
            <Globe className="h-4 w-4" />
            {collapsed ? null : "Sitio web público"}
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-700"
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
  const Icon = ICONS[section.icon];
  const active = sectionHasActiveChild(pathname, section);
  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  if (section.href) {
    return (
      <li>
        <Link
          href={section.href}
          onClick={onNavigate}
          title={section.label}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
            active
              ? "bg-[#0B0C10] text-white"
              : "text-gray-600 hover:bg-gray-50 hover:text-[#0B0C10]"
          } ${collapsed ? "justify-center px-0" : ""}`}
        >
          <Icon className="h-4 w-4 shrink-0" />
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
          className={`flex items-center justify-center rounded-lg py-2.5 text-sm transition ${
            active
              ? "bg-[#0B0C10] text-white"
              : "text-gray-600 hover:bg-gray-50 hover:text-[#0B0C10]"
          }`}
        >
          <Icon className="h-4 w-4" />
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
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-[#0B0C10]"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 font-medium">{section.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <ul className="mt-1 ml-5 space-y-0.5 border-l border-gray-100 py-1 pl-4">
          {section.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className={`block rounded-md px-2.5 py-1.5 text-[13px] leading-5 transition ${
                  pathname === child.href
                    ? "bg-gray-50 font-medium text-[#0B0C10] ring-1 ring-gray-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#0B0C10]"
                }`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
