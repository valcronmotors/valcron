import type { SaleChannel } from "@/lib/parts";
import type { VehicleState } from "@/lib/vehicle-costs";

export const VEHICLE_STATE_BADGE: Record<VehicleState, string> = {
  "En Subasta": "bg-amber-500/15 text-amber-200 ring-amber-400/30",
  "En Tránsito": "bg-sky-500/15 text-sky-200 ring-sky-400/30",
  "En Taller": "bg-violet-500/15 text-violet-200 ring-violet-400/30",
  Disponible: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30",
  Vendido: "bg-slate-500/20 text-slate-300 ring-slate-400/30",
};

export const SALE_CHANNEL_BADGE: Record<SaleChannel, string> = {
  eBay: "bg-orange-500/15 text-orange-200 ring-orange-400/30",
  Amazon: "bg-yellow-500/15 text-yellow-100 ring-yellow-400/30",
  Walmart: "bg-blue-500/15 text-blue-200 ring-blue-400/30",
  "Venta Directa": "bg-cyan-500/15 text-cyan-200 ring-cyan-400/30",
};
