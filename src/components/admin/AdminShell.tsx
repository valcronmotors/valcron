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
    <div className="flex h-[100dvh] overflow-hidden bg-[#F8F9FA] text-[#0B0C10]">
      <div className="hidden lg:block">
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
            className="absolute inset-0 bg-[#0B0C10]/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-64 flex-col bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50"
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

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
