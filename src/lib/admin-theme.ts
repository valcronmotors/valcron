import type { AdminNavIcon } from "@/lib/admin-nav";
import type { VehicleState } from "@/lib/vehicle-costs";

export type AdminNavTone = {
  icon: string;
  wrap: string;
  hover: string;
  active: string;
  childHover: string;
  childActive: string;
};

export const ADMIN_NAV_TONE: Record<AdminNavIcon, AdminNavTone> = {
  dashboard: {
    icon: "text-slate-600",
    wrap: "bg-slate-100",
    hover: "hover:bg-slate-50 hover:text-slate-700",
    active: "bg-slate-100 text-slate-800",
    childHover: "hover:bg-slate-50 hover:text-slate-700",
    childActive: "bg-slate-100 font-medium text-slate-800 ring-1 ring-slate-200",
  },
  inventory: {
    icon: "text-slate-700",
    wrap: "bg-slate-100",
    hover: "hover:bg-slate-50 hover:text-slate-800",
    active: "bg-slate-100 text-slate-900",
    childHover: "hover:bg-slate-50 hover:text-slate-800",
    childActive: "bg-slate-100 font-medium text-slate-900 ring-1 ring-slate-200",
  },
  requests: {
    icon: "text-neutral-600",
    wrap: "bg-neutral-100",
    hover: "hover:bg-neutral-50 hover:text-neutral-700",
    active: "bg-neutral-100 text-neutral-800",
    childHover: "hover:bg-neutral-50 hover:text-neutral-700",
    childActive: "bg-neutral-100 font-medium text-neutral-800 ring-1 ring-neutral-200",
  },
  settings: {
    icon: "text-slate-500",
    wrap: "bg-slate-100",
    hover: "hover:bg-slate-50 hover:text-slate-700",
    active: "bg-slate-100 text-slate-700",
    childHover: "hover:bg-slate-50 hover:text-slate-700",
    childActive: "bg-slate-100 font-medium text-slate-700 ring-1 ring-slate-200",
  },
};

export const ADMIN_STATUS_BADGE: Record<VehicleState, string> = {
  Disponible:
    "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]",
  "En Tránsito":
    "border-sky-200 bg-sky-50 text-sky-700 shadow-[0_0_0_3px_rgba(14,165,233,0.1)]",
  "En Subasta":
    "border-amber-200 bg-amber-50 text-amber-800 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]",
  "En Taller":
    "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]",
  Vendido: "border-slate-200 bg-slate-50 text-slate-600",
};

const RESERVED_BADGE =
  "border-yellow-200 bg-yellow-50 text-yellow-800 shadow-[0_0_0_3px_rgba(250,204,21,0.12)]";

export function adminStatusBadgeClass(estado: string | null | undefined) {
  if (estado === "Reservado") {
    return RESERVED_BADGE;
  }
  if (estado && estado in ADMIN_STATUS_BADGE) {
    return ADMIN_STATUS_BADGE[estado as VehicleState];
  }
  return "border-gray-200 bg-gray-50 text-gray-600";
}

export const AUCTION_BRAND = {
  Copart: {
    label: "COPART",
    className: "bg-[#111111] text-white",
  },
  IAAI: {
    label: "IAAI",
    className: "bg-[#262626] text-white",
  },
  Manheim: {
    label: "MANHEIM",
    className: "bg-[#404040] text-white",
  },
} as const;

export type AuctionBrand = keyof typeof AUCTION_BRAND;
