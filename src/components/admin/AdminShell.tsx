"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  AdminSidebar,
  type AdminShellUser,
} from "@/components/admin/AdminSidebar";

export function AdminShell({
  user,
  children,
}: {
  user: AdminShellUser;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-console flex h-screen w-full min-h-screen overflow-hidden bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className={`hidden h-screen shrink-0 lg:block ${collapsed ? "w-[72px]" : "w-[264px]"}`}>
        <AdminSidebar
          user={user}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-[#08090b]/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-[264px] flex-col bg-[var(--admin-nav)] shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--admin-nav-muted)] transition hover:bg-[var(--admin-nav-hover)] hover:text-[var(--admin-text)]"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
            <AdminSidebar
              user={user}
              collapsed={false}
              onToggleCollapsed={() => setMobileOpen(false)}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex h-screen min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader user={user} onMenu={() => setMobileOpen(true)} />
        <main className="h-full min-h-0 w-full flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
          <div className="mx-auto h-full min-h-full w-full max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
