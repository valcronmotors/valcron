"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ICONS } from "@/components/admin/admin-icons";
import { findAdminNavItem } from "@/lib/admin-nav";
import { ADMIN_NAV_TONE } from "@/lib/admin-theme";

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const match = findAdminNavItem(pathname);
  const iconKey = match?.section.icon ?? "dashboard";
  const Icon = ADMIN_NAV_ICONS[iconKey];
  const tone = ADMIN_NAV_TONE[iconKey];

  return (
    <header className="sticky top-0 z-20 flex w-full shrink-0 items-center gap-4 border-b border-gray-200 bg-white/90 px-4 py-3.5 backdrop-blur-md md:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all duration-200 hover:bg-blue-50/70 hover:text-blue-600 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-4 w-4" />
      </button>
      <span
        className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:inline-flex ${tone.wrap}`}
      >
        <Icon className={`h-5 w-5 ${tone.icon}`} strokeWidth={2.25} />
      </span>
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
