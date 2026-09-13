"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { findAdminNavItem } from "@/lib/admin-nav";

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const match = findAdminNavItem(pathname);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur-md lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-4 w-4" />
      </button>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gray-400">
          {match?.section.label ?? "Valcron Motors"}
        </p>
        <h1 className="truncate font-display text-xl font-semibold tracking-tight text-[#0B0C10] sm:text-2xl">
          {match?.item.label ?? "Panel administrativo"}
        </h1>
      </div>
    </header>
  );
}
