import type { AdminNavIcon } from "@/lib/admin-nav";
import type { CrmState } from "@/lib/crm";
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
    icon: "text-blue-500",
    wrap: "bg-blue-50",
    hover: "hover:bg-blue-50/70 hover:text-blue-600",
    active: "bg-blue-50 text-blue-700",
    childHover: "hover:bg-blue-50/60 hover:text-blue-600",
    childActive: "bg-blue-50 font-medium text-blue-700 ring-1 ring-blue-100",
  },
  messaging: {
    icon: "text-emerald-500",
    wrap: "bg-emerald-50",
    hover: "hover:bg-emerald-50/70 hover:text-emerald-600",
    active: "bg-emerald-50 text-emerald-700",
    childHover: "hover:bg-emerald-50/60 hover:text-emerald-600",
    childActive:
      "bg-emerald-50 font-medium text-emerald-700 ring-1 ring-emerald-100",
  },
  inventory: {
    icon: "text-red-500",
    wrap: "bg-red-50",
    hover: "hover:bg-red-50/70 hover:text-red-600",
    active: "bg-red-50 text-red-700",
    childHover: "hover:bg-red-50/60 hover:text-red-600",
    childActive: "bg-red-50 font-medium text-red-700 ring-1 ring-red-100",
  },
  imports: {
    icon: "text-cyan-500",
    wrap: "bg-cyan-50",
    hover: "hover:bg-cyan-50/70 hover:text-cyan-600",
    active: "bg-cyan-50 text-cyan-800",
    childHover: "hover:bg-cyan-50/60 hover:text-cyan-700",
    childActive: "bg-cyan-50 font-medium text-cyan-800 ring-1 ring-cyan-100",
  },
  finance: {
    icon: "text-purple-500",
    wrap: "bg-purple-50",
    hover: "hover:bg-purple-50/70 hover:text-purple-600",
    active: "bg-purple-50 text-purple-700",
    childHover: "hover:bg-purple-50/60 hover:text-purple-600",
    childActive:
      "bg-purple-50 font-medium text-purple-700 ring-1 ring-purple-100",
  },
  legal: {
    icon: "text-amber-500",
    wrap: "bg-amber-50",
    hover: "hover:bg-amber-50/70 hover:text-amber-700",
    active: "bg-amber-50 text-amber-800",
    childHover: "hover:bg-amber-50/60 hover:text-amber-700",
    childActive: "bg-amber-50 font-medium text-amber-800 ring-1 ring-amber-100",
  },
  accounting: {
    icon: "text-green-600",
    wrap: "bg-green-50",
    hover: "hover:bg-green-50/70 hover:text-green-700",
    active: "bg-green-50 text-green-800",
    childHover: "hover:bg-green-50/60 hover:text-green-700",
    childActive: "bg-green-50 font-medium text-green-800 ring-1 ring-green-100",
  },
  clients: {
    icon: "text-indigo-500",
    wrap: "bg-indigo-50",
    hover: "hover:bg-indigo-50/70 hover:text-indigo-600",
    active: "bg-indigo-50 text-indigo-700",
    childHover: "hover:bg-indigo-50/60 hover:text-indigo-600",
    childActive:
      "bg-indigo-50 font-medium text-indigo-700 ring-1 ring-indigo-100",
  },
  reports: {
    icon: "text-pink-500",
    wrap: "bg-pink-50",
    hover: "hover:bg-pink-50/70 hover:text-pink-600",
    active: "bg-pink-50 text-pink-700",
    childHover: "hover:bg-pink-50/60 hover:text-pink-600",
    childActive: "bg-pink-50 font-medium text-pink-700 ring-1 ring-pink-100",
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

export const ADMIN_CRM_BADGE: Record<CrmState, string> = {
  "Nuevo Lead":
    "border-orange-200 bg-orange-50 text-orange-700 shadow-[0_0_0_3px_rgba(249,115,22,0.08)]",
  Contactado: "border-sky-200 bg-sky-50 text-sky-700",
  "En Negociación": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "Cotizado / Test Drive": "border-purple-200 bg-purple-50 text-purple-700",
  "Cerrado Ganado":
    "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]",
  "Cerrado Perdido": "border-slate-200 bg-slate-50 text-slate-600",
};

export function adminCrmBadgeClass(estado: string | null | undefined) {
  if (estado && estado in ADMIN_CRM_BADGE) {
    return ADMIN_CRM_BADGE[estado as CrmState];
  }
  return "border-gray-200 bg-gray-50 text-gray-600";
}

export const AUCTION_BRAND = {
  Copart: {
    label: "COPART",
    className: "bg-[#0055A5] text-white",
  },
  IAAI: {
    label: "IAAI",
    className: "bg-[#E31837] text-white",
  },
  Manheim: {
    label: "MANHEIM",
    className: "bg-gradient-to-r from-[#43B02A] to-[#003DA5] text-white",
  },
} as const;

export type AuctionBrand = keyof typeof AUCTION_BRAND;
