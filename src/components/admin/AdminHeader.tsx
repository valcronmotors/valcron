"use client";

import Link from "next/link";
import { Globe, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { adminInitials } from "@/lib/admin-copy";
import { findAdminNavItem } from "@/lib/admin-nav";
import type { AdminShellUser } from "@/components/admin/AdminSidebar";

export function AdminHeader({
  user,
  onMenu,
}: {
  user: AdminShellUser;
  onMenu: () => void;
}) {
  const pathname = usePathname();
  const match = findAdminNavItem(pathname);
  const crumbs: { href: string; label: string }[] = [{ href: "/admin", label: pathname === "/admin" ? "Dashboard" : "Admin" }];
  if (match && match.section.href && match.section.href !== "/admin") {
    crumbs.push({ href: match.section.href, label: match.section.label });
  }
  if (match && match.item.label !== match.section.label) {
    crumbs.push({ href: match.item.href, label: match.item.label });
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full shrink-0 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/92 px-4 backdrop-blur-md md:px-6 lg:h-[3.25rem] lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-secondary)] transition hover:bg-[var(--admin-surface-muted)] lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-4 w-4" />
      </button>

      <nav aria-label="Ruta" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-sm text-[var(--admin-text-muted)]">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={`${crumb.href}-${crumb.label}`} className="flex min-w-0 items-center gap-1.5">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span className="truncate font-medium text-[var(--admin-text)]">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="truncate transition hover:text-[var(--admin-text)]">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <Link
        href="/"
        className="hidden h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-[var(--admin-text-secondary)] transition hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-text)] sm:inline-flex"
      >
        <Globe className="h-3.5 w-3.5" />
        Website
      </Link>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--admin-text)] text-[10px] font-semibold tracking-wide text-white"
        title={user.name}
        aria-label={user.name}
      >
        {adminInitials(user.name)}
      </span>
    </header>
  );
}
