"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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

  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setMobileOpen(false); }
      if (event.key !== "Tab") return;
      const controls = [...(drawerRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? [])].filter((element) => element.offsetParent !== null);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === drawerRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === drawerRef.current)) { event.preventDefault(); first?.focus(); }
    }
    window.addEventListener("keydown", handleKey);
    return () => { window.removeEventListener("keydown", handleKey); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [mobileOpen]);

  return (
    <div className="admin-console flex h-dvh w-full min-h-dvh overflow-hidden bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <a href="#admin-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:p-3">Ir al contenido</a>
      <div className={`hidden h-dvh shrink-0 lg:block ${collapsed ? "w-[72px]" : "w-[264px]"}`}>
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
          <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Menú de administración" tabIndex={-1} className="relative flex h-full w-[264px] flex-col bg-[var(--admin-nav)] shadow-2xl">
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

      <div className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader user={user} onMenu={() => setMobileOpen(true)} />
        <main id="admin-content" className="h-full min-h-0 w-full flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
          <div className="mx-auto h-full min-h-full w-full max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
